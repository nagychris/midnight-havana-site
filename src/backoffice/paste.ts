import { CLASS_IDS, classes, type ClassId } from '../data/classes';
import type { BookingTarget } from '../lib/event-types';
import { isAcceptedBookingLink } from './event-form';

/**
 * Reads the message the owner usually sends when a new date is ready.
 *
 * It looks like this:
 *
 *     4.12. Salsa Friday
 *
 *     Kurse:
 *     Basics PW 19:00: https://www.eversports.de/…
 *     Beginner PW 20:00: https://www.eversports.de/…
 *     Rueda Beginner 19:00: https://www.eversports.de/…
 *     Rueda Advanced 20:00: https://www.eversports.de/…
 *
 *     Social:
 *     DJ Tamboly
 *     DJ Tamboly bringt Energie … (the text, one sentence or more per line)
 *
 * Nothing here guesses beyond that shape, and nothing is translated: whatever
 * is recognised lands in the form, where the owner checks it. A message that
 * looks different simply fills fewer fields.
 */

export interface PastedEvent {
    date: string | null;
    title: string | null;
    links: Partial<Record<BookingTarget, string>>;
    dj: string | null;
    /** The first sentence of the text, for the event card. */
    summary: string | null;
    /** The rest of the text, paragraphs separated by a blank line. */
    description: string | null;
}

const URL_PATTERN = /https?:\/\/\S+/;
const DATE_PATTERN = /(\d{1,2})\.\s?(\d{1,2})\.(?:\s?(\d{4}|\d{2})(?!\d))?/;
const SECTION_LABEL = /^(kurse|classes|social|party|social dance)\s*:?$/i;
const SOCIAL_LABEL = /^(social|party|social dance)\s*:?$/i;

/** Words that end in a full stop without ending a sentence. */
const ABBREVIATIONS = ['z', 'b', 'bzw', 'ca', 'inkl', 'nr', 'u', 'a', 'd', 'h', 'usw', 'vs'];

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

/**
 * A date written the German way, "4.12." or "04.12.2026", as YYYY-MM-DD.
 *
 * Without a year it is the next time that day comes round, counted from today.
 */
function readDate(line: string, today: string): string | null {
    const match = line.match(DATE_PATTERN);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    if (day < 1 || day > 31 || month < 1 || month > 12) return null;

    const isReal = (candidate: string) => {
        const [year, m, d] = candidate.split('-').map(Number);
        const date = new Date(Date.UTC(year, m - 1, d, 12));
        return date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
    };

    if (match[3]) {
        const year = match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3]);
        const written = `${year}-${pad(month)}-${pad(day)}`;
        return isReal(written) ? written : null;
    }

    const thisYear = Number(today.slice(0, 4));
    const sameYear = `${thisYear}-${pad(month)}-${pad(day)}`;
    const candidate =
        sameYear >= today ? sameYear : `${thisYear + 1}-${pad(month)}-${pad(day)}`;
    return isReal(candidate) ? candidate : null;
}

/** Which class a labelled link belongs to, or the party. */
function classOf(label: string): BookingTarget | null {
    const text = label.toLowerCase();
    const time = text.match(/\b(\d{1,2})[:.](\d{2})\b/);
    const startsAt = time ? `${pad(Number(time[1]))}:${time[2]}` : null;
    const track = text.includes('rueda') ? 'rueda' : 'salsa';

    let level: 'first' | 'second' | null = null;
    if (/adv|fortg/.test(text)) level = 'second';
    else if (/basic/.test(text)) level = 'first';
    else if (/beginner|anf[aä]nger|einsteiger/.test(text)) {
        // "Beginner" is the second salsa class but the first rueda class.
        level = track === 'rueda' ? 'first' : 'second';
    }

    const ofTrack = classes
        .filter((danceClass) => danceClass.track === track)
        .sort((a, b) => a.order - b.order);

    let match: ClassId | undefined;
    if (level) match = (level === 'first' ? ofTrack[0] : ofTrack[1])?.id;
    else if (startsAt) match = ofTrack.find((c) => c.startTime === startsAt)?.id;

    if (match) return match;
    if (/party|social|abend/.test(text)) return 'party';
    return null;
}

function looksLikeDjName(line: string): boolean {
    return (
        line.length <= 60 &&
        !/[.!?]$/.test(line) &&
        !URL_PATTERN.test(line) &&
        !SECTION_LABEL.test(line)
    );
}

/**
 * Where the first sentence of a paragraph ends, as an index after its last
 * character, or -1 when the paragraph is a single sentence.
 *
 * "Am 13.11. wird es kubanisch." must not be cut after the date, so a full
 * stop only counts when what follows starts like a new sentence and what
 * comes before is neither a number nor an abbreviation.
 */
function firstSentenceEnd(paragraph: string): number {
    const ending = /[.!?]+(?=\s+\S)/g;
    let match: RegExpExecArray | null;

    while ((match = ending.exec(paragraph)) !== null) {
        const end = match.index + match[0].length;
        const before = paragraph.slice(0, match.index);
        const after = paragraph.slice(end).trimStart();

        const wordBefore = before.match(/([\p{L}\p{N}]+)$/u)?.[1] ?? '';
        const afterNumber = /^\d+$/.test(wordBefore);
        const afterAbbreviation = ABBREVIATIONS.includes(wordBefore.toLowerCase());
        const startsSentence = /^[\p{Lu}\d"„“'¡¿(]/u.test(after);

        const isFullStop = match[0].startsWith('.');
        if (isFullStop && (afterNumber || afterAbbreviation)) continue;
        if (!startsSentence) continue;
        return end;
    }
    return -1;
}

/** The first sentence for the card, everything after it for the page. */
export function splitText(paragraphs: string[]): {
    summary: string | null;
    description: string | null;
} {
    if (paragraphs.length === 0) return { summary: null, description: null };

    const [first, ...rest] = paragraphs;
    const end = firstSentenceEnd(first);
    const summary = end === -1 ? first : first.slice(0, end).trim();
    const remainder = end === -1 ? '' : first.slice(end).trim();

    const description = [remainder, ...rest].filter((part) => part !== '').join('\n\n');
    return { summary, description: description === '' ? null : description };
}

export function parsePastedMessage(message: string, today: string): PastedEvent {
    const lines = message
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.trim());

    const result: PastedEvent = {
        date: null,
        title: null,
        links: {},
        dj: null,
        summary: null,
        description: null,
    };

    const content = lines.filter((line) => line !== '');
    if (content.length === 0) return result;

    // The headline: a date, then what the night is called.
    const headline = content[0];
    const headlineIsPlain = !URL_PATTERN.test(headline) && !SECTION_LABEL.test(headline);
    if (headlineIsPlain) {
        result.date = readDate(headline, today);
        const title = headline
            .replace(DATE_PATTERN, '')
            .replace(/^[\s:,–-]+|[\s:,–-]+$/g, '');
        result.title = title === '' ? null : title;
    }

    // Links, wherever they stand. The words before a link say which class.
    const linkLines = new Set<number>();
    lines.forEach((line, index) => {
        const url = line.match(URL_PATTERN)?.[0];
        if (!url) return;
        linkLines.add(index);

        const target = classOf(line.slice(0, line.indexOf(url)));
        if (target && !result.links[target] && isAcceptedBookingLink(url)) {
            result.links[target] = url;
        }
    });

    // After "Social:" comes the DJ on a line of their own, then the text.
    const socialAt = lines.findIndex((line) => SOCIAL_LABEL.test(line));
    const bodyStart = socialAt === -1 ? firstLineAfter(lines, linkLines) : socialAt + 1;
    const body = lines
        .slice(bodyStart)
        .map((line, offset) => ({ line, index: bodyStart + offset }))
        .filter(({ line, index }) => line !== '' && !linkLines.has(index))
        .filter(({ line }) => !SECTION_LABEL.test(line))
        .map(({ line }) => line);

    if (body.length > 0 && /\bdj\b/i.test(body[0]) && looksLikeDjName(body[0])) {
        result.dj = body.shift() ?? null;
    } else if (socialAt !== -1 && body.length > 1 && looksLikeDjName(body[0])) {
        result.dj = body.shift() ?? null;
    }

    const { summary, description } = splitText(body);
    result.summary = summary;
    result.description = description;
    return result;
}

/**
 * Where the free text starts when the message has no "Social:" line: after
 * the last link, or after the headline when there are no links at all.
 */
function firstLineAfter(lines: string[], linkLines: Set<number>): number {
    if (linkLines.size > 0) return Math.max(...linkLines) + 1;
    const headline = lines.findIndex((line) => line !== '');
    return headline + 1;
}

/** How many of the four class links a pasted message carried. */
export function classLinkCount(pasted: PastedEvent): number {
    return CLASS_IDS.filter((id) => pasted.links[id]).length;
}
