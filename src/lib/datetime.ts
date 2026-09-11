import { site } from '../data/site';
import type { Locale } from '../i18n/locales';

const BCP47: Record<Locale, string> = { de: 'de-DE', en: 'en-GB' };

/**
 * Today's date in Berlin as YYYY-MM-DD.
 *
 * The site is generated ahead of time, so this is the build date. A daily
 * rebuild keeps the "next date" from going stale; see README.md.
 */
export function todayInBerlin(now: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: site.schedule.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}

/** Turns YYYY-MM-DD into a Date at midday UTC, safely away from any DST edge. */
export function parseDateKey(dateKey: string): Date {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
}

/** True if the string is a real calendar date written as YYYY-MM-DD. */
export function isValidDateKey(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    // Rejects dates like 2026-02-31, which parse but roll over into March.
    return parseDateKey(value).toISOString().slice(0, 10) === value;
}

/** "Freitag, 11. September" / "Friday, 11 September". */
export function formatLongDate(dateKey: string, locale: Locale): string {
    return new Intl.DateTimeFormat(BCP47[locale], {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
    }).format(parseDateKey(dateKey));
}

/** The parts of a date, for the large date block on an event card. */
export function formatDateParts(dateKey: string, locale: Locale) {
    const date = parseDateKey(dateKey);
    const part = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(BCP47[locale], {
            ...options,
            timeZone: 'UTC',
        }).format(date);

    return {
        weekday: part({ weekday: 'short' }).replace('.', ''),
        day: part({ day: 'numeric' }),
        month: part({ month: 'short' }).replace('.', ''),
        year: part({ year: 'numeric' }),
    };
}

/**
 * An ISO 8601 timestamp with Berlin's UTC offset, for structured data.
 *
 * Example: `toIsoDateTime('2026-09-11', '19:00')` gives
 * `2026-09-11T19:00:00+02:00`.
 */
export function toIsoDateTime(dateKey: string, time: string): string {
    const offset = berlinUtcOffset(dateKey);
    return `${dateKey}T${time}:00${offset}`;
}

/**
 * The end of a night falls after midnight, so it belongs to the next day.
 */
export function toIsoEndOfNight(dateKey: string, time: string): string {
    const nextDay = parseDateKey(dateKey);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    return toIsoDateTime(nextDay.toISOString().slice(0, 10), time);
}

/** Berlin's offset from UTC on a given date, as "+01:00" or "+02:00". */
function berlinUtcOffset(dateKey: string): string {
    const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: site.schedule.timeZone,
        timeZoneName: 'longOffset',
    }).format(parseDateKey(dateKey));

    const match = formatted.match(/GMT([+-]\d{2}:\d{2})/);
    return match ? match[1] : '+01:00';
}
