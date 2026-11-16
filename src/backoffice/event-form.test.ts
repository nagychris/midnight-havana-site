import { describe, expect, it } from 'vitest';

import { parseEvent } from '../lib/event-parsing';
import { bo } from './copy';
import {
    emptyForm,
    eventFromForm,
    findProblems,
    findWarnings,
    formFromEvent,
    isAcceptedBookingLink,
    previewFromForm,
    readForm,
    type EventFormValues,
    type FormContext,
} from './event-form';

const context: FormContext = {
    others: [{ date: '2026-11-27', slug: 'salsa-friday-dj-ren', label: 'Salsa Friday (27.11.)' }],
    photoNames: ['venue-bar.jpg'],
    today: '2026-11-16',
    publishedSlug: null,
};

function complete(overrides: Partial<EventFormValues> = {}): EventFormValues {
    return emptyForm({
        date: '2026-12-04',
        slug: 'salsa-friday-dj-tamboly',
        titleDe: 'Salsa Friday',
        summaryDe: 'Ein Satz.',
        summaryEn: 'One sentence.',
        dj: 'DJ Tamboly',
        teachers: 'Helen, Yago',
        image: 'venue-bar.jpg',
        ...overrides,
    });
}

describe('eventFromForm', () => {
    it('gives an event the site accepts', () => {
        const event = parseEvent(eventFromForm(complete()));
        expect(event.title).toEqual({ de: 'Salsa Friday', en: 'Salsa Friday' });
        expect(event.teachers).toEqual(['Helen', 'Yago']);
        expect(event.bookingLinks).toEqual({});
    });

    it('survives a round trip through the form', () => {
        const event = parseEvent(eventFromForm(complete()));
        expect(parseEvent(eventFromForm(formFromEvent(event)))).toEqual(event);
    });

    it('uses the German label when the English one is left empty', () => {
        const values = complete();
        values.badges[0] = { de: 'DJ Tamboly', en: '' };
        expect(eventFromForm(values).badges).toEqual([{ de: 'DJ Tamboly', en: 'DJ Tamboly' }]);
    });
});

describe('readForm', () => {
    it('turns browser line endings into plain ones', () => {
        const data = new FormData();
        data.set('descriptionDe', 'Erster Absatz.\r\n\r\nZweiter Absatz.');
        expect(readForm(data).descriptionDe).toBe('Erster Absatz.\n\nZweiter Absatz.');
    });

    it('reads an unticked box as off', () => {
        expect(readForm(new FormData()).regularClasses).toBe(false);
    });
});

describe('findProblems', () => {
    it('finds nothing wrong with a complete event', () => {
        expect(findProblems(complete(), context)).toEqual({});
    });

    it('asks for the English text when only German is there', () => {
        const problems = findProblems(complete({ summaryEn: '' }), context);
        expect(problems.summaryEn).toBe(bo.problems.needsEnglish);
    });

    it('refuses a date another event already has', () => {
        const problems = findProblems(complete({ date: '2026-11-27' }), context);
        expect(problems.date).toContain('Salsa Friday (27.11.)');
    });

    it('refuses a slug another event already has', () => {
        const problems = findProblems(complete({ slug: 'salsa-friday-dj-ren' }), context);
        expect(problems.slug).toContain('Salsa Friday (27.11.)');
    });

    it('keeps the slug of a published event fixed', () => {
        const problems = findProblems(complete(), {
            ...context,
            publishedSlug: 'salsa-friday',
        });
        expect(problems.slug).toBe(bo.problems.slugLocked);
    });

    it('refuses a booking link to another site', () => {
        const values = complete();
        values.links['salsa-basics'] = 'https://example.com/kurs';
        expect(findProblems(values, context)['link-salsa-basics']).toBe(
            bo.problems.linkInvalid,
        );
    });

    it('refuses a picture that is not in the library', () => {
        expect(findProblems(complete({ image: 'nope.jpg' }), context).image).toBe(
            bo.problems.imageUnknown,
        );
    });

    it('never lets through what the site would reject', () => {
        // Whatever passes here must also pass the check of the build.
        const values = complete({ descriptionDe: 'Text.', descriptionEn: 'Text.' });
        expect(findProblems(values, context)).toEqual({});
        expect(() => parseEvent(eventFromForm(values))).not.toThrow();
    });
});

describe('isAcceptedBookingLink', () => {
    it('follows the allow list of the site', () => {
        expect(isAcceptedBookingLink('https://www.eversports.de/e/workshop/abc')).toBe(true);
        expect(isAcceptedBookingLink('https://urbansportsclub.com/de/venues/x')).toBe(true);
        expect(isAcceptedBookingLink('http://www.eversports.de/e/workshop/abc')).toBe(false);
        expect(isAcceptedBookingLink('https://eversports.de.example.com/')).toBe(false);
    });
});

describe('findWarnings', () => {
    it('points out a date that is not a Friday', () => {
        const warnings = findWarnings(complete({ date: '2026-12-05' }), context);
        expect(warnings).toContain(bo.warnings.notFriday('Samstag'));
    });

    it('counts the class links that are missing', () => {
        expect(findWarnings(complete(), context)).toContain(bo.warnings.linksMissing(4, 4));
    });

    it('does not ask for class links on a night without classes', () => {
        const warnings = findWarnings(complete({ regularClasses: false }), context);
        expect(warnings.join(' ')).not.toContain('Buchungslink');
    });
});

describe('previewFromForm', () => {
    const preserved = { extras: [], courseLabels: {} };

    it('borrows the German text while the English one is missing', () => {
        const { event, notes } = previewFromForm(
            complete({ summaryEn: '' }),
            preserved,
            context.photoNames,
        );
        expect(event?.summary).toEqual({ de: 'Ein Satz.', en: 'Ein Satz.' });
        expect(notes).toContain(bo.preview.notes.fallbackEn);
    });

    it('leaves a broken link out and says so', () => {
        const values = complete();
        values.links['salsa-basics'] = 'not a link';
        const { event, notes } = previewFromForm(values, preserved, context.photoNames);
        expect(event?.bookingLinks).toEqual({});
        expect(notes).toContain(bo.preview.notes.linksDropped);
    });

    it('has nothing to show without a date', () => {
        expect(previewFromForm(complete({ date: '' }), preserved, []).event).toBeNull();
    });

    it('renders even with no slug yet', () => {
        expect(previewFromForm(complete({ slug: '' }), preserved, context.photoNames).event?.slug).toBe(
            'vorschau',
        );
    });
});
