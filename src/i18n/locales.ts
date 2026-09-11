export const locales = ['de', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

/** Language tag for the `lang` attribute and `Intl` formatting. */
export const htmlLang: Record<Locale, string> = {
    de: 'de-DE',
    en: 'en-GB',
};

/** Locale for Open Graph, which wants an underscore. */
export const openGraphLocale: Record<Locale, string> = {
    de: 'de_DE',
    en: 'en_GB',
};

/** What each language calls itself, for the language switch. */
export const localeName: Record<Locale, string> = {
    de: 'Deutsch',
    en: 'English',
};

export function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
