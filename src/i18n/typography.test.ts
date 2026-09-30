import { describe, expect, it } from 'vitest';
import { keepTogether } from './typography';

describe('keepTogether', () => {
    it('replaces every space with a non-breaking space', () => {
        expect(keepTogether('Rueda de Casino')).toBe('Rueda\u00A0de\u00A0Casino');
    });

    it('leaves a single word unchanged', () => {
        expect(keepTogether('Berlin')).toBe('Berlin');
    });
});
