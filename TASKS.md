# Midnight Havana — status

Ported from the Claude Design canvas project `a66a5b6a-36d3-44f4-9dc1-b749ba6d1781`
(artboard `Midnight Havana Home.dc.html`) to Astro 7 + Tailwind v4.

## Scaffold

- [x] Astro 7 + `@tailwindcss/vite`, pnpm via corepack
- [x] `@theme` token block in `src/styles/global.css`
- [x] Base layer and the artboard's `mh-*` component classes ported
- [x] `pnpm build` clean, `pnpm astro check` 0 errors
- [ ] **`git init`** — blocked in the sandbox this was built in (writing `.git/config`
      is denied). Run manually:
      `git init -b main && git add -A && git commit -m "Port Midnight Havana homepage"`

## Components (page order)

- [x] `Base.astro` — head, meta, Google Fonts, JSON-LD `EventSeries`
- [x] `Header.astro` — sticky, scroll-hide, language select, icon cluster, burger
- [x] `Hero.astro` — both gradient scrims, two-line headline, 2 CTAs
- [x] `TonightStrip.astro`
- [x] `NextDates.astro` — 3 rows, badges, poster thumbs
- [x] `StartHere.astro` — 4-step grid
- [x] `Courses.astro` — 2 track cards, 4 levels
- [x] `FridayRun.astro` — timeline + at-the-door prices
- [x] `Gallery.astro` — 5 photos, 2×2 feature tile
- [x] `Venue.astro` — address, transit, map, 2 photos
- [x] `Faq.astro` — 7 accordions
- [x] `CommunityCta.astro`
- [x] `Footer.astro`
- [x] `event.astro` — stub route so the "Event details →" links aren't dead

## Canvas-runtime constructs translated

- [x] `style-hover="…"` → `hover:` utilities (~14 elements)
- [x] `DCLogic` scroll-hide header → inline script (4px threshold, 160px floor kept)
- [x] `<sc-if>` + `data-props` → `showLangSwitcher` / `showPosterThumbs` props
- [x] `<image-slot>` → `<img>`, with a build-time existence guard
      (`src/lib/assets.ts`) so missing artwork degrades to a placeholder
- [x] `<helmet>` → `Base.astro` head

## Breakpoints added (not in the design)

The artboard only handled the header nav (1040px) and `.mh-steps` (1100/620px).
All additions are marked `ADDED` in the source.

- [x] Date rows — poster column drops <1100px, date block goes horizontal <620px
- [x] Courses — 1 col <900px
- [x] Gallery — 2 cols <900px, feature tile stops spanning <620px
- [x] Friday-run — 1 col <980px
- [x] Venue — 1 col <980px, feature list 1 col <560px
- [x] Footer — 2 cols <860px, 1 col <560px
- [x] Section padding 32px → 20px <620px
- [x] Mobile menu built for the burger (the design had none)

## Changes requested after the port

- [x] Language dropdown shows just `EN` / `DE` / `ES`, with a globe icon
- [x] Instagram button in the header is icon-only
- [x] Language / WhatsApp / Instagram tightened to an 8px cluster
- [x] Hero copy replaced: "Salsa Friday" + gradient "Come to learn. Stay to dance."
- [x] Duplicate next-event line removed from the hero (the Tonight strip has it)
- [x] "Tonight" pulses — radar-style expanding ring on the strip dot, matching glow
      on the date-row badge, both off under `prefers-reduced-motion`. The label
      itself does *not* animate on purpose: motion on 12px uppercase type costs
      legibility where it's most needed, and two synced animations side by side
      read as one flashing block rather than a status indicator. Emphasis on the
      word comes from weight (`font-medium`) instead.

## Copy decisions

- **The come/stay antithesis lives in the hero only.** "Come to learn. Stay to dance."
  stays because it works as a tagline *and* explains the format (class 19:00, social
  21:00). The gallery previously ran the same device in reverse ("You came for the
  dance. You stay for the people"), which made the hero's payoff into the gallery's
  setup. Gallery headline is now "Strangers at 19:00. Friends by midnight." — a
  time-based device instead, reusing the night's own timeline and landing on the
  brand's own name.
- **Community is shown, not claimed.** Next to five photos of real faces the gallery
  does not need to assert belonging.
- **Slop pass.** Removed stock phrasing and replaced it with concrete detail:
  - Hero lede: dropped "Authentic" (claiming authenticity rather than showing it),
    "taught with care" (says nothing) and "you will leave with a community" (a
    promise a stranger can't verify, and the gallery's job). Now leads with the
    times and the three things that actually lower the barrier.
  - Footer tagline: "real connection" → "Cuban music". Kept "warm nights", which is
    evocative rather than filler.
  - Footer sign-off: "Cuba meets Berlin" (the "X meets Y" template) → "Havana rules,
    Berlin hours".
  - `/event` stub: rewrote dev-speak ("has not been ported", "Coming soon") into
    plain language.

  Left alone deliberately — the design's own writing is strong and specific:
  "cross-ventilation that actually works", "the list below is always the truth",
  "Suddenly you are dancing with twelve people instead of one", "that's when it
  stops being steps and starts being dancing", and the door line naming Helen, Yago
  and Sassan.

## Assets

In `public/assets/`. The design MCP could not supply these (`get_file` truncates
at 256 KiB and returns corrupt data), so they were provided by hand.

| File | Status |
|---|---|
| `hero-social.jpg` | present |
| `class-rueda.jpg` | present |
| `community-terrace.jpg` | present |
| `dj-night.jpg` | present |
| `class-beginners.jpg` | present |
| `logo-round.png` | present (design called it `logo-vinyl.png`; refs updated) |
| `flyer-summer-peak.png` | **missing** — Summer Peak Party row shows the placeholder |

## Open questions from the source

Things the design left unresolved. Flagged rather than invented.

1. **Mobile menu** — the design had none; one was built. Worth a look to confirm it
   matches intent.
2. **Two event flyers don't exist** — `mh-ev-1109` (Timba Nights) and `mh-ev-2509`
   (Rueda Grande) were empty image slots. `flyer-come-to-learn.png` and
   `flyer-square.png` exist in the canvas project but aren't used on the home page.
3. **Dead links** — both "Join the WhatsApp community" buttons, the footer WhatsApp
   link, Impressum and Datenschutz are all `href="#"`. WhatsApp is a
   `whatsappUrl` prop, so it only needs the real invite URL passing in.
4. **Language select does nothing** — it renders, but no i18n is wired. Either build
   it or drop it.
5. **Icons** — vendored from `simple-icons` as inline SVG, so the
   `cdn.simpleicons.org` runtime dependency is gone.
6. **Google Maps** — the design embedded the iframe on first paint. It's now behind
   a click-to-load cover, since the site links an Impressum and Datenschutz. Revert
   to a bare iframe in `Venue.astro` if not wanted.
7. **Event page** — `/event` is a stub. The real layout lives in the
   `Midnight Havana Event.dc.html` artboard, which was out of scope.

## Deployment

- [x] Showcase snapshot published as a Claude Artifact:
      https://claude.ai/code/artifact/f211eb80-bd23-4a07-8e11-a9a4fb9776da
      One self-contained file (CSS inlined, images as data URIs, 3.2 MB). Caveats:
      single page, so `/event` links point at `#dates`, and the Maps embed can't
      load under the artifact CSP. The bundler also has to pin the dark ground
      unlayered — the artifact host injects unlayered CSS, and any unlayered rule
      beats our `body` background inside Tailwind's `@layer base`, which otherwise
      renders the page on the host's light ground. Not an issue for real hosting,
      where the page owns the document.
- [ ] Real hosting. Needs `git init` first (see above), then a static host — the
      build output is plain static files in `dist/`. Netlify, Vercel, Cloudflare
      Pages and GitHub Pages all work with zero config for an Astro static build.

## Local commands

`pnpm` comes from corepack in this environment; `packageManager` pins 11.22.0.

```sh
pnpm install
pnpm dev        # note: Astro 7's dev server would not start under the build sandbox
pnpm build
pnpm astro check
```
