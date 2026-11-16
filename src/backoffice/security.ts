/**
 * Fits the site's Content Security Policy to the back office.
 *
 * The public pages forbid forms from posting anywhere and only allow Google
 * Maps in a frame. The back office is made of forms and shows the preview in a
 * frame, so on its pages both are allowed for the site itself, and nothing
 * else changes. Astro sends the policy of a server-rendered page as a header,
 * which is why it can be adjusted here.
 */
export function adjustPolicy(policy: string): string {
    const directives = policy
        .split(';')
        .map((directive) => directive.trim())
        .filter((directive) => directive !== '');

    let hasFormAction = false;
    let hasFrameSrc = false;

    const adjusted = directives.map((directive) => {
        const [name, ...sources] = directive.split(/\s+/);
        if (name === 'form-action') {
            hasFormAction = true;
            return "form-action 'self'";
        }
        if (name === 'frame-src') {
            hasFrameSrc = true;
            const kept = sources.filter((source) => source !== "'none'" && source !== "'self'");
            return ["frame-src 'self'", ...kept].join(' ');
        }
        return directive;
    });

    if (!hasFormAction) adjusted.push("form-action 'self'");
    if (!hasFrameSrc) adjusted.push("frame-src 'self'");
    return `${adjusted.join('; ')};`;
}
