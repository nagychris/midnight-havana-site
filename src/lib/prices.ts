import { site } from '../data/site';

/**
 * The admission prices of a Salsa Friday, read from `site.prices`.
 *
 * The event card shows the social dance price on its own line and the class
 * prices in a shorter second line, so the helpers here split the list that way.
 */

export type PriceTier = (typeof site.prices.tiers)[number];
export type PriceTierId = PriceTier['id'];

export const priceTiers: readonly PriceTier[] = site.prices.tiers;

function tierById(id: PriceTierId): PriceTier {
    const tier = priceTiers.find((candidate) => candidate.id === id);
    if (!tier) {
        throw new Error(`No price tier "${id}" in site.prices.tiers.`);
    }
    return tier;
}

/** Admission for the social dance alone. */
export const socialPrice: PriceTier = tierById('social');

/** Admission with one or two classes before the social dance. */
export const classPrices: readonly PriceTier[] = priceTiers.filter(
    (tier) => tier.id !== 'social',
);

/**
 * The tiers that apply on a night. Without the regular classes there is no
 * class to pay for, so only the social dance price is left.
 */
export function priceTiersFor(hasRegularClasses: boolean): readonly PriceTier[] {
    return hasRegularClasses ? priceTiers : [socialPrice];
}

/** Standard and reduced price in one short label, e.g. `12 / 8 €`. */
export function formatPricePair(tier: PriceTier): string {
    return `${tier.standard} / ${tier.reduced} €`;
}

/** Cheapest and most expensive ticket, for the schema.org price range. */
export function priceRange(): { lowest: number; highest: number } {
    const reducedPrices = priceTiers.map((tier) => tier.reduced);
    const standardPrices = priceTiers.map((tier) => tier.standard);
    return {
        lowest: Math.min(...reducedPrices),
        highest: Math.max(...standardPrices),
    };
}
