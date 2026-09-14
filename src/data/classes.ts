/**
 * The four classes that run on every Midnight Havana night.
 *
 * Only the language-independent facts live here. Names, descriptions and call
 * to action labels are in `src/i18n/`, keyed by the same ids, so adding a class
 * means adding one entry here and one translation block per language.
 *
 * Booking links are not here. Eversports gives each date its own URL, so they
 * are entered per date in `src/data/events.json`.
 */

export const CLASS_IDS = [
    'salsa-basics',
    'rueda-beginner',
    'salsa-beginner',
    'rueda-advanced',
] as const;

export type ClassId = (typeof CLASS_IDS)[number];

/** Which of the two tracks a class belongs to. Drives its accent colour. */
export type ClassTrack = 'salsa' | 'rueda';

export interface DanceClass {
    id: ClassId;
    /** Start time in Europe/Berlin, 24 hour clock. */
    startTime: string;
    /** End time in Europe/Berlin, 24 hour clock. */
    endTime: string;
    track: ClassTrack;
    /** Level shorthand shown on the card, e.g. "A1" or "B2 / C1". */
    level: string;
    /** Sort order, lowest first. */
    order: number;
}

export const classes: readonly DanceClass[] = [
    {
        id: 'salsa-basics',
        startTime: '19:00',
        endTime: '20:00',
        track: 'salsa',
        level: 'A1',
        order: 1,
    },
    {
        id: 'rueda-beginner',
        startTime: '19:00',
        endTime: '20:00',
        track: 'rueda',
        level: 'A2 – B1',
        order: 2,
    },
    {
        id: 'salsa-beginner',
        startTime: '20:00',
        endTime: '21:00',
        track: 'salsa',
        level: 'A2',
        order: 3,
    },
    {
        id: 'rueda-advanced',
        startTime: '20:00',
        endTime: '21:00',
        track: 'rueda',
        level: 'B2 / C1',
        order: 4,
    },
];

export function getClass(id: ClassId): DanceClass {
    const found = classes.find((danceClass) => danceClass.id === id);
    if (!found) {
        throw new Error(`Unknown class id: ${id}`);
    }
    return found;
}

/** The two classes that start at the same time, in card order. */
export function classesStartingAt(startTime: string): DanceClass[] {
    return classes
        .filter((danceClass) => danceClass.startTime === startTime)
        .sort((a, b) => a.order - b.order);
}

/** Every distinct start time, earliest first. */
export function classStartTimes(): string[] {
    const times = new Set(classes.map((danceClass) => danceClass.startTime));
    return [...times].sort();
}
