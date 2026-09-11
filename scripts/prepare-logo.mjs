/**
 * Removes the white background from the vinyl logo and trims the empty border.
 *
 * The source file came out of an image editor with an opaque white matte. Left
 * as it is, the logo shows up as a white square on the site's near-black
 * surfaces.
 *
 * The background is removed by flooding inwards from the edges rather than by
 * deleting every white pixel, so any light detail inside the record survives.
 * Pixels on the boundary get a partial alpha taken from how white they are,
 * which keeps the antialiased rim smooth instead of jagged.
 *
 * Run with: node scripts/prepare-logo.mjs <input> <output>
 */
import sharp from 'sharp';

/** A pixel at least this white counts as background. */
const BACKGROUND_MIN = 244;
/** Below this brightness a rim pixel is definitely part of the logo. */
const EDGE_MIN = 150;
/**
 * How far the soft edge reaches inwards.
 *
 * The original artwork has a pale two to three pixel stroke around the record.
 * A one pixel feather leaves the rest of it behind as a white halo on our dark
 * background, so the band has to be at least as wide as that stroke.
 */
const EDGE_BAND = 4;
/** Above this difference between channels a pixel is coloured, not grey. */
const COLOURED_SATURATION = 26;

async function main() {
    const [input, output] = process.argv.slice(2);
    if (!input || !output) {
        throw new Error('Usage: node scripts/prepare-logo.mjs <input> <output>');
    }

    const { data, info } = await sharp(input)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const background = floodBackground(data, width, height, channels);
    applyAlpha(data, background, width, height, channels);

    await sharp(data, { raw: { width, height, channels } })
        .trim({ threshold: 0 })
        .png({ compressionLevel: 9 })
        .toFile(output);

    const after = await sharp(output).metadata();
    console.log(`${input} ${width}x${height} -> ${output} ${after.width}x${after.height}`);
}

/** Marks every background pixel reachable from the border. */
function floodBackground(data, width, height, channels) {
    const isWhite = (index) => {
        const offset = index * channels;
        return (
            data[offset] >= BACKGROUND_MIN &&
            data[offset + 1] >= BACKGROUND_MIN &&
            data[offset + 2] >= BACKGROUND_MIN
        );
    };

    const background = new Uint8Array(width * height);
    const queue = [];

    const push = (x, y) => {
        const index = y * width + x;
        if (background[index] || !isWhite(index)) return;
        background[index] = 1;
        queue.push(index);
    };

    for (let x = 0; x < width; x += 1) {
        push(x, 0);
        push(x, height - 1);
    }
    for (let y = 0; y < height; y += 1) {
        push(0, y);
        push(width - 1, y);
    }

    while (queue.length > 0) {
        const index = queue.pop();
        const x = index % width;
        const y = (index - x) / width;
        if (x > 0) push(x - 1, y);
        if (x < width - 1) push(x + 1, y);
        if (y > 0) push(x, y - 1);
        if (y < height - 1) push(x, y + 1);
    }

    return background;
}

/**
 * Clears the flooded pixels and fades out the pale stroke around them.
 *
 * Only grey and white pixels are faded. The record's copper rim is strongly
 * coloured, so keying on saturation keeps the rim solid while the white glow
 * beside it disappears.
 */
function applyAlpha(data, background, width, height, channels) {
    const distance = distanceToBackground(background, width, height);

    for (let index = 0; index < width * height; index += 1) {
        const offset = index * channels;
        const alphaOffset = offset + 3;

        if (background[index]) {
            data[alphaOffset] = 0;
            continue;
        }

        const steps = distance[index];
        if (steps > EDGE_BAND) continue;

        const red = data[offset];
        const green = data[offset + 1];
        const blue = data[offset + 2];
        const brightest = Math.max(red, green, blue);
        const saturation = brightest - Math.min(red, green, blue);

        if (saturation >= COLOURED_SATURATION || brightest <= EDGE_MIN) continue;

        // Pale and close to the edge: fade it out, more the paler it is.
        const ratio = (BACKGROUND_MIN - brightest) / (BACKGROUND_MIN - EDGE_MIN);
        const faded = Math.round(255 * Math.max(0, Math.min(1, ratio)));
        data[alphaOffset] = Math.min(data[alphaOffset], faded);
    }
}

/** How many pixels each pixel sits from the flooded background, up to the band. */
function distanceToBackground(background, width, height) {
    const distance = new Uint8Array(width * height).fill(255);
    let frontier = [];

    for (let index = 0; index < background.length; index += 1) {
        if (background[index]) {
            distance[index] = 0;
            frontier.push(index);
        }
    }

    for (let step = 1; step <= EDGE_BAND && frontier.length > 0; step += 1) {
        const next = [];
        for (const index of frontier) {
            const x = index % width;
            const y = (index - x) / width;
            const neighbours = [
                x > 0 ? index - 1 : -1,
                x < width - 1 ? index + 1 : -1,
                y > 0 ? index - width : -1,
                y < height - 1 ? index + width : -1,
            ];
            for (const neighbour of neighbours) {
                if (neighbour < 0 || distance[neighbour] !== 255) continue;
                distance[neighbour] = step;
                next.push(neighbour);
            }
        }
        frontier = next;
    }

    return distance;
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
