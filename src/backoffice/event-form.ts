import { CLASS_IDS } from '../data/classes';
import { isValidDateKey, parseDateKey } from '../lib/datetime';
import { parseEvent } from '../lib/event-parsing';
import type {
    BookingTarget,
    EventBadge,
    LocalisedText,
    SiteEvent,
} from '../lib/event-types';
import { bo } from './copy';
import { slugify } from './slug';

/**
 * The event form: what the owner types, turned into an event and checked.
 *
 * The form holds plain text for every field. `eventFromForm` builds an event
 * from it without judging it, so a half-finished draft can be saved and
 * previewed. `findProblems` says what still stands in the way of publishing,
 * in German and per field. The last word stays with `parseEvent`, the same
 * check every event file goes through when the site is built.
 */

export const BOOKING_TARGETS: readonly BookingTarget[] = [...CLASS_IDS, 'party'];
export const BADGE_ROWS = 3;

const MAX_TEXT_LENGTH = 600;
const MAX_DESCRIPTION_LENGTH = 2500;
const MAX_BADGE_LENGTH = 40;
const MAX_DJ_LENGTH = 120;
const MAX_TEACHERS = 8;
const SUMMARY_GOOGLE_LENGTH = 155;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FRIDAY = 5;

export interface BadgeRow {
    de: string;
    en: string;
}

/** Every field of the form as the text that was typed into it. */
export interface EventFormValues {
    date: string;
    slug: string;
    titleDe: string;
    titleEn: string;
    summaryDe: string;
    summaryEn: string;
    descriptionDe: string;
    descriptionEn: string;
    dj: string;
    /** Names separated by commas. */
    teachers: string;
    badges: BadgeRow[];
    image: string;
    links: Record<BookingTarget, string>;
    regularClasses: boolean;
    cancelled: boolean;
    priceNoteDe: string;
    priceNoteEn: string;
    seoTitleDe: string;
    seoTitleEn: string;
    seoDescriptionDe: string;
    seoDescriptionEn: string;
}

/** The parts of an event the form does not edit yet. They are carried over. */
export type PreservedFields = Pick<SiteEvent, 'extras' | 'courseLabels'>;

export const NOTHING_PRESERVED: PreservedFields = { extras: [], courseLabels: {} };

function emptyLinks(): Record<BookingTarget, string> {
    return {
        'salsa-basics': '',
        'rueda-beginner': '',
        'salsa-beginner': '',
        'rueda-advanced': '',
        party: '',
    };
}

function emptyBadges(): BadgeRow[] {
    return Array.from({ length: BADGE_ROWS }, () => ({ de: '', en: '' }));
}

export function emptyForm(defaults: Partial<EventFormValues> = {}): EventFormValues {
    return {
        date: '',
        slug: '',
        titleDe: '',
        titleEn: '',
        summaryDe: '',
        summaryEn: '',
        descriptionDe: '',
        descriptionEn: '',
        dj: '',
        teachers: '',
        badges: emptyBadges(),
        image: '',
        links: emptyLinks(),
        regularClasses: true,
        cancelled: false,
        priceNoteDe: '',
        priceNoteEn: '',
        seoTitleDe: '',
        seoTitleEn: '',
        seoDescriptionDe: '',
        seoDescriptionEn: '',
        ...defaults,
    };
}

/** The form filled from an event, for editing. */
export function formFromEvent(event: SiteEvent): EventFormValues {
    const badges = emptyBadges().map(
        (empty, index) => event.badges[index] ?? empty,
    );
    const links = emptyLinks();
    for (const target of BOOKING_TARGETS) {
        links[target] = event.bookingLinks[target] ?? '';
    }

    return {
        date: event.date,
        slug: event.slug,
        titleDe: event.title?.de ?? '',
        titleEn: event.title?.en ?? '',
        summaryDe: event.summary?.de ?? '',
        summaryEn: event.summary?.en ?? '',
        descriptionDe: event.description?.de ?? '',
        descriptionEn: event.description?.en ?? '',
        dj: event.dj ?? '',
        teachers: event.teachers.join(', '),
        badges,
        image: event.image ?? '',
        links,
        regularClasses: event.regularClasses,
        cancelled: event.cancelled,
        priceNoteDe: event.priceNote?.de ?? '',
        priceNoteEn: event.priceNote?.en ?? '',
        seoTitleDe: event.seoTitle?.de ?? '',
        seoTitleEn: event.seoTitle?.en ?? '',
        seoDescriptionDe: event.seoDescription?.de ?? '',
        seoDescriptionEn: event.seoDescription?.en ?? '',
    };
}

/** Line endings from a browser form are `\r\n`; the files use `\n`. */
function field(data: FormData, name: string): string {
    const value = data.get(name);
    return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
}

/** The form as it arrived in a request. */
export function readForm(data: FormData): EventFormValues {
    const links = emptyLinks();
    for (const target of BOOKING_TARGETS) {
        links[target] = field(data, `link-${target}`);
    }

    return {
        date: field(data, 'date'),
        slug: field(data, 'slug'),
        titleDe: field(data, 'titleDe'),
        titleEn: field(data, 'titleEn'),
        summaryDe: field(data, 'summaryDe'),
        summaryEn: field(data, 'summaryEn'),
        descriptionDe: field(data, 'descriptionDe'),
        descriptionEn: field(data, 'descriptionEn'),
        dj: field(data, 'dj'),
        teachers: field(data, 'teachers'),
        badges: emptyBadges().map((_, index) => ({
            de: field(data, `badge-${index}-de`),
            en: field(data, `badge-${index}-en`),
        })),
        image: field(data, 'image'),
        links,
        regularClasses: data.get('regularClasses') === 'on',
        cancelled: data.get('cancelled') === 'on',
        priceNoteDe: field(data, 'priceNoteDe'),
        priceNoteEn: field(data, 'priceNoteEn'),
        seoTitleDe: field(data, 'seoTitleDe'),
        seoTitleEn: field(data, 'seoTitleEn'),
        seoDescriptionDe: field(data, 'seoDescriptionDe'),
        seoDescriptionEn: field(data, 'seoDescriptionEn'),
    };
}

function pair(de: string, en: string): LocalisedText | null {
    return de === '' && en === '' ? null : { de, en };
}

/** A name that is the same in both languages only has to be typed once. */
function pairWithGermanDefault(de: string, en: string): LocalisedText | null {
    return pair(de, en === '' ? de : en);
}

export function teacherNames(value: string): string[] {
    return value
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name !== '');
}

/**
 * The event the form describes, as it is. Nothing is checked here, so the
 * result may not be publishable yet.
 */
export function eventFromForm(
    values: EventFormValues,
    preserved: PreservedFields = NOTHING_PRESERVED,
): SiteEvent {
    const bookingLinks: Partial<Record<BookingTarget, string>> = {};
    for (const target of BOOKING_TARGETS) {
        if (values.links[target] !== '') bookingLinks[target] = values.links[target];
    }

    const badges = values.badges
        .map((row) => pairWithGermanDefault(row.de, row.en))
        .filter((badge): badge is EventBadge => badge !== null);

    return {
        date: values.date,
        slug: values.slug,
        title: pairWithGermanDefault(values.titleDe, values.titleEn),
        summary: pair(values.summaryDe, values.summaryEn),
        description: pair(values.descriptionDe, values.descriptionEn),
        seoTitle: pair(values.seoTitleDe, values.seoTitleEn),
        seoDescription: pair(values.seoDescriptionDe, values.seoDescriptionEn),
        dj: values.dj === '' ? null : values.dj,
        teachers: teacherNames(values.teachers),
        badges,
        image: values.image === '' ? null : values.image,
        priceNote: pair(values.priceNoteDe, values.priceNoteEn),
        cancelled: values.cancelled,
        regularClasses: values.regularClasses,
        courseLabels: preserved.courseLabels,
        bookingLinks,
        extras: preserved.extras,
    };
}

/**
 * True when the site would accept this booking link.
 *
 * Asks the site's own parser rather than repeating its list of allowed hosts,
 * so the form can never be more lenient than the build.
 */
export function isAcceptedBookingLink(link: string): boolean {
    try {
        parseEvent({ date: '2000-01-01', slug: 'check', bookingLinks: { party: link } });
        return true;
    } catch {
        return false;
    }
}

/** Another event that is already published, for the checks against doubles. */
export interface OtherEvent {
    date: string;
    slug: string;
    /** How to name it in a message, e.g. "Salsa Friday (27.11.)". */
    label: string;
}

export interface FormContext {
    /** Published events other than the one being edited. */
    others: readonly OtherEvent[];
    /** File names of the photos an event can use. */
    photoNames: readonly string[];
    /** Today in Berlin as YYYY-MM-DD. */
    today: string;
    /** The slug of the published version. Set once an event is online. */
    publishedSlug: string | null;
}

/** Field name mapped to what is wrong with it. */
export type FormProblems = Partial<Record<string, string>>;

/** Everything that stands in the way of publishing, per field. */
export function findProblems(
    values: EventFormValues,
    context: FormContext,
): FormProblems {
    const problems: FormProblems = {};
    const say = (name: string, message: string) => {
        problems[name] ??= message;
    };

    if (!isValidDateKey(values.date)) {
        say('date', bo.problems.dateMissing);
    } else {
        const sameDate = context.others.find((other) => other.date === values.date);
        if (sameDate) say('date', bo.problems.dateTaken(sameDate.label));
    }

    if (values.titleDe === '') say('titleDe', bo.problems.titleMissing);

    if (!SLUG.test(values.slug) || values.slug.length > 80) {
        say('slug', bo.problems.slugInvalid);
    } else if (context.publishedSlug && values.slug !== context.publishedSlug) {
        say('slug', bo.problems.slugLocked);
    } else {
        const sameSlug = context.others.find((other) => other.slug === values.slug);
        if (sameSlug) say('slug', bo.problems.slugTaken(sameSlug.label));
    }

    /** Both languages or neither, each within the length the site accepts. */
    const checkPair = (name: string, de: string, en: string, max: number) => {
        if (de !== '' && en === '') say(`${name}En`, bo.problems.needsEnglish);
        if (en !== '' && de === '') say(`${name}De`, bo.problems.needsGerman);
        if (de.length > max) say(`${name}De`, bo.problems.tooLong(max));
        if (en.length > max) say(`${name}En`, bo.problems.tooLong(max));
    };

    if (values.titleDe.length > MAX_TEXT_LENGTH) {
        say('titleDe', bo.problems.tooLong(MAX_TEXT_LENGTH));
    }
    if (values.titleEn.length > MAX_TEXT_LENGTH) {
        say('titleEn', bo.problems.tooLong(MAX_TEXT_LENGTH));
    }
    checkPair('summary', values.summaryDe, values.summaryEn, MAX_TEXT_LENGTH);
    checkPair(
        'description',
        values.descriptionDe,
        values.descriptionEn,
        MAX_DESCRIPTION_LENGTH,
    );
    checkPair('priceNote', values.priceNoteDe, values.priceNoteEn, MAX_TEXT_LENGTH);
    checkPair('seoTitle', values.seoTitleDe, values.seoTitleEn, MAX_TEXT_LENGTH);
    checkPair(
        'seoDescription',
        values.seoDescriptionDe,
        values.seoDescriptionEn,
        MAX_TEXT_LENGTH,
    );

    values.badges.forEach((row, index) => {
        if (row.en !== '' && row.de === '') {
            say(`badge-${index}-de`, bo.problems.needsGerman);
        }
        if (row.de.length > MAX_BADGE_LENGTH) {
            say(`badge-${index}-de`, bo.problems.tooLong(MAX_BADGE_LENGTH));
        }
        if (row.en.length > MAX_BADGE_LENGTH) {
            say(`badge-${index}-en`, bo.problems.tooLong(MAX_BADGE_LENGTH));
        }
    });

    if (values.dj.length > MAX_DJ_LENGTH) {
        say('dj', bo.problems.tooLong(MAX_DJ_LENGTH));
    }
    if (teacherNames(values.teachers).length > MAX_TEACHERS) {
        say('teachers', bo.problems.tooManyTeachers);
    }

    for (const target of BOOKING_TARGETS) {
        const link = values.links[target];
        if (link !== '' && !isAcceptedBookingLink(link)) {
            say(`link-${target}`, bo.problems.linkInvalid);
        }
    }

    if (values.image !== '' && !context.photoNames.includes(values.image)) {
        say('image', bo.problems.imageUnknown);
    }

    return problems;
}

/** Things worth a second look that do not stop publishing. */
export function findWarnings(
    values: EventFormValues,
    context: Pick<FormContext, 'today'>,
): string[] {
    const warnings: string[] = [];

    if (isValidDateKey(values.date)) {
        const day = parseDateKey(values.date);
        if (day.getUTCDay() !== FRIDAY) {
            const weekday = new Intl.DateTimeFormat('de-DE', {
                weekday: 'long',
                timeZone: 'UTC',
            }).format(day);
            warnings.push(bo.warnings.notFriday(weekday));
        }
        if (values.date < context.today) warnings.push(bo.warnings.past);
    }

    if (values.regularClasses && !values.cancelled) {
        const missing = CLASS_IDS.filter((id) => values.links[id] === '').length;
        if (missing > 0) {
            warnings.push(bo.warnings.linksMissing(missing, CLASS_IDS.length));
        }
    }

    if (values.summaryDe.length > SUMMARY_GOOGLE_LENGTH) {
        warnings.push(bo.warnings.summaryLong);
    }
    if (values.image === '') warnings.push(bo.warnings.noImage);

    return warnings;
}

/**
 * Fills in what is needed for a file name: a slug made from the title when
 * none was typed. Used when saving, so the owner never has to think about it.
 */
export function withSlug(values: EventFormValues, suggestion: string): EventFormValues {
    if (values.slug !== '') return { ...values, slug: slugify(values.slug) || suggestion };
    return { ...values, slug: suggestion };
}

export interface PreviewResult {
    /** The event to render, or null when there is not enough to show. */
    event: SiteEvent | null;
    /** What the preview had to change to be able to render. */
    notes: string[];
}

/**
 * An event good enough to render, built from an unfinished form.
 *
 * A preview should be possible long before a draft is complete, so gaps are
 * bridged instead of reported: a text missing in one language borrows the
 * other, a broken link or an unknown picture is left out. Each of those is
 * named in `notes`, so the preview never hides that something is missing.
 */
export function previewFromForm(
    values: EventFormValues,
    preserved: PreservedFields,
    photoNames: readonly string[],
): PreviewResult {
    if (!isValidDateKey(values.date)) return { event: null, notes: [] };

    const notes = new Set<string>();
    const borrow = (de: string, en: string): [string, string] => {
        if (de !== '' && en === '') {
            notes.add(bo.preview.notes.fallbackEn);
            return [de, de];
        }
        if (en !== '' && de === '') {
            notes.add(bo.preview.notes.fallbackDe);
            return [en, en];
        }
        return [de, en];
    };

    const [summaryDe, summaryEn] = borrow(values.summaryDe, values.summaryEn);
    const [descriptionDe, descriptionEn] = borrow(
        values.descriptionDe,
        values.descriptionEn,
    );
    const [priceNoteDe, priceNoteEn] = borrow(values.priceNoteDe, values.priceNoteEn);
    const [seoTitleDe, seoTitleEn] = borrow(values.seoTitleDe, values.seoTitleEn);
    const [seoDescriptionDe, seoDescriptionEn] = borrow(
        values.seoDescriptionDe,
        values.seoDescriptionEn,
    );

    const links = { ...values.links };
    for (const target of BOOKING_TARGETS) {
        if (links[target] !== '' && !isAcceptedBookingLink(links[target])) {
            links[target] = '';
            notes.add(bo.preview.notes.linksDropped);
        }
    }

    let image = values.image;
    if (image !== '' && !photoNames.includes(image)) {
        image = '';
        notes.add(bo.preview.notes.imageDropped);
    }

    const shorten = (value: string, max: number) => value.slice(0, max);
    const repaired: EventFormValues = {
        ...values,
        slug: SLUG.test(values.slug) ? values.slug.slice(0, 80) : 'vorschau',
        titleDe: shorten(values.titleDe || values.titleEn, MAX_TEXT_LENGTH),
        titleEn: shorten(values.titleEn, MAX_TEXT_LENGTH),
        summaryDe: shorten(summaryDe, MAX_TEXT_LENGTH),
        summaryEn: shorten(summaryEn, MAX_TEXT_LENGTH),
        descriptionDe: shorten(descriptionDe, MAX_DESCRIPTION_LENGTH),
        descriptionEn: shorten(descriptionEn, MAX_DESCRIPTION_LENGTH),
        priceNoteDe: shorten(priceNoteDe, MAX_TEXT_LENGTH),
        priceNoteEn: shorten(priceNoteEn, MAX_TEXT_LENGTH),
        seoTitleDe: shorten(seoTitleDe, MAX_TEXT_LENGTH),
        seoTitleEn: shorten(seoTitleEn, MAX_TEXT_LENGTH),
        seoDescriptionDe: shorten(seoDescriptionDe, MAX_TEXT_LENGTH),
        seoDescriptionEn: shorten(seoDescriptionEn, MAX_TEXT_LENGTH),
        dj: shorten(values.dj, MAX_DJ_LENGTH),
        badges: values.badges.map((row) => ({
            de: shorten(row.de || row.en, MAX_BADGE_LENGTH),
            en: shorten(row.en, MAX_BADGE_LENGTH),
        })),
        image,
        links,
    };

    try {
        return {
            event: parseEvent(eventFromForm(repaired, preserved)),
            notes: [...notes],
        };
    } catch {
        return { event: null, notes: [...notes] };
    }
}
