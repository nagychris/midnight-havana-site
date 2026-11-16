/**
 * How the back office is set up for this build.
 *
 * `local` runs on the developer's machine with `astro dev` and writes real
 * event files into `src/data/events/`. `demo` keeps every change in the
 * visitor's own session, so it can be put online for someone to try without
 * touching the website.
 *
 * The values are fixed by the integration when the site is built or started.
 * A login set in the Netlify UI (as a function environment variable) wins over
 * the built-in one, so a password can be changed without a new build.
 */
export type BackofficeMode = 'local' | 'demo';

const built = typeof __BACKOFFICE__ === 'undefined' ? undefined : __BACKOFFICE__;

export const backofficeConfig = {
    mode: (built?.mode ?? 'demo') as BackofficeMode,
    user: process.env.BACKOFFICE_USER ?? built?.user ?? '',
    passwordHash: process.env.BACKOFFICE_PASSWORD_HASH ?? built?.passwordHash ?? '',
};

export const isDemo = backofficeConfig.mode === 'demo';
