import rawReviewData from '../data/reviews.json';
import type { Locale } from '../i18n/locales';

/**
 * Guest quotes shown in the community section.
 *
 * Only genuine quotes belong in this file. They are deliberately not marked up
 * as schema.org reviews: Google does not show review snippets for reviews a
 * business collects and publishes about itself, so the markup would add risk
 * without adding anything.
 */
export interface Review {
    author: string;
    quote: Record<Locale, string>;
}

export function allReviews(): Review[] {
    const entries = (rawReviewData as { reviews?: unknown }).reviews;
    if (!Array.isArray(entries)) return [];
    return entries.map(parseReview);
}

function parseReview(entry: unknown): Review {
    const raw = (entry ?? {}) as Record<string, unknown>;

    if (typeof raw.author !== 'string' || raw.author.trim() === '') {
        throw new Error('reviews.json: every review needs a non-empty "author".');
    }

    const quote = (raw.quote ?? {}) as Record<string, unknown>;
    if (typeof quote.de !== 'string' || typeof quote.en !== 'string') {
        throw new Error(
            `reviews.json: the quote from ${raw.author} needs a "de" and an "en" version.`,
        );
    }

    return {
        author: raw.author,
        quote: { de: quote.de, en: quote.en },
    };
}
