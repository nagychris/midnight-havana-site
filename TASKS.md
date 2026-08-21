# Midnight Havana — status

Ported from the Claude Design canvas project `a66a5b6a-36d3-44f4-9dc1-b749ba6d1781`
(artboard `Midnight Havana Home.dc.html`) to Astro 7 + Tailwind v4.

## Scaffold

- [x] Astro 7 + `@tailwindcss/vite`, pnpm via corepack
- [x] `@theme` token block in `src/styles/global.css`
- [x] Base layer and the artboard's `mh-*` component classes ported
- [x] `pnpm build` clean, `pnpm astro check` 0 errors
- [x] Git repo initialised and pushed to `github.com/nagychris/midnight-havana-website`
- [x] `sharp` added as a direct dependency — Astro's image pipeline needs it declared
      in the project, not just present transitively, or `<Image>` silently falls back
      to shipping the original file

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
- [x] `<image-slot>` → `<img>` for photos, `<Image>` for the flyers and logo.
      Flyers resolve through `import.meta.glob` over `src/assets/flyers/`, so a
      `poster` with no matching file still degrades to the placeholder — the
      drop-a-file-in behaviour survives while gaining build-time optimisation
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

## Header fixes

- [x] **Sticky header actually sticks.** The root cause was not the header — the
      page wrapper in `Base.astro` had `overflow-x: hidden`, which makes it a scroll
      container and therefore the containing block for `position: sticky`
      descendants. The header was sticking to a box that never scrolls. Changed to
      `overflow-x: clip`, which still blocks sideways scrolling but creates no
      scroll container.
- [x] **Mobile menu overlays instead of pushing.** It was a block child of the
      header, so opening it grew the header and displaced the page. Now
      `absolute inset-x-0 top-full`, with a max height and its own scroll for short
      viewports. Added the dismissals an overlay needs and a pushing panel didn't:
      tap outside, and Escape (which also returns focus to the burger).
- [x] **Header no longer clips on small phones.** Below 620px the bar could not fit
      the wordmark plus three controls. The two CTAs now move into the burger menu,
      full-width and labelled, and the wordmark drops to 12px with tighter tracking.
      Each control appears in exactly one place at any width — the bar CTAs are
      `max-sm:hidden`, the menu CTAs `sm:hidden`.

## Assets

The design MCP could not supply these (`get_file` truncates at 256 KiB and returns
corrupt data), so they were provided by hand.

Two locations, and the split is deliberate:

- **`src/assets/`** — anything Astro should optimise. Full-resolution originals live
  here and never ship as-is.
  - `logo-round.png` (537×537, 514 KB source) — the design called it
    `logo-vinyl.png`; refs updated
  - `flyers/summer-peak-party-flyer.png` (1086×1448, 2.9 MB source)
- **`public/`** — served verbatim, no optimisation.
  - `assets/hero-social.jpg`, `class-rueda.jpg`, `community-terrace.jpg`,
    `dj-night.jpg`, `class-beginners.jpg`
  - `favicon.png` (64×64, 10 KB) — generated from the logo, because
    `<link rel="icon">` needs a stable URL the image pipeline can't hash, and PNG
    still has wider favicon support than webp

- [x] **Images optimised — build went 4.6 MB → 1.1 MB.** The two big offenders were
      print-resolution files rendered into thumbnails, both stored as PNG with
      photographic content:

      | | Before | After |
      |---|---|---|
      | Flyer (shown at 300×172) | 2905 KB PNG | 111 KB webp |
      | Logo, header (38×38) | 514 KB PNG | 6 KB webp |
      | Logo, footer (52×52) | *same file* | 10 KB webp |
      | Favicon | 514 KB PNG | 10 KB PNG @64px |

      Worth noting for future assets: most of the win was the *format*, not the
      resize — converting the flyer at full resolution already saved 91%; the resize
      took it to 96%. PNG is for flat graphics and transparency, not photographs.

- [ ] Timba Nights and Rueda Grande still show the "Flyer to come" placeholder. Drop
      a file into `src/assets/flyers/` and set `poster` on that row in
      `NextDates.astro` — the glob picks it up and optimises it automatically.
- [ ] The five photos in `public/assets/` (~900 KB combined) are still unoptimised.
      Moving them to `src/assets/` and using `<Image>` would cut most of that too;
      left alone because they render near full-bleed, so the gain is smaller and the
      quality risk higher than it was for a 300px thumbnail.

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

Local dev plus Cloudflare Pages via GitHub Actions. No snapshot/artifact step.

- [x] Repo pushed to `github.com/nagychris/midnight-havana-website` (branch `main`)
- [x] Node pinned to 22 (`.nvmrc` + `engines.node`) — Astro 7 needs ≥ 22.12
- [x] `site` in astro.config set to `https://midnight-havana.pages.dev`
- [x] `workerd` added to `allowBuilds` in pnpm-workspace.yaml — wrangler pulls it in,
      and pnpm 11 treats an unapproved build script as a hard failure, which breaks
      `pnpm install` in CI
- [x] Deploy path decided: **Cloudflare's Git integration**, not GitHub Actions.
      `.github/workflows/deploy.yml` was written and then deleted — keeping both
      would deploy twice per push. Nothing to maintain in-repo, no API token or
      account ID secrets, and PR previews come free.
- [x] `output: 'static'` pinned in astro.config. See below for why this matters.
- [x] **`wrangler.jsonc` committed — fixes the double build and the image 404s.**
      Without a config, `wrangler deploy` auto-detected Astro and ran
      `astro add cloudflare` on *every* build: ~36s of setup plus a second full
      build. Timings from the 86s run:

      | Phase | Time |
      |---|---|
      | Install deps | 6s |
      | First build (correct, images optimised) | 1s |
      | `npx` downloading wrangler | 8s |
      | `astro add cloudflare` | 36s |
      | Second build (adapter loaded, no image optimisation) | 6s |
      | Upload + deploy | 5s |

      The second build is also what broke images: with the adapter loaded Astro
      swaps build-time optimisation for Cloudflare Images at request time, so the
      pre-generated `_astro/*.webp` became `/_image?…` URLs that 404. Pinning
      `output: 'static'` did not prevent it — the adapter injects the Images
      binding regardless. The config is assets-only (`assets` with no `main`), so
      there is no adapter and no Worker script; Astro's own webp output ships as-is.
- [x] `wrangler` added as a devDependency, so `npx wrangler` resolves it locally
      instead of downloading 4.x on every build (~8s).
- [x] `.wrangler/` gitignored — the auto-setup used to write it during CI builds.
- [ ] **Leave Cloudflare's deploy command as `npx wrangler deploy`.** Do *not* point
      it at the new `pnpm run deploy` script — that one is `build && wrangler deploy`
      for local use, and would reintroduce the double build in CI.
- [ ] Not verified locally: wrangler cannot run in the sandbox this was built in
      (it requires a config dir outside it). The build side is confirmed — static
      output, no adapter, optimised webp emitted. The first push is the real test of
      the deploy side.

<details>
<summary>Superseded: earlier plan to move to Pages</summary>

Before the cause was known, the plan was to move off Workers onto a Pages project
to get static serving. That turned out to be unnecessary — Workers serves static
assets fine; the adapter was the problem, and a committed `wrangler.jsonc` stops it
being added. Staying on Workers, so the site is at
`midnight-havana.chrisn4gy.workers.dev`.

The other route, if a Pages project is ever wanted instead: Workers & Pages →
Create → Pages → Connect to Git, build command `pnpm build`, output `dist`.

</details>

- [ ] Custom domain, if wanted later: the Worker → Settings → Domains & Routes.
      Update `site` in astro.config to match at the same time.

## Local commands

`pnpm` comes from corepack in this environment; `packageManager` pins 11.22.0.

```sh
pnpm install
pnpm dev        # note: Astro 7's dev server would not start under the build sandbox
pnpm build
pnpm astro check
```
