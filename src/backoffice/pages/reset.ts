import type { APIRoute } from 'astro';

import { isDemo } from '../config';
import { bo } from '../copy';
import { adminPaths } from '../routes';

export const prerender = false;

/** Demo only: throws away this visitor's changes. */
export const POST: APIRoute = async ({ session, redirect }) => {
    if (isDemo) {
        session?.delete('sandbox');
        session?.delete('working');
        session?.set('flash', { tone: 'ok', text: bo.demo.resetDone });
    }
    return redirect(adminPaths.home);
};
