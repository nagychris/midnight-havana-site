/**
 * Browser code for the frame that shows an event as visitors will see it.
 *
 * The page inside is the real event page, so its links are real too. Followed
 * inside the frame they would lead away from the preview, to pages that may
 * not exist yet. Booking links still open, in a new tab, because checking them
 * is half the point of a preview; links within the page still scroll.
 */
export function guardFrameLinks(frame: HTMLIFrameElement): void {
    const guard = () => {
        const inner = frame.contentDocument;
        if (!inner) return;

        inner.addEventListener(
            'click',
            (event) => {
                const link = (event.target as Element | null)?.closest('a');
                if (!link) return;

                const target = new URL(link.href, inner.location.href);
                const staysOnPage =
                    target.pathname === inner.location.pathname && target.hash !== '';
                if (staysOnPage) return;

                if (target.origin !== inner.location.origin) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    return;
                }
                event.preventDefault();
            },
            true,
        );
    };

    frame.addEventListener('load', guard);
    if (frame.contentDocument?.readyState === 'complete') guard();
}

/** Loads the frame again and puts the reader back where they were. */
export function reloadKeepingPlace(frame: HTMLIFrameElement, url?: string): void {
    const inner = frame.contentWindow;
    const top = inner?.scrollY ?? 0;

    frame.addEventListener(
        'load',
        () => frame.contentWindow?.scrollTo({ top, behavior: 'instant' }),
        { once: true },
    );

    if (url && url !== frame.getAttribute('src')) frame.src = url;
    else inner?.location.reload();
}
