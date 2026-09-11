import { SITE_URL } from '../config/site-url.mjs';

/**
 * Facts about Midnight Havana that appear in several places: the footer, the
 * structured data, the legal pages, the venue section.
 *
 * Everything here is language independent. Anything that needs a German and an
 * English version belongs in `src/i18n/`.
 */
export const site = {
    name: 'Midnight Havana',
    url: SITE_URL,
    email: 'info@midnight-havana.de',
    phone: '+49 220 43704',

    social: {
        instagram: 'https://www.instagram.com/midnight.havana/',
        instagramHandle: '@midnight.havana',
        whatsappCommunity:
            'https://chat.whatsapp.com/JoQ108VPf0TAGXwV3ZRZ0G',
    },

    /** The dance school whose teachers run the classes. */
    school: {
        name: 'Punto Cubano Berlin',
        url: 'https://puntocubanoberlin.com/',
    },

    /** Booking platform. Individual class links live in `events.json`. */
    booking: {
        platform: 'Eversports',
        /** Shown when an event has no specific link for a class yet. */
        fallbackUrl: 'https://www.eversports.de/scl/salsa-im-tangoloft-berlin',
    },

    venue: {
        name: 'Tangoloft Berlin',
        street: 'Pfuelstraße 5',
        postalCode: '10997',
        city: 'Berlin',
        district: 'Berlin-Kreuzberg',
        country: 'DE',
        latitude: 52.4985,
        longitude: 13.4472,
        mapsUrl: 'https://maps.google.com/?q=Tangoloft+Berlin',
        /** Loaded into an iframe only after the visitor asks for it. */
        mapEmbedUrl:
            'https://www.google.com/maps?q=Tangoloft+Berlin,+Pfuelstra%C3%9Fe+5,+10997+Berlin&z=16&output=embed',
    },

    /** Every event follows the same timetable. Times are Europe/Berlin. */
    schedule: {
        doorsOpen: '18:45',
        firstClass: '19:00',
        secondClass: '20:00',
        socialDance: '21:00',
        endOfNight: '01:00',
        timeZone: 'Europe/Berlin',
        /** ISO weekday, 5 = Friday. Used for the EventSeries schedule. */
        weekday: 5,
    },

    prices: {
        currency: 'EUR',
        /** One or both classes plus the social dance. */
        standard: 10,
        /** Students and people on a low income. */
        reduced: 8,
        /** Social dance only, arriving after the classes. */
        socialOnly: 8,
    },

    /** Required for the Impressum under German law (§ 5 DDG). */
    legal: {
        company: 'Kaizen Travel e.K.',
        representative: 'Peter Michael Kreuter',
        street: 'Paul-Francke-Straße 2',
        postalCode: '13156',
        city: 'Berlin',
        country: 'Deutschland',
        court: 'Amtsgericht Charlottenburg',
        registerNumber: 'HRA 60110',
        vatId: 'DE 352552108',
        /** Kept in sync with the legal pages when they are revised. */
        lastUpdated: '2026-09',
    },

    /** Hosting provider, named in the privacy policy. */
    host: {
        name: 'Netlify, Inc.',
        address: '512 2nd Street, Suite 200, San Francisco, CA 94107, USA',
    },
} as const;

export type Site = typeof site;
