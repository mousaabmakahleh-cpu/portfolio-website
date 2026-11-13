/**
 * Only allow absolute http(s) or site-relative URLs coming from the API,
 * so stored data can never produce javascript: or data: links.
 */
export function safeUrl(value) {
    if (typeof value !== 'string' || value.trim() === '') return null;
    try {
        const url = new URL(value, window.location.origin);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    } catch {
        return null;
    }
}

/** Opens in a new tab only when the link leaves this site. */
export function linkAttrs(href) {
    const external = new URL(href).origin !== window.location.origin;
    return external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
}
