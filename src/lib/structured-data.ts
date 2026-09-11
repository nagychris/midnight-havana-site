import { classes, type ClassId } from '../data/classes';
import { site } from '../data/site';
import type { SiteEvent } from './events';
import { bookingUrlFor } from './events';
import { toIsoDateTime, toIsoEndOfNight } from './datetime';
import {
    absoluteUrl,
    eventPathFor,
    htmlLang,
    pathFor,
    useTranslations,
    type Locale,
} from '../i18n';

/**
 * Builders for the schema.org data that Google reads.
 *
 * A `DanceEvent` per upcoming date is what can put the night into the event
 * results with a date and a booking link, so each one carries the real class
 * times, the venue address and an offer.
 */

type JsonObject = Record<string, unknown>;

const PLACE: JsonObject = {
    '@type': 'Place',
    name: site.venue.name,
    address: {
        '@type': 'PostalAddress',
        streetAddress: site.venue.street,
        postalCode: site.venue.postalCode,
        addressLocality: site.venue.city,
        addressCountry: site.venue.country,
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: site.venue.latitude,
        longitude: site.venue.longitude,
    },
};

const ORGANIZER: JsonObject = {
    '@type': 'Organization',
    name: site.name,
    url: `${site.url}/`,
    email: site.email,
    sameAs: [site.social.instagram],
};

/**
 * Serialises JSON-LD for a `<script>` tag.
 *
 * `<` is escaped so a stray `</script>` in the data can never close the tag
 * early and turn content into markup.
 */
export function toJsonLd(data: unknown): string {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** One upcoming date, as an event Google can show with a date and a link. */
export function danceEventSchema(event: SiteEvent, locale: Locale): JsonObject {
    const t = useTranslations(locale);
    const name = event.title?.[locale] ?? t.hero.eyebrow;
    const description =
        event.summary?.[locale] ??
        event.description?.[locale] ??
        t.meta.home.description;

    return {
        '@context': 'https://schema.org',
        '@type': 'DanceEvent',
        name: `${name} — ${site.name}`,
        description,
        startDate: toIsoDateTime(event.date, site.schedule.firstClass),
        endDate: toIsoEndOfNight(event.date, site.schedule.endOfNight),
        eventStatus: event.cancelled
            ? 'https://schema.org/EventCancelled'
            : 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        inLanguage: htmlLang[locale],
        url: absoluteUrl(eventPathFor(event.slug, locale), site.url),
        location: PLACE,
        organizer: ORGANIZER,
        performer: performersFor(event),
        offers: offersFor(event),
        subEvent: subEventsFor(event, locale),
        image: `${site.url}/og-image.jpg`,
        isAccessibleForFree: false,
    };
}

/** The weekly series, so the night is understood as recurring. */
export function eventSeriesSchema(locale: Locale): JsonObject {
    const t = useTranslations(locale);

    return {
        '@context': 'https://schema.org',
        '@type': 'EventSeries',
        name: `${t.hero.eyebrow} — ${site.name}`,
        description: t.meta.home.description,
        url: `${site.url}${pathFor('home', locale)}`,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        inLanguage: Object.values(htmlLang),
        location: PLACE,
        organizer: ORGANIZER,
        eventSchedule: {
            '@type': 'Schedule',
            byDay: 'https://schema.org/Friday',
            startTime: site.schedule.firstClass,
            endTime: site.schedule.endOfNight,
            scheduleTimezone: site.schedule.timeZone,
            repeatFrequency: 'P1W',
        },
    };
}

/** Midnight Havana as a place you can search for locally. */
export function localBusinessSchema(locale: Locale): JsonObject {
    const t = useTranslations(locale);

    return {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'EntertainmentBusiness'],
        '@id': `${site.url}/#business`,
        name: site.name,
        description: t.meta.home.description,
        url: `${site.url}${pathFor('home', locale)}`,
        email: site.email,
        telephone: site.phone,
        image: `${site.url}/og-image.jpg`,
        address: PLACE.address,
        geo: PLACE.geo,
        sameAs: [site.social.instagram, site.school.url],
        priceRange: `${site.prices.reduced}–${site.prices.standard} €`,
        currenciesAccepted: site.prices.currency,
        paymentAccepted: 'Cash, Credit Card',
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'https://schema.org/Friday',
                opens: site.schedule.doorsOpen,
                closes: site.schedule.endOfNight,
            },
        ],
        areaServed: { '@type': 'City', name: 'Berlin' },
    };
}

/** The FAQ block, eligible for the question and answer rich result. */
export function faqSchema(
    items: readonly { question: string; answer: string }[],
): JsonObject {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    };
}

/** Breadcrumb trail, so a sub page shows its parent in the result. */
export function breadcrumbSchema(
    trail: readonly { name: string; url: string }[],
    siteUrl: string,
): JsonObject {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((step, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: step.name,
            item: absoluteUrl(step.url, siteUrl),
        })),
    };
}

function performersFor(event: SiteEvent): JsonObject[] {
    const performers: JsonObject[] = [
        { '@type': 'Organization', name: site.school.name, url: site.school.url },
        ...event.teachers.map((teacher) => ({ '@type': 'Person', name: teacher })),
    ];
    if (event.dj) {
        performers.push({ '@type': 'PerformingGroup', name: event.dj });
    }
    return performers;
}

function offersFor(event: SiteEvent): JsonObject[] {
    const shared = {
        '@type': 'Offer',
        priceCurrency: site.prices.currency,
        availability: event.cancelled
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
        validFrom: `${event.date.slice(0, 8)}01`,
    };

    return [
        {
            ...shared,
            name: 'Standard',
            price: String(site.prices.standard),
            url: bookingUrlFor(event, 'salsa-basics'),
        },
        {
            ...shared,
            name: 'Reduced',
            price: String(site.prices.reduced),
            url: bookingUrlFor(event, 'salsa-basics'),
        },
    ];
}

/** Each class of the night as its own sub event, with its own booking link. */
function subEventsFor(event: SiteEvent, locale: Locale): JsonObject[] {
    const t = useTranslations(locale);

    return classes.map((danceClass) => ({
        '@type': 'DanceEvent',
        name: t.classes.items[danceClass.id as ClassId].name,
        description: t.classes.items[danceClass.id as ClassId].body,
        startDate: toIsoDateTime(event.date, danceClass.startTime),
        endDate: toIsoDateTime(event.date, danceClass.endTime),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: PLACE,
        organizer: ORGANIZER,
        url: bookingUrlFor(event, danceClass.id),
    }));
}
