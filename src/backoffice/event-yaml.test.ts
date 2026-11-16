import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { parseEventFile } from '../lib/event-files';
import { readEventData, serializeEvent } from './event-yaml';

const DIR = 'src/data/events';
const eventFiles = readdirSync(DIR).filter(
    (name) => name.endsWith('.yaml') && !name.startsWith('_'),
);

describe('serializeEvent', () => {
    it.each(eventFiles)('writes %s back so the site reads the same event', (name) => {
        const original = parseEventFile(name, readFileSync(join(DIR, name), 'utf8'));
        const written = serializeEvent(original);
        expect(parseEventFile(name, written)).toEqual(original);
    });

    const event = parseEventFile(
        'x.yaml',
        readFileSync(join(DIR, '2026-11-06-eloy-rojas-workshop-shownight.yaml'), 'utf8'),
    );
    const written = serializeEvent(event);

    it('starts with the schema line editors use', () => {
        expect(written.startsWith('# yaml-language-server: $schema=../event.schema.json\n')).toBe(
            true,
        );
    });

    it('quotes the date and the times', () => {
        expect(written).toContain('date: "2026-11-06"');
        expect(written).toContain('startTime: "19:00"');
    });

    it('writes long texts as |- blocks', () => {
        expect(written).toMatch(/description:\n {2}de: \|-\n {4}Der gebürtige Venezolaner/);
    });

    it('quotes a text that YAML would otherwise cut at a #', () => {
        const withHash = serializeEvent({
            ...event,
            title: { de: 'Salsa #1', en: 'Salsa #1' },
        });
        expect(parseEventFile('x.yaml', withHash).title?.de).toBe('Salsa #1');
    });

    it('leaves regularClasses out on a normal night', () => {
        expect(written).toContain('regularClasses: false');
        expect(serializeEvent({ ...event, regularClasses: true })).not.toContain(
            'regularClasses',
        );
    });
});

describe('readEventData', () => {
    it('reads an unfinished draft without complaining', () => {
        const draft = readEventData('date: "2026-12-04"\ntitle:\n  de: Salsa Friday\n  en: ""\n');
        expect(draft.date).toBe('2026-12-04');
        expect(draft.title).toEqual({ de: 'Salsa Friday', en: '' });
        expect(draft.summary).toBeNull();
        expect(draft.regularClasses).toBe(true);
        expect(draft.teachers).toEqual([]);
    });

    it('returns an empty event for text that is not YAML', () => {
        expect(readEventData('date: [unclosed').date).toBe('');
    });
});
