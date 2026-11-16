import type { AstroIntegration } from 'astro';

/** Spike: injects the admin routes only when the back office is enabled. */
export function backoffice(): AstroIntegration {
    return {
        name: 'midnight-havana:backoffice',
        hooks: {
            'astro:config:setup': ({ injectRoute, addMiddleware }) => {
                injectRoute({
                    pattern: '/admin/spike',
                    entrypoint: './src/backoffice/pages/spike.astro',
                    prerender: false,
                });
                injectRoute({
                    pattern: '/admin/preview/[id]',
                    entrypoint: './src/backoffice/pages/preview.astro',
                    prerender: false,
                });
                injectRoute({
                    pattern: '/en/admin/preview/[id]',
                    entrypoint: './src/backoffice/pages/preview.astro',
                    prerender: false,
                });
                addMiddleware({
                    entrypoint: new URL('./middleware.ts', import.meta.url),
                    order: 'pre',
                });
            },
        },
    };
}
