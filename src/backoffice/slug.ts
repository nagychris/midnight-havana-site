/**
 * Turns a title into the last part of an event URL.
 *
 * Follows the slugs already in `src/data/events/`: lower case, hyphens, German
 * umlauts written out, accents dropped ("Fiesta Navideña" gives
 * `fiesta-navidena`), and "&" left out rather than spelled.
 */

const GERMAN: Record<string, string> = {
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
    ß: 'ss',
};

/** The longest slug the event files accept. */
const MAX_SLUG_LENGTH = 80;

export function slugify(text: string): string {
    const slug = text
        .toLowerCase()
        .replace(/[äöüß]/g, (letter) => GERMAN[letter])
        // Splits "ñ" into "n" plus a combining mark, which the next step drops.
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/, '');
}

/**
 * The slug the back office proposes for a new event.
 *
 * Most Fridays share a title ("Salsa Friday"), so the DJ is added to keep the
 * URLs apart, as in `salsa-friday-dj-ren`. If that is still taken, the date
 * goes on the end.
 */
export function suggestSlug(
    title: string,
    dj: string,
    date: string,
    taken: readonly string[],
): string {
    const base = slugify(title) || 'termin';
    const djPart = slugify(dj);
    const withDj =
        djPart && !base.includes(djPart) ? slugify(`${base}-${djPart}`) : base;

    const candidates = [withDj, slugify(`${withDj}-${date}`)];
    return candidates.find((slug) => !taken.includes(slug)) ?? candidates[1];
}
