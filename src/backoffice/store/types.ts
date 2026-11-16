/**
 * Where the back office keeps events.
 *
 * An entry is one date. It can have a published version (the file the website
 * reads), a draft (work nobody sees yet), or both, when a date that is already
 * online is being changed. Both are the text of a YAML event file.
 *
 * Three places can sit behind this interface. Two exist: the files in the
 * working copy, for local use, and a sandbox per visitor, for the demo. The
 * third is the one the finished back office needs: commits to the repository
 * through the GitHub API, which Netlify then builds.
 */
export interface EventEntry {
    /** File name without `.yaml`, e.g. `2026-12-04-salsa-friday-dj-tamboly`. */
    id: string;
    published: string | null;
    draft: string | null;
}

export interface EventStore {
    list(): Promise<EventEntry[]>;
    get(id: string): Promise<EventEntry | null>;
    saveDraft(id: string, source: string): Promise<void>;
    discardDraft(id: string): Promise<void>;
    /**
     * Puts an event online and removes its draft. `publishedId` follows the
     * date and the slug, so it differs from `id` for a new event and when the
     * date of a published one changes; the old file is then removed.
     */
    publish(id: string, publishedId: string, source: string): Promise<void>;
}

/** Demo mode: what one visitor changed. `null` marks a removed file. */
export interface SandboxChanges {
    published: Record<string, string | null>;
    drafts: Record<string, string>;
}
