/**
 * Makes the stored form of a back office password.
 *
 *     pnpm backoffice:password "the new password"
 *
 * Prints two lines for `.env` (local) or for the environment variables of the
 * Netlify site. Only the hash is stored anywhere; the password itself is not.
 */
import { hashPassword } from '../src/backoffice/auth';

const password = process.argv[2];
if (!password || password.length < 10) {
    console.error('Usage: pnpm backoffice:password "<password, at least 10 characters>"');
    process.exit(1);
}

console.log('BACKOFFICE_USER=<the e-mail address to log in with>');
console.log(`BACKOFFICE_PASSWORD_HASH=${hashPassword(password)}`);
