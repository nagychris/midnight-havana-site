import { describe, expect, it } from 'vitest';

import { CLASS_IDS } from '../data/classes';
import { de } from '../i18n/de';
import { classNameOn, classesOn } from './event-classes';
import type { SiteEvent } from './event-types';
import { timetableFor } from './timetable';

function event(overrides: Partial<SiteEvent> = {}): SiteEvent {
    return {
        date: '2026-10-02',
        slug: 'al-son-de-cuba',
        title: null,
        summary: null,
        description: null,
        dj: null,
        teachers: [],
        badges: [],
        image: null,
        flyer: null,
        priceNote: null,
        cancelled: false,
        regularClasses: true,
        courseLabels: {},
        bookingLinks: {},
        extras: [],
        ...overrides,
    };
}

const WORKSHOP = {
    startTime: '19:00',
    endTime: '20:30',
    title: { de: 'Workshop', en: 'Workshop' },
    description: null,
    level: null,
    booking: null,
};

describe('classesOn', () => {
    it('lists the four standard classes on a normal night', () => {
        const ids = classesOn(event()).map((danceClass) => danceClass.id);

        expect(ids).toEqual([...CLASS_IDS]);
    });

    it('lists no classes when the night has no regular classes', () => {
        expect(classesOn(event({ regularClasses: false }))).toEqual([]);
    });
});

describe('classNameOn', () => {
    it('uses the standard name when the date has no label', () => {
        const name = classNameOn(event(), 'salsa-basics', 'de', de);

        expect(name).toBe(de.classes.items['salsa-basics'].name);
    });

    it('uses the label of the date in the requested language', () => {
        const labelled = event({
            courseLabels: {
                'salsa-beginner': { de: 'Son Anfänger', en: 'Son beginner' },
            },
        });

        expect(classNameOn(labelled, 'salsa-beginner', 'de', de)).toBe('Son Anfänger');
    });
});

describe('timetableFor', () => {
    it('shows the date label as the class title', () => {
        const labelled = event({
            courseLabels: { 'rueda-advanced': { de: 'Rueda de Son', en: 'Rueda de Son' } },
        });

        const titles = timetableFor(labelled, 'de', de).flatMap((slot) =>
            slot.entries.map((entry) => entry.title),
        );

        expect(titles).toContain('Rueda de Son');
    });

    it('leaves out the classes on a workshop night', () => {
        const workshopNight = event({ regularClasses: false, extras: [WORKSHOP] });

        const tones = timetableFor(workshopNight, 'de', de).flatMap((slot) =>
            slot.entries.map((entry) => entry.tone),
        );

        expect(tones).toEqual(['doors', 'extra', 'social']);
    });
});
