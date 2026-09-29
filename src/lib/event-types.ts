import type { ClassId } from '../data/classes';
import type { Locale } from '../i18n/locales';

/** The same text in both site languages. */
export type LocalisedText = Record<Locale, string>;

/**
 * A short label on a date. Its colour is not stored: it comes from the
 * badge's position, so every card looks the same (see event-badges.ts).
 */
export type EventBadge = LocalisedText;

/** Anything in the timetable that is not one of the four standard classes. */
export interface EventExtra {
    startTime: string;
    endTime: string | null;
    title: LocalisedText;
    description: LocalisedText | null;
    level: string | null;
    booking: string | null;
}

/** Where a booking link can point: one of the classes, or the party itself. */
export type BookingTarget = ClassId | 'party';

export interface SiteEvent {
    date: string;
    slug: string;
    title: LocalisedText | null;
    summary: LocalisedText | null;
    description: LocalisedText | null;
    dj: string | null;
    teachers: string[];
    badges: EventBadge[];
    image: string | null;
    flyer: string | null;
    priceNote: LocalisedText | null;
    cancelled: boolean;
    /**
     * False on nights where the four standard classes do not run, for example
     * when a guest workshop replaces them.
     */
    regularClasses: boolean;
    /** Class names that differ from the standard ones on this date. */
    courseLabels: Partial<Record<ClassId, LocalisedText>>;
    /** The Eversports links for this date, one per class, plus the party. */
    bookingLinks: Partial<Record<BookingTarget, string>>;
    extras: EventExtra[];
}

/** Thrown when `events.json` holds something the site cannot render. */
export class EventDataError extends Error {
    constructor(where: string, message: string) {
        super(`events.json — ${where}: ${message}`);
        this.name = 'EventDataError';
    }
}
