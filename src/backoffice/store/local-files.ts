import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { EventEntry, EventStore } from './types';

/**
 * Events as files in the working copy, for `pnpm backoffice`.
 *
 * Publishing writes `src/data/events/<id>.yaml`, exactly the file a developer
 * would have added by hand; the dev server picks it up at once. A draft is
 * `_draft-<id>.yaml` in the same folder. The website ignores every file that
 * starts with `_`, so a draft can never reach a page.
 */
const DRAFT_PREFIX = '_draft-';
const EXTENSION = '.yaml';

export class LocalFileStore implements EventStore {
    readonly #dir: string;

    constructor(dir = path.join(process.cwd(), 'src/data/events')) {
        this.#dir = dir;
    }

    #publishedPath(id: string): string {
        return path.join(this.#dir, `${id}${EXTENSION}`);
    }

    #draftPath(id: string): string {
        return path.join(this.#dir, `${DRAFT_PREFIX}${id}${EXTENSION}`);
    }

    async #read(file: string): Promise<string | null> {
        try {
            return await readFile(file, 'utf8');
        } catch {
            return null;
        }
    }

    async list(): Promise<EventEntry[]> {
        const names = await readdir(this.#dir).catch(() => [] as string[]);
        const ids = new Set<string>();

        for (const name of names) {
            if (!name.endsWith(EXTENSION)) continue;
            const stem = name.slice(0, -EXTENSION.length);
            if (stem.startsWith(DRAFT_PREFIX)) ids.add(stem.slice(DRAFT_PREFIX.length));
            // `_template.yaml` and anything else with an underscore is not an event.
            else if (!stem.startsWith('_')) ids.add(stem);
        }

        const entries = await Promise.all([...ids].map((id) => this.get(id)));
        return entries.filter((entry): entry is EventEntry => entry !== null);
    }

    async get(id: string): Promise<EventEntry | null> {
        const [published, draft] = await Promise.all([
            this.#read(this.#publishedPath(id)),
            this.#read(this.#draftPath(id)),
        ]);
        return published === null && draft === null ? null : { id, published, draft };
    }

    async saveDraft(id: string, source: string): Promise<void> {
        await mkdir(this.#dir, { recursive: true });
        await writeFile(this.#draftPath(id), source, 'utf8');
    }

    async discardDraft(id: string): Promise<void> {
        await rm(this.#draftPath(id), { force: true });
    }

    async publish(id: string, publishedId: string, source: string): Promise<void> {
        await mkdir(this.#dir, { recursive: true });
        await writeFile(this.#publishedPath(publishedId), source, 'utf8');
        if (publishedId !== id) await rm(this.#publishedPath(id), { force: true });
        await rm(this.#draftPath(id), { force: true });
    }
}
