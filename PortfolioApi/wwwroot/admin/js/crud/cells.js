import { el } from '../../../js/core/dom.js';

/** Reusable table-cell renderers for resource configs. */

export const visibility = (item) =>
    el('span', { class: `pill ${item.isActive ? 'pill--on' : 'pill--off'}`, text: item.isActive ? 'Visible' : 'Hidden' });

export const monthYear = (value) => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null;

export function dateRange(start, end, { present = 'Present' } = {}) {
    const from = monthYear(start);
    const to = monthYear(end) ?? (start ? present : null);
    return from ? `${from} – ${to}` : (to ?? '—');
}

export const listSummary = (items, max = 3) => {
    if (!items?.length) return '—';
    const shown = items.slice(0, max).join(', ');
    return items.length > max ? `${shown} +${items.length - max}` : shown;
};

export function thumbnail(url) {
    return url
        ? el('img', { class: 'thumb', attrs: { src: url, alt: '', loading: 'lazy' } })
        : el('span', { class: 'thumb thumb--empty', text: '—' });
}

export function titleWithSub(title, sub) {
    return el('div', { class: 'cell-title' }, [el('strong', { text: title }), sub ? el('small', { text: sub }) : null]);
}
