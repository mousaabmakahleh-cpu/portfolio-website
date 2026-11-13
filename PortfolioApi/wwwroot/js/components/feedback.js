import { el, icon } from '../core/dom.js';

/** Placeholder cards shown while data loads. */
export function createSkeletons(count, className) {
    return Array.from({ length: count }, () =>
        el('div', { class: `skeleton ${className}`, attrs: { 'aria-hidden': 'true' } }));
}

/** Empty / error message that spans the whole grid. */
export function createState(message, iconName = 'folder') {
    return el('div', { class: 'state' }, [icon(iconName), el('p', { text: message })]);
}
