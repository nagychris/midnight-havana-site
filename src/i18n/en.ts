import type { ClassId } from '../data/classes';
import type { ClassCopy, Translation } from './de';

const classCopy: Record<ClassId, ClassCopy> = {
    'salsa-basics': {
        name: 'Cuban Salsa Basics',
        lead: 'Never danced salsa before, or want to start again from scratch?',
        body: 'In the Basics class you learn the core steps, a feeling for the rhythm and the first elements of Cuban Salsa. The class is built for complete beginners.',
        note: 'No previous experience required.',
        prerequisites: null,
        cta: 'Book salsa for beginners',
    },
    'salsa-beginner': {
        name: 'Cuban Salsa Beginner',
        lead: 'Already taken a few salsa classes and ready for the next step?',
        body: 'We build on the fundamentals and work on partnerwork, movement, timing and the elements that are typical of Cuban Salsa.',
        note: null,
        prerequisites: 'Basic step and dile que no, from two or three classes.',
        cta: 'Book Cuban Salsa Beginner',
    },
    'rueda-beginner': {
        name: 'Rueda de Casino Beginner',
        lead: 'Several couples dance together in a circle and switch figures and partners on a call.',
        body: 'Rueda de Casino combines salsa with communication, teamwork and plenty of shared energy. Midnight Havana runs Rueda classes for different experience levels — this one is for newcomers.',
        note: null,
        prerequisites: 'A confident Cuban Salsa basic step.',
        cta: 'Discover Rueda de Casino',
    },
    'rueda-advanced': {
        name: 'Rueda de Casino Advanced',
        lead: 'Several couples dance together in a circle and switch figures and partners on a call.',
        body: 'Rueda de Casino combines salsa with communication, teamwork and plenty of shared energy. This class is for advanced dancers who want longer calls and faster switches.',
        note: null,
        prerequisites:
            "Pa' dentro y pa' fuera, exhíbela, Lazo, dame, dame dos, directo, enchufla, (una arriba), Interior, La vecina.",
        cta: 'Discover Rueda de Casino',
    },
};

export const en: Translation = {
    meta: {
        home: {
            title: 'Salsa Berlin | Cuban Salsa, Rueda & Social Dance | Midnight Havana',
            description:
                'Cuban Salsa and Rueda de Casino in Berlin-Kreuzberg. Salsa classes from 7 PM and Cuban Salsa Social Dance from 9 PM at Tangoloft. No partner needed.',
        },
        classes: {
            title: 'Salsa Classes Berlin | Cuban Salsa & Rueda de Casino | Midnight Havana',
            description:
                'Salsa classes in Berlin-Kreuzberg: Cuban Salsa Basics, Beginner and Rueda de Casino from 7 PM at Tangoloft. No partner needed, beginners welcome.',
        },
        party: {
            title: 'Salsa Party Berlin on Friday | Cuban Salsa Social | Midnight Havana',
            description:
                'Cuban Salsa party every Friday in Berlin-Kreuzberg. Social dance from 9 PM at Tangoloft with Cuban Salsa, Timba and Son. No partner needed.',
        },
        imprint: {
            title: 'Imprint | Midnight Havana',
            description: 'Provider information for Midnight Havana, Berlin, as required by German law.',
        },
        privacy: {
            title: 'Privacy Policy | Midnight Havana',
            description:
                'How Midnight Havana processes personal data: hosting, bookings, Google Maps, analytics and your rights under the GDPR.',
        },
        terms: {
            title: 'Terms and Conditions | Midnight Havana',
            description:
                'Terms and conditions for classes, social dance nights and parties run by Midnight Havana in Berlin.',
        },
        ogImageAlt: 'Dancers on the floor at Midnight Havana in Tangoloft Berlin',
    },

    nav: {
        home: 'Home',
        dates: 'Dates',
        party: 'Salsa Party',
        classes: 'Classes',
        team: 'Team',
        venue: 'Venue',
        contact: 'Contact',
        faq: 'FAQ',
        book: 'Book now',
        bookShort: 'Book',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        language: 'Language',
        skipToContent: 'Skip to content',
        details: 'Details',
        instagram: 'Midnight Havana on Instagram',
        whatsapp: 'Join the WhatsApp community',
    },

    hero: {
        eyebrow: 'Midnight Havana · Salsa Friday',
        eyebrowDisplay: 'Salsa Friday · Tangoloft, Kreuzberg',
        eyebrowNext: 'Next Salsa Friday',
        metaTimes: 'Classes 19:00 & 20:00 · Social from 21:00',
        metaPrices: 'Regular 10 € · students 8 € · cloakroom included',
        metaVenue: 'Tangoloft · Pfuelstraße 5, Kreuzberg',
        headline: 'Cuban Salsa & Rueda de Casino in Berlin',
        tagline: 'Learn salsa. Meet people. Dance your way into the weekend.',
        badges: ['No partner needed', 'Beginners welcome'],
        ctaPrimary: 'See upcoming dates',
        ctaSecondary: 'Explore classes',
        scrollCue: 'Scroll to the next section',
        slideshowLabel: 'Impressions from Midnight Havana',
    },

    nextEvent: {
        eyebrow: 'Dates',
        headline: 'Your Salsa Friday in Berlin',
        intro: 'Start with a class, meet new people and put what you have learned straight into practice on the dance floor. Or simply join us from 21:00 for the Social Dance.',
        nextLabel: 'Next date',
        todayLabel: 'Tonight',
        classesAt: '',
        socialDance: 'Cuban Salsa Social Dance',
        socialDanceFrom: 'from 21:00',
        arriveNote: 'Please arrive around 10 minutes before your class starts.',
        ctaClasses: 'Book your class',
        ctaParty: 'Join the next salsa night',
        details: 'Details for this night',
        bookOnPlatform: 'Book through Eversports',
        bookNote: 'Book in advance or pay at the door.',
        cancelled: 'Cancelled',
        furtherDates: 'Further dates',
        noEvent:
            'The next date is not confirmed yet. New dates go out first in the WhatsApp community and on Instagram.',
        moreDates:
            'More dates to come. New dates go out first in the WhatsApp community and on Instagram.',
        bookingFallbackNote:
            'The individual class links for this date are not live yet. The button takes you to the class overview on Eversports.',
    },

    event: {
        backToDates: 'All dates',
        eyebrow: 'Salsa Friday · Berlin-Kreuzberg',
        timetableHeading: 'How the night runs',
        doorsOpen: 'Doors',
        doorsNote: 'Pay, change your shoes, settle in. First time here? Say so and we will point you to the right room.',
        socialNote: 'No ticket needed. The social dance is included in the class price.',
        bookHeading: 'Book a place',
        bookIntro: 'Each class is booked separately. You can also just turn up and pay at the door.',
        priceHeading: 'Admission',
        priceStandard: 'Standard',
        priceReduced: 'Students & people on a low income',
        priceIncluded: 'Class, social dance and cloakroom are always included.',
        pricePayment: 'Cash or card at the door, or in advance through Eversports or Urban Sports Club.',
        crewHeading: 'Who is there',
        teachersLabel: 'Teaching',
        djLabel: 'Music',
        whereHeading: 'Where',
        otherDatesHeading: 'Cannot make it? The next dates',
        allDates: 'All dates',
        cancelledNote: 'This date is cancelled. The next regular Salsa Friday is listed below.',
        metaTitleSuffix: 'Salsa Friday in Berlin',
        addToCalendar: 'Add to calendar',
    },

    party: {
        eyebrow: 'Social dance',
        headline: 'Cuban Salsa Party on Friday in Berlin',
        body1: 'From 21:00 the dance floor belongs to the social dance. Expect Cuban Salsa, Timba, Son and other Cuban sounds with changing DJs from Berlin and international guests.',
        body2: 'You can take a class beforehand and keep dancing, or simply turn up from 21:00 for the party.',
        highlight: 'Social dance from 21:00 · No partner needed',
        cta: 'See the next salsa night',
        more: {
            headline: 'More than just another salsa party',
            intro: 'Midnight Havana brings classes, social dancing and community together in one night. Come alone, with friends or as a couple, meet new people and spend a Friday where everything is about dancing.',
            points: [
                {
                    title: 'A real social dance',
                    body: 'This is not a club night with a little salsa on the side. At Midnight Havana the focus is on dancing, great music and a welcoming, familiar atmosphere.',
                },
                {
                    title: 'Cuban Salsa at the heart of the night',
                    body: 'Cuban Salsa, Timba, Son and Rueda de Casino shape the sound and the character of our nights.',
                },
                {
                    title: 'Beginners are welcome',
                    body: 'New to salsa? No problem. Our Basics class gives you an easy introduction, and afterwards you can try out your first moves during the social dance.',
                },
                {
                    title: 'Specials & international guests',
                    body: 'Shows, workshops, guest teachers, international dancers and special events make sure that not every Friday feels the same.',
                },
                {
                    title: 'Tangoloft Berlin',
                    body: 'A wooden floor, a generous dance space and a particular atmosphere in Berlin-Kreuzberg make Tangoloft the home of Midnight Havana.',
                },
            ],
        },
    },

    classes: {
        eyebrow: 'Classes',
        headline: 'Salsa Classes in Berlin',
        intro: 'Our classes are designed for different experience levels, from complete beginners to dancers who already feel at home on the dance floor. You do not need to bring a partner.',
        bookNote: 'Book in advance or pay at the door',
        priceNote:
            'Class and party: 10 € standard · 8 € for students and people on a low income · cloakroom included',
        levelLabel: 'Level',
        timeLabel: 'Time',
        prerequisitesLabel: 'Prerequisites',
        items: classCopy,
        bookAll: 'All classes on Eversports',
        finder: {
            title: 'Which class is mine?',
            question: 'Have you danced Cuban salsa before?',
            answers: {
                'salsa-basics': {
                    label: 'Never',
                    why: 'For complete beginners: the basic step, a feeling for the rhythm and the first elements of Cuban Salsa. No experience needed.',
                },
                'salsa-beginner': {
                    label: 'A few evenings',
                    why: 'You have taken a few classes already: partnerwork, movement, timing and the elements that are typical of Cuban Salsa.',
                },
                'rueda-beginner': {
                    label: 'I can already dance Rueda',
                    why: 'Calls, timing and switching partners in the circle. Got that down? Rueda Advanced at 20:00 is the next step.',
                },
                'rueda-advanced': {
                    label: 'I dance Rueda at an advanced level',
                    why: 'Long combinations, clean timing, pace. If the Rueda fundamentals are solid, this is your class.',
                },
            },
            resultLabel: 'Your class',
            nextOn: 'Next date:',
            bookThis: 'Book this class',
            seeNight: 'See how the night runs',
            optionalNote:
                'Booking is optional — you can also just turn up and pay at the door.',
            unsureStrong: 'Not sure?',
            unsureRest:
                'Arrive around 10 minutes before the class starts and ask at the door — we will find the right class for you.',
        },
    },

    venue: {
        eyebrow: 'Venue',
        headline: 'Dance Salsa at Tangoloft Berlin',
        body1: 'Midnight Havana takes place at Tangoloft in Berlin-Kreuzberg, just a few minutes from the Spree and the East Side Gallery.',
        body2: 'The large wooden floor gives you plenty of room to dance. In summer the outdoor area by the water adds something special to the evening.',
        addressLabel: 'Address',
        directionsLabel: 'Getting there',
        transit: [
            'U1 / U3 Schlesisches Tor — an 8 minute walk along the water',
            'S-Bahn and U-Bahn Warschauer Straße',
        ],
        accessLabel: 'How to find us',
        accessNote:
            'Ground floor in the rear courtyard: come in through the courtyard, then follow the signs to Midnight Havana.',
        goodToKnow: {
            heading: 'Good to know',
            shoeLead: 'One thing to bring:',
            shoeStrong: 'clean indoor shoes',
            shoeRest:
                '— no street shoes on the wooden floor. Change at the door. Smooth soles turn best, and clean trainers are fine to start with.',
            items: [
                'Coming alone is completely normal. Most people do.',
                'You can watch the first class from the side before joining in.',
                'There is a cloakroom for your things.',
                'Cash or card at the door, or book ahead via Eversports and Urban Sports Club.',
            ],
        },
        cta: 'Get directions',
        map: {
            heading: 'Map',
            note: 'The map comes from Google Maps. Loading it sends data, including your IP address, to Google.',
            load: 'Load map',
            loadOnce: 'Load for this visit only',
            title: 'Map: Tangoloft Berlin, Pfuelstraße 5',
            privacyLink: 'More about this in the privacy policy',
        },
    },

    team: {
        eyebrow: 'Our team',
        headline: 'Meet Our Salsa Teachers',
        intro1: 'At Midnight Havana you learn from experienced dancers with different specialities in Cuban Salsa and Rueda de Casino.',
        intro2: 'It is about more than memorising figures. We want to give you a feeling for rhythm, movement, connection and dancing together.',
        mottoLabel: 'Motto',
        cta: 'Meet the dance school',
        members: [
            {
                name: 'Helen',
                role: 'Cuban Salsa · Rueda de Casino',
                body: [
                    'For Helen, great salsa happens where musicality, connection and dancing together come naturally.',
                    'In 2025 she won the Son Cubano Competition at the Guaguancó Festival together with Yago. Her dancing is characterised by musicality, expression and a fine sense for the connection between two people.',
                    'At Midnight Havana, Helen teaches Cuban Salsa and Rueda de Casino. Her classes are not only about learning figures, but about hearing the music more consciously, reacting to each other and developing a natural feeling for Cuban salsa.',
                ],
                motto: 'Hear the music. Feel the connection. Dance together.',
            },
            {
                name: 'Yago',
                role: 'Cuban Salsa · Rueda de Casino',
                body: [
                    'Yago combines salsa with a strong sense of music, movement and dynamics on the dance floor.',
                    'In 2025 he won the Son Cubano Competition at the Guaguancó Festival together with Helen. His dancing is musical, clear and strongly influenced by Cuban movement culture.',
                    'At Midnight Havana, Yago teaches Cuban Salsa and Rueda de Casino. For him it goes beyond figures and step patterns: understanding rhythm, moving naturally to the music and really dancing with each other.',
                ],
                motto: 'Understand the music. Feel the movement. Dance together.',
            },
            {
                name: 'Sassan',
                role: 'Rueda de Casino',
                body: [
                    'Sassan lives and breathes Rueda de Casino and has spent many years exploring how versatile, creative and playful it can be.',
                    'As part of the SalsaNor Rueda Family he teaches regularly at the international SalsaNor Rueda Congress, bringing his experience to workshops for different levels.',
                    'At Midnight Havana, Sassan stands for solid Rueda technique, creative structures and the particular energy that appears when individual couples become one Rueda. Expect to experiment, laugh and occasionally give your brain a workout.',
                ],
                motto: 'Discover, play and develop Rueda together.',
            },
        ],
    },

    reviews: {
        eyebrow: 'Community',
        headline: 'What our community says',
        intro: 'Voices from guests who have spent a Friday at Midnight Havana.',
        sourceLabel: 'Source',
        community: {
            eyebrow: 'La comunidad',
            headline: ['Come for the music.', 'Stay for the people.'],
        },
    },

    contact: {
        eyebrow: 'Contact',
        headline: 'Write to us',
        intro: 'Got a question about one of the nights? Left something behind? Want to reserve a table or celebrate your birthday with us? Write to us directly — we would love to hear from you.',
        name: 'Name',
        phone: 'Phone',
        email: 'E-mail',
        message: 'Message',
        send: 'Send by e-mail',
        orWrite: 'Or write straight to',
        hint: 'Opens your e-mail app with your message to us.',
        subject: 'Enquiry from the website',
        privacyIntro:
            'By sending this you agree to your details being processed to answer your enquiry. More about that in the ',
        privacyLink: 'privacy policy',
    },

    faq: {
        eyebrow: 'Frequently asked',
        headline: 'Frequently Asked Questions',
        items: [
            {
                question: 'Do I need a dance partner?',
                answer: 'No. You are very welcome to come alone. Partners are changed regularly during the classes.',
            },
            {
                question: 'Can I join if I have never danced salsa before?',
                answer: 'Absolutely. Our Cuban Salsa Basics class is designed specifically for complete beginners.',
            },
            {
                question: 'Can I come only for the salsa party?',
                answer: 'Of course. The social dance starts at 21:00 and you can join without attending a class beforehand.',
            },
            {
                question: 'Do I need to book a class in advance?',
                answer: 'We recommend booking your spot in advance so you know there is still space in your preferred class.',
            },
            {
                question: 'What music do you play?',
                answer: 'The main focus is on Cuban Salsa, Timba and Son, together with other Cuban sounds.',
            },
            {
                question: 'Where does Midnight Havana take place?',
                answer: 'At Tangoloft Berlin, Pfuelstraße 5 in Berlin-Kreuzberg.',
            },
            {
                question: 'When should I arrive for a class?',
                answer: 'Around 10 minutes before the class starts, so we can begin together on time.',
            },
        ],
    },

    finalCta: {
        headline: 'Ready for your next Salsa Friday?',
        body: 'Come for a class, stay for the social dance and discover the Cuban salsa community in Berlin.',
        strap: 'Midnight Havana · Salsa Friday · Berlin',
        ctaDates: 'See upcoming dates',
        ctaBook: 'Book a class',
        instagramLabel: 'Instagram',
        whatsappLabel: 'WhatsApp community',
    },

    footer: {
        tagline: 'Cuban Salsa · Rueda de Casino · Social Dance · Berlin',
        navHeading: 'Navigation',
        contactHeading: 'Contact',
        legalHeading: 'Legal',
        contact: 'Contact',
        imprint: 'Imprint',
        privacy: 'Privacy',
        terms: 'Terms',
        cookieSettings: 'Cookie settings',
        copyright: 'Midnight Havana · a division of Kaizen Travel e.K.',
    },

    consent: {
        heading: 'Cookies and analytics',
        body: 'We would like to use Google Analytics to measure which pages people visit. That sets cookies and sends data to Google. It is not necessary — the site works without it.',
        privacyLink: 'Privacy policy',
        accept: 'Accept',
        reject: 'Necessary only',
        change: 'You can change your choice at any time from the footer.',
        settingsHeading: 'Your choice',
        currentAccepted: 'Currently: analytics allowed.',
        currentRejected: 'Currently: necessary cookies only.',
    },

    common: {
        ariaLanguageSwitch: 'Switch language',
        externalLink: 'Opens in a new tab',
        backToTop: 'Back to top',
        clock: '',
        and: 'and',
        lightbox: {
            open: 'View the photo full screen',
            close: 'Close',
            zoom: 'Zoom',
            previous: 'Previous photo',
            next: 'Next photo',
        },
    },
};
