import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/locales';

/**
 * The photo library.
 *
 * Files are globbed from `src/assets/photos/` rather than imported one by one,
 * so adding a picture means dropping the file in and describing it below. A
 * file with no description still works; it just gets an empty `alt` and counts
 * as decorative.
 *
 * Originals live in `Fotos/` and are brought in by `pnpm run import-photos`,
 * which resizes them and gives them these names.
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/photos/*.{png,jpg,jpeg,webp,avif}',
    { eager: true },
);

export interface Photo {
    /** File name without the folder, e.g. `class-rueda.jpg`. */
    name: string;
    image: ImageMetadata;
    alt: Record<Locale, string>;
    /**
     * What has to stay in frame when the photo is cropped, as a Tailwind
     * `object-*` position class. Defaults to the middle of the picture.
     */
    focus: string;
}

const CENTRE = 'object-center';

/**
 * Where the subject sits in a photo, for the places it is cropped.
 *
 * Only needed where the middle of the picture is the wrong thing to keep. Both
 * teacher portraits are full-length shots, so a centred crop lands on the
 * clothes and cuts the face off; these pull the frame up to the face.
 *
 * A class rather than a raw `object-position` value, because the Content
 * Security Policy blocks inline style in the built site.
 */
const focalPoints: Record<string, string> = {
    'teacher-helen.jpg': 'object-top',
    'teacher-yago.jpg': 'object-top',
};

/**
 * Alt text per file.
 *
 * Describe what is in the picture, not that it is a picture. A photo used
 * purely as a backdrop behind text is passed an empty alt at the point of use
 * instead, because repeating the headline to a screen reader helps nobody.
 */
const descriptions: Record<string, Record<Locale, string>> = {
    'hero-dancer-arms-up.jpg': {
        de: 'Tänzerin dreht sich mit erhobenen Armen auf der Tanzfläche im Tangoloft',
        en: 'A dancer turning with her arms raised on the floor at Tangoloft',
    },
    'hero-couple-window.jpg': {
        de: 'Paar tanzt Salsa Cubana vor den Fenstern des Tangoloft bei Nacht',
        en: 'A couple dancing Cuban salsa by the windows of Tangoloft at night',
    },
    'hero-group-smiling.jpg': {
        de: 'Lachende Gäste beim Social Dance von Midnight Havana',
        en: 'Guests laughing during the Midnight Havana social dance',
    },
    'hero-dancer-smiling.jpg': {
        de: 'Tänzer lacht mitten in einer Figur beim Social Dance',
        en: 'A dancer laughing in the middle of a figure during the social dance',
    },

    'social-couple-close.jpg': {
        de: 'Paar tanzt eng umschlungen Salsa Cubana im Saal',
        en: 'A couple dancing Cuban salsa close together in the hall',
    },
    'social-couple-hat.jpg': {
        de: 'Tänzer mit Hut führt seine Partnerin über die Tanzfläche',
        en: 'A dancer in a hat leading his partner across the floor',
    },
    'social-pair-smiling.jpg': {
        de: 'Zwei Tanzende lächeln sich beim Son an, Tänzer mit weißem Hut',
        en: 'Two dancers smiling at each other during a son, the lead in a white hat',
    },
    'social-two-dancers.jpg': {
        de: 'Zwei Tänzerinnen tanzen gemeinsam beim Social Dance',
        en: 'Two dancers dancing together during the social dance',
    },
    'dj-cuban-flag.jpg': {
        de: 'DJ legt kubanische Salsa auf, im Hintergrund die kubanische Flagge',
        en: 'A DJ playing Cuban salsa, with the Cuban flag behind the decks',
    },

    'class-group.jpg': {
        de: 'Salsa-Kurs im Tangoloft: Paare üben gemeinsam eine Figur',
        en: 'A salsa class at Tangoloft: couples practising a figure together',
    },
    'class-couple.jpg': {
        de: 'Zwei Tanzende üben im Kurs Führen und Folgen',
        en: 'Two dancers practising leading and following in class',
    },
    'class-circle.jpg': {
        de: 'Kursgruppe steht im Kreis, der Trainer zeigt einen Schritt',
        en: 'A class standing in a circle while the teacher demonstrates a step',
    },
    'class-rueda.jpg': {
        de: 'Rueda de Casino: mehrere Paare tanzen gemeinsam im Kreis',
        en: 'Rueda de Casino: several couples dancing together in a circle',
    },

    'venue-hall-daylight.jpg': {
        de: 'Der Saal des Tangoloft bei Tageslicht, mit Holzboden und Flügel',
        en: 'The Tangoloft hall in daylight, with its wooden floor and grand piano',
    },
    'venue-hall-piano.jpg': {
        de: 'Flügel und roter Vorhang im Saal des Tangoloft Berlin',
        en: 'The grand piano and red curtain in the hall at Tangoloft Berlin',
    },
    'venue-hall-evening.jpg': {
        de: 'Der Saal am Abend, in warmes rotes Licht getaucht',
        en: 'The hall in the evening, lit in warm red light',
    },
    'venue-lounge-night.jpg': {
        de: 'Lounge mit Kerzenleuchtern und Blick auf die Spree bei Nacht',
        en: 'The lounge with candelabra and a view over the Spree at night',
    },
    'venue-entrance.jpg': {
        de: 'Eingangsbereich des Tangoloft im Hinterhof',
        en: 'The entrance to Tangoloft in the rear courtyard',
    },
    'venue-floor-busy.jpg': {
        de: 'Volle Tanzfläche im Tangoloft während einer Rueda',
        en: 'A full dance floor at Tangoloft during a rueda',
    },
    'venue-from-water.jpg': {
        de: 'Das Gebäude des Tangoloft von der Spree aus gesehen',
        en: 'The Tangoloft building seen from the Spree',
    },
    'venue-spree-view.jpg': {
        de: 'Blick über die Spree Richtung Fernsehturm, unweit des Tangoloft',
        en: 'The view across the Spree towards the TV tower, close to Tangoloft',
    },

    'teacher-helen.jpg': {
        de: 'Helen lacht während einer Unterrichtsstunde',
        en: 'Helen laughing during a class',
    },
    'teacher-yago.jpg': {
        de: 'Yago spielt Congas',
        en: 'Yago playing congas',
    },
};

function toPhoto(filePath: string, module: { default: ImageMetadata }): Photo {
    const name = filePath.split('/').pop() ?? filePath;
    return {
        name,
        image: module.default,
        alt: descriptions[name] ?? { de: '', en: '' },
        focus: focalPoints[name] ?? CENTRE,
    };
}

/** Every photo in the library, sorted by file name for a stable order. */
export const photos: Photo[] = Object.entries(files)
    .map(([filePath, module]) => toPhoto(filePath, module))
    .sort((a, b) => a.name.localeCompare(b.name));

/** One photo by file name, or undefined when the file is not there. */
export function photoByName(name: string): Photo | undefined {
    return photos.find((photo) => photo.name === name);
}

/**
 * Photos in a given order, skipping any that are not in the folder.
 *
 * Lets a section ask for the pictures it wants without the build breaking when
 * one of them has not been delivered yet.
 */
export function photoSet(names: readonly string[]): Photo[] {
    return names
        .map((name) => photoByName(name))
        .filter((photo): photo is Photo => photo !== undefined);
}

/** Falls back to the whole library when none of the preferred files exist. */
export function photoSetOrAll(names: readonly string[]): Photo[] {
    const set = photoSet(names);
    return set.length > 0 ? set : photos;
}

/**
 * Named groups, so a section asks for "the hero photos" rather than hard-coding
 * file names. Order matters: the first hero photo is the one that loads first
 * and is the page's largest paint.
 */
export const photoGroups = {
    hero: [
        'hero-dancer-arms-up.jpg',
        'hero-couple-window.jpg',
        'hero-group-smiling.jpg',
        'social-couple-close.jpg',
        'hero-dancer-smiling.jpg',
        'class-rueda.jpg',
    ],
    community: [
        'social-pair-smiling.jpg',
        'class-circle.jpg',
        'social-couple-hat.jpg',
        'dj-cuban-flag.jpg',
        'venue-floor-busy.jpg',
        'social-two-dancers.jpg',
        'class-group.jpg',
        'hero-dancer-smiling.jpg',
    ],
    venue: [
        'venue-hall-evening.jpg',
        'venue-floor-busy.jpg',
        'venue-lounge-night.jpg',
        'venue-hall-daylight.jpg',
    ],
    party: ['dj-cuban-flag.jpg'],
    classes: ['class-group.jpg'],
    finalCta: ['hero-group-smiling.jpg'],
} as const;
