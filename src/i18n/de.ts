import type { ClassId } from '../data/classes';

/** Copy for one class card. Shared by every language. */
export interface ClassCopy {
    name: string;
    /** Opening line, set slightly larger on the card. */
    lead: string;
    body: string;
    /** Short emphasised line under the body, or null. */
    note: string | null;
    /** What you should already be able to dance, or null. */
    prerequisites: string | null;
    cta: string;
}

const classCopy: Record<ClassId, ClassCopy> = {
    'salsa-basics': {
        name: 'Salsa Cubana Basics',
        lead: 'Du hast noch nie Salsa getanzt oder möchtest ganz von vorne anfangen?',
        body: 'Im Basics-Kurs lernst du die wichtigsten Grundschritte, Rhythmusgefühl und erste Elemente der Salsa Cubana. Der Kurs ist bewusst für komplette Anfänger aufgebaut.',
        note: 'Keine Vorkenntnisse nötig.',
        prerequisites: null,
        cta: 'Salsa für Anfänger buchen',
    },
    'salsa-beginner': {
        name: 'Salsa Cubana Beginner',
        lead: 'Du hast bereits ein paar Salsa-Kurse besucht und möchtest sicherer werden?',
        body: 'Hier entwickeln wir deine Grundlagen weiter und arbeiten an Partnerwork, Bewegung, Timing und typischen Elementen der kubanischen Salsa.',
        note: null,
        prerequisites: 'Grundschritt und Dile que no aus zwei bis drei Kursen.',
        cta: 'Salsa Cubana Beginner buchen',
    },
    'rueda-beginner': {
        name: 'Rueda de Casino Beginner',
        lead: 'Mehrere Paare tanzen gemeinsam im Kreis und wechseln auf Ansage Figuren und Partner.',
        body: 'Rueda de Casino verbindet Salsa mit Kommunikation, Dynamik und jeder Menge gemeinsamer Energie. Bei Midnight Havana gibt es Rueda-Kurse für unterschiedliche Erfahrungslevel — dieser Kurs ist für Einsteiger.',
        note: null,
        prerequisites: 'Sicherer Grundschritt der Salsa Cubana.',
        cta: 'Rueda de Casino entdecken',
    },
    'rueda-advanced': {
        name: 'Rueda de Casino Advanced',
        lead: 'Mehrere Paare tanzen gemeinsam im Kreis und wechseln auf Ansage Figuren und Partner.',
        body: 'Rueda de Casino verbindet Salsa mit Kommunikation, Dynamik und jeder Menge gemeinsamer Energie. Dieser Kurs richtet sich an Fortgeschrittene, die längere Ansagen und schnellere Wechsel tanzen möchten.',
        note: null,
        prerequisites:
            "Pa' dentro y pa' fuera, exhíbela, Lazo, dame, dame dos, directo, enchufla, (una arriba), Interior, La vecina.",
        cta: 'Rueda de Casino entdecken',
    },
};

/**
 * German copy. This object is the shape every other language must match.
 *
 * Text only. Dates, prices and addresses come from `src/data/site.ts` so a
 * change to a fact does not have to be made twice.
 */
export const de = {
    meta: {
        home: {
            title: 'Salsa Berlin | Salsa Cubana, Rueda & Social Dance | Midnight Havana',
            description:
                'Salsa Cubana & Rueda de Casino in Berlin-Kreuzberg. Salsa-Kurse ab 19 Uhr und Cuban Salsa Social ab 21 Uhr im Tangoloft. Kein Tanzpartner nötig.',
        },
        classes: {
            title: 'Salsa Kurs Berlin | Salsa Cubana & Rueda de Casino | Midnight Havana',
            description:
                'Salsa-Kurse in Berlin-Kreuzberg: Salsa Cubana Basics, Beginner und Rueda de Casino ab 19 Uhr im Tangoloft. Ohne Tanzpartner, Anfänger willkommen.',
        },
        party: {
            title: 'Salsa Party Berlin am Freitag | Cuban Salsa Social | Midnight Havana',
            description:
                'Cuban Salsa Party jeden Freitag in Berlin-Kreuzberg. Social Dance ab 21 Uhr im Tangoloft mit Salsa Cubana, Timba und Son. Kein Tanzpartner nötig.',
        },
        imprint: {
            title: 'Impressum | Midnight Havana',
            description: 'Anbieterkennzeichnung nach § 5 DDG für Midnight Havana, Berlin.',
        },
        privacy: {
            title: 'Datenschutzerklärung | Midnight Havana',
            description:
                'Wie Midnight Havana personenbezogene Daten verarbeitet: Hosting, Buchungen, Google Maps, Analyse und deine Rechte nach DSGVO.',
        },
        terms: {
            title: 'AGB | Midnight Havana',
            description:
                'Allgemeine Geschäftsbedingungen für Kurse, Social-Dance-Abende und Partys von Midnight Havana in Berlin.',
        },
        ogImageAlt: 'Tanzende auf der Tanzfläche bei Midnight Havana im Tangoloft Berlin',
    },

    nav: {
        home: 'Start',
        dates: 'Termine',
        party: 'Salsa Party',
        classes: 'Kurse',
        team: 'Team',
        venue: 'Location',
        faq: 'FAQ',
        book: 'Jetzt buchen',
        bookShort: 'Buchen',
        openMenu: 'Menü öffnen',
        closeMenu: 'Menü schließen',
        language: 'Sprache',
        skipToContent: 'Zum Inhalt springen',
        details: 'Details',
        instagram: 'Midnight Havana auf Instagram',
        whatsapp: 'WhatsApp-Community beitreten',
    },

    hero: {
        eyebrow: 'Midnight Havana · Salsa Friday',
        /** Sits above the headline and names the next night. */
        eyebrowNext: 'Nächster Salsa Friday',
        /** The practical line under the headline, from the artboard. */
        metaTimes: 'Kurse 19:00 & 20:00 · Party ab 21:00',
        metaPrices: 'Normalpreis 10 € · Studierende 8 € · Garderobe inklusive',
        metaVenue: 'Tangoloft · Pfuelstraße 5, Kreuzberg',
        headline: 'Salsa Cubana & Rueda de Casino in Berlin',
        tagline: 'Lerne Salsa. Triff Menschen. Tanz durch den Freitagabend.',
        body: 'Salsa-Kurse für Anfänger und Fortgeschrittene ab 19 Uhr. Ab 21 Uhr wird das Tangoloft zum Cuban Salsa Social mit Salsa Cubana, Timba und Son.',
        badges: ['Kein Tanzpartner nötig', 'Anfänger willkommen', 'Berlin-Kreuzberg'],
        ctaPrimary: 'Nächsten Termin ansehen',
        ctaSecondary: 'Kurse entdecken',
        scrollCue: 'Weiter zum nächsten Abschnitt',
        slideshowLabel: 'Eindrücke von Midnight Havana',
    },

    nextEvent: {
        eyebrow: 'Termine',
        headline: 'Dein Salsa-Freitag in Berlin',
        intro: 'Starte mit einem Kurs, lerne neue Leute kennen und probiere das Gelernte direkt auf der Tanzfläche aus. Oder komm einfach ab 21 Uhr zum Social Dance.',
        nextLabel: 'Nächster Termin',
        todayLabel: 'Heute Abend',
        classesAt: 'Uhr',
        socialDance: 'Cuban Salsa Social Dance',
        socialDanceFrom: 'ab 21:00 Uhr',
        arriveNote: 'Komm bitte etwa 10 Minuten vor Kursbeginn.',
        ctaClasses: 'Platz im Kurs sichern',
        ctaParty: 'Zur Salsa Party',
        details: 'Details zum Abend',
        bookOnPlatform: 'Buchen über Eversports',
        bookNote: 'Vorab buchen oder an der Abendkasse.',
        cancelled: 'Fällt aus',
        furtherDates: 'Weitere Termine',
        noEvent:
            'Der nächste Termin steht noch nicht fest. Neue Daten gibt es zuerst in der WhatsApp-Community und auf Instagram.',
        bookingFallbackNote:
            'Für diesen Termin sind die einzelnen Kurslinks noch nicht freigeschaltet. Der Button führt zur Kursübersicht bei Eversports.',
    },

    event: {
        backToDates: 'Alle Termine',
        eyebrow: 'Salsa Friday · Berlin-Kreuzberg',
        timetableHeading: 'Ablauf des Abends',
        doorsOpen: 'Einlass',
        doorsNote: 'Bezahlen, Schuhe wechseln, ankommen. Zum ersten Mal da? Sag Bescheid, wir zeigen dir den richtigen Raum.',
        socialNote: 'Kein Ticket nötig. Der Social Dance ist im Kurspreis enthalten.',
        bookHeading: 'Platz sichern',
        bookIntro: 'Jeder Kurs wird einzeln gebucht. Du kannst auch spontan an der Abendkasse bezahlen.',
        priceHeading: 'Eintritt',
        priceStandard: 'Normalpreis',
        priceReduced: 'Studierende & geringes Einkommen',
        priceIncluded: 'Kurs, Social Dance und Garderobe sind immer enthalten.',
        pricePayment: 'Bar oder Karte vor Ort, vorab über Eversports oder Urban Sports Club.',
        crewHeading: 'Wer da ist',
        teachersLabel: 'Unterricht',
        djLabel: 'Musik',
        whereHeading: 'Wo',
        otherDatesHeading: 'Du kannst nicht? Die nächsten Termine',
        allDates: 'Alle Termine',
        cancelledNote: 'Dieser Termin fällt aus. Der nächste reguläre Salsa Friday steht unten.',
        metaTitleSuffix: 'Salsa Friday in Berlin',
        addToCalendar: 'Zum Kalender hinzufügen',
    },

    party: {
        eyebrow: 'Social Dance',
        headline: 'Cuban Salsa Party am Freitag in Berlin',
        body1: 'Ab 21 Uhr gehört die Tanzfläche dem Social Dance. Freu dich auf Salsa Cubana, Timba, Son und weitere kubanische Sounds mit wechselnden DJs aus Berlin und internationalen Gästen.',
        body2: 'Du kannst vorher einen Kurs besuchen und direkt weitertanzen oder einfach ab 21 Uhr zur Party kommen.',
        highlight: 'Social Dance ab 21 Uhr · Kein Tanzpartner nötig',
        cta: 'Nächsten Salsa-Abend ansehen',
        more: {
            headline: 'Mehr als nur eine Salsa Party',
            intro: 'Midnight Havana verbindet Kurse, Social Dance und Community an einem Abend. Komm allein, mit Freunden oder als Paar, lerne neue Leute kennen und genieße einen Freitag, bei dem sich alles ums Tanzen dreht.',
            points: [
                {
                    title: 'Echter Social Dance',
                    body: 'Kein Clubabend mit ein bisschen Salsa nebenbei. Bei Midnight Havana stehen Tanzen, Musik und eine familiäre Atmosphäre im Mittelpunkt.',
                },
                {
                    title: 'Cuban Salsa im Fokus',
                    body: 'Salsa Cubana, Timba, Son und Rueda de Casino prägen den Sound und den Charakter unserer Abende.',
                },
                {
                    title: 'Anfänger willkommen',
                    body: 'Du bist neu bei Salsa? Kein Problem. Unsere Basics-Kurse machen den Einstieg einfach und danach kannst du das Gelernte direkt beim Social ausprobieren.',
                },
                {
                    title: 'Specials & internationale Gäste',
                    body: 'Shows, Workshops, Gastlehrer, internationale Tänzer und besondere Specials sorgen dafür, dass sich nicht jeder Freitag gleich anfühlt.',
                },
                {
                    title: 'Tangoloft Berlin',
                    body: 'Holzboden, großzügige Tanzfläche und eine besondere Atmosphäre in Berlin-Kreuzberg machen das Tangoloft zum Zuhause von Midnight Havana.',
                },
            ],
        },
    },

    classes: {
        eyebrow: 'Kurse',
        headline: 'Salsa-Kurse in Berlin',
        intro: 'Unsere Kurse richten sich an verschiedene Erfahrungsstufen, von kompletten Anfängern bis zu Tänzerinnen und Tänzern, die sich auf der Tanzfläche längst zu Hause fühlen. Einen Tanzpartner brauchst du nicht.',
        bookNote: 'Vorab buchen oder an der Abendkasse',
        priceNote:
            'Kurs und Party: Normalpreis 10 € · Studierende und geringes Einkommen 8 € · Garderobe inklusive',
        levelLabel: 'Level',
        timeLabel: 'Uhrzeit',
        prerequisitesLabel: 'Voraussetzungen',
        items: classCopy,
    },

    venue: {
        eyebrow: 'Location',
        headline: 'Salsa tanzen im Tangoloft Berlin',
        body1: 'Midnight Havana findet im Tangoloft in Berlin-Kreuzberg statt, nur wenige Minuten von der Spree und der East Side Gallery entfernt.',
        body2: 'Der große Holzboden bietet viel Platz zum Tanzen. Im Sommer gehört auch der Außenbereich am Wasser zur besonderen Atmosphäre der Location.',
        addressLabel: 'Adresse',
        directionsLabel: 'Anfahrt',
        transit: [
            'U1 / U3 Schlesisches Tor — 8 Minuten am Wasser entlang',
            'S- und U-Bahn Warschauer Straße',
        ],
        accessNote: 'Zweiter Hinterhof, dritter Stock. Ein Aufzug ist vorhanden.',
        goodToKnow: {
            heading: 'Gut zu wissen',
            shoeLead: 'Eine Sache mitbringen:',
            shoeStrong: 'saubere Hallenschuhe',
            shoeRest:
                '— keine Straßenschuhe auf dem Holzboden. Zieh sie am Eingang um. Glatte Sohlen drehen am besten, saubere Sneaker gehen für den Anfang auch.',
            items: [
                'Allein zu kommen ist völlig normal — die meisten tun es.',
                'Du kannst beim ersten Kurs erst von der Seite zuschauen.',
                'Es gibt einen Aufzug in den dritten Stock und eine Garderobe.',
                'An der Tür bar oder mit Karte, vorab über Eversports und Urban Sports Club.',
            ],
        },
        cta: 'Anfahrt ansehen',
        map: {
            heading: 'Karte',
            note: 'Die Karte kommt von Google Maps. Beim Laden werden Daten, unter anderem deine IP-Adresse, an Google übertragen.',
            load: 'Karte laden',
            loadOnce: 'Nur für diesen Besuch laden',
            title: 'Karte: Tangoloft Berlin, Pfuelstraße 5',
            privacyLink: 'Mehr dazu in der Datenschutzerklärung',
        },
    },

    team: {
        eyebrow: 'Unser Team',
        headline: 'Lerne Salsa mit unserem Team',
        intro1: 'Bei Midnight Havana unterrichten erfahrene Tänzerinnen und Tänzer mit unterschiedlichen Schwerpunkten in Salsa Cubana und Rueda de Casino.',
        intro2: 'Dabei geht es nicht nur darum, Figuren auswendig zu lernen. Wir wollen dir ein Gefühl für Rhythmus, Bewegung, Connection und gemeinsames Tanzen vermitteln.',
        mottoLabel: 'Motto',
        cta: 'Tanzschule kennenlernen',
        members: [
            {
                name: 'Helen',
                role: 'Salsa Cubana · Rueda de Casino',
                body: [
                    'Für Helen entsteht guter Salsa dort, wo Musikalität, Connection und gemeinsames Tanzen zusammenkommen.',
                    '2025 gewann sie gemeinsam mit Yago die Son Cubano Competition beim Guaguancó Festival. Ihr Tanz zeichnet sich durch Musikalität, Ausdruck und ein feines Gespür für die Verbindung zwischen zwei Menschen aus.',
                    'Bei Midnight Havana unterrichtet Helen Salsa Cubana und Rueda de Casino. In ihren Kursen geht es nicht nur darum, Figuren zu lernen, sondern die Musik bewusster wahrzunehmen, aufeinander zu reagieren und ein natürliches Gefühl für kubanische Salsa zu entwickeln.',
                ],
                motto: 'Musik hören. Connection spüren. Gemeinsam tanzen.',
            },
            {
                name: 'Yago',
                role: 'Salsa Cubana · Rueda de Casino',
                body: [
                    'Yago verbindet Salsa mit einem ausgeprägten Gefühl für Musik, Bewegung und Dynamik auf der Tanzfläche.',
                    '2025 gewann er gemeinsam mit Helen die Son Cubano Competition beim Guaguancó Festival. Sein Tanzstil ist musikalisch, klar und stark von kubanischer Bewegungskultur geprägt.',
                    'Bei Midnight Havana unterrichtet Yago Salsa Cubana und Rueda de Casino. Dabei geht es ihm um mehr als Figuren und Schrittfolgen: Rhythmus verstehen, sich natürlich zur Musik bewegen und wirklich miteinander tanzen.',
                ],
                motto: 'Musik verstehen. Bewegung fühlen. Gemeinsam tanzen.',
            },
            {
                name: 'Sassan',
                role: 'Rueda de Casino',
                body: [
                    'Sassan lebt Rueda de Casino und beschäftigt sich seit vielen Jahren intensiv damit, wie vielseitig, kreativ und spielerisch sie getanzt werden kann.',
                    'Als Teil der SalsaNor Rueda Family unterrichtet er regelmäßig beim internationalen SalsaNor Rueda Congress und bringt dort seine Erfahrung in Workshops für unterschiedliche Levels ein.',
                    'Bei Midnight Havana steht Sassan für fundierte Rueda-Technik, kreative Strukturen und die besondere Dynamik, die entsteht, wenn aus einzelnen Paaren eine gemeinsame Rueda wird. Dabei darf ausprobiert, gelacht und auch mal der Kopf gefordert werden.',
                ],
                motto: 'Rueda gemeinsam entdecken, spielen und weiterentwickeln.',
            },
        ],
    },

    reviews: {
        eyebrow: 'Community',
        headline: 'Was unsere Community sagt',
        intro: 'Stimmen von Gästen, die einen Freitag bei Midnight Havana verbracht haben.',
        sourceLabel: 'Quelle',
    },

    faq: {
        eyebrow: 'Häufige Fragen',
        headline: 'Häufige Fragen zu Midnight Havana',
        items: [
            {
                question: 'Brauche ich einen Tanzpartner?',
                answer: 'Nein. Du kannst problemlos alleine kommen. In den Kursen wechseln wir regelmäßig die Tanzpartner.',
            },
            {
                question: 'Kann ich teilnehmen, wenn ich noch nie Salsa getanzt habe?',
                answer: 'Ja. Der Salsa Cubana Basics Kurs richtet sich speziell an komplette Anfänger ohne Vorkenntnisse.',
            },
            {
                question: 'Kann ich nur zur Salsa Party kommen?',
                answer: 'Natürlich. Der Social Dance beginnt ab 21 Uhr und kann unabhängig von den Kursen besucht werden.',
            },
            {
                question: 'Muss ich einen Kurs vorher buchen?',
                answer: 'Wir empfehlen dir, deinen Platz vorher zu reservieren. So weißt du sicher, dass im gewünschten Kurs noch Platz ist.',
            },
            {
                question: 'Welche Musik wird gespielt?',
                answer: 'Der musikalische Schwerpunkt liegt auf Salsa Cubana, Timba und Son sowie weiteren kubanischen Sounds.',
            },
            {
                question: 'Wo findet Midnight Havana statt?',
                answer: 'Im Tangoloft Berlin, Pfuelstraße 5 in Berlin-Kreuzberg.',
            },
            {
                question: 'Wann sollte ich zum Kurs kommen?',
                answer: 'Am besten etwa 10 Minuten vor Kursbeginn, damit wir pünktlich gemeinsam starten können.',
            },
        ],
    },

    finalCta: {
        headline: 'Dein Freitag braucht mehr Salsa',
        body: 'Komm zum Kurs, bleib zum Social und entdecke die Berliner Cuban-Salsa-Community.',
        strap: 'Midnight Havana · Salsa Friday · Berlin',
        ctaDates: 'Nächsten Termin ansehen',
        ctaBook: 'Salsa-Kurs buchen',
        instagramLabel: 'Instagram',
        whatsappLabel: 'WhatsApp-Community',
    },

    footer: {
        tagline: 'Salsa Cubana · Rueda de Casino · Social Dance · Berlin',
        navHeading: 'Navigation',
        contactHeading: 'Kontakt',
        legalHeading: 'Rechtliches',
        contact: 'Kontakt',
        imprint: 'Impressum',
        privacy: 'Datenschutz',
        terms: 'AGB',
        cookieSettings: 'Cookie-Einstellungen',
        copyright: 'Midnight Havana · ein Geschäftsbereich von Kaizen Travel e.K.',
    },

    consent: {
        heading: 'Cookies und Reichweitenmessung',
        body: 'Wir würden gerne mit Google Analytics messen, welche Seiten besucht werden. Dafür werden Cookies gesetzt und Daten an Google übertragen. Notwendig ist das nicht — die Seite funktioniert auch ohne.',
        privacyLink: 'Datenschutzerklärung',
        accept: 'Einverstanden',
        reject: 'Nur notwendige',
        change: 'Du kannst deine Entscheidung jederzeit im Footer ändern.',
        settingsHeading: 'Deine Auswahl',
        currentAccepted: 'Aktuell: Analyse erlaubt.',
        currentRejected: 'Aktuell: nur notwendige Cookies.',
    },

    common: {
        ariaLanguageSwitch: 'Sprache wechseln',
        externalLink: 'Öffnet in einem neuen Tab',
        backToTop: 'Nach oben',
        clock: 'Uhr',
        and: 'und',
    },
};

export type Translation = typeof de;
