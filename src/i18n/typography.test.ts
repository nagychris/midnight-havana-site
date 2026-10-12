import { describe, expect, it } from 'vitest';
import { keepTogether, toParagraphs } from './typography';

describe('keepTogether', () => {
    it('replaces every space with a non-breaking space', () => {
        expect(keepTogether('Rueda de Casino')).toBe('Rueda\u00A0de\u00A0Casino');
    });

    it('leaves a single word unchanged', () => {
        expect(keepTogether('Berlin')).toBe('Berlin');
    });
});

describe('toParagraphs', () => {
    it('splits a text at blank lines', () => {
        expect(toParagraphs('First.\n\nSecond.')).toEqual(['First.', 'Second.']);
    });

    it('keeps a text without blank lines as one paragraph', () => {
        expect(toParagraphs('Only one.')).toEqual(['Only one.']);
    });

    it('drops empty paragraphs and surrounding spaces', () => {
        expect(toParagraphs('\n\n A. \n\n\n\nB.\n')).toEqual(['A.', 'B.']);
    });
});
