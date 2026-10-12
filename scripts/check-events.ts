/**
 * Checks every event file in src/data/events/ and lists all problems.
 *
 * Much faster than a full build, and it reports every broken file at once.
 * Runs before each push (see .githooks/pre-push).
 *
 *     pnpm check-events
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
    findEventFileProblems,
    isTemplateFile,
    type EventFiles,
} from '../src/lib/event-files';

const EVENTS_DIR = 'src/data/events';

function readEventFiles(dir: string): EventFiles {
    const files: EventFiles = {};
    for (const name of readdirSync(dir)) {
        // Hidden files such as .DS_Store are not meant as events.
        if (name.startsWith('.')) continue;
        const path = join(dir, name);
        files[path] = readFileSync(path, 'utf8');
    }
    return files;
}

const files = readEventFiles(EVENTS_DIR);
const problems = findEventFileProblems(files);

if (problems.length > 0) {
    for (const problem of problems) console.error(problem);
    console.error(`\n${problems.length} problem(s) in ${EVENTS_DIR}.`);
    process.exit(1);
}
const eventCount = Object.keys(files).filter((path) => !isTemplateFile(path)).length;
console.log(`${eventCount} event files OK.`);
