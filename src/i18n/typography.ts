const NON_BREAKING_SPACE = '\u00A0';

/**
 * Joins the words of a phrase with non-breaking spaces, so a line break can
 * only fall before or after it, never inside.
 *
 * For names and short phrases in headlines, where `text-wrap: balance` would
 * otherwise split "Rueda de Casino" or leave "Berlin" alone on a line.
 */
export function keepTogether(phrase: string): string {
    return phrase.replaceAll(' ', NON_BREAKING_SPACE);
}
