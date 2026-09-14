import { describe, expect, it } from 'vitest';

import { CLASS_IDS } from '../data/classes';
import {
    eventsMissingBookingLinks,
    formatMissingBookingLinks,
} from './booking-report';
import type { BookingTarget, SiteEvent } from './event-types';

const TODAY = '2026-09-14';

function linkFor(target: BookingTarget): string {
    return `https://www.eversports.de/e/${target}`;
}

/** Booking links for all four classes, so nothing is reported as missing. */
function allClassLinks(): Partial<Record<BookingTarget, string>> {
    return Object.fromEntries(CLASS_IDS.map((id) => [id, linkFor(id)]));
}

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
        bookingLinks: allClassLinks(),
        extras: [],
        ...overrides,
    };
}

describe('eventsMissingBookingLinks', () => {
    it('says nothing when every class has a link', () => {
        expect(eventsMissingBookingLinks([event()], TODAY)).toEqual([]);
    });

    it('names the classes that have no link', () => {
        const links = allClassLinks();
        delete links['rueda-advanced'];
        delete links['salsa-beginner'];

        const reports = eventsMissingBookingLinks(
            [event({ bookingLinks: links })],
            TODAY,
        );

        expect(reports).toEqual([
            {
                date: '2026-10-02',
                slug: 'al-son-de-cuba',
                missing: ['salsa-beginner', 'rueda-advanced'],
            },
        ]);
    });

    it('ignores dates that have passed', () => {
        const past = event({ date: '2026-09-11', slug: 'gone', bookingLinks: {} });

        expect(eventsMissingBookingLinks([past], TODAY)).toEqual([]);
    });

    it('counts today as upcoming', () => {
        const tonight = event({ date: TODAY, slug: 'tonight', bookingLinks: {} });

        expect(eventsMissingBookingLinks([tonight], TODAY)).toHaveLength(1);
    });

    it('ignores cancelled dates, which nobody can book', () => {
        const off = event({ cancelled: true, bookingLinks: {} });

        expect(eventsMissingBookingLinks([off], TODAY)).toEqual([]);
    });

    it('does not treat a missing party link as a problem', () => {
        const event_ = event({ bookingLinks: allClassLinks() });

        expect(eventsMissingBookingLinks([event_], TODAY)).toEqual([]);
    });
});

describe('formatMissingBookingLinks', () => {
    it('writes one line per date, naming the classes', () => {
        const lines = formatMissingBookingLinks([
            {
                date: '2026-10-02',
                slug: 'al-son-de-cuba',
                missing: ['salsa-beginner', 'rueda-advanced'],
            },
        ]);

        expect(lines).toEqual([
            '2026-10-02 al-son-de-cuba is missing salsa-beginner, rueda-advanced.',
        ]);
    });

    it('writes nothing when there is nothing to report', () => {
        expect(formatMissingBookingLinks([])).toEqual([]);
    });
});
