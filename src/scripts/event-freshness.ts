/**
 * Keeps past dates off the page between builds.
 *
 * The site is generated ahead of time, so its idea of "today" is the build
 * date. A nightly rebuild keeps that fresh, but a build can be skipped or a
 * page can sit in a cache, and a visitor must never be shown a night that has
 * already happened. This runs in the browser, checks each card against the
 * real date in Berlin, hides the ones that have passed and promotes the first
 * remaining date to be the next one.
 */

const BERLIN_TIME_ZONE = 'Europe/Berlin';

/** Today in Berlin as YYYY-MM-DD, whatever time zone the visitor is in. */
function todayInBerlin(): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: BERLIN_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}

function setNext(card: HTMLElement, isNext: boolean): void {
    card.dataset.next = String(isNext);
    if (card instanceof HTMLDetailsElement) {
        card.open = isNext;
    }
}

/**
 * Hides anything dated before today and returns what is left, in order.
 *
 * `keepHidden` leaves the surviving elements hidden for the caller to reveal,
 * which the hero needs because only its first strip is ever shown.
 */
function showOnlyUpcoming(
    elements: HTMLElement[],
    today: string,
    keepHidden = false,
): HTMLElement[] {
    const upcoming: HTMLElement[] = [];

    for (const element of elements) {
        const date = element.dataset.eventDate ?? '';
        const isPast = date < today;
        if (isPast) {
            element.hidden = true;
            continue;
        }
        if (!keepHidden) element.hidden = false;
        upcoming.push(element);
    }
    return upcoming;
}

/**
 * Keeps the small "next date" markers honest: the header chip and the booking
 * bar at the foot of the screen.
 *
 * Both are rendered from the build date and both say whether the night is
 * tonight, so both have to be checked against the real date in Berlin. A marker
 * for a date that has already passed is removed rather than corrected, because
 * there is nothing sensible left for it to say.
 */
export function refreshEventBadges(): void {
    const today = todayInBerlin();

    const badges = document.querySelectorAll<HTMLElement>('[data-event-when]');
    for (const badge of badges) {
        const date = badge.dataset.eventDate ?? '';
        if (date < today) {
            badge.remove();
            continue;
        }
        badge.dataset.today = String(date === today);
    }
}

export function refreshEventDates(): void {
    const today = todayInBerlin();

    const cards = Array.from(
        document.querySelectorAll<HTMLElement>('[data-event-card]'),
    );
    const upcoming = showOnlyUpcoming(cards, today);
    upcoming.forEach((card, index) => setNext(card, index === 0));

    // The hero shows the same next date, so it has to move at the same moment.
    const heroDates = Array.from(
        document.querySelectorAll<HTMLElement>('[data-hero-date]'),
    );
    const upcomingHero = showOnlyUpcoming(heroDates, today, true);
    upcomingHero.forEach((strip, index) => {
        strip.hidden = index !== 0;
    });

    if (cards.length === 0) return;

    // When every date on the page has passed, show the "no date yet" note
    // instead of an empty section.
    const emptyState = document.querySelector<HTMLElement>('[data-events-empty]');
    if (emptyState) emptyState.hidden = upcoming.length > 0;

    // The list itself and the note under it both belong to the "there are
    // dates" state, so they are marked the same way and hidden together.
    const list = document.querySelectorAll<HTMLElement>('[data-events-list]');
    for (const element of list) {
        element.hidden = upcoming.length === 0;
    }
}
