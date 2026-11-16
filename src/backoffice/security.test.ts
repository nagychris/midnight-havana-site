import { describe, expect, it } from 'vitest';

import { hashPassword, sameUser, verifyPassword } from './auth';
import { isBackofficePath, isEntryId, safeReturnPath } from './routes';
import { adjustPolicy } from './security';

describe('adjustPolicy', () => {
    const site =
        "default-src 'self';form-action 'none';frame-src https://www.google.com https://maps.google.com; script-src 'self' 'sha256-abc';";

    it('lets the back office post its own forms', () => {
        expect(adjustPolicy(site)).toContain("form-action 'self'");
        expect(adjustPolicy(site)).not.toContain("'none'");
    });

    it('allows the preview frame and keeps the map', () => {
        expect(adjustPolicy(site)).toContain(
            "frame-src 'self' https://www.google.com https://maps.google.com",
        );
    });

    it('leaves every other directive as it was', () => {
        const adjusted = adjustPolicy(site);
        expect(adjusted).toContain("default-src 'self'");
        expect(adjusted).toContain("script-src 'self' 'sha256-abc'");
    });

    it('adds the two directives when the policy has neither', () => {
        expect(adjustPolicy("default-src 'self'")).toBe(
            "default-src 'self'; form-action 'self'; frame-src 'self';",
        );
    });
});

describe('passwords', () => {
    const stored = hashPassword('tanzen-bis-eins');

    it('accepts the right password and no other', () => {
        expect(verifyPassword('tanzen-bis-eins', stored)).toBe(true);
        expect(verifyPassword('tanzen-bis-zwei', stored)).toBe(false);
    });

    it('never stores the password itself', () => {
        expect(stored).not.toContain('tanzen');
        expect(stored).not.toContain('$');
    });

    it('lets nobody in when the stored value is unusable', () => {
        expect(verifyPassword('anything', '')).toBe(false);
        expect(verifyPassword('anything', 'scrypt:x:y:z:salt:hash')).toBe(false);
    });

    it('compares login names without regard to case', () => {
        expect(sameUser(' Demo@Midnight-Havana.de', 'demo@midnight-havana.de')).toBe(true);
        expect(sameUser('', '')).toBe(false);
    });
});

describe('routes', () => {
    it('knows which paths belong to the back office', () => {
        expect(isBackofficePath('/admin/')).toBe(true);
        expect(isBackofficePath('/en/admin/vorschau/x/seite/')).toBe(true);
        expect(isBackofficePath('/administration/')).toBe(false);
        expect(isBackofficePath('/termine/fiesta-navidena/')).toBe(false);
    });

    it('only returns to its own pages after the login', () => {
        expect(safeReturnPath('/admin/termine/neu/')).toBe('/admin/termine/neu/');
        expect(safeReturnPath('https://example.com/')).toBe('/admin/');
        expect(safeReturnPath('//example.com/admin/')).toBe('/admin/');
        expect(safeReturnPath(null)).toBe('/admin/');
    });

    it('accepts only ids that are safe as file names', () => {
        expect(isEntryId('2026-12-04-salsa-friday-dj-tamboly')).toBe(true);
        expect(isEntryId('../../etc/passwd')).toBe(false);
        expect(isEntryId('a.yaml')).toBe(false);
        expect(isEntryId(undefined)).toBe(false);
    });
});
