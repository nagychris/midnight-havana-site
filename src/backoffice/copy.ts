/**
 * Every text of the back office, in German.
 *
 * The owner works in German, so the back office has one language. Keeping the
 * texts here, away from the pages, means a second language later is a second
 * file rather than a search through templates.
 */
export const bo = {
    name: 'Backoffice',
    brand: 'Midnight Havana',

    demo: {
        banner: 'Demo: Änderungen bleiben in dieser Sitzung. Die echte Website wird nicht verändert.',
        reset: 'Demo zurücksetzen',
        resetDone: 'Die Demo ist wieder im Ausgangszustand.',
    },

    login: {
        title: 'Anmelden',
        intro: 'Termine der Website selbst pflegen.',
        user: 'E-Mail',
        password: 'Passwort',
        submit: 'Anmelden',
        failed: 'E-Mail oder Passwort stimmt nicht.',
        notConfigured:
            'Für dieses Backoffice ist noch kein Zugang eingerichtet. Siehe README, Abschnitt „Backoffice“.',
        loggedOut: 'Du bist abgemeldet.',
        logout: 'Abmelden',
    },

    list: {
        title: 'Termine',
        intro: 'Alle Termine der Website. Vergangene verschwinden von selbst.',
        add: 'Neuer Termin',
        upcoming: 'Kommende Termine',
        past: 'Vergangene Termine',
        none: 'Noch keine kommenden Termine. Lege den ersten an.',
        edit: 'Bearbeiten',
        preview: 'Vorschau',
        duplicate: 'Als Vorlage nutzen',
        status: {
            live: 'Online',
            draft: 'Entwurf',
            changes: 'Änderungen offen',
            cancelled: 'Fällt aus',
        },
        linksMissing: (missing: number, total: number) =>
            `${missing} von ${total} Buchungslinks fehlen`,
        noTitle: 'Ohne Titel',
    },

    editor: {
        newTitle: 'Neuer Termin',
        editTitle: 'Termin bearbeiten',
        back: 'Alle Termine',

        paste: {
            heading: 'Schnell ausfüllen',
            intro: 'Füge die Nachricht ein, die du sonst per WhatsApp schickst. Datum, Titel, Kurslinks, DJ und Text werden ins Formular übernommen.',
            label: 'Nachricht',
            submit: 'Formular ausfüllen',
            example: 'Beispiel einsetzen',
            found: 'Übernommen:',
            nothing: 'In der Nachricht wurde nichts erkannt. Fülle das Formular bitte von Hand aus.',
            parts: {
                date: 'Datum',
                title: 'Titel',
                links: (count: number) => (count === 1 ? '1 Kurslink' : `${count} Kurslinks`),
                dj: 'DJ',
                text: 'Text',
            },
            check: 'Bitte prüfen und die englischen Texte ergänzen.',
        },

        sections: {
            basics: 'Das Wichtigste',
            texts: 'Texte',
            booking: 'Kurse buchen',
            image: 'Bild der Terminseite',
            more: 'Weitere Angaben',
        },

        fields: {
            date: 'Datum',
            title: 'Titel',
            dj: 'DJ',
            teachers: 'Unterricht',
            summary: 'Kurztext',
            description: 'Beschreibung',
            regularClasses: 'Die vier regulären Kurse finden statt',
            party: 'Party selbst buchbar',
            image: 'Bild',
            noImage: 'Kein Bild',
            badges: 'Labels',
            priceNote: 'Preishinweis',
            cancelled: 'Termin fällt aus',
            seoTitle: 'Titel bei Google',
            seoDescription: 'Text bei Google',
            slug: 'Adresse der Seite',
        },

        languages: { de: 'Deutsch', en: 'Englisch' },

        hints: {
            titleEn: 'Leer lassen, wenn der Titel in beiden Sprachen gleich ist.',
            teachers: 'Namen mit Komma trennen.',
            summary: 'Ein Satz. Steht auf der Terminkarte und bei Google.',
            description: 'Für die Terminseite. Absätze mit einer Leerzeile trennen.',
            links: 'Links von Eversports oder Urban Sports Club. Ohne Link führt der Button zur allgemeinen Kursübersicht.',
            party: 'Nur ausfüllen, wenn der Abend selbst online buchbar ist.',
            badges: 'Bis zu drei kurze Labels auf der Terminkarte, zum Beispiel der DJ. Englisch leer lassen, wenn es gleich ist.',
            priceNote: 'Nur ausfüllen, wenn an dem Abend andere Preise gelten.',
            cancelled: 'Der Termin bleibt sichtbar und wird als abgesagt markiert.',
            seo: 'Freiwillig. Ohne Angabe nimmt Google den Titel und den Kurztext.',
            slug: 'Wird aus dem Titel gebildet. Nach der Veröffentlichung bleibt sie fest, damit geteilte Links weiter funktionieren.',
            extras: 'Dieser Termin hat ein Zusatzangebot (z. B. einen Workshop). Es bleibt erhalten; bearbeiten lässt es sich in dieser Version noch nicht.',
        },

        actions: {
            draft: 'Entwurf speichern',
            draftShort: 'Entwurf',
            preview: 'Vorschau',
            publish: 'Veröffentlichen',
            discard: 'Entwurf verwerfen',
        },

        saved: 'Entwurf gespeichert.',
        discarded: 'Der Entwurf wurde verworfen.',
        published: {
            demo: 'Veröffentlicht. In der echten Version ist der Termin jetzt in etwa zwei Minuten online.',
            local: (file: string) =>
                `Veröffentlicht. Die Datei ${file} wurde geschrieben, der Termin steht auf der lokalen Website.`,
        },
        problemsHeading: 'Bitte noch prüfen',
        notFound: 'Diesen Termin gibt es nicht (mehr).',
        technical: 'Der Termin konnte nicht gespeichert werden:',
    },

    preview: {
        title: 'Vorschau',
        back: 'Bearbeiten',
        views: { page: 'Terminseite', card: 'Terminkarte' },
        languages: { de: 'DE', en: 'EN' },
        widths: { phone: 'Handy', full: 'Breit' },
        frameTitle: 'So sieht der Termin auf der Website aus',
        cardHeadline: 'So steht der Termin in der Liste',
        unavailable:
            'Für die Vorschau fehlen noch Angaben. Trage mindestens ein Datum ein.',
        notes: {
            fallbackEn: 'Englische Texte fehlen noch. In der englischen Vorschau steht dafür der deutsche Text.',
            fallbackDe: 'Deutsche Texte fehlen noch. In der deutschen Vorschau steht dafür der englische Text.',
            linksDropped: 'Mindestens ein Buchungslink ist ungültig und fehlt deshalb in der Vorschau.',
            imageDropped: 'Das gewählte Bild gibt es nicht. Die Vorschau zeigt den Termin ohne Bild.',
        },
    },

    problems: {
        dateMissing: 'Bitte ein Datum wählen.',
        dateTaken: (label: string) =>
            `Für dieses Datum gibt es schon einen Termin: ${label}.`,
        titleMissing: 'Bitte einen Titel eintragen.',
        slugInvalid:
            'Nur Kleinbuchstaben, Zahlen und Bindestriche, zum Beispiel salsa-friday-dj-ren.',
        slugTaken: (label: string) =>
            `Diese Adresse nutzt schon ein anderer Termin: ${label}.`,
        slugLocked: 'Die Adresse lässt sich nach der Veröffentlichung nicht mehr ändern.',
        needsGerman: 'Bitte auch die deutsche Fassung eintragen.',
        needsEnglish: 'Bitte auch die englische Fassung eintragen.',
        tooLong: (max: number) => `Höchstens ${max} Zeichen.`,
        linkInvalid:
            'Der Link muss mit https:// beginnen und zu eversports.de oder urbansportsclub.com führen.',
        imageUnknown: 'Dieses Bild gibt es nicht. Bitte ein anderes wählen.',
        tooManyTeachers: 'Höchstens 8 Namen.',
    },

    warnings: {
        notFriday: (weekday: string) =>
            `Das Datum ist ein ${weekday}, kein Freitag. Stimmt das?`,
        past: 'Das Datum liegt in der Vergangenheit. Der Termin erscheint nicht auf der Website.',
        linksMissing: (missing: number, total: number) =>
            `Für ${missing} von ${total} Kursen fehlt der Buchungslink. Die Buttons führen dann zur allgemeinen Kursübersicht.`,
        summaryLong: 'Der Kurztext hat mehr als 155 Zeichen. Google kürzt ihn.',
        noImage: 'Ohne Bild beginnt die Terminseite ohne Foto.',
    },
} as const;
