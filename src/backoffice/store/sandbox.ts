import type { EventEntry, EventStore, SandboxChanges } from './types';

/**
 * The demo: the real events, plus whatever this visitor changed.
 *
 * The starting point is the set of event files the site was built with.
 * Changes are kept in the visitor's session and nowhere else, so two people
 * trying the demo never see each other's work, nothing reaches the website,
 * and everything is gone when the session ends.
 */

/** The event files of this build, by id. */
export function bundledEvents(): Record<string, string> {
    const files = import.meta.glob<string>('/src/data/events/*.yaml', {
        query: '?raw',
        import: 'default',
        eager: true,
    });

    const events: Record<string, string> = {};
    for (const [filePath, source] of Object.entries(files)) {
        const name = filePath.split('/').pop() ?? '';
        if (name.startsWith('_')) continue;
        events[name.replace(/\.yaml$/, '')] = source;
    }
    return events;
}

export const NO_CHANGES: SandboxChanges = { published: {}, drafts: {} };

export class SandboxStore implements EventStore {
    readonly #base: Record<string, string>;
    readonly #load: () => Promise<SandboxChanges>;
    readonly #save: (changes: SandboxChanges) => void;

    constructor(
        base: Record<string, string>,
        load: () => Promise<SandboxChanges>,
        save: (changes: SandboxChanges) => void,
    ) {
        this.#base = base;
        this.#load = load;
        this.#save = save;
    }

    #entry(id: string, changes: SandboxChanges): EventEntry | null {
        const published =
            id in changes.published ? changes.published[id] : (this.#base[id] ?? null);
        const draft = changes.drafts[id] ?? null;
        return published === null && draft === null ? null : { id, published, draft };
    }

    async list(): Promise<EventEntry[]> {
        const changes = await this.#load();
        const ids = new Set([
            ...Object.keys(this.#base),
            ...Object.keys(changes.published),
            ...Object.keys(changes.drafts),
        ]);
        return [...ids]
            .map((id) => this.#entry(id, changes))
            .filter((entry): entry is EventEntry => entry !== null);
    }

    async get(id: string): Promise<EventEntry | null> {
        return this.#entry(id, await this.#load());
    }

    async saveDraft(id: string, source: string): Promise<void> {
        const changes = await this.#load();
        this.#save({ ...changes, drafts: { ...changes.drafts, [id]: source } });
    }

    async discardDraft(id: string): Promise<void> {
        const changes = await this.#load();
        const { [id]: _removed, ...drafts } = changes.drafts;
        this.#save({ ...changes, drafts });
    }

    async publish(id: string, publishedId: string, source: string): Promise<void> {
        const changes = await this.#load();
        const { [id]: _removed, ...drafts } = changes.drafts;
        const published = { ...changes.published, [publishedId]: source };
        if (publishedId !== id) published[id] = null;
        this.#save({ published, drafts });
    }
}
