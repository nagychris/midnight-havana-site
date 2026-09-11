import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site-url.mjs';

/**
 * robots.txt, generated so the sitemap URL always matches the site it is
 * served from. A deploy preview points at its own sitemap rather than at the
 * production one.
 */
export const GET: APIRoute = () => {
    const body = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${SITE_URL}/sitemap-index.xml`,
        '',
    ].join('\n');

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};
