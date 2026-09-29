import { describe, expect, it } from 'vitest';

import { badgesBesideTitle } from './event-badges';
import type { EventBadge, SiteEvent } from './event-types';

function badge(text: string): EventBadge {
    return { de: text, en: text };
}

function event(title: string | null, badges: EventBadge[]): SiteEvent {
    return {
        date: '2026-11-27',
        slug: 'salsa-friday-dj-helen',
        title: title ? { de: title, en: title } : null,
        summary: null,
        description: null,
        dj: null,
        teachers: [],
        badges,
        image: null,
        flyer: null,
        priceNote: null,
        cancelled: false,
        regularClasses: true,
        courseLabels: {},
        bookingLinks: {},
        extras: [],
    };
}

describe('badgesBesideTitle', () => {
    it('drops a badge that repeats part of the title', () => {
        const night = event('Salsa Friday: DJ Helen', [badge('DJ Helen')]);

        expect(badgesBesideTitle(night, 'en')).toEqual([]);
    });

    it('keeps a badge that adds information', () => {
        const night = event('Salsa Friday: EC Kuba DJ Night', [badge('Matanzas')]);

        expect(badgesBesideTitle(night, 'en')).toEqual([
            { ...badge('Matanzas'), tone: 'gold' },
        ]);
    });

    it('ignores spaces, case and punctuation when comparing', () => {
        const night = event('Eloy Rojas Workshop & Shownight', [badge('Show night')]);

        expect(badgesBesideTitle(night, 'en')).toEqual([]);
    });

    it('keeps every badge when the date has no title', () => {
        const night = event(null, [badge('DJ Helen')]);

        expect(badgesBesideTitle(night, 'en')).toEqual([
            { ...badge('DJ Helen'), tone: 'gold' },
        ]);
    });

    it('colours badges gold, green, muted by position', () => {
        const night = event(null, [badge('A'), badge('B'), badge('C')]);

        const tones = badgesBesideTitle(night, 'en').map((shown) => shown.tone);

        expect(tones).toEqual(['gold', 'green', 'muted']);
    });

    it('assigns colours after dropping badges that repeat the title', () => {
        const night = event('Salsa Friday: DJ Helen', [badge('DJ Helen'), badge('Son')]);

        const tones = badgesBesideTitle(night, 'en').map((shown) => shown.tone);

        expect(tones).toEqual(['gold']);
    });
});
