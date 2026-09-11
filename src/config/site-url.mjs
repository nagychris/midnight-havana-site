/**
 * The public origin of the site, without a trailing slash.
 *
 * Kept in its own file because both `astro.config.mjs` and the TypeScript site
 * data need it, and the Astro config cannot import from a `.ts` file.
 *
 * On Netlify, deploy previews and branch deploys get their own hostname. Using
 * it there keeps canonical URLs and hreflang links pointing at the preview
 * instead of at production, so a preview never tells Google it is the
 * canonical version of the live site.
 */
const PRODUCTION_URL = 'https://midnight-havana.de';

function resolveSiteUrl() {
    const context = process.env.CONTEXT;
    if (context === 'production') {
        return process.env.URL ?? PRODUCTION_URL;
    }
    // `DEPLOY_PRIME_URL` is Netlify's stable URL for a branch or preview build.
    if (context && process.env.DEPLOY_PRIME_URL) {
        return process.env.DEPLOY_PRIME_URL;
    }
    return PRODUCTION_URL;
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, '');
