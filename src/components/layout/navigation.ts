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

/**
 * The bar's links plus Kontakt, for the full-screen menu and the footer.
 *
 * Kontakt is left out of the header bar on purpose: the artboard keeps the bar
 * to six items so nothing in it wraps, and anyone hunting for a way to get in
 * touch opens the menu or scrolls to the foot of the page.
 */
export function menuNavigation(t: Translation, locale: Locale): NavLink[] {
    const links = mainNavigation(t, locale);
    const contact: NavLink = {
        href: sectionHref(sectionIds.contact, locale),
        label: t.nav.contact,
        section: sectionIds.contact,
    };

    const faqIndex = links.findIndex((link) => link.section === sectionIds.faq);
    links.splice(faqIndex, 0, contact);
    return links;
}

export function legalNavigation(t: Translation, locale: Locale): NavLink[] {
    return [
        { href: pathFor('imprint', locale), label: t.footer.imprint },
        { href: pathFor('privacy', locale), label: t.footer.privacy },
        { href: pathFor('terms', locale), label: t.footer.terms },
    ];
}
