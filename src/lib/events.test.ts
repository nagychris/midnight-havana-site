import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { parseEventFile } from './event-files';
import { allEvents } from './events';

describe('allEvents', () => {
    it('loads every event file in src/data/events', () => {
        const events = allEvents();

        expect(events.length).toBeGreaterThan(0);
    });

    it('does not load the template', () => {
        const slugs = allEvents().map((event) => event.slug);

        expect(slugs).not.toContain('neuer-termin');
    });
});

describe('_template.yaml', () => {
    it('is a valid event, so a copy of it builds', () => {
        const source = readFileSync('src/data/events/_template.yaml', 'utf8');

        expect(() => parseEventFile('_template.yaml', source)).not.toThrow();
    });
});
