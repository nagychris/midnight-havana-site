import type { Locale } from '../i18n/locales';

/** Every URL of the back office, in one place. */

export type PreviewView = 'seite' | 'karte';

export const adminPaths = {
    home: '/admin/',
    login: '/admin/login/',
    logout: '/admin/logout/',
    resetDemo: '/admin/demo-zuruecksetzen/',
    newEvent: '/admin/termine/neu/',
    event: (id: string) => `/admin/termine/${id}/`,
    preview: (id: string) => `/admin/termine/${id}/vorschau/`,
    /** The real event page or card, shown inside the preview frame. */
    frame: (id: string, view: PreviewView, locale: Locale, live = false) =>
        `${locale === 'en' ? '/en' : ''}/admin/vorschau/${id}/${view}/${live ? '?stand=live' : ''}`,
};

/** The id the form uses for an event that has not been saved yet. */
export const NEW_EVENT_ID = 'neu';

/** German pages sit at the root, the English preview frames under /en/. */
export function isBackofficePath(pathname: string): boolean {
    return /^\/(en\/)?admin(\/|$)/.test(pathname);
}

/** Only ever send someone back to a page of the back office itself. */
export function safeReturnPath(value: string | null): string {
    if (value && /^\/admin\/[A-Za-z0-9\-/]*$/.test(value)) return value;
    return adminPaths.home;
}

/** Event ids become file names, so nothing but these characters may pass. */
export function isEntryId(value: string | undefined): value is string {
    return typeof value === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) && value.length <= 120;
}
