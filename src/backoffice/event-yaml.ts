import { Document, Scalar, parse, visit, type Pair } from 'yaml';

import { CLASS_IDS, type ClassId } from '../data/classes';
import type {
    BookingTarget,
    EventExtra,
    LocalisedText,
    SiteEvent,
} from '../lib/event-types';

/**
 * Reads and writes event files for the back office.
 *
 * Writing produces the same shape a person would type by hand, following
 * `src/data/events/_template.yaml`: the same key order, dates and times in
 * quotes, long texts as `|-` blocks. The site keeps reading the files through
 * `src/lib/event-files.ts`; nothing here is used by the public pages.
 *
 * Reading is deliberately forgiving. A draft may be half finished, so
 * `readEventData` never throws and fills gaps with empty values. Whether an
 * event may be published is decided by `parseEvent`, as for every other file.
 */

/** First line of every event file. Turns on schema hints in editors. */
const HEADER = '# yaml-language-server: $schema=../event.schema.json\n\n';

const BOOKING_TARGETS: readonly BookingTarget[] = [...CLASS_IDS, 'party'];

/** An event as plain data in file order, ready to be turned into YAML. */
function toFileShape(event: SiteEvent): Record<string, unknown> {
    const shape: Record<string, unknown> = {
        date: event.date,
        slug: event.slug,
        title: event.title,
        summary: event.summary,
        description: event.description,
        seoTitle: event.seoTitle,
        seoDescription: event.seoDescription,
        dj: event.dj,
        teachers: event.teachers,
        badges: event.badges,
        image: event.image,
        priceNote: event.priceNote,
        cancelled: event.cancelled,
    };

    // Left out on a normal night, as in the files written by hand.
    if (!event.regularClasses) shape.regularClasses = false;
    if (Object.keys(event.courseLabels).length > 0) {
        shape.courseLabels = inOrder(event.courseLabels, CLASS_IDS);
    }

    shape.bookingLinks = inOrder(event.bookingLinks, BOOKING_TARGETS);
    shape.extras = event.extras.map((extra) => ({
        startTime: extra.startTime,
        endTime: extra.endTime,
        title: extra.title,
        description: extra.description,
        level: extra.level,
        booking: extra.booking,
    }));
    return shape;
}

/** The entries of a record that have a value, in a fixed key order. */
function inOrder<Key extends string, Value>(
    record: Partial<Record<Key, Value>>,
    order: readonly Key[],
): Record<string, Value> {
    const sorted: Record<string, Value> = {};
    for (const key of order) {
        const value = record[key];
        if (value !== undefined && value !== null && value !== '') {
            sorted[key] = value;
        }
    }
    return sorted;
}

/** The names of the keys leading to a value, outermost first. */
function keysAbove(path: readonly unknown[]): string[] {
    return path
        .filter((node): node is Pair => isPair(node))
        .map((pair) => String((pair.key as Scalar).value));
}

function isPair(node: unknown): node is Pair {
    return typeof node === 'object' && node !== null && 'key' in node && 'value' in node;
}

const QUOTED_KEYS = ['date', 'startTime', 'endTime'];

/** One event as the text of its YAML file. */
export function serializeEvent(event: SiteEvent): string {
    const doc = new Document(toFileShape(event));

    visit(doc, {
        Scalar(position, node, path) {
            if (position !== 'value' && typeof position !== 'number') return;
            if (typeof node.value !== 'string' || node.value === '') return;

            const keys = keysAbove(path);
            const ownKey = keys.at(-1) ?? '';

            if (QUOTED_KEYS.includes(ownKey)) {
                node.type = Scalar.QUOTE_DOUBLE;
            } else if (keys.includes('description') || node.value.includes('\n')) {
                // A `|-` block: readable in a diff, and safe for any text.
                node.type = Scalar.BLOCK_LITERAL;
            }
        },
    });

    // No line folding: a folded text would come back with different breaks.
    return HEADER + doc.toString({ lineWidth: 0 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
    return typeof value === 'string' ? value : '';
}

function textOrNull(value: unknown): string | null {
    return text(value).trim() === '' ? null : text(value);
}

/** Both languages, or null when neither has any text. */
function localised(value: unknown): LocalisedText | null {
    if (!isRecord(value)) return null;
    const de = text(value.de);
    const en = text(value.en);
    return de.trim() === '' && en.trim() === '' ? null : { de, en };
}

function list(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
}

function readExtra(value: unknown): EventExtra | null {
    if (!isRecord(value)) return null;
    return {
        startTime: text(value.startTime),
        endTime: textOrNull(value.endTime),
        title: localised(value.title) ?? { de: '', en: '' },
        description: localised(value.description),
        level: textOrNull(value.level),
        booking: textOrNull(value.booking),
    };
}

/**
 * The content of an event file as far as it can be read.
 *
 * Anything missing or of the wrong type becomes an empty value, so a draft
 * always opens in the form. The result is not validated.
 */
export function readEventData(source: string): SiteEvent {
    let parsed: unknown;
    try {
        parsed = parse(source);
    } catch {
        parsed = null;
    }
    const raw = isRecord(parsed) ? parsed : {};

    const bookingLinks: Partial<Record<BookingTarget, string>> = {};
    const rawLinks = isRecord(raw.bookingLinks) ? raw.bookingLinks : {};
    for (const target of BOOKING_TARGETS) {
        const link = text(rawLinks[target]).trim();
        if (link !== '') bookingLinks[target] = link;
    }

    const courseLabels: Partial<Record<ClassId, LocalisedText>> = {};
    const rawLabels = isRecord(raw.courseLabels) ? raw.courseLabels : {};
    for (const id of CLASS_IDS) {
        const label = localised(rawLabels[id]);
        if (label) courseLabels[id] = label;
    }

    return {
        date: text(raw.date),
        slug: text(raw.slug),
        title: localised(raw.title),
        summary: localised(raw.summary),
        description: localised(raw.description),
        seoTitle: localised(raw.seoTitle),
        seoDescription: localised(raw.seoDescription),
        dj: textOrNull(raw.dj),
        teachers: list(raw.teachers).map(text).filter((name) => name.trim() !== ''),
        badges: list(raw.badges)
            .map(localised)
            .filter((badge): badge is LocalisedText => badge !== null),
        image: textOrNull(raw.image),
        priceNote: localised(raw.priceNote),
        cancelled: raw.cancelled === true,
        regularClasses: raw.regularClasses !== false,
        courseLabels,
        bookingLinks,
        extras: list(raw.extras)
            .map(readExtra)
            .filter((extra): extra is EventExtra => extra !== null),
    };
}
