// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config/site-url.mjs';

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
                // Gradients and image sizing are set with style attributes,
                // which a hash cannot cover.
                resources: ["'self'", "'unsafe-inline'"],
            },
            directives: [
                "default-src 'self'",
                "base-uri 'self'",
                "object-src 'none'",
                // Nothing on the site posts anywhere: booking is a link to
                // Eversports, and the contact form hands its message to the
                // visitor's mail app instead of submitting.
                "form-action 'none'",
                "img-src 'self' data:",
                "font-src 'self'",
                "manifest-src 'self'",
                "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
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
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
