import { CLASS_IDS, type ClassId } from '../data/classes';
import { todayInBerlin } from './datetime';
import type { SiteEvent } from './event-types';

/**
 * Finds upcoming dates whose booking links have not been entered yet.
 *
 * The links come from Eversports by hand, a set per date, so the one thing that
 * can quietly go stale is somebody forgetting a month. The build prints what is
 * missing instead of failing: a date without links still renders, its buttons
 * just lead to the studio's general page.
 *
 * The party is not checked. It is paid for at the door and only sometimes has a
 * link of its own.
 */

export interface MissingBookingLinks {
    date: string;
    slug: string;
    /** Classes on that date with no booking link, in timetable order. */
    missing: ClassId[];
}

export function eventsMissingBookingLinks(
    events: SiteEvent[],
    today: string = todayInBerlin(),
): MissingBookingLinks[] {
    const relevant = events.filter(
        (event) => event.date >= today && !event.cancelled,
    );

    return relevant
        .map((event) => ({
            date: event.date,
            slug: event.slug,
            missing: CLASS_IDS.filter((id) => !event.bookingLinks[id]),
        }))
        .filter((report) => report.missing.length > 0);
}

/** One readable line per date, for the build log. */
export function formatMissingBookingLinks(
    reports: MissingBookingLinks[],
): string[] {
    return reports.map(
        (report) =>
            `${report.date} ${report.slug} is missing ${report.missing.join(', ')}.`,
    );
}
