/**
 * Types the back office adds to Astro: what it keeps in the session, and the
 * settings the integration fixes when the site is built or started.
 */

/** Set by `src/backoffice/integration.ts`. Missing when the back office is off. */
declare const __BACKOFFICE__:
    | { mode: 'local' | 'demo'; user: string; passwordHash: string }
    | undefined;

declare namespace App {
    interface SessionData {
        /** Who is logged in. */
        user: { name: string };
        /** Demo mode: this visitor's changes on top of the real events. */
        sandbox: import('./store/types').SandboxChanges;
        /** What is in the form right now, per event, for the live preview. */
        working: Record<string, import('./event-form').EventFormValues>;
        /** A message for the next page that is shown. */
        flash: { tone: 'ok' | 'warn'; text: string };
    }

    interface Locals {
        backofficeUser?: { name: string };
    }
}
