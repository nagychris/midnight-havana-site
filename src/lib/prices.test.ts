import { describe, expect, it } from 'vitest';
import {
    classPrices,
    formatPricePair,
    priceRange,
    priceTiersFor,
    socialPrice,
} from './prices';

describe('socialPrice', () => {
    it('is the social dance tier', () => {
        expect(socialPrice.id).toBe('social');
    });
});

describe('classPrices', () => {
    it('lists the class tiers in order, without the social dance', () => {
        expect(classPrices.map((tier) => tier.id)).toEqual([
            'oneClass',
            'twoClasses',
        ]);
    });
});

describe('priceTiersFor', () => {
    it('lists every tier on a night with the regular classes', () => {
        expect(priceTiersFor(true).map((tier) => tier.id)).toEqual([
            'social',
            'oneClass',
            'twoClasses',
        ]);
    });

    it('lists only the social dance on a night without them', () => {
        expect(priceTiersFor(false)).toEqual([socialPrice]);
    });
});

describe('formatPricePair', () => {
    it('puts the standard price first and the reduced price second', () => {
        const tier = { id: 'oneClass', standard: 12, reduced: 8 } as const;
        expect(formatPricePair(tier)).toBe('12 / 8 €');
    });
});

describe('priceRange', () => {
    it('spans the cheapest reduced and the dearest standard ticket', () => {
        expect(priceRange()).toEqual({ lowest: 8, highest: 20 });
    });
});
