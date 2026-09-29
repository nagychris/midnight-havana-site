import { classes, type ClassId, type DanceClass } from '../data/classes';
import type { Translation } from '../i18n/de';
import type { Locale } from '../i18n/locales';
import type { SiteEvent } from './event-types';

/**
 * Which of the standard classes run on one date, and what they are called.
 *
 * Most nights have the same four classes with the same names. A date can drop
 * them (a guest workshop night) or rename them (a son special), and every place
 * that lists the classes of a date goes through here so they all agree.
 */

/** The classes that run on this date, in card order. Empty when none do. */
export function classesOn(event: SiteEvent): readonly DanceClass[] {
    return event.regularClasses ? classes : [];
}

/** The name of a class on this date: the date's own label, else the standard name. */
export function classNameOn(
    event: SiteEvent,
    classId: ClassId,
    locale: Locale,
    t: Translation,
): string {
    return event.courseLabels[classId]?.[locale] ?? t.classes.items[classId].name;
}
