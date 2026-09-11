import type { Translation } from '../../i18n/de';
import { pathFor, sectionHref, sectionIds, type Locale } from '../../i18n';

/**
 * The main navigation, in one place so the header, the mobile menu and the
 * footer never drift apart.
 *
 * The SEO brief asks for a short bar: dates, party, classes, team, venue, FAQ,
 * plus a prominent booking button on the right.
 */
export interface NavLink {
    href: string;
    label: string;
    /**
     * The id of the section this link points at, when it is on the same page.
     * The header's scroll spy uses it to mark the link you are currently in.
     */
    section?: string;
}

export function mainNavigation(t: Translation, locale: Locale): NavLink[] {
    return [
        {
            href: sectionHref(sectionIds.dates, locale),
            label: t.nav.dates,
            section: sectionIds.dates,
        },
        {
            href: pathFor('party', locale),
            label: t.nav.party,
            section: sectionIds.party,
        },
        {
            href: pathFor('classes', locale),
            label: t.nav.classes,
            section: sectionIds.classes,
        },
        {
            href: sectionHref(sectionIds.team, locale),
            label: t.nav.team,
            section: sectionIds.team,
        },
        {
            href: sectionHref(sectionIds.venue, locale),
            label: t.nav.venue,
            section: sectionIds.venue,
        },
        {
            href: sectionHref(sectionIds.faq, locale),
            label: t.nav.faq,
            section: sectionIds.faq,
        },
    ];
}

export function legalNavigation(t: Translation, locale: Locale): NavLink[] {
    return [
        { href: pathFor('imprint', locale), label: t.footer.imprint },
        { href: pathFor('privacy', locale), label: t.footer.privacy },
        { href: pathFor('terms', locale), label: t.footer.terms },
    ];
}
