import { parse, YAMLParseError } from 'yaml';

import { parseEvent } from './event-parsing';
import type { SiteEvent } from './event-types';

/**
 * Reads the event files in `src/data/events/`, one YAML file per date.
 *
 * Files are passed in as a map from path to file content, so this module never
 * touches the disk. `events.ts` fills the map through Vite at build time, and
 * `scripts/check-events.ts` fills it from the file system.
 */

/** File path mapped to the text inside that file. */
export type EventFiles = Record<string, string>;

interface ParsedEventFile {
    path: string;
    event: SiteEvent;
}

/** Files starting with `_`, such as `_template.yaml`, are not events. */
export function isTemplateFile(path: string): boolean {
    const fileName = path.split('/').pop() ?? path;
    return fileName.startsWith('_');
}

/**
 * Parses one event file, or throws an error that starts with the file name.
 *
 * YAML syntax errors also name the line and column.
 */
export function parseEventFile(path: string, source: string): SiteEvent {
    let raw: unknown;
    try {
        raw = parse(source);
    } catch (error) {
        throw new Error(`${path}${describeYamlError(error)}`);
    }

    try {
        return parseEvent(raw);
    } catch (error) {
        throw new Error(`${path}: ${errorMessage(error)}`);
    }
}

/** Every event, validated and sorted by date, soonest first. */
export function eventsFromFiles(files: EventFiles): SiteEvent[] {
    const parsed = eventPaths(files).map((path) => ({
        path,
        event: parseEventFile(path, files[path]),
    }));

    const duplicates = findDuplicates(parsed);
    if (duplicates.length > 0) throw new Error(duplicates[0]);

    const events = parsed.map(({ event }) => event);
    return events.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Checks every event file and returns one message per problem.
 *
 * Unlike `eventsFromFiles`, this does not stop at the first broken file, so
 * all mistakes show up in one run. An empty list means every file is fine.
 */
export function findEventFileProblems(files: EventFiles): string[] {
    const problems: string[] = [];
    const parsed: ParsedEventFile[] = [];

    for (const path of eventPaths(files)) {
        if (!path.endsWith('.yaml')) {
            problems.push(`${path}: event files must end in .yaml, or the site ignores them.`);
            continue;
        }
        try {
            parsed.push({ path, event: parseEventFile(path, files[path]) });
        } catch (error) {
            problems.push(errorMessage(error));
        }
    }

    return [...problems, ...findDuplicates(parsed)];
}

/** The paths of real events, in a stable order. */
function eventPaths(files: EventFiles): string[] {
    return Object.keys(files)
        .filter((path) => !isTemplateFile(path))
        .sort();
}

/**
 * Two files with the same date or slug would build two pages for one night,
 * or two nights on one URL. Each message names both files.
 */
function findDuplicates(parsed: ParsedEventFile[]): string[] {
    const problems: string[] = [];
    const fileByDate = new Map<string, string>();
    const fileBySlug = new Map<string, string>();

    for (const { path, event } of parsed) {
        const sameDate = fileByDate.get(event.date);
        if (sameDate) {
            problems.push(`${sameDate} and ${path} both use the date ${event.date}.`);
        } else {
            fileByDate.set(event.date, path);
        }

        const sameSlug = fileBySlug.get(event.slug);
        if (sameSlug) {
            problems.push(`${sameSlug} and ${path} both use the slug "${event.slug}".`);
        } else {
            fileBySlug.set(event.slug, path);
        }
    }
    return problems;
}

function describeYamlError(error: unknown): string {
    if (!(error instanceof YAMLParseError)) {
        return `: ${errorMessage(error)}`;
    }
    // The library's message repeats the position and ends with a code
    // excerpt. Only the description itself is kept.
    const summary = error.message
        .split('\n')[0]
        .replace(/ at line \d+, column \d+:?$/, '');
    const position = error.linePos?.[0];
    if (!position) return `: ${summary}`;
    return `, line ${position.line}, column ${position.col}: ${summary}`;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
