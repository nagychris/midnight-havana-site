import { describe, expect, it } from 'vitest';

import { classLinkCount, parsePastedMessage, splitText } from './paste';
import { SAMPLE_MESSAGE } from './sample';

const TODAY = '2026-11-16';

describe('parsePastedMessage', () => {
    const found = parsePastedMessage(SAMPLE_MESSAGE, TODAY);

    it('reads the date and the title from the first line', () => {
        expect(found.date).toBe('2026-12-04');
        expect(found.title).toBe('Salsa Friday');
    });

    it('puts each link on its class', () => {
        expect(classLinkCount(found)).toBe(4);
        expect(found.links['salsa-basics']).toContain('2b0bb918');
        expect(found.links['salsa-beginner']).toContain('b7673d12');
        expect(found.links['rueda-beginner']).toContain('73b352b5');
        expect(found.links['rueda-advanced']).toContain('ac26d8ea');
    });

    it('takes the line after "Social:" as the DJ', () => {
        expect(found.dj).toBe('DJ Tamboly');
    });

    it('uses the first sentence as the summary and the rest as paragraphs', () => {
        expect(found.summary).toBe(
            'DJ Tamboly bringt Energie, Rhythmus und ein gutes Gespür für die Tanzfläche zu Midnight Havana.',
        );
        expect(found.description?.split('\n\n')).toHaveLength(2);
        expect(found.description).toMatch(/^Seine Sets bewegen sich/);
    });

    it('moves a date that has passed this year into the next', () => {
        expect(parsePastedMessage('9.1. Salsa Friday', TODAY).date).toBe('2027-01-09');
    });

    it('keeps a year that is written out', () => {
        expect(parsePastedMessage('04.12.2027 Noche de Timba', TODAY).date).toBe(
            '2027-12-04',
        );
    });

    it('rejects a date that does not exist', () => {
        expect(parsePastedMessage('31.2. Salsa Friday', TODAY).date).toBeNull();
    });

    it('leaves out a link to a site that is not a booking platform', () => {
        const message = '4.12. Salsa Friday\nBasics 19:00: https://example.com/kurs';
        expect(parsePastedMessage(message, TODAY).links).toEqual({});
    });

    it('tells the classes apart by time when the level is not named', () => {
        const message = [
            '4.12. Salsa Friday',
            'Salsa 19:00: https://www.eversports.de/a',
            'Rueda 20:00: https://www.eversports.de/b',
        ].join('\n');
        const { links } = parsePastedMessage(message, TODAY);
        expect(links['salsa-basics']).toBe('https://www.eversports.de/a');
        expect(links['rueda-advanced']).toBe('https://www.eversports.de/b');
    });

    it('finds nothing in an empty message', () => {
        const empty = parsePastedMessage('  \n ', TODAY);
        expect(empty.date).toBeNull();
        expect(empty.summary).toBeNull();
    });
});

describe('splitText', () => {
    it('does not end the first sentence at a date', () => {
        const { summary, description } = splitText([
            'Am 13.11. wird Midnight Havana wieder ganz kubanisch. EC Kuba DJ legt auf.',
        ]);
        expect(summary).toBe('Am 13.11. wird Midnight Havana wieder ganz kubanisch.');
        expect(description).toBe('EC Kuba DJ legt auf.');
    });

    it('does not end the first sentence at an abbreviation', () => {
        const { summary } = splitText(['Mit Timba, Son usw. bis in die Nacht. Kommt vorbei.']);
        expect(summary).toBe('Mit Timba, Son usw. bis in die Nacht.');
    });

    it('keeps a single sentence whole and has no description', () => {
        expect(splitText(['Ein Abend voller Musik.'])).toEqual({
            summary: 'Ein Abend voller Musik.',
            description: null,
        });
    });
});
