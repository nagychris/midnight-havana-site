import type { AstroSession } from 'astro';

import { CLASS_IDS } from '../data/classes';
import { parseDateKey } from '../lib/datetime';
import type { SiteEvent } from '../lib/event-types';
import { bo } from './copy';
import type { OtherEvent } from './event-form';
import { readEventData } from './event-yaml';
import type { EventEntry } from './store';

/** Small things several back office pages need. */

/** The session, which every back office page has. */
export function sessionOf(astro: { session?: AstroSession }): AstroSession {
    if (!astro.session) {
        throw new Error('The back office needs sessions. Is the Netlify adapter enabled?');
    }
    return astro.session;
}

export function setFlash(session: AstroSession, text: string, tone: 'ok' | 'warn' = 'ok'): void {
    session.set('flash', { tone, text });
}

/** The message left for this page, shown once. */
export async function takeFlash(session: AstroSession) {
    const flash = await session.get('flash');
    if (flash) session.delete('flash');
    return flash ?? null;
}

export type EntryStatus = 'live' | 'draft' | 'changes';

export interface ListedEvent {
    id: string;
    status: EntryStatus;
    /** What the back office shows: the draft when there is one. */
    event: SiteEvent;
    /** Standard classes on this date that still have no booking link. */
    missingLinks: number;
}

export function statusOf(entry: EventEntry): EntryStatus {
    if (entry.published !== null && entry.draft !== null) return 'changes';
    return entry.published !== null ? 'live' : 'draft';
}

export function listed(entry: EventEntry): ListedEvent {
    const event = readEventData(entry.draft ?? entry.published ?? '');
    const missingLinks =
        event.regularClasses && !event.cancelled
            ? CLASS_IDS.filter((id) => !event.bookingLinks[id]).length
            : 0;
    return { id: entry.id, status: statusOf(entry), event, missingLinks };
}

/** "27.11." */
export function shortDate(dateKey: string): string {
    const [, month, day] = dateKey.split('-');
    return month && day ? `${Number(day)}.${Number(month)}.` : dateKey;
}

/** The published events other than one, for the checks against doubles. */
export function othersPublished(entries: EventEntry[], exceptId: string | null): OtherEvent[] {
    return entries
        .filter((entry) => entry.published !== null && entry.id !== exceptId)
        .map((entry) => readEventData(entry.published ?? ''))
        .map((event) => ({
            date: event.date,
            slug: event.slug,
            label: `${event.title?.de ?? bo.list.noTitle} (${shortDate(event.date)})`,
        }));
}

const FRIDAY = 5;

/** The first Friday from today that has no event yet. */
export function nextFreeFriday(today: string, takenDates: readonly string[]): string {
    const day = parseDateKey(today);
    for (let step = 0; step < 370; step += 1) {
        const key = day.toISOString().slice(0, 10);
        if (day.getUTCDay() === FRIDAY && !takenDates.includes(key)) return key;
        day.setUTCDate(day.getUTCDate() + 1);
    }
    return today;
}

/** A file-name id that no other entry has yet. */
export function freeId(wanted: string, taken: readonly string[]): string {
    if (!taken.includes(wanted)) return wanted;
    for (let count = 2; ; count += 1) {
        const candidate = `${wanted}-${count}`;
        if (!taken.includes(candidate)) return candidate;
    }
}
