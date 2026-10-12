import { describe, expect, it } from 'vitest';

import { toParagraphs } from '../i18n/typography';
import {
    eventsFromFiles,
    findEventFileProblems,
    isTemplateFile,
    parseEventFile,
} from './event-files';

const DIR = '/src/data/events';

function eventYaml(date: string, slug: string, extra = ''): string {
    return `date: "${date}"\nslug: ${slug}\n${extra}`;
}

const TWO_PARAGRAPHS = `description:
  de: |-
    Erster Absatz.

    Zweiter Absatz.
  en: |-
    First paragraph.

    Second paragraph.
`;

describe('isTemplateFile', () => {
    it('is true for a file name starting with an underscore', () => {
        expect(isTemplateFile(`${DIR}/_template.yaml`)).toBe(true);
    });

    it('is false for an event file', () => {
        expect(isTemplateFile(`${DIR}/2026-10-02-al-son-de-cuba.yaml`)).toBe(false);
    });
});

describe('parseEventFile', () => {
    it('keeps the blank line of a |- block and adds no trailing newline', () => {
        const event = parseEventFile(
            'a.yaml',
            eventYaml('2026-10-02', 'a', TWO_PARAGRAPHS),
        );

        expect(event.description?.de).toBe('Erster Absatz.\n\nZweiter Absatz.');
    });

    it('gives a description that splits into two paragraphs', () => {
        const event = parseEventFile(
            'a.yaml',
            eventYaml('2026-10-02', 'a', TWO_PARAGRAPHS),
        );

        expect(toParagraphs(event.description?.en ?? '')).toEqual([
            'First paragraph.',
            'Second paragraph.',
        ]);
    });

    it('names the file when the YAML is invalid', () => {
        expect(() => parseEventFile('broken.yaml', 'date: "2026-10-02\n')).toThrow(
            /broken\.yaml/,
        );
    });

    it('names the file when a field is invalid', () => {
        expect(() =>
            parseEventFile('bad.yaml', eventYaml('2026-10-02', 'Not A Slug')),
        ).toThrow(/bad\.yaml.*slug/);
    });
});

describe('eventsFromFiles', () => {
    it('ignores files starting with an underscore', () => {
        const events = eventsFromFiles({
            [`${DIR}/_template.yaml`]: eventYaml('2026-12-31', 'template'),
            [`${DIR}/2026-10-02-a.yaml`]: eventYaml('2026-10-02', 'a'),
        });

        expect(events.map((event) => event.slug)).toEqual(['a']);
    });

    it('sorts events by date', () => {
        const events = eventsFromFiles({
            [`${DIR}/x.yaml`]: eventYaml('2026-11-06', 'later'),
            [`${DIR}/y.yaml`]: eventYaml('2026-10-02', 'sooner'),
        });

        expect(events.map((event) => event.slug)).toEqual(['sooner', 'later']);
    });

    it('rejects two files with the same slug', () => {
        expect(() =>
            eventsFromFiles({
                [`${DIR}/x.yaml`]: eventYaml('2026-10-02', 'same'),
                [`${DIR}/y.yaml`]: eventYaml('2026-10-16', 'same'),
            }),
        ).toThrow(/same/);
    });
});

describe('findEventFileProblems', () => {
    it('finds nothing in a folder of valid files', () => {
        const problems = findEventFileProblems({
            [`${DIR}/x.yaml`]: eventYaml('2026-10-02', 'a', TWO_PARAGRAPHS),
            [`${DIR}/y.yaml`]: eventYaml('2026-10-16', 'b'),
        });

        expect(problems).toEqual([]);
    });

    it('reports broken indentation with the file name and line', () => {
        const broken = 'date: "2026-10-02"\nslug: a\ntitle:\n  de: Titel\n en: Title\n';

        const problems = findEventFileProblems({ [`${DIR}/x.yaml`]: broken });

        expect(problems).toHaveLength(1);
        expect(problems[0]).toMatch(/x\.yaml.*line 5/);
    });

    it('reports an invalid date with the field name', () => {
        const problems = findEventFileProblems({
            [`${DIR}/x.yaml`]: eventYaml('2026-13-01', 'a'),
        });

        expect(problems).toHaveLength(1);
        expect(problems[0]).toMatch(/x\.yaml.*date/);
    });

    it('reports two files with the same slug', () => {
        const problems = findEventFileProblems({
            [`${DIR}/x.yaml`]: eventYaml('2026-10-02', 'same'),
            [`${DIR}/y.yaml`]: eventYaml('2026-10-16', 'same'),
        });

        expect(problems).toHaveLength(1);
        expect(problems[0]).toMatch(/"same"/);
    });

    it('names both files when two files use the same slug', () => {
        const problems = findEventFileProblems({
            [`${DIR}/x.yaml`]: eventYaml('2026-10-02', 'same'),
            [`${DIR}/y.yaml`]: eventYaml('2026-10-16', 'same'),
        });

        expect(problems[0]).toMatch(/x\.yaml.*y\.yaml/);
    });

    it('names both files when two files use the same date', () => {
        const problems = findEventFileProblems({
            [`${DIR}/x.yaml`]: eventYaml('2026-10-02', 'a'),
            [`${DIR}/y.yaml`]: eventYaml('2026-10-02', 'b'),
        });

        expect(problems).toHaveLength(1);
        expect(problems[0]).toMatch(/x\.yaml.*y\.yaml.*2026-10-02/);
    });

    it('reports every broken file, not only the first', () => {
        const problems = findEventFileProblems({
            [`${DIR}/x.yaml`]: eventYaml('2026-10-02', 'Bad Slug'),
            [`${DIR}/y.yaml`]: eventYaml('not-a-date', 'b'),
        });

        expect(problems).toHaveLength(2);
    });

    it('reports a file that does not end in .yaml', () => {
        const problems = findEventFileProblems({
            [`${DIR}/2026-12-04-x.yml`]: eventYaml('2026-12-04', 'x'),
        });

        expect(problems).toHaveLength(1);
        expect(problems[0]).toMatch(/2026-12-04-x\.yml.*\.yaml/);
    });

    it('skips files starting with an underscore', () => {
        const problems = findEventFileProblems({
            [`${DIR}/_notes.yaml`]: 'not: [valid',
        });

        expect(problems).toEqual([]);
    });
});
