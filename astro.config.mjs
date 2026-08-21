import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    // Base for canonical URLs and any future sitemap — keep in sync with the deploy.
    site: 'https://midnight-havana.chrisn4gy.workers.dev',

    // Static is what makes Astro optimize images at build time. See TASKS.md.
    output: 'static',

    vite: {
        plugins: [tailwindcss()],
    },
});
