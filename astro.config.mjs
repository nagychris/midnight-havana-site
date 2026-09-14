// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config/site-url.mjs';
import {
    eventsMissingBookingLinks,
    formatMissingBookingLinks,
} from './src/lib/booking-report.ts';
import { allEvents } from './src/lib/events.ts';

/**
 * Names the upcoming dates whose Eversports booking links are still missing.
 *
 * The links are entered by hand, a set per date, so the thing that can quietly
 * go stale is a forgotten month. This lives in an integration rather than in
 * the data layer so it runs once per build instead of once per rendered page.
 * It only warns: a date without links still builds, its buttons just lead to
 * the studio's general Eversports page.
 *
 * @returns {import('astro').AstroIntegration}
 */
function reportMissingBookingLinks() {
    return {
        name: 'midnight-havana:booking-links',
        hooks: {
            'astro:build:start': ({ logger }) => {
                const missing = eventsMissingBookingLinks(allEvents());
                for (const line of formatMissingBookingLinks(missing)) {
                    logger.warn(line);
                }
            },
        },
    };
}

export default defineConfig({
    // Base for canonical URLs, hreflang links and the sitemap.
    site: SITE_URL,

    // Static output is what lets Astro pre-generate the responsive image
    // variants at build time instead of resizing on request.
    output: 'static',

    // German is the default language and lives at the root. English pages are
    // prefixed with /en/. See src/i18n/routes.ts for the URL of each page.
    i18n: {
        defaultLocale: 'de',
        locales: ['de', 'en'],
        routing: {
            prefixDefaultLocale: false,
            redirectToDefaultLocale: false,
        },
    },

    // Fonts come from the @fontsource-variable packages and are bundled with
    // the site. Loading them from Google's CDN sends visitor IP addresses to
    // Google, which a German court ruled a GDPR violation (LG München,
    // 3 O 17493/20). See src/styles/fonts.css.

    /*
      Content Security Policy.

      Astro bundles each page's scripts and inlines the small ones, so a policy
      written by hand would either block them or have to allow all inline
      script. Letting Astro build the policy means every inline block is
      allowed by its own hash and nothing else is, which is the point of having
      one. It is emitted as a meta tag per page.

      `frame-ancestors` is ignored in a meta tag, so framing is blocked by the
      X-Frame-Options header in netlify.toml instead.
    */
    security: {
        csp: {
            scriptDirective: {
                // Google Analytics loads from here, and only after consent.
                resources: ["'self'", 'https://www.googletagmanager.com'],
            },
            styleDirective: {
                // No 'unsafe-inline' here, and it would do nothing if there
                // were: Astro adds a hash to this directive for each stylesheet
                // it inlines, and a source list carrying a hash makes the
                // browser ignore 'unsafe-inline' entirely. Listing it gave the
                // false impression that style attributes were allowed while the
                // built site dropped every one of them — invisibly, because
                // `astro dev` serves no policy at all.
                //
                // So nothing in src/ may use a `style` attribute. Gradients,
                // the hero's measurements and image cropping are all classes;
                // see `.hero` and friends in src/styles/global.css. Styles set
                // from script through the CSSOM are not affected by this.
                resources: ["'self'"],
            },
            directives: [
                "default-src 'self'",
                "base-uri 'self'",
                "object-src 'none'",
                // Nothing on the site posts anywhere: booking is a link to
                // Eversports, and the contact form hands its message to the
                // visitor's mail app instead of submitting.
                "form-action 'none'",
                // Google Analytics falls back to an image request when it
                // cannot use fetch or sendBeacon, so it needs the same hosts
                // as connect-src below.
                "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
                "font-src 'self'",
                "manifest-src 'self'",
                // The wildcard on google-analytics.com is the part that
                // matters, and must not be narrowed to a single host: GA4
                // sends hits from EU devices to a regional endpoint
                // (region1.google-analytics.com and others), not to
                // www.google-analytics.com. Naming only www meant the browser
                // refused nearly every hit this site made.
                "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
                // Only the Google Maps embed, and only once a visitor asks.
                'frame-src https://www.google.com https://maps.google.com',
                'upgrade-insecure-requests',
            ],
        },
    },

    image: {
        /*
          Astro's generated image styles are off.

          They are emitted unlayered, and unlayered CSS beats anything inside an
          `@layer` no matter how specific it is. Tailwind's utilities live in a
          layer, so `height: auto` from those styles silently overrode every
          `h-full` and `aspect-*` class on the site, and a full-bleed background
          photo collapsed to its own aspect ratio.

          Astro still generates the resized files, the srcset and the width and
          height attributes. Only the presentation is ours.
        */
        responsiveStyles: false,
    },

    integrations: [
        sitemap({
            i18n: {
                defaultLocale: 'de',
                locales: { de: 'de-DE', en: 'en-GB' },
            },
            // Impressum, Datenschutz and AGB are noindex. Submitting a page and
            // then telling Google not to index it is a contradiction, and
            // Search Console reports it as an error rather than ignoring it.
            filter: (page) =>
                !/\/(impressum|datenschutz|agb|imprint|privacy|terms)\/$/.test(page),
        }),
        reportMissingBookingLinks(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
