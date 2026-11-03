# Midnight Havana

The website for Midnight Havana, the Cuban salsa night at Tangoloft Berlin.

Astro 7, Tailwind v4, no client framework. German at the root, English under
`/en/`. Deployed to Netlify from this repository.

---

## Adding an event

Every date has its own YAML file in `src/data/events/`, named
`<date>-<slug>.yaml`. To add one, copy `src/data/events/_template.yaml`, give it
the new name, change the date, the slug and the texts, then commit. That is the
whole job. The template explains every field in a comment.

```yaml
# yaml-language-server: $schema=../event.schema.json

date: "2026-10-16"
slug: noche-de-timba
title:
  de: Noche de Timba
  en: Noche de Timba
summary:
  de: Ein Satz für die Karte.
  en: One sentence for the card.
description:
  de: |-
    Erster Absatz.

    Zweiter Absatz.
  en: |-
    First paragraph.

    Second paragraph.
dj: DJ EC Kuba
teachers:
  - Helen
  - Yago
badges:
  - de: Live-Percussion
    en: Live percussion
image: dj-night.jpg
bookingLinks: {}
```

Only `date` and `slug` are required. Everything else can be left out or set to
`null`. The file name is only for sorting in the editor; the site reads the
date and the slug from inside the file. Files starting with `_` are ignored.

Four YAML rules matter here:

- **Put the date in quotes:** `date: "2026-10-16"`. The same goes for times in
  `extras`: `startTime: "19:00"`.
- **Write long texts as `|-` blocks.** Start the text on the next line, indented
  by two more spaces, and separate paragraphs with a blank line. Use `|-`, not
  `|`: a plain `|` adds a line break at the end of the text.
- **Quote any short text that contains `#`:** `de: "Salsa #1"`. Without quotes,
  YAML reads everything from ` #` on as a comment and drops it without an
  error. Texts in `|-` blocks are safe.
- **Indent with two spaces, never tabs.** `de:` and `en:` must start in the same
  column.

A few things worth knowing:

- **Past dates disappear on their own.** They are filtered out when the site is
  built and again in the browser, so a date that has passed is never shown even
  if the site has not been rebuilt. The old files can stay or be deleted.
- **The slug is the URL.** `slug: noche-de-timba` gives
  `/termine/noche-de-timba/` and `/en/events/noche-de-timba/`. Changing it after
  publishing breaks any link people have already shared.
- **Booking links go in `bookingLinks`, per date.** See below.
- **Check before you push.** `pnpm check-events` checks every event file in
  about a second and lists every problem with its file name and line. It also
  runs before each `git push`, so a broken file never reaches Netlify. (Netlify
  would refuse to build it anyway, but then the old site stays live and the
  mistake is easy to miss.) `src/data/event.schema.json` describes every field; VS Code
  with the YAML extension uses it for autocomplete and warnings.

### Booking links

Eversports gives every date its own URLs, so the four links are entered by hand,
one set per date, in that date's `bookingLinks` block:

```yaml
bookingLinks:
  salsa-basics: https://www.eversports.de/e/…
  rueda-beginner: https://www.eversports.de/e/…
  salsa-beginner: https://www.eversports.de/e/…
  rueda-advanced: https://www.eversports.de/e/…
```

Add `party` only when the night itself is bookable. Normally it is paid for at
the door.

A class with no link still gets a working button, because it falls back to the
studio's general Eversports page. The build names whatever is missing, so a
forgotten month shows up in the deploy log:

```text
[midnight-havana:booking-links] 2026-10-02 al-son-de-cuba is missing salsa-beginner, rueda-advanced.
```

That check is an Astro integration in `astro.config.mjs` on top of
`src/lib/booking-report.ts`. It only warns, so a missing link never stops a
deploy.

Links are checked at build time: they must use https and point at
`eversports.de` or `urbansportsclub.com`. Anything else stops the build, so a
mistyped or tampered entry can never turn a booking button into a link
somewhere unexpected.

#### Why this is not automated

There used to be a script that read the links off the studio's public schedule
page. Eversports now serves its whole site behind a Cloudflare challenge, which
answers any plain HTTP request with `403` regardless of the headers it sends, so
the script could not work and was removed.

Eversports does have a read-only GraphQL Provider API at
`provider-api.eversportsmanager.io/api/graphql`, and it exposes exactly the
right field, `activity.bookable.checkoutURL`. Its schema is public but every
real query needs an integration key, which the studio has to activate on its
Eversports Manager account from about €50 per month per location. Until that is
worth paying for, the links are typed in by hand.

### Something extra that night

A workshop or a one-off item goes in `extras` and slots into the timetable by
its start time:

```json
"extras": [
  {
    "startTime": "17:00",
    "endTime": "18:30",
    "title": { "de": "Rueda Concéntrica Workshop", "en": "Rueda Concéntrica Workshop" },
    "description": { "de": "…", "en": "…" },
    "level": "B1",
    "booking": "https://www.eversports.de/…"
  }
]
```

---

## Adding photos

Full-size originals live in `Fotos/`, sorted into folders. To bring a new one
into the site:

1. Drop the file into the right folder under `Fotos/`.
2. Add a line to `MAPPING` in `scripts/import-photos.mjs`, giving it a name
   that says what it shows.
3. Run `pnpm run import-photos`. It resizes to 2400px on the long edge, strips
   camera metadata including any GPS coordinates, and writes to
   `src/assets/photos/`.
4. Describe it in `src/data/photos.ts` so it gets alt text.
5. Add it to a group in `photoGroups` if it should appear somewhere.

The import prints anything in `Fotos/` that is not mapped, so nothing gets
quietly forgotten. Astro does the rest at build time: WebP conversion, the
responsive sizes and the `srcset`.

A photo with no description still works; it just gets an empty `alt` and counts
as decorative. Describe anything that carries meaning.

If a photo is cropped somewhere and the crop cuts off the subject, give it an
entry in `focalPoints` in the same file. It is a CSS `object-position` value,
and the default is the middle of the picture. Both teacher portraits need one,
because they are full-length shots and a centred crop lands on the clothes.

### Opening a photo full screen

Tapping a photo opens it full screen, and from there it can be swiped, pinched
and dragged away. Wrap the thumbnail in `<Zoomable photo={photo}>` and mark the
container it belongs to with `data-lightbox-gallery`. That container decides
what you swipe through, so one section is one set of photos.

The viewer is [PhotoSwipe](https://photoswipe.com/) 5 (MIT, no dependencies of
its own). It is served from our own domain like everything else, and its main
code is only fetched once someone actually opens a photo.

The full-bleed photographs behind a headline — the hero, the closing call to
action, the header of an event page — are deliberately left out. They are a
backdrop for text, not pictures anyone wants to inspect.

Names the layout looks for:

| File | Where it appears |
| --- | --- |
| `teacher-helen.jpg`, `teacher-yago.jpg`, `teacher-sassan.jpg` | Team section. Without one, that card shows the initial instead. |
| anything in `photoGroups` | Hero slideshow, community strip, venue, closing panel |

After changing the logo or the hero photo, regenerate the icons and the social
card:

```sh
pnpm run brand-assets
```

---

## Local development

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # writes dist/
pnpm check     # types and Astro diagnostics
pnpm test      # unit tests for the data layer (vitest)
```

Node 22 or newer.

---

## Deployment

Netlify builds from this repository. `netlify.toml` holds the build command and
the response headers; there is nothing to configure in the Netlify UI beyond
connecting the repo and pointing the domain at it.

### Past dates

The site is generated ahead of time, so its idea of "today" is the date of the
last build. Netlify rebuilds on every commit to `main`. Between builds, the
browser hides dates that have passed, so the page never shows an old date as
upcoming.

### Environment variables

| Variable | Effect |
| --- | --- |
| `PUBLIC_GA_MEASUREMENT_ID` | Turns on Google Analytics 4 and, with it, the consent banner. Format `G-XXXXXXXXXX`. Leave it unset and the site loads no third-party code, sets no cookies, and shows no banner. Set in `netlify.toml`; for local work put it in a `.env` file. |

Analytics is wired up by hand rather than by pasting Google's snippet. The
snippet loads gtag immediately, which would set cookies before anyone had
agreed; `src/components/Analytics.astro` waits for consent and then loads the
same script with IP anonymisation on and ad personalisation off.

---

## How the site is put together

```
src/
  data/          the things that change: events, classes, photos, reviews, facts
  i18n/          all copy, in de.ts and en.ts, plus the URL of every page
  lib/           loading and validating data, dates, structured data
  components/
    ui/          Button, Badge, Icon, Section, SectionHeading
    layout/      header, footer, navigation, language picker
    sections/    one file per section of the home page
    event/       the date card, the timetable, the big date block
    classes/     the "which class is mine?" chooser
    seo/         head tags and JSON-LD
  pages/         thin files; the real page bodies are components
  scripts/       the small amount of browser JavaScript
scripts/         build-time helpers, run by hand
```

Two rules keep it that way:

- **A fact lives in one place.** The address is in `src/data/site.ts`, not in
  four templates. Class times are in `src/data/classes.ts`, not in the copy.
- **Copy lives in `src/i18n/`.** German is the reference; `de.ts` defines the
  shape and TypeScript refuses to build if `en.ts` is missing anything.

### Typography

`DESIGN.md` asks for a neutral grotesk for everything functional and keeps the
expressive serif for the wordmark alone. The display face is condensed, for the
poster-like headings it describes; tracking follows the ranges in its
typography section and is defined as tokens in `src/styles/global.css` rather
than picked per component.

### Privacy and security

- No cookies, no third-party requests, unless the visitor asks for them. Fonts
  and icons are served from this domain; loading them from Google's CDN would
  send visitor IP addresses to Google, which a German court ruled a GDPR
  violation.
- Google Maps loads only after a click on the placeholder.
- Google Analytics loads only after the consent banner is accepted, and only
  when a measurement id is configured at all.
- Response headers in `netlify.toml` set a Content Security Policy with no
  inline script, plus HSTS, a referrer policy and a permissions policy.
- Event data is validated on every build, including a host allowlist for
  booking links.

### What a future admin interface would need

The event files in `src/data/events/` are the only files that change week to
week, they have a JSON Schema next to them (`src/data/event.schema.json`), and
everything that reads them goes through `src/lib/events.ts`. An editor with a
login would write the same file shape and trigger a Netlify build hook. Nothing
else would have to change.
