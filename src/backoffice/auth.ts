import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * Password checking for the back office.
 *
 * Only a hash of the password is ever stored: in an environment variable, or
 * for the demo in `netlify.toml`. The hash is made with scrypt, which is slow
 * on purpose, so a leaked hash cannot be tried against millions of guesses.
 *
 * Format: `scrypt:<N>:<r>:<p>:<salt>:<hash>`, the last two in base64url. It
 * uses colons, not `$`, because `.env` files treat `$` as a variable.
 */

const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLEL = 1;
const KEY_LENGTH = 32;

export function hashPassword(password: string): string {
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, KEY_LENGTH, {
        N: COST,
        r: BLOCK_SIZE,
        p: PARALLEL,
    });
    return [
        'scrypt',
        COST,
        BLOCK_SIZE,
        PARALLEL,
        salt.toString('base64url'),
        hash.toString('base64url'),
    ].join(':');
}

export function verifyPassword(password: string, stored: string): boolean {
    const [scheme, cost, blockSize, parallel, salt, hash] = stored.split(':');
    if (scheme !== 'scrypt' || !salt || !hash) return false;

    const expected = Buffer.from(hash, 'base64url');
    try {
        const actual = scryptSync(password, Buffer.from(salt, 'base64url'), expected.length, {
            N: Number(cost),
            r: Number(blockSize),
            p: Number(parallel),
        });
        return timingSafeEqual(actual, expected);
    } catch {
        // Unusable parameters in the stored value: nobody gets in.
        return false;
    }
}

/** Login names are compared without regard to case or stray spaces. */
export function sameUser(typed: string, expected: string): boolean {
    return expected !== '' && typed.trim().toLowerCase() === expected.trim().toLowerCase();
}

/** A password easy enough to read off a terminal, for a local session. */
export function randomPassword(): string {
    return randomBytes(9).toString('base64url');
}
