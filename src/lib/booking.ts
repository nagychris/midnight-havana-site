import syncedLinks from '../data/eversports-links.json';
import { getClass, type ClassId } from '../data/classes';
import { site } from '../data/site';
import type { BookingTarget, SiteEvent } from './event-types';

/**
 * Works out where a booking button should point.
 *
 * Eversports gives each occurrence of a class its own URL, so the links move
 * every week. Rather than asking whoever adds an event to paste four fresh
 * URLs, the build reads them off the Eversports schedule page and the site
 * uses whatever it found. Everything below that is a safety net.
 */

/** Where a booking link came from. Useful when explaining a fallback. */
export type BookingSource = 'event' | 'synced' | 'class' | 'general';

export interface BookingLink {
    url: string;
    source: BookingSource;
}

const synced = (syncedLinks as { links?: Record<string, string> }).links ?? {};

/** When the links were last read off Eversports, or null if never. */
export const syncedAt: string | null =
    (syncedLinks as { syncedAt?: string | null }).syncedAt ?? null;

/**
 * The booking link for one class on one date, and where it came from.
 *
 * Four levels, most specific first:
 *
 *   1. a link set on the date itself in `events.json`, for a night that is
 *      booked differently from usual;
 *   2. the link read off the Eversports schedule on the last build;
 *   3. the class's own link in `classes.ts`, kept as a hand-maintained
 *      fallback for when the sync finds nothing;
 *   4. the studio's general Eversports page, which always works.
 */
export function resolveBooking(
    event: SiteEvent,
    target: BookingTarget,
): BookingLink {
    const perDate = event.booking[target];
    if (perDate) return { url: perDate, source: 'event' };

    if (target !== 'party') {
        const fresh = synced[target];
        if (fresh) return { url: fresh, source: 'synced' };

        const fallback = getClass(target as ClassId).bookingUrl;
        if (fallback) return { url: fallback, source: 'class' };
    }

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
