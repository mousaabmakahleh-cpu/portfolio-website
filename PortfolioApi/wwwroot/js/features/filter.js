import { el } from '../core/dom.js';

/**
 * Renders a row of filter chips ("All" + one per option) and reports the selected value.
 * @param {HTMLElement} container
 * @param {{ value: string, label: string, count?: number }[]} options
 * @param {(value: string) => void} onChange  receives 'all' or an option value
 */
export function renderFilter(container, options, onChange) {
    if (!container) return;
    if (options.length < 2) {
        container.hidden = true;
        return;
    }

    const total = options.reduce((sum, option) => sum + (option.count ?? 0), 0);
    const all = [{ value: 'all', label: 'All', count: total }, ...options];

    const buttons = all.map(option => {
        const button = el('button', {
            class: 'filter__chip',
            attrs: { type: 'button', 'aria-pressed': String(option.value === 'all') }
        }, [
            option.label,
            option.count != null ? el('span', { class: 'filter__count', text: String(option.count) }) : null
        ]);
        button.addEventListener('click', () => {
            buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
            onChange(option.value);
        });
        return button;
    });

    container.hidden = false;
    container.replaceChildren(...buttons);
}
