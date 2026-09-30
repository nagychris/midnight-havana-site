# Midnight Havana website

The website for Midnight Havana, a Cuban salsa night every Friday at Tangoloft
Berlin (Kreuzberg): classes from 19:00, social dance from 21:00. Astro 7
(static), Tailwind v4, no client framework, deployed to Netlify. `README.md`
explains how to add events and booking links; `TASKS.md` is the build plan.

## Who the site is for

- **Most visitors are on a phone.** Design and check mobile first. Vertical
  space is the scarcest resource: avoid extra lines of text, large gaps, full
  width photos that fill the screen, and repeated calls to action.
- **Visitors have very different dance experience,** from people who have never
  danced salsa to advanced Rueda dancers. Never assume one level. Let people
  choose their class themselves; do not send a general "book" button to one
  particular class.
- **German first, English second.** German pages sit at the root, English
  under `/en/`. Every copy change goes into both `src/i18n/de.ts` and
  `src/i18n/en.ts`.

## Business goal

The main goal is to get people to book classes, now through Eversports and
Urban Sports Club (USC). This will become more important over time.

- A booking button either leads to one specific class or to a place where the
  visitor picks a class (the event timetable, `eventTimetableHref`, or the
  Eversports overview).
- Booking links are entered per date in `src/data/events.json`. Only https
  links to `eversports.de` and `urbansportsclub.com` are allowed.
- Keep booking rows consistent: use `src/components/event/BookingRow.astro` for
  anything bookable.

## Content owner

The owner sends change requests in German and is not a developer. Things they
edit or ask for most:

- Event dates, titles and texts in `src/data/events.json`.
- Prices in `site.prices.tiers` in `src/data/site.ts` (social only, 1 class +
  social, 2 classes + social; standard and reduced). All price displays and the
  schema.org data read from there.
- Photos. Originals go into `Fotos/` (git-ignored), get an entry in
  `scripts/import-photos.mjs`, and a description in `src/data/photos.ts`.

## Conventions

- **Spacing:** use the tokens `py-section`, `mt-heading`, `mt-block` and
  `gap-stack` from `src/styles/global.css` for the space between and inside
  sections. They grow at `sm` and `lg` on their own; do not add `sm:`/`lg:`
  pairs for these.
- **Line breaks in headlines:** join names and short phrases with
  `keepTogether()` from `src/i18n/typography.ts`, so "Rueda de Casino" or
  "in Berlin" never breaks apart.
- **No inline styles.** The Content Security Policy blocks them. Use classes.
- **Slugs are URLs.** When an event slug changes after publishing, add a 301
  redirect in `netlify.toml`.
- **Mobile booking bar:** pages opt out with `bookingBar={false}` on the `Base`
  layout. It is off on event and legal pages.
- **Text contrast over photos:** check small gold and orange text against
  bright, warm photos. The venue photos share those colours.

## Checking a change

```sh
pnpm test    # vitest, for src/lib and src/i18n
pnpm check   # astro check, types
pnpm build   # full static build
```

Run all three before calling a change done. The preview server may be blocked
in the sandbox; then check the built HTML in `dist/` and say that the change
was not seen in a browser.
