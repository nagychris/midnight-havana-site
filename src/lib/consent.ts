/**
 * Consent state, shared by the banner, the analytics loader and the map.
 *
 * Stored in `localStorage` rather than a cookie, because a cookie would be sent
 * to the server on every request for no reason. Nothing is loaded and nothing
 * is stored until the visitor makes a choice.
 */

export const CONSENT_STORAGE_KEY = 'mh-consent';

/** Bumping this asks everyone again, for example after adding a new service. */
export const CONSENT_VERSION = 1;

/** Fired on `window` whenever the stored choice changes. */
export const CONSENT_EVENT = 'mh:consent-change';

export interface ConsentState {
    version: number;
    /** Google Analytics may load. */
    analytics: boolean;
    /** The Google Maps iframe may load without asking again. */
    maps: boolean;
    /** When the choice was made, as an ISO timestamp. */
    decidedAt: string;
}

export type ConsentCategory = 'analytics' | 'maps';
