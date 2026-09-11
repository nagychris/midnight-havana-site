import { locales, type Locale } from './locales';

/**
 * Every URL on the site, in each language.
 *
 * German pages sit at the root, English under /en/, and each language uses
 * words a searcher in that language would actually type. A page is addressed
 * by a stable id, so links, the language switch and the hreflang tags all read
 * from one place.
 */
export const routes = {
    home: { de: '/', en: '/en/' },
    classes: { de: '/salsa-kurs-berlin/', en: '/en/salsa-classes-berlin/' },
    party: { de: '/salsa-party-berlin/', en: '/en/salsa-party-berlin/' },
    imprint: { de: '/impressum/', en: '/en/imprint/' },
    privacy: { de: '/datenschutz/', en: '/en/privacy/' },
    terms: { de: '/agb/', en: '/en/terms/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageId = keyof typeof routes;

/** Where the event detail pages live in each language. */
const eventBase: Record<Locale, string> = {
    de: '/termine/',
    en: '/en/events/',
};

/** A page's path in every language. */
export type LocalisedPaths = Record<Locale, string>;

/** The paths of a static page. */
export function pagePaths(page: PageId): LocalisedPaths {
    return routes[page];
}

/** The paths of one event's detail page. */
export function eventPaths(slug: string): LocalisedPaths {
    return {
        de: `${eventBase.de}${slug}/`,
        en: `${eventBase.en}${slug}/`,
    };
}

/** The path of a static page in one language. */
export function pathFor(page: PageId, locale: Locale): string {
    return routes[page][locale];
}

/** The path of an event detail page in one language. */
export function eventPathFor(slug: string, locale: Locale): string {
    return eventPaths(slug)[locale];
}

/** Absolute URL from a path, for canonical tags and structured data. */
export function absoluteUrl(path: string, siteUrl: string): string {
    return new URL(path, `${siteUrl}/`).toString();
}

/**
 * The hreflang links for a page: one per language plus x-default.
 *
 * Google only trusts a set of hreflang tags when every version links to every
 * other version and to itself, so this always returns the complete set.
 */
export function alternateLinks(paths: LocalisedPaths, siteUrl: string) {
    const links = locales.map((locale) => ({
        hreflang: locale as string,
        href: absoluteUrl(paths[locale], siteUrl),
    }));

    return [...links, { hreflang: 'x-default', href: absoluteUrl(paths.de, siteUrl) }];
}

/** Anchors on the home page, shared by the navigation and the footer. */
export const sectionIds = {
    top: 'top',
    dates: 'termine',
    party: 'salsa-party',
    classes: 'kurse',
    team: 'team',
    venue: 'location',
    reviews: 'reviews',
    contact: 'kontakt',
    faq: 'faq',
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

/** A link to a section of the home page in the given language. */
export function sectionHref(section: SectionId, locale: Locale): string {
    return `${pathFor('home', locale)}#${section}`;
}
