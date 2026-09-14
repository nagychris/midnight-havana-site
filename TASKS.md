# Midnight Havana — build plan

SEO-optimised rebuild of the site, based on the Claude Design project
`a66a5b6a-36d3-44f4-9dc1-b749ba6d1781` and the copy in
`midnight-havana structure_ seo-optimized.md`.

Stack: Astro 7 (static) + Tailwind v4 + sharp. Netlify. German at `/`,
English at `/en/`. See `README.md` for how to run and edit it.

Tick a box when the task is done **and** `pnpm build` and `pnpm check` pass.
If a session is interrupted, the next one starts at the first unticked box.

---

## 1 · Project setup

- [x] Read the design artboards and the SEO copy document
- [x] Decide what to reuse from the old site and what to rewrite
- [x] Netlify instead of Cloudflare Workers (`netlify.toml`, wrangler removed)
- [x] Astro i18n routing: `de` at the root, `en` under `/en/`
- [x] Self-host Oswald and Karla (`@fontsource-variable`, no Google CDN)
- [x] `@astrojs/sitemap` and a generated `robots.txt`

## 2 · Data layer

- [x] `src/data/site.ts` — venue, prices, times, social links, legal entity
- [x] `src/data/classes.ts` — the four classes, their times and levels
- [x] `src/data/events.json` — one block per date
- [x] `src/data/events.schema.json` — JSON Schema for editors and a future UI
- [x] `src/lib/events.ts` — load, validate, sort, drop past dates
- [x] Booking links checked against a host allowlist
- [x] Build fails loudly, naming the date and field, on invalid data
- [x] Booking links entered per date in `bookingLinks`, so `events.json` is the
      only file that needs touching each month. A class with no link falls back
      to the studio's general Eversports page.
- [x] The build names upcoming dates whose links are still missing, so a
      forgotten month shows up in the deploy log instead of going unnoticed
- [x] Unit tests for booking resolution and the missing-links report (vitest)

## 3 · Design system

- [x] Brand tokens in `src/styles/global.css`, mobile first
- [x] `src/components/ui/` — Button, Badge, Icon, Section, SectionHeading
- [x] Inline SVG icons, no icon CDN
- [x] Logo background removed and trimmed (`scripts/prepare-logo.mjs`)
- [x] Language picker matching the design

## 4 · Pages

- [x] Home, German and English
- [x] Hero with photo slideshow
- [x] Dates: every upcoming date, next one open, four booking buttons each
- [x] Salsa party and the five points
- [x] Classes, four cards
- [x] Location with click-to-load map
- [x] Team: Helen, Yago, Sassan, backlink to Punto Cubano
- [x] FAQ
- [x] Closing CTA and footer
- [x] Event detail page per date, both languages
- [x] Landing pages `/salsa-kurs-berlin/` and `/salsa-party-berlin/` (+ English)
- [x] Impressum, Datenschutz, AGB (+ English imprint and privacy)
- [x] Reviews section, five guest quotes in both languages

## 4b · UX pass

- [x] Next date shown in the hero, so "when is it" is answered above the fold
- [x] Hero compacted for phones: smaller lockup, one-line badges, the pitch
      paragraph kept for wider screens
- [x] Booking button in the header at every width, short label on phones
- [x] Event timetable: four stacked buttons became four tappable rows, leaving
      one obvious primary action per card
- [x] Price shown on the date card, where the decision is made
- [x] FAQ in one column, so opening an answer does not reflow the other half
- [x] Community photos drift slowly and stay swipeable, draggable and
      keyboard reachable
- [x] Round vinyl as the favicon, transparent rather than on a square
- [x] Tracking follows the ranges in DESIGN.md, as tokens not per-component
- [x] Header matched to the artboard: transparent over the hero, background,
      border and wordmark fading in on scroll, the tonight/next-date chip, the
      underline-on-hover nav and the accent colour on the section you are in
- [x] Hero matched to the artboard: photo running to the top of the window
      under the transparent bar, centred lockup, date-led eyebrow, the
      times/prices/address line, and the map, Instagram and WhatsApp buttons
- [x] Clean-shoes rule and the full arrival details from the artboard, in the
      venue section in both languages
- [x] Hero matched to the regenerated artboard: brand lockup centred high, then
      eyebrow, headline at display size, tagline, the pitch, the three badges,
      the orange button and a quiet text link, and the scroll cue
- [x] Header matched: no brand, no chip and no booking button over the hero.
      The wordmark fades in on scroll; the tonight chip appears on scroll and
      only on the day itself. Nothing in the bar wraps.
- [x] Official Instagram and WhatsApp marks, painted in the brand gold rather
      than their own colours
- [x] Fixed the empty cell that appeared wherever a hairline grid's last row
      was not full: the lines now belong to the cells, not to a background
      showing through the gaps. Affected the event page, the reviews and the
      salsa-party points.
- [x] Event timetable grouped by time, so 19:00 and 20:00 each appear once with
      their two parallel classes beside them instead of four rows repeating the
      same two times
- [x] Contact section with a form. No backend: submitting hands the message to
      the visitor's mail app, and the address is printed under the form for
      anyone whose phone has no mail account set up.
- [x] "Welcher Kurs ist meiner?" — four answers, one recommended class, kept in
      `localStorage` so it survives a trip to Eversports
- [x] Booking bar fixed to the foot of the screen on phones, hidden over the
      hero and sliding up once it is behind you
- [x] Header chip has a second state: the next Friday, not only tonight
- [x] Venue reordered to the artboard: address, transit, the way in with the
      shoe rule, then what is good to know, the map and the photos
- [x] Team cards boxed, with the photo filling the top. A teacher with no
      photo file starts at the name rather than showing a stand-in letter.
- [x] Footer links wrap into one block on phones, each tall enough to tap
- [x] Ground floor in the rear courtyard, not the third floor. The lift is gone
      from "gut zu wissen" with it.

DESIGN.md §4 asks for Inter and Instrument Serif. The artboard is newer and
loads Oswald and Karla, which is what the site already self-hosts, so that swap
is off the table.

## 5 · SEO

- [x] Per-language title, description and self-referencing canonical
- [x] Reciprocal `hreflang` de / en / x-default on every page
- [x] JSON-LD: `DanceEvent` per date, `EventSeries`, `LocalBusiness`,
      `FAQPage`, `BreadcrumbList`
- [x] Open Graph and Twitter card, 1200×630, generated from the brand assets
- [x] One H1 per page, ordered headings, descriptive alt text
- [x] Submit the sitemap in Google Search Console
- [x] Legal pages kept out of the sitemap, since they are `noindex`

## 6 · Privacy, security, analytics

- [x] Security headers in `netlify.toml` (HSTS, Referrer-Policy,
      Permissions-Policy, frame-ancestors)
- [x] CSP forbids inline script **and** inline style. The style half was a
      lie for a while: `'unsafe-inline'` sat next to a hash, which makes a
      browser ignore it, so every `style` attribute was dropped in the
      built site while `astro dev` looked fine. Nothing in `src/` may use
      one now; see `.hero` and friends in `src/styles/global.css`.
- [x] Google Maps behind an explicit click
- [x] Consent banner, shown only when analytics is configured
- [x] Google Analytics 4 behind consent, off unless `PUBLIC_GA_MEASUREMENT_ID`
      is set
- [ ] Have the legal texts checked. They were taken over from the existing
      wording, but the host changed from manitu to Netlify and a section on
      analytics was added.

## 7 · Performance

- [x] Photos through Astro `<Image>`, WebP, explicit sizes, lazy below the fold
- [x] Hero image eager with `fetchpriority="high"`
- [x] No third-party request on first load
- [ ] Lighthouse run against the deployed site

## 8 · Handover

- [x] `README.md`: adding an event, adding photos, deploying
- [ ] Netlify build hook plus a daily trigger, so the next date never goes stale
- [x] Point `midnight-havana.de` at the Netlify site

---

## Before go-live

In order. The first four are blockers.

1. [x] **Commit and push.**
2. [x] **Create the Netlify site** and point `midnight-havana.de` at it. The
       DNS zone is at manitu; the nameservers were not moved.
3. [ ] **Have the legal pages checked.** The wording was carried over, but the
       host changed from manitu to Netlify and an analytics section was added.
       This is the item with actual legal exposure.
4. [x] **Confirm the prices.** 10 € standard, 8 € reduced, party included.
5. [ ] **Daily build hook**, so a date that has passed drops off without anyone
       touching the repo. The workflow is written
       (`.github/workflows/daily-rebuild.yml`); it needs the build hook created
       in Netlify and its URL stored as the `NETLIFY_BUILD_HOOK_URL` secret in
       GitHub.
6. [ ] **Run `pnpm install`** once, to pull in vitest, then `pnpm test`. The
       tests are written but have never been executed: the session that added
       them could not install packages.
7. [ ] **Check the Google Analytics property** is set up for this domain.
8. [ ] **Lighthouse** against the deployed site.
9. [x] **Submit the sitemap** in Google Search Console. The domain is
       verified through a TXT record in the manitu zone.

## Needs input from you

- [ ] **Paste the month's booking links into `events.json`.** This is now the
      monthly routine: open each upcoming date, copy its four Eversports URLs
      into `bookingLinks`, commit. The three dates in the file currently carry
      the generic activity links, which land on the right class but not on the
      specific date.

      Automating this is off the table for now. Eversports serves its whole
      site behind a Cloudflare challenge, so the old sync script was removed;
      the details and the paid API alternative are in `README.md` under
      "Why this is not automated".
- [ ] **A portrait of Sassan.** Helen and Yago are in; his card starts at his
      name until a photo lands in `Fotos/Punto Cubano/`. Add a line to
      `focalPoints` in `src/data/photos.ts` if a centred crop cuts his face.
- [x] **Prices.** The site says 10 € standard and 8 € reduced, party included.
      Confirm that is current, now that it appears on every date card.

## Local commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm check
pnpm test                 # unit tests for the data layer
pnpm run brand-assets     # after changing the logo or the hero photo
pnpm run import-photos    # after adding files to Fotos/
```
