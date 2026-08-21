# Midnight Havana — status

Ported from the Claude Design canvas project `a66a5b6a-36d3-44f4-9dc1-b749ba6d1781`
(artboard `Midnight Havana Home.dc.html`) to Astro 7 + Tailwind v4.

## By Claude
- [x] scaffold project
- [x] breakpoints / responsiveness
- [x] sticky header, mobile menu overlays, header doesnt clip on small phones
- [x] "next event / today" strip visible without scrolling on all screens
- [ ] event pages with details
- [ ] translations for de, en, es
- [ ] add contact form / email address
- [ ] Impressum & Datenschutz pages

## Manual
- [ ] review and update copy texts
- [ ] optimize content for SEO
- [ ] add new images & flyers (optimized via `<Image>`)
- [ ] add links to Whatsapp
- [ ] Custom domain in Cloudflare: Worker → Settings → Domains & Routes.
      Update `site` in astro.config to match at the same time.

## Local commands

```sh
pnpm install
pnpm dev        # note: Astro 7's dev server would not start under the build sandbox
pnpm build
pnpm astro check
```
