import { de, type Translation } from './de';
import { en } from './en';
import { defaultLocale, isLocale, type Locale } from './locales';

const translations: Record<Locale, Translation> = { de, en };

/** All copy for one language. */
export function useTranslations(locale: Locale): Translation {
    return translations[locale];
}

/**
 * The language a page belongs to, taken from its URL.
 *
 * Astro fills `Astro.currentLocale` from the i18n routing config. It is
 * undefined for a page outside a locale folder, which for this site means a
 * German page at the root.
 */
export function localeFromAstro(currentLocale: string | undefined): Locale {
    return isLocale(currentLocale) ? currentLocale : defaultLocale;
}

export { de, en, type Translation };
export * from './locales';
export * from './routes';
