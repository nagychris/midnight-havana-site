import { site } from '../data/site';
import type { BookingTarget, SiteEvent } from './event-types';

/**
 * Works out where a booking button should point.
 *
 * Eversports gives each occurrence of a class its own URL, so the links change
 * from date to date. They are entered by hand in `events.json`, one block per
 * date. A date with no link yet still gets a working button, because the
 * studio's general page is always there to fall back on.
 */

/** Where a booking link came from. Useful when explaining a fallback. */
export type BookingSource = 'event' | 'general';

export interface BookingLink {
    url: string;
    source: BookingSource;
}

/**
 * The booking link for one class on one date, and where it came from.
 *
 * Two levels: the link entered for that date in `events.json`, and otherwise
 * the studio's general Eversports page, which always works.
 */
export function resolveBooking(
    event: SiteEvent,
    target: BookingTarget,
): BookingLink {
    const forThisDate = event.bookingLinks[target];
    if (forThisDate) return { url: forThisDate, source: 'event' };

    return { url: site.booking.fallbackUrl, source: 'general' };
}

/** Just the URL, for the common case. */
export function bookingUrlFor(event: SiteEvent, target: BookingTarget): string {
    return resolveBooking(event, target).url;
}

/**
 * True when a booking button leads somewhere more specific than the studio's
 * general page. Drives the note that warns visitors the link is provisional.
 */
export function isSpecificBooking(
    event: SiteEvent,
    target: BookingTarget,
): boolean {
    return resolveBooking(event, target).source !== 'general';
}
