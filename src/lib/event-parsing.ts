import { CLASS_IDS } from '../data/classes';
import { isValidDateKey } from './datetime';
import {
    EventDataError,
    type BadgeTone,
    type BookingTarget,
    type EventBadge,
    type EventExtra,
    type LocalisedText,
    type SiteEvent,
} from './event-types';

/**
 * Turns raw JSON into typed events, or fails the build saying exactly what is
 * wrong and which date it is on.
 *
 * Nothing here trusts the input. The file is edited by hand today and may be
 * written by an admin interface later, and a page that silently renders a
 * broken link is much harder to notice than a build that stops.
 */

/** Hosts a booking link is allowed to point at. */
const ALLOWED_BOOKING_HOSTS = [
    'eversports.de',
    'eversports.com',
    'eversports.at',
    'urbansportsclub.com',
];

const BOOKING_TARGETS: BookingTarget[] = [...CLASS_IDS, 'party'];
const BADGE_TONES: BadgeTone[] = ['gold', 'green', 'solid', 'muted'];
const MAX_TEXT_LENGTH = 600;
const IMAGE_FILE = /^[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TIME_OF_DAY = /^([01]\d|2[0-3]):[0-5]\d$/;

export function parseEvent(entry: unknown): SiteEvent {
    if (typeof entry !== 'object' || entry === null) {
        throw new Error('events.json contains an entry that is not an object.');
    }

    const raw = entry as Record<string, unknown>;
    const date = raw.date;
    if (!isValidDateKey(date)) {
        throw new Error(
            `events.json contains an invalid date: ${JSON.stringify(date)}. Use YYYY-MM-DD.`,
        );
    }

    return {
        date,
        slug: parseSlug(date, raw.slug),
        title: parseLocalisedText(date, 'title', raw.title),
        summary: parseLocalisedText(date, 'summary', raw.summary),
        description: parseLocalisedText(date, 'description', raw.description),
        dj: parseOptionalString(date, 'dj', raw.dj),
        teachers: parseStringList(date, 'teachers', raw.teachers),
        badges: parseBadges(date, raw.badges),
        image: parseImageFileName(date, 'image', raw.image),
        flyer: parseImageFileName(date, 'flyer', raw.flyer),
        priceNote: parseLocalisedText(date, 'priceNote', raw.priceNote),
        cancelled: raw.cancelled === true,
        booking: parseBooking(date, raw.booking),
        extras: parseExtras(date, raw.extras),
    };
}

export function assertUniqueDatesAndSlugs(events: SiteEvent[]): void {
    const dates = new Set<string>();
    const slugs = new Set<string>();

    for (const event of events) {
        if (dates.has(event.date)) {
            throw new EventDataError(event.date, 'this date appears more than once.');
        }
        if (slugs.has(event.slug)) {
            throw new EventDataError(
                event.date,
                `the slug "${event.slug}" is already used by another date.`,
            );
        }
        dates.add(event.date);
        slugs.add(event.slug);
    }
}

function parseSlug(date: string, value: unknown): string {
    if (typeof value !== 'string' || !SLUG.test(value) || value.length > 80) {
        throw new EventDataError(
            date,
            `"slug" must be lower case letters, digits and hyphens, for example al-son-de-cuba. Got ${JSON.stringify(value)}.`,
        );
    }
    return value;
}

function parseLocalisedText(
    date: string,
    field: string,
    value: unknown,
): LocalisedText | null {
    if (value === null || value === undefined) return null;

    const text = value as Record<string, unknown>;
    const de = text.de;
    const en = text.en;

    const hasBoth =
        typeof de === 'string' &&
        typeof en === 'string' &&
        de.trim() !== '' &&
        en.trim() !== '';

    if (!hasBoth) {
        throw new EventDataError(
            date,
            `"${field}" needs a non-empty "de" and "en" value, or null.`,
        );
    }
    if (de.length > MAX_TEXT_LENGTH || en.length > MAX_TEXT_LENGTH) {
        throw new EventDataError(
            date,
            `"${field}" is longer than ${MAX_TEXT_LENGTH} characters.`,
        );
    }
    return { de, en };
}

function parseOptionalString(
    date: string,
    field: string,
    value: unknown,
): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value !== 'string' || value.length > MAX_TEXT_LENGTH) {
        throw new EventDataError(date, `"${field}" must be a short string or null.`);
    }
    return value.trim() === '' ? null : value;
}

function parseStringList(date: string, field: string, value: unknown): string[] {
    if (value === null || value === undefined) return [];
    if (!Array.isArray(value)) {
        throw new EventDataError(date, `"${field}" must be an array of strings.`);
    }
    return value.map((item, index) => {
        if (typeof item !== 'string' || item.trim() === '') {
            throw new EventDataError(
                date,
                `"${field}[${index}]" must be a non-empty string.`,
            );
        }
        return item;
    });
}

function parseBadges(date: string, value: unknown): EventBadge[] {
    if (value === null || value === undefined) return [];
    if (!Array.isArray(value)) {
        throw new EventDataError(date, '"badges" must be an array.');
    }

    return value.map((entry, index) => {
        const text = parseLocalisedText(date, `badges[${index}]`, entry);
        if (!text) {
            throw new EventDataError(date, `"badges[${index}]" must not be null.`);
        }

        const tone = (entry as Record<string, unknown>).tone ?? 'gold';
        if (!BADGE_TONES.includes(tone as BadgeTone)) {
            throw new EventDataError(
                date,
                `"badges[${index}].tone" must be one of ${BADGE_TONES.join(', ')}.`,
            );
        }
        return { ...text, tone: tone as BadgeTone };
    });
}

function parseImageFileName(
    date: string,
    field: string,
    value: unknown,
): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value !== 'string' || !IMAGE_FILE.test(value)) {
        throw new EventDataError(
            date,
            `"${field}" must be an image file name such as party.jpg, with no folders.`,
        );
    }
    return value;
}

function parseExtras(date: string, value: unknown): EventExtra[] {
    if (value === null || value === undefined) return [];
    if (!Array.isArray(value)) {
        throw new EventDataError(date, '"extras" must be an array.');
    }

    return value.map((entry, index) => {
        const raw = (entry ?? {}) as Record<string, unknown>;
        const where = `extras[${index}]`;

        const title = parseLocalisedText(date, `${where}.title`, raw.title);
        if (!title) {
            throw new EventDataError(date, `"${where}.title" is required.`);
        }

        return {
            startTime: parseTimeOfDay(date, `${where}.startTime`, raw.startTime, true),
            endTime: parseTimeOfDay(date, `${where}.endTime`, raw.endTime, false),
            title,
            description: parseLocalisedText(date, `${where}.description`, raw.description),
            level: parseOptionalString(date, `${where}.level`, raw.level),
            booking:
                raw.booking === null || raw.booking === undefined
                    ? null
                    : assertBookingUrl(date, `${where}.booking`, raw.booking),
        };
    });
}

function parseTimeOfDay(
    date: string,
    field: string,
    value: unknown,
    required: true,
): string;
function parseTimeOfDay(
    date: string,
    field: string,
    value: unknown,
    required: false,
): string | null;
function parseTimeOfDay(
    date: string,
    field: string,
    value: unknown,
    required: boolean,
): string | null {
    if (value === null || value === undefined) {
        if (required) throw new EventDataError(date, `"${field}" is required.`);
        return null;
    }
    if (typeof value !== 'string' || !TIME_OF_DAY.test(value)) {
        throw new EventDataError(date, `"${field}" must be a time such as 19:00.`);
    }
    return value;
}

function parseBooking(
    date: string,
    value: unknown,
): Partial<Record<BookingTarget, string>> {
    if (value === null || value === undefined) return {};
    if (typeof value !== 'object') {
        throw new EventDataError(date, '"booking" must be an object or null.');
    }

    const booking: Partial<Record<BookingTarget, string>> = {};

    for (const [key, url] of Object.entries(value as Record<string, unknown>)) {
        if (!BOOKING_TARGETS.includes(key as BookingTarget)) {
            throw new EventDataError(
                date,
                `"booking" has an unknown key "${key}". Allowed: ${BOOKING_TARGETS.join(', ')}.`,
            );
        }
        if (url === null || url === undefined) continue;
        booking[key as BookingTarget] = assertBookingUrl(date, `booking.${key}`, url);
    }
    return booking;
}

/**
 * Accepts an https URL on one of our booking platforms and rejects everything
 * else, so a typo or a tampered data file cannot turn a booking button into a
 * link to an arbitrary site.
 */
function assertBookingUrl(date: string, field: string, value: unknown): string {
    if (typeof value !== 'string') {
        throw new EventDataError(date, `"${field}" must be a URL string or null.`);
    }

    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new EventDataError(date, `"${field}" is not a valid URL: ${value}`);
    }

    if (url.protocol !== 'https:') {
        throw new EventDataError(date, `"${field}" must use https.`);
    }
    if (!ALLOWED_BOOKING_HOSTS.some((host) => isSameOrSubdomainOf(url.hostname, host))) {
        throw new EventDataError(
            date,
            `"${field}" points at ${url.hostname}. Allowed hosts: ${ALLOWED_BOOKING_HOSTS.join(', ')}.`,
        );
    }
    return url.toString();
}

function isSameOrSubdomainOf(hostname: string, domain: string): boolean {
    return hostname === domain || hostname.endsWith(`.${domain}`);
}
