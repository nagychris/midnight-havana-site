import { describe, expect, it } from 'vitest';

import { slugify, suggestSlug } from './slug';

describe('slugify', () => {
    it('matches the slugs already used for events', () => {
        expect(slugify('Fiesta Navideña')).toBe('fiesta-navidena');
        expect(slugify('Eloy Rojas Workshop & Shownight')).toBe(
            'eloy-rojas-workshop-shownight',
        );
    });

    it('writes German umlauts out', () => {
        expect(slugify('Frühlings Fête für Anfänger')).toBe(
            'fruehlings-fete-fuer-anfaenger',
        );
        expect(slugify('Großer Abend')).toBe('grosser-abend');
    });

    it('has no hyphen at either end', () => {
        expect(slugify('  ¡Salsa!  ')).toBe('salsa');
    });

    it('stays within the length the event files accept', () => {
        const slug = slugify('salsa '.repeat(40));
        expect(slug.length).toBeLessThanOrEqual(80);
        expect(slug.endsWith('-')).toBe(false);
    });
});

describe('suggestSlug', () => {
    it('adds the DJ, because most Fridays share a title', () => {
        expect(suggestSlug('Salsa Friday', 'DJ Tamboly', '2026-12-04', [])).toBe(
            'salsa-friday-dj-tamboly',
        );
    });

    it('does not repeat a DJ the title already names', () => {
        expect(suggestSlug('Noche con DJ Ren', 'DJ Ren', '2026-12-04', [])).toBe(
            'noche-con-dj-ren',
        );
    });

    it('adds the date when the slug is taken', () => {
        expect(
            suggestSlug('Salsa Friday', 'DJ Ren', '2027-01-08', ['salsa-friday-dj-ren']),
        ).toBe('salsa-friday-dj-ren-2027-01-08');
    });

    it('falls back to a neutral word when there is no title', () => {
        expect(suggestSlug('', '', '2026-12-04', [])).toBe('termin');
    });
});
