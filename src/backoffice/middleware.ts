import { defineMiddleware } from 'astro:middleware';

import { adminPaths, isBackofficePath } from './routes';
import { adjustPolicy } from './security';

/**
 * Guards every page of the back office.
 *
 * Runs before the pages do. Anyone who is not logged in is sent to the login
 * page, a request that changes something must come from the site itself, and
 * every answer carries the headers a private page needs. Public pages pass
 * straight through, including while the site is being built.
 */
export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname, search } = context.url;
    if (!isBackofficePath(pathname)) return next();

    // A form on another website must not be able to post here.
    const changesSomething = !['GET', 'HEAD'].includes(context.request.method);
    if (changesSomething && !isSameOrigin(context.request, context.url)) {
        return new Response('Forbidden', { status: 403 });
    }

    const user = await context.session?.get('user');
    const isLogin = pathname.replace(/\/$/, '') === adminPaths.login.replace(/\/$/, '');

    let response: Response;
    if (!user && !isLogin) {
        const back = encodeURIComponent(pathname + search);
        response = context.redirect(`${adminPaths.login}?weiter=${back}`);
    } else {
        context.locals.backofficeUser = user;
        response = await next();
    }

    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'same-origin');
    // The preview shows event pages in a frame, but only inside the back office.
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');

    const policy = response.headers.get('Content-Security-Policy');
    if (policy) response.headers.set('Content-Security-Policy', adjustPolicy(policy));

    return response;
});

function isSameOrigin(request: Request, url: URL): boolean {
    const origin = request.headers.get('origin');
    if (!origin) return false;
    try {
        return new URL(origin).host === url.host;
    } catch {
        return false;
    }
}
