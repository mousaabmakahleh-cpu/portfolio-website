/**
 * Tiny DOM helpers. All text goes through textContent, so API data can never inject HTML.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an element.
 * @param {string} tag
 * @param {{ class?: string, text?: string, attrs?: Record<string,string>, vars?: Record<string,string|number> }} [props]
 * @param {(Node|string|null|false|undefined)[]} [children]
 */
export function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    if (props.class) node.className = props.class;
    if (props.text != null) node.textContent = props.text;
    for (const [key, value] of Object.entries(props.attrs ?? {})) node.setAttribute(key, value);
    for (const [key, value] of Object.entries(props.vars ?? {})) node.style.setProperty(`--${key}`, String(value));
    for (const child of children) if (child) node.append(child);
    return node;
}

/** Reference an icon from the inline sprite in index.html. */
export function icon(name, className = 'icon') {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', `#i-${name}`);
    svg.append(use);
    return svg;
}

export const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
