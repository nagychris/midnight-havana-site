/**
 * Reads the current class links off the Eversports schedule page.
 *
 * Eversports gives each occurrence of a class its own URL, so the four booking
 * links change from week to week. Keeping them by hand in `events.json` would
 * mean editing four URLs every week and would go stale the moment somebody
 * forgot. This fetches the studio's public schedule page instead and writes
 * what it finds to `src/data/eversports-links.json`.
 *
 * It is deliberately forgiving. It never throws and never exits non-zero: if
 * the page cannot be reached or nothing can be matched, the existing file is
 * left alone and the site falls back to the links in `src/data/classes.ts` and
 * then to the studio's general page. A booking button is never dead.
 *
 * Run with:
 *   pnpm run sync-eversports            update the file
 *   pnpm run sync-eversports -- --dry   show what it found, change nothing
 */
import { readFile, writeFile } from 'node:fs/promises';

const SCHEDULE_URL = 'https://www.eversports.de/scl/salsa-im-tangoloft-berlin';
const OUTPUT = 'src/data/eversports-links.json';
const TIMEOUT_MS = 20000;

/**
 * How to recognise each class in the schedule.
 *
 * Matching on words rather than on the page's markup: the titles are the one
 * thing on that page that has to stay readable to a human, so they are far
 * more stable than a CSS class name or a DOM path. `require` must all be
 * present, `reject` must all be absent.
 */
const CLASS_PATTERNS = [
    { id: 'salsa-basics', require: [/basic/i], reject: [/rueda/i] },
    { id: 'rueda-advanced', require: [/rueda/i, /advanced|fortgeschritt/i], reject: [] },
    { id: 'rueda-beginner', require: [/rueda/i], reject: [/advanced|fortgeschritt/i] },
    {
        id: 'salsa-beginner',
        require: [/beginner|anf(ä|ae)nger/i],
        reject: [/rueda/i, /basic/i],
    },
];

/** An Eversports activity or class URL, in either of the shapes they use. */
const ACTIVITY_URL =
    /https:\/\/(?:www\.)?eversports\.de\/(?:[a-z]{1,4}\/)?(?:org\/)?(?:activity|class|e)\/[0-9a-f-]{8,}/gi;

async function main() {
    const dryRun = process.argv.includes('--dry');

    const html = await fetchSchedule();
    if (!html) {
        console.warn('Could not read the schedule page. Leaving the current links alone.');
        return;
    }

    const found = extractLinks(html);
    const matched = matchClasses(found);

    report(found, matched);

    if (Object.keys(matched).length === 0) {
        console.warn(
            '\nNothing matched. The page layout may have changed; check the patterns in this file.',
        );
        return;
    }

    if (dryRun) {
        console.log('\nDry run, nothing written.');
        return;
    }

    await write(matched);
}

async function fetchSchedule() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(SCHEDULE_URL, {
            signal: controller.signal,
            headers: {
                // Without a browser-like user agent some sites answer with a
                // consent wall instead of the schedule.
                'user-agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
                'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
            },
        });

        if (!response.ok) {
            console.warn(`Schedule page answered ${response.status}.`);
            return null;
        }
        return await response.text();
    } catch (error) {
        console.warn(`Could not fetch the schedule page: ${error.message}`);
        return null;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Every activity URL on the page, with the text around it.
 *
 * Looking at the raw response rather than at a parsed DOM means this works
 * whether the schedule is rendered as HTML or embedded as JSON for a widget to
 * render later. In both cases the title and the URL sit near each other.
 */
function extractLinks(html) {
    const results = [];
    const seen = new Set();

    for (const match of html.matchAll(ACTIVITY_URL)) {
        const url = match[0];
        if (seen.has(url)) continue;
        seen.add(url);

        results.push({ url, context: contextAround(html, match.index, url.length) });
    }
    return results;
}

/** The readable words on either side of a URL, markup stripped out. */
function contextAround(html, index, length, window = 400) {
    const before = html.slice(Math.max(0, index - window), index);
    const after = html.slice(index + length, index + length + window);

    return `${before} ${after}`
        .replace(/<[^>]*>/g, ' ')
        .replace(/\\u[0-9a-f]{4}/gi, ' ')
        .replace(/[{}",:[\]]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Picks the best URL for each class from the candidates. */
function matchClasses(candidates) {
    const matched = {};
    const used = new Set();

    // Ordered so the most specific pattern claims its URL first: without that,
    // "Rueda de Casino Beginner" could be taken by the plain beginner rule.
    for (const pattern of CLASS_PATTERNS) {
        const hit = candidates.find(
            (candidate) =>
                !used.has(candidate.url) &&
                pattern.require.every((rule) => rule.test(candidate.context)) &&
                pattern.reject.every((rule) => !rule.test(candidate.context)),
        );

        if (hit) {
            matched[pattern.id] = hit.url;
            used.add(hit.url);
        }
    }
    return matched;
}

function report(found, matched) {
    console.log(`Found ${found.length} activity links on the schedule page.`);
    for (const pattern of CLASS_PATTERNS) {
        const url = matched[pattern.id];
        console.log(`  ${pattern.id.padEnd(16)} ${url ?? 'no match'}`);
    }
}

async function write(matched) {
    const previous = await readExisting();

    const payload = {
        _readme:
            'Generated by scripts/sync-eversports.mjs. Do not edit by hand. These are the current booking links for the four classes, read from the Eversports schedule page. If a class is missing, the site falls back to the link in src/data/classes.ts.',
        syncedAt: new Date().toISOString(),
        source: SCHEDULE_URL,
        links: matched,
    };

    const unchanged =
        previous && JSON.stringify(previous.links) === JSON.stringify(matched);

    if (unchanged) {
        console.log('\nLinks unchanged.');
        return;
    }

    await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(`\nWrote ${OUTPUT}.`);
}

async function readExisting() {
    try {
        return JSON.parse(await readFile(OUTPUT, 'utf8'));
    } catch {
        return null;
    }
}

// Never fail a build over this. A stale link is a small problem; a deploy that
// does not happen is a bigger one.
main().catch((error) => {
    console.warn(`sync-eversports failed: ${error.message}`);
});
