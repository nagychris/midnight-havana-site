import type { Locale } from '../i18n/locales';
import type { EventBadge, SiteEvent } from './event-types';

/** The colour a badge gets from its position: first, second, third. */
export type PositionTone = 'gold' | 'green' | 'muted';

export interface ToneBadge extends EventBadge {
    tone: PositionTone;
}

const TONE_BY_POSITION: PositionTone[] = ['gold', 'green', 'muted'];

/**
 * The badges of a date that add something the title does not already say.
 *
 * Editors often tag a night with its own name, e.g. "DJ Helen" on
 * "Salsa Friday: DJ Helen". Shown right above the title, that reads as a
 * stutter, so such badges are left out. The comparison ignores case, spaces
 * and punctuation, so "Show night" also matches "Shownight".
 *
 * Colours are assigned after that filtering, by position, so the first badge
 * you see is always gold, the second green and the third muted.
 */
export function badgesBesideTitle(event: SiteEvent, locale: Locale): ToneBadge[] {
    return badgesNotInTitle(event, locale).map((badge, index) => ({
        ...badge,
        tone: TONE_BY_POSITION[Math.min(index, TONE_BY_POSITION.length - 1)],
    }));
}

function badgesNotInTitle(event: SiteEvent, locale: Locale): EventBadge[] {
    const title = event.title?.[locale];
    if (!title) return event.badges;

    const normalisedTitle = normalise(title);
    return event.badges.filter(
        (badge) => !normalisedTitle.includes(normalise(badge[locale])),
    );
}

/** Lower case letters and digits only, so wording differences do not matter. */
function normalise(text: string): string {
    return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}
