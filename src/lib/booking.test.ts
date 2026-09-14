import { describe, expect, it } from 'vitest';

import { site } from '../data/site';
import { bookingUrlFor, isSpecificBooking, resolveBooking } from './booking';
import type { BookingTarget, SiteEvent } from './event-types';

const SALSA_BASICS_URL = 'https://www.eversports.de/e/11111111-1111-1111-1111-111111111111';
const PARTY_URL = 'https://www.eversports.de/e/22222222-2222-2222-2222-222222222222';

function eventWithBookingLinks(
    bookingLinks: Partial<Record<BookingTarget, string>>,
): SiteEvent {
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
        bookingLinks,
        extras: [],
    };
}

describe('resolveBooking', () => {
    it('uses the link set on the date', () => {
        const event = eventWithBookingLinks({ 'salsa-basics': SALSA_BASICS_URL });

        expect(resolveBooking(event, 'salsa-basics')).toEqual({
            url: SALSA_BASICS_URL,
            source: 'event',
        });
    });

    it('falls back to the general page when the date has no link', () => {
        const event = eventWithBookingLinks({});

        expect(resolveBooking(event, 'salsa-basics')).toEqual({
            url: site.booking.fallbackUrl,
            source: 'general',
        });
    });

    it('resolves each class independently', () => {
        const event = eventWithBookingLinks({ 'salsa-basics': SALSA_BASICS_URL });

        expect(bookingUrlFor(event, 'salsa-basics')).toBe(SALSA_BASICS_URL);
        expect(bookingUrlFor(event, 'rueda-advanced')).toBe(site.booking.fallbackUrl);
    });

    it('never lends a class link to the party', () => {
        const event = eventWithBookingLinks({ 'salsa-basics': SALSA_BASICS_URL });

        expect(bookingUrlFor(event, 'party')).toBe(site.booking.fallbackUrl);
    });

    it('uses the party link when the date has one', () => {
        const event = eventWithBookingLinks({ party: PARTY_URL });

        expect(bookingUrlFor(event, 'party')).toBe(PARTY_URL);
    });
});

describe('isSpecificBooking', () => {
    it('is true for a class the date links to', () => {
        const event = eventWithBookingLinks({ 'salsa-basics': SALSA_BASICS_URL });

        expect(isSpecificBooking(event, 'salsa-basics')).toBe(true);
    });

    it('is false for a class that falls back to the general page', () => {
        const event = eventWithBookingLinks({});

        expect(isSpecificBooking(event, 'salsa-basics')).toBe(false);
    });
});
