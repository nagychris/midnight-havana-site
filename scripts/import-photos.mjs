/**
 * Imports the photo library from `Fotos/` into `src/assets/photos/`.
 *
 * The originals are 4 to 40 MB each, which is far more than any screen needs
 * and slow for everyone to build with. This resizes them to a sensible maximum,
 * strips camera metadata, and gives them names that say what they show, so the
 * rest of the codebase refers to `class-rueda.jpg` rather than `DSC_3061.jpg`.
 *
 * Astro still does the real work at build time: it generates the WebP variants
 * and the srcset from whatever is in `src/assets/photos/`.
 *
 * Run with: pnpm run import-photos
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = 'Fotos';
const TARGET = 'src/assets/photos';

/** Long edge in pixels. The widest the layout ever shows a photo is ~2000. */
const MAX_EDGE = 2400;
/** Portraits are only ever shown in a narrow column. */
const MAX_EDGE_PORTRAIT = 1600;

/**
 * Source file to published name.
 *
 * Keep the published names stable: `events.json` and `photos.ts` refer to them,
 * and renaming one silently drops the picture from the page.
 */
const MAPPING = [
    // Wide, atmospheric, people dancing. These carry the hero and the strip.
    ['Hero/2.jpg', 'hero-dancer-arms-up.jpg'],
    ['Hero/3.jpg', 'hero-couple-window.jpg'],
    ['Hero/5.jpg', 'hero-group-smiling.jpg'],
    ['Hero/6.jpg', 'hero-dancer-smiling.jpg'],
    ['Hero/4.jpg', 'venue-lounge-night.jpg'],

    // The social dance and the people at it.
    ['Kurse:Community/DSC_2445.jpg', 'social-couple-close.jpg'],
    ['Kurse:Community/DSC_2653.jpg', 'social-couple-hat.jpg'],
    ['Kurse:Community/DSC_3061.jpg', 'social-pair-smiling.jpg'],
    ['Kurse:Community/DSC_2384.jpg', 'social-two-dancers.jpg'],
    ['Kurse:Community/DJ.jpg', 'dj-cuban-flag.jpg'],

    // Classes.
    ['Kurse:Community/Kurs 1.jpg', 'class-group.jpg'],
    ['Kurse:Community/Kurs 2.jpg', 'class-couple.jpg'],
    ['Kurse:Community/Kurs 4.jpg', 'class-circle.jpg'],
    ['Kurse:Community/Kurs Rueda.jpg', 'class-rueda.jpg'],

    // The venue. Location/3 is the same file as Hero/1, so only one is taken.
    ['Location/1.jpg', 'venue-hall-daylight.jpg'],
    ['Location/2.jpg', 'venue-hall-piano.jpg'],
    ['Location/3.jpg', 'venue-hall-evening.jpg'],
    ['Location/4.JPG', 'venue-entrance.jpg'],
    ['Location/5.jpg', 'venue-floor-busy.jpg'],
    ['Location/6.jpg', 'venue-from-water.jpg'],
    ['Location/7.jpg', 'venue-spree-view.jpg'],

    // Teachers. The team cards look these up by name.
    ['Punto Cubano/helen.jpg', 'teacher-helen.jpg'],
    ['Punto Cubano/yago.jpg', 'teacher-yago.jpg'],
];

async function main() {
    await mkdir(TARGET, { recursive: true });
    await warnAboutUnmappedFiles();

    let before = 0;
    let after = 0;

    for (const [source, name] of MAPPING) {
        const from = path.join(SOURCE, source);
        const to = path.join(TARGET, name);

        const original = await stat(from);
        const isPortrait = name.startsWith('teacher-');
        const maxEdge = isPortrait ? MAX_EDGE_PORTRAIT : MAX_EDGE;

        await sharp(from)
            // Applies the camera's rotation flag and then drops the metadata,
            // which also removes any GPS coordinates the photographer's phone
            // recorded.
            .rotate()
            .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 82, mozjpeg: true, progressive: true })
            .toFile(to);

        const result = await stat(to);
        before += original.size;
        after += result.size;
        console.log(
            `${name.padEnd(30)} ${mb(original.size).padStart(8)} -> ${mb(result.size).padStart(8)}`,
        );
    }

    console.log(`\n${MAPPING.length} photos, ${mb(before)} -> ${mb(after)}`);
}

/** Points out anything in Fotos/ that nothing on the site would ever show. */
async function warnAboutUnmappedFiles() {
    const mapped = new Set(MAPPING.map(([source]) => source));
    const found = [];

    for (const folder of await readdir(SOURCE, { withFileTypes: true })) {
        if (!folder.isDirectory()) continue;
        for (const file of await readdir(path.join(SOURCE, folder.name))) {
            if (file.startsWith('.')) continue;
            found.push(`${folder.name}/${file}`);
        }
    }

    const missing = found.filter((file) => !mapped.has(file));
    if (missing.length > 0) {
        console.log('Not imported (add them to MAPPING if they should be):');
        for (const file of missing) console.log(`  ${file}`);
        console.log();
    }
}

function mb(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
