/**
 * Generates the icons and the social sharing image into public/.
 *
 * These are derived files, not hand-made ones. Keeping them as a script means
 * a new logo or a new hero photo can be regenerated in one command instead of
 * being re-exported by hand from an image editor.
 *
 * Run with: pnpm run brand-assets
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const LOGO = 'src/assets/brand/logo-vinyl.png';
const WORDMARK = 'src/assets/brand/wordmark.svg';
const SOCIAL_PHOTO = 'src/assets/photos/hero-group-smiling.jpg';
const OUT = 'public';

const INK = '#0b0908';
const CREAM = '#f5ece0';

/** Sizes browsers and app launchers ask for. */
const ICON_SIZES = [32, 180, 192, 512];

async function main() {
    await mkdir(OUT, { recursive: true });
    await writeIcons();
    await writeSocialImage();
    await writeManifest();
}

/**
 * The record itself as the icon: edge to edge, with a transparent background,
 * so a browser tab shows a disc rather than a square.
 *
 * The Apple touch icon is the exception. iOS composites a transparent icon onto
 * black and then applies its own rounded-square mask, so it gets the brand's
 * near-black behind it deliberately instead of by accident.
 */
async function writeIcons() {
    const disc = await sharp(LOGO).trim({ threshold: 0 }).toBuffer();

    for (const size of ICON_SIZES) {
        const isAppleTouchIcon = size === 180;
        const name = isAppleTouchIcon ? 'apple-touch-icon.png' : `favicon-${size}.png`;

        // A small inset stops the rim being clipped by a launcher's own mask.
        const inset = isAppleTouchIcon ? Math.round(size * 0.1) : 0;
        const artwork = await sharp(disc)
            .resize(size - inset * 2, size - inset * 2, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .toBuffer();

        await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: isAppleTouchIcon ? INK : { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([{ input: artwork, gravity: 'centre' }])
            .png({ compressionLevel: 9 })
            .toFile(`${OUT}/${name}`);

        console.log(`${OUT}/${name} (${size}x${size})`);
    }
}

/**
 * The 1200x630 card used by Open Graph and Twitter.
 *
 * A dark wash over the photo keeps the wordmark legible whichever crop a
 * platform decides to show.
 */
async function writeSocialImage() {
    const width = 1200;
    const height = 630;

    const photo = await sharp(SOCIAL_PHOTO)
        .resize(width, height, { fit: 'cover', position: 'attention' })
        .toBuffer();

    const scrim = await sharp({
        create: { width, height, channels: 4, background: { r: 11, g: 9, b: 8, alpha: 0.58 } },
    })
        .png()
        .toBuffer();

    // The source SVG paints with currentColor, which has no meaning outside a
    // document, so the brand colour is substituted before rasterising.
    const wordmarkSource = await readFile(WORDMARK, 'utf8');
    const wordmark = await sharp(
        Buffer.from(wordmarkSource.replaceAll('currentColor', CREAM)),
        { density: 300 },
    )
        .resize({ width: Math.round(width * 0.56) })
        .png()
        .toBuffer();

    await sharp(photo)
        .composite([
            { input: scrim, blend: 'over' },
            { input: wordmark, gravity: 'centre' },
        ])
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(`${OUT}/og-image.jpg`);

    console.log(`${OUT}/og-image.jpg (${width}x${height})`);
}

async function writeManifest() {
    const manifest = {
        name: 'Midnight Havana',
        short_name: 'Midnight Havana',
        description:
            'Salsa Cubana und Rueda de Casino in Berlin-Kreuzberg. Kurse ab 19 Uhr, Social Dance ab 21 Uhr.',
        start_url: '/',
        display: 'browser',
        background_color: INK,
        theme_color: INK,
        icons: [
            { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
        ],
    };

    await writeFile(`${OUT}/site.webmanifest`, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`${OUT}/site.webmanifest`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
