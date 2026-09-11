import {
    CONSENT_EVENT,
    CONSENT_STORAGE_KEY,
    CONSENT_VERSION,
    type ConsentCategory,
    type ConsentState,
} from '../lib/consent';

/**
 * Browser side of the consent store.
 *
 * Every read and write is wrapped, because `localStorage` throws in a private
 * window with site data blocked. When it is unavailable we behave as if nothing
 * was ever agreed to, which is the safe direction.
 */

export function readConsent(): ConsentState | null {
    try {
        const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(stored) as Partial<ConsentState>;
        if (parsed.version !== CONSENT_VERSION) return null;

        return {
            version: CONSENT_VERSION,
            analytics: parsed.analytics === true,
            maps: parsed.maps === true,
            decidedAt: parsed.decidedAt ?? new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

export function writeConsent(choice: {
    analytics: boolean;
    maps: boolean;
}): ConsentState {
    const state: ConsentState = {
        version: CONSENT_VERSION,
        analytics: choice.analytics,
        maps: choice.maps,
        decidedAt: new Date().toISOString(),
    };

    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // No storage available. The choice still applies to this page view.
    }

    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
    return state;
}

export function hasConsent(category: ConsentCategory): boolean {
    return readConsent()?.[category] === true;
}

/** True until the visitor has made a choice, which is when we ask. */
export function needsDecision(): boolean {
    return readConsent() === null;
}

/** Runs the callback now if already granted, and again if it is granted later. */
export function whenGranted(
    category: ConsentCategory,
    callback: () => void,
): void {
    let done = false;
    const run = () => {
        if (done) return;
        done = true;
        callback();
    };

    if (hasConsent(category)) {
        run();
        return;
    }

    window.addEventListener(CONSENT_EVENT, (event) => {
        const state = (event as CustomEvent<ConsentState>).detail;
        if (state?.[category]) run();
    });
}

export { CONSENT_EVENT, CONSENT_STORAGE_KEY };
export type { ConsentState };
