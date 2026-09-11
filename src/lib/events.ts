import rawEventData from '../data/events.json';
import { CLASS_IDS } from '../data/classes';
import { isSpecificBooking } from './booking';
import { todayInBerlin } from './datetime';
import { assertUniqueDatesAndSlugs, parseEvent } from './event-parsing';
import type { SiteEvent } from './event-types';

/**
 * Reading side of `src/data/events.json`.
 *
 * Validation lives in `event-parsing.ts`; this module is the small API the
 * pages use.
 */

/** Every event in the file, validated and sorted by date, soonest first. */
export function allEvents(): SiteEvent[] {
    const entries = (rawEventData as { events?: unknown }).events;
    if (!Array.isArray(entries)) {
        throw new Error('events.json must contain an "events" array.');
    }

    const events = entries.map(parseEvent);
    assertUniqueDatesAndSlugs(events);
    return events.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Events from today onwards, soonest first.
 *
 * Today counts, because the night has not happened yet when the page is read
 * in the morning. Anything earlier is never rendered.
 */
export function upcomingEvents(today: string = todayInBerlin()): SiteEvent[] {
    return allEvents().filter((event) => event.date >= today);
}

/** The next event, or null when the file holds no future dates. */
export function nextEvent(today: string = todayInBerlin()): SiteEvent | null {
    return upcomingEvents(today)[0] ?? null;
}

/** One event by its slug, or null. Used by the detail pages. */
export function eventBySlug(slug: string): SiteEvent | null {
    return allEvents().find((event) => event.slug === slug) ?? null;
}

/** The dates after a given one, for the "other dates" list on a detail page. */
export function otherUpcomingEvents(
    slug: string,
    today: string = todayInBerlin(),
): SiteEvent[] {
    return upcomingEvents(today).filter((event) => event.slug !== slug);
}

/**
 * True when every class on this date links to that specific class rather than
 * to the studio's general page. Drives the note that warns visitors the links
 * are provisional.
 */
export function hasSpecificBookingLinks(event: SiteEvent): boolean {
    return CLASS_IDS.every((id) => isSpecificBooking(event, id));
}

export { bookingUrlFor, resolveBooking } from './booking';

export type {
    BookingTarget,
    EventBadge,
    EventExtra,
    LocalisedText,
    SiteEvent,
} from './event-types';
