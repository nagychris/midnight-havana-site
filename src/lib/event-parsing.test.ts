import { describe, expect, it } from 'vitest';

import { parseEvent } from './event-parsing';

const LABEL = { de: 'Son Beginner 20:00', en: 'Son Beginner 20:00' };

function rawEvent(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return { date: '2026-10-02', slug: 'al-son-de-cuba', ...overrides };
}

describe('parseEvent regularClasses', () => {
    it('defaults to true when missing', () => {
        expect(parseEvent(rawEvent()).regularClasses).toBe(true);
    });

    it('accepts false', () => {
        const event = parseEvent(rawEvent({ regularClasses: false }));

        expect(event.regularClasses).toBe(false);
    });

    it('rejects a value that is not a boolean', () => {
        expect(() => parseEvent(rawEvent({ regularClasses: 'no' }))).toThrow(
            /regularClasses/,
        );
    });
});

describe('parseEvent courseLabels', () => {
    it('defaults to an empty object when missing', () => {
        expect(parseEvent(rawEvent()).courseLabels).toEqual({});
    });

    it('keeps a label for a known class', () => {
        const event = parseEvent(
            rawEvent({ courseLabels: { 'salsa-beginner': LABEL } }),
        );

        expect(event.courseLabels).toEqual({ 'salsa-beginner': LABEL });
    });

    it('rejects an unknown class id', () => {
        const raw = rawEvent({ courseLabels: { 'son-beginner': LABEL } });

        expect(() => parseEvent(raw)).toThrow(/unknown key "son-beginner"/);
    });

    it('rejects a label without both languages', () => {
        const raw = rawEvent({ courseLabels: { 'salsa-beginner': { de: 'Son' } } });

        expect(() => parseEvent(raw)).toThrow(/courseLabels.salsa-beginner/);
    });
});

describe('parseEvent badges', () => {
    it('rejects the old tone field', () => {
        const raw = rawEvent({ badges: [{ de: 'Son', en: 'Son', tone: 'green' }] });

        expect(() => parseEvent(raw)).toThrow(/tone" is no longer used/);
    });
});

describe('parseEvent unknown fields', () => {
    it('rejects an unknown event field', () => {
        expect(() => parseEvent(rawEvent({ djs: 'Helen' }))).toThrow(
            /unknown fields: djs/,
        );
    });

    it('rejects an unknown extra field', () => {
        const extra = {
            startTime: '19:00',
            title: { de: 'Workshop', en: 'Workshop' },
            cta: { de: 'Jetzt buchen', en: 'Book now' },
        };

        expect(() => parseEvent(rawEvent({ extras: [extra] }))).toThrow(
            /extras\[0\]" has unknown fields: cta/,
        );
    });
});

describe('parseEvent SEO fields', () => {
    it('defaults to null when missing', () => {
        const event = parseEvent(rawEvent());

        expect(event.seoTitle).toBeNull();
        expect(event.seoDescription).toBeNull();
    });

    it('keeps an SEO title in both languages', () => {
        const seoTitle = { de: 'Salsa Berlin', en: 'Salsa Berlin' };

        expect(parseEvent(rawEvent({ seoTitle })).seoTitle).toEqual(seoTitle);
    });

    it('rejects an SEO description without both languages', () => {
        expect(() =>
            parseEvent(rawEvent({ seoDescription: { de: 'Nur Deutsch' } })),
        ).toThrow(/seoDescription/);
    });
});

describe('parseEvent description length', () => {
    it('accepts a description of several paragraphs', () => {
        const long = 'Ein Satz. '.repeat(150);
        const description = { de: long, en: long };

        expect(parseEvent(rawEvent({ description })).description).toEqual(
            description,
        );
    });

    it('keeps the shorter limit for the summary', () => {
        const long = 'Ein Satz. '.repeat(150);

        expect(() =>
            parseEvent(rawEvent({ summary: { de: long, en: long } })),
        ).toThrow(/summary/);
    });
});
