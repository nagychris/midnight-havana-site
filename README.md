# Midnight Havana

The website for Midnight Havana, the Cuban salsa night at Tangoloft Berlin.

Astro 7, Tailwind v4, no client framework. German at the root, English under
`/en/`. Deployed to Netlify from this repository.

---

## Adding an event

Open `src/data/events.json`, copy a block inside `events`, change the date, the
slug and the texts, then commit. That is the whole job.

```json
{
  "date": "2026-10-16",
  "slug": "noche-de-timba",
  "title": { "de": "Noche de Timba", "en": "Noche de Timba" },
  "summary": { "de": "Ein Satz für die Karte.", "en": "One sentence for the card." },
  "description": { "de": "Zwei bis vier Sätze.", "en": "Two to four sentences." },
  "dj": "DJ EC Kuba",
  "teachers": ["Helen", "Yago"],
  "badges": [{ "de": "Live-Percussion", "en": "Live percussion", "tone": "green" }],
  "image": "dj-night.jpg",
  "booking": {}
}
```

Only `date` and `slug` are required. Everything else can be left out or set to
`null`.

A few things worth knowing:

- **Past dates disappear on their own.** They are filtered out when the site is
  built and again in the browser, so a date that has passed is never shown even
  if the site has not been rebuilt.
- **The slug is the URL.** `"slug": "noche-de-timba"` gives
  `/termine/noche-de-timba/` and `/en/events/noche-de-timba/`. Changing it after
  publishing breaks any link people have already shared.
- **Booking links are usually not needed.** See below.
- **The file must stay valid JSON.** `src/data/events.schema.json` describes
  every field; most editors will use it for autocomplete and warnings. If a
  value is wrong, the build stops and says which date and which field.

### Booking links

Eversports gives every occurrence of a class its own URL, so the four booking
links change week to week. You do not have to maintain them.

`scripts/sync-eversports.mjs` runs before every build. It reads the studio's
public schedule page, matches the four classes by name and writes what it finds
to `src/data/eversports-links.json`. A daily rebuild therefore keeps the links
current on its own.

If the sync finds nothing, the site falls back in order to:

1. a link set on that date in `events.json`, for a night booked differently;
2. the link the sync last found;
3. the hand-maintained link in `src/data/classes.ts`;
4. the studio's general Eversports page.

So a booking button is never dead, and a failed sync never breaks a deploy.

To see what the sync would do without changing anything:

```sh
pnpm run sync-eversports -- --dry
```

If the class names on Eversports change, update `CLASS_PATTERNS` at the top of
that script. It matches on words in the class title rather than on the page's
markup, because the titles have to stay readable to humans and so change far
less often than the HTML.

Links are checked at build time wherever they come from: they must use https
and point at `eversports.de` or `urbansportsclub.com`. Anything else stops the
build, so a mistyped or tampered entry can never turn a booking button into a
link somewhere unexpected.

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

Event flyers go in `src/assets/flyers/` and are referenced by file name from
`events.json`.

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
```

Node 22 or newer.

---

## Deployment

Netlify builds from this repository. `netlify.toml` holds the build command and
the response headers; there is nothing to configure in the Netlify UI beyond
connecting the repo and pointing the domain at it.

### Keep the dates fresh

The site is generated ahead of time, so its idea of "today" is the build date.
Set up a **scheduled build** in Netlify so it rebuilds once a day:

1. Site configuration, Build & deploy, Build hooks: create a hook.
2. Point a daily scheduler at it (Netlify's scheduled functions, GitHub Actions
   on a cron, or any uptime service that can make a POST request).

If a rebuild is missed, the browser still hides dates that have passed, so the
page is never wrong. It just will not show a date that was added since.

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

`src/data/events.json` is the only file that changes week to week, it has a JSON
Schema next to it, and everything that reads it goes through `src/lib/events.ts`.
An editor with a login would write the same file shape and trigger a Netlify
build hook. Nothing else would have to change.
