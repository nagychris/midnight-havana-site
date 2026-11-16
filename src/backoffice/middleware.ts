import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const isAdmin = /^\/(en\/)?admin(\/|$)/.test(context.url.pathname);
    if (isAdmin) {
    }
    const response = await next();
    if (isAdmin) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Cache-Control', 'no-store');
        response.headers.set('X-Backoffice-Middleware', 'ran');
    }
    return response;
});
