import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Set this to whatever URL the site is actually served from. Nothing reads it
  // yet, but it becomes the base for canonical URLs and a sitemap, so a stale
  // value here silently emits wrong URLs once either is added.
  // Cloudflare Pages serves this at https://midnight-havana.pages.dev until a
  // custom domain is attached — the subdomain follows the Pages *project* name,
  // so name the project "midnight-havana" (not after the repo).
  site: 'https://midnight-havana.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
