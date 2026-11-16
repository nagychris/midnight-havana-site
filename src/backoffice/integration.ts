import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

import type { AstroIntegration } from 'astro';

import { hashPassword, randomPassword } from './auth';
import type { BackofficeMode } from './config';

/**
 * Adds the back office to the site.
 *
 * Only used when `BACKOFFICE` is set (see `astro.config.mjs`). Without it none
 * of this runs: the pages below do not exist, no middleware is added, and the
 * build is the plain static site.
 *
 * The pages live in `src/backoffice/pages/` rather than `src/pages/`, so they
 * are routes only when this integration says so.
 */

const page = (file: string) => new URL(`./pages/${file}`, import.meta.url).pathname;

const ROUTES: [pattern: string, file: string][] = [
    ['/admin', 'index.astro'],
    ['/admin/login', 'login.astro'],
    ['/admin/logout', 'logout.ts'],
    ['/admin/demo-zuruecksetzen', 'reset.ts'],
    ['/admin/termine/neu', 'event.astro'],
    ['/admin/termine/[id]', 'event.astro'],
    ['/admin/termine/[id]/vorschau', 'preview.astro'],
    // The page inside the preview frame, once per language of the website.
    ['/admin/vorschau/[id]/[view]', 'frame.astro'],
    ['/en/admin/vorschau/[id]/[view]', 'frame.astro'],
];

export function backoffice(mode: BackofficeMode): AstroIntegration {
    /** Printed once the dev server is up, when a password was made up. */
    let generatedLogin: { user: string; password: string } | null = null;

    return {
        name: 'midnight-havana:backoffice',
        hooks: {
            'astro:config:setup': ({
                command,
                config,
                injectRoute,
                addMiddleware,
                updateConfig,
            }) => {
                if (mode === 'local' && command === 'build') {
                    throw new Error(
                        'BACKOFFICE=local writes event files and only works with `astro dev`. ' +
                            'Use BACKOFFICE=demo for a build that goes online.',
                    );
                }

                // `.env` is read here because Astro only loads it for the pages.
                const envFile = new URL('.env', config.root);
                const env = {
                    ...(existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {}),
                    ...process.env,
                };
                let user = env.BACKOFFICE_USER ?? '';
                let passwordHash = env.BACKOFFICE_PASSWORD_HASH ?? '';

                // No login set up: on a developer's machine, make one up for
                // this run. A build without a login stays locked.
                if (command === 'dev' && (user === '' || passwordHash === '')) {
                    const password = randomPassword();
                    user = 'admin';
                    passwordHash = hashPassword(password);
                    generatedLogin = { user, password };
                }

                for (const [pattern, file] of ROUTES) {
                    injectRoute({ pattern, entrypoint: page(file), prerender: false });
                }
                addMiddleware({
                    entrypoint: new URL('./middleware.ts', import.meta.url),
                    order: 'pre',
                });
                updateConfig({
                    vite: {
                        define: {
                            __BACKOFFICE__: JSON.stringify({ mode, user, passwordHash }),
                        },
                    },
                });
            },

            'astro:server:start': ({ address, logger }) => {
                const host = address.family === 'IPv6' ? `[${address.address}]` : address.address;
                const origin = `http://${host === '[::1]' || host === '127.0.0.1' ? 'localhost' : host}:${address.port}`;
                logger.info(`Back office (${mode}): ${origin}/admin/`);
                if (generatedLogin) {
                    logger.info(
                        `Login for this run: ${generatedLogin.user} / ${generatedLogin.password}`,
                    );
                }
            },
        },
    };
}
