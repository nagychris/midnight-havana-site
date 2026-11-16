import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { LocalFileStore } from './local-files';
import { NO_CHANGES, SandboxStore } from './sandbox';
import type { EventStore, SandboxChanges } from './types';

/** Both stores have to behave the same way, so they share these checks. */
function behavesLikeAStore(name: string, create: () => EventStore) {
    describe(name, () => {
        it('lists what was there before, as published', async () => {
            const store = create();
            expect(await store.list()).toEqual([
                { id: '2026-11-27-old', published: 'old', draft: null },
            ]);
        });

        it('keeps a draft apart from the published version', async () => {
            const store = create();
            await store.saveDraft('2026-11-27-old', 'changed');
            expect(await store.get('2026-11-27-old')).toEqual({
                id: '2026-11-27-old',
                published: 'old',
                draft: 'changed',
            });
        });

        it('publishes a new event and drops its draft', async () => {
            const store = create();
            await store.saveDraft('2026-12-04-new', 'draft');
            await store.publish('2026-12-04-new', '2026-12-04-new', 'final');
            expect(await store.get('2026-12-04-new')).toEqual({
                id: '2026-12-04-new',
                published: 'final',
                draft: null,
            });
        });

        it('moves the file when the date of a published event changes', async () => {
            const store = create();
            await store.publish('2026-11-27-old', '2026-12-11-old', 'moved');
            expect(await store.get('2026-11-27-old')).toBeNull();
            expect((await store.get('2026-12-11-old'))?.published).toBe('moved');
        });

        it('forgets a discarded draft', async () => {
            const store = create();
            await store.saveDraft('2026-12-04-new', 'draft');
            await store.discardDraft('2026-12-04-new');
            expect(await store.get('2026-12-04-new')).toBeNull();
        });
    });
}

behavesLikeAStore('LocalFileStore', () => {
    const dir = mkdtempSync(join(tmpdir(), 'events-'));
    writeFileSync(join(dir, '2026-11-27-old.yaml'), 'old');
    writeFileSync(join(dir, '_template.yaml'), 'template');
    return new LocalFileStore(dir);
});

behavesLikeAStore('SandboxStore', () => {
    let changes: SandboxChanges = NO_CHANGES;
    return new SandboxStore(
        { '2026-11-27-old': 'old' },
        async () => changes,
        (next) => {
            changes = next;
        },
    );
});

describe('LocalFileStore', () => {
    it('writes a draft as a file the website ignores', async () => {
        const dir = mkdtempSync(join(tmpdir(), 'events-'));
        await new LocalFileStore(dir).saveDraft('2026-12-04-new', 'draft');
        expect(readdirSync(dir)).toEqual(['_draft-2026-12-04-new.yaml']);
    });
});

describe('SandboxStore', () => {
    it('never changes the events it started from', async () => {
        const base = { '2026-11-27-old': 'old' };
        let changes: SandboxChanges = NO_CHANGES;
        const store = new SandboxStore(base, async () => changes, (next) => {
            changes = next;
        });
        await store.publish('2026-11-27-old', '2026-12-11-old', 'moved');
        expect(base).toEqual({ '2026-11-27-old': 'old' });
        expect(NO_CHANGES).toEqual({ published: {}, drafts: {} });
    });
});
