import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    // Set this to whatever URL the site is actually served from. Nothing reads it
    // yet, but it becomes the base for canonical URLs and a sitemap, so a stale
    // value here silently emits wrong URLs once either is added.
    site: 'https://midnight-havana.chrisn4gy.workers.dev',

    // Pinned deliberately. This site is fully static, and `static` is what makes
    // Astro optimize images at BUILD time into _astro/*.webp. In a server build it
    // instead emits the originals and rewrites every <img> to the on-demand
    // /_image endpoint — which does not exist on a static host, and cannot run
    // sharp on Cloudflare Workers, so every image 404s. If a host preset adds an
    // adapter and flips this to 'server', images break; keep it here so that
    // change has to be deliberate.
    output: 'static',

    vite: {
        plugins: [tailwindcss()],
    },
});
