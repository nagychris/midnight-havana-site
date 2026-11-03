import { CLASS_IDS } from '../data/classes';
import { isSpecificBooking } from './booking';
import { todayInBerlin } from './datetime';
import { eventsFromFiles } from './event-files';
import type { SiteEvent } from './event-types';

/**
 * Reading side of `src/data/events/`, one YAML file per date.
 *
 * Reading and validation live in `event-files.ts` and `event-parsing.ts`; this
 * module is the small API the pages use.
 */

/**
 * The text of every event file, read by Vite at build time.
 *
 * Astro content collections are not used on purpose: `getCollection()` is
 * async and only works inside Astro, but `allEvents()` must stay synchronous
 * because `astro.config.mjs` (booking report) and the vitest tests call it
 * outside Astro.
 */
const eventFiles = import.meta.glob<string>('/src/data/events/*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

/** Every event, validated and sorted by date, soonest first. */
export function allEvents(): SiteEvent[] {
    return eventsFromFiles(eventFiles);
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

/**
 * The next event where the standard classes run, or null.
 *
 * The class section books the next class, so a workshop night without the
 * usual classes is skipped.
 */
export function nextEventWithClasses(
    today: string = todayInBerlin(),
): SiteEvent | null {
    return upcomingEvents(today).find((event) => event.regularClasses) ?? null;
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
