import { classes } from '../data/classes';
import { site } from '../data/site';
import { bookingUrlFor } from './booking';
import type { SiteEvent } from './event-types';
import type { Locale } from '../i18n/locales';
import type { Translation } from '../i18n/de';

/**
 * Builds the running order of one night, grouped by time.
 *
 * Two classes run in parallel at 19:00 and two more at 20:00, so a flat list
 * repeats every time twice and reads like four separate slots. Grouping means
 * each time is stated once, with what happens then beside it, which is how a
 * timetable is normally read.
 *
 * Doors first, then anything extra that date has, then the classes, then the
 * social dance. Slots are sorted by time, so a workshop at 17:00 lands above
 * the classes without this having to know about it.
 */

export type TimetableTone = 'doors' | 'salsa' | 'rueda' | 'extra' | 'social';

export interface TimetableEntry {
    title: string;
    /**
     * Only set for things that have no card of their own elsewhere on the page.
     * Repeating each class description here would say the same sentence twice
     * for the two rueda levels and turn the schedule into prose.
     */
    description: string | null;
    /** Level shorthand such as A1, or null where there is no level. */
    level: string | null;
    /** Where the booking link points, or null when there is nothing to book. */
    bookingUrl: string | null;
    tone: TimetableTone;
}

export interface TimetableSlot {
    startTime: string;
    /** The latest end time in the slot, or null when nothing has one. */
    endTime: string | null;
    entries: TimetableEntry[];
}

export function timetableFor(
    event: SiteEvent,
    locale: Locale,
    t: Translation,
): TimetableSlot[] {
    const rows = [
        doorsRow(t),
        ...extraRows(event, locale),
        ...classRows(event, t),
        socialRow(event, t),
    ];

    return groupByStartTime(rows);
}

interface Row extends TimetableEntry {
    startTime: string;
    endTime: string | null;
}

function groupByStartTime(rows: Row[]): TimetableSlot[] {
    const slots = new Map<string, TimetableSlot>();

    for (const { startTime, endTime, ...entry } of rows) {
        const slot = slots.get(startTime) ?? { startTime, endTime, entries: [] };

        // Two parallel classes can in principle end at different times; the
        // slot runs until the last of them is done.
        if (endTime && (!slot.endTime || endTime > slot.endTime)) {
            slot.endTime = endTime;
        }

        slot.entries.push(entry);
        slots.set(startTime, slot);
    }

    return [...slots.values()].sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function doorsRow(t: Translation): Row {
    return {
        startTime: site.schedule.doorsOpen,
        endTime: null,
        title: t.event.doorsOpen,
        description: t.event.doorsNote,
        level: null,
        bookingUrl: null,
        tone: 'doors',
    };
}

function extraRows(event: SiteEvent, locale: Locale): Row[] {
    return event.extras.map((extra) => ({
        startTime: extra.startTime,
        endTime: extra.endTime,
        title: extra.title[locale],
        description: extra.description?.[locale] ?? null,
        level: extra.level,
        bookingUrl: extra.booking,
        tone: 'extra' as const,
    }));
}

function classRows(event: SiteEvent, t: Translation): Row[] {
    return classes.map((danceClass) => ({
        startTime: danceClass.startTime,
        endTime: danceClass.endTime,
        title: t.classes.items[danceClass.id].name,
        description: null,
        level: danceClass.level,
        bookingUrl: bookingUrlFor(event, danceClass.id),
        tone: danceClass.track === 'rueda' ? ('rueda' as const) : ('salsa' as const),
    }));
}

function socialRow(event: SiteEvent, t: Translation): Row {
    return {
        startTime: site.schedule.socialDance,
        endTime: site.schedule.endOfNight,
        title: t.nextEvent.socialDance,
        description: event.dj
            ? `${t.event.djLabel}: ${event.dj}. ${t.event.socialNote}`
            : t.event.socialNote,
        level: null,
        bookingUrl: event.booking.party ?? null,
        tone: 'social',
    };
}
