import type { AstroSession } from 'astro';

import { backofficeConfig } from '../config';
import { LocalFileStore } from './local-files';
import { bundledEvents, NO_CHANGES, SandboxStore } from './sandbox';
import type { EventStore } from './types';

export type { EventEntry, EventStore } from './types';

/** The place events are kept in for this build: files, or the demo sandbox. */
export function eventStore(session: AstroSession): EventStore {
    if (backofficeConfig.mode === 'local') return new LocalFileStore();

    return new SandboxStore(
        bundledEvents(),
        async () => (await session.get('sandbox')) ?? NO_CHANGES,
        (changes) => session.set('sandbox', changes),
    );
}
