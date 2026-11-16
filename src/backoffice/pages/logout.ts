import type { APIRoute } from 'astro';

import { bo } from '../copy';
import { adminPaths } from '../routes';

export const prerender = false;

/** Ends the session. A form post, so a link cannot log anyone out. */
export const POST: APIRoute = async ({ session, redirect }) => {
    // A new session id; the old one, and everything kept under it, is gone.
    await session?.regenerate();
    session?.delete('user');
    session?.delete('sandbox');
    session?.delete('working');
    session?.set('flash', { tone: 'ok', text: bo.login.loggedOut });
    return redirect(adminPaths.login);
};
