import { el, icon } from '../core/dom.js';
import { dateRange, parseGpa } from '../core/format.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function svg(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    return node;
}

/** Circular GPA meter; falls back to a text badge for non-numeric grades. */
function renderGpa(text) {
    if (!text) return null;
    const gpa = parseGpa(text);

    if (!gpa) {
        return el('div', { class: 'gpa gpa--text' }, [
            el('span', { class: 'gpa__label', text: 'Grade' }),
            el('strong', { class: 'gpa__value', text })
        ]);
    }

    const ring = svg('svg', { class: 'gpa__ring', viewBox: '0 0 100 100', 'aria-hidden': 'true' });
    const gradient = svg('linearGradient', { id: 'gpa-gradient', x1: '0', y1: '0', x2: '1', y2: '1' });
    gradient.append(
        svg('stop', { offset: '0', 'stop-color': '#8b5cf6' }),
        svg('stop', { offset: '1', 'stop-color': '#22d3ee' }));
    const defs = svg('defs', {});
    defs.append(gradient);

    const track = svg('circle', { class: 'gpa__track', cx: 50, cy: 50, r: RADIUS });
    const bar = svg('circle', {
        class: 'gpa__bar', cx: 50, cy: 50, r: RADIUS,
        'stroke-dasharray': CIRCUMFERENCE.toFixed(2)
    });
    // The bar animates from empty to --gpa-offset when the card is revealed (see content.css)
    bar.style.setProperty('--gpa-full', CIRCUMFERENCE.toFixed(2));
    bar.style.setProperty('--gpa-offset', (CIRCUMFERENCE * (1 - gpa.ratio)).toFixed(2));
    ring.append(defs, track, bar);

    const scale = gpa.scale === 100 ? '%' : ` / ${gpa.scale}`;
    return el('div', { class: 'gpa', attrs: { role: 'img', 'aria-label': `GPA ${gpa.value}${scale}` } }, [
        ring,
        el('div', { class: 'gpa__center' }, [
            el('strong', { class: 'gpa__value', text: String(gpa.value) }),
            el('span', { class: 'gpa__label', text: gpa.scale === 100 ? '%' : `GPA / ${gpa.scale}` })
        ])
    ]);
}

/**
 * @param {{ institution: string, degree: string, fieldOfStudy?: string, location?: string,
 *           startDate?: string, endDate?: string, gpa?: string, description?: string, subjects: string[] }} item
 */
export function createEducationCard(item, index) {
    const title = item.fieldOfStudy ? `${item.degree} in ${item.fieldOfStudy}` : item.degree;
    const dates = dateRange(item.startDate, item.endDate, { present: 'Expected' });

    const meta = el('div', { class: 'edu__meta' }, [
        dates ? el('span', {}, [icon('calendar'), dates]) : null,
        item.location ? el('span', {}, [icon('pin'), item.location]) : null
    ]);

    const subjects = item.subjects?.length
        ? el('div', { class: 'edu__subjects' }, [
            el('span', { class: 'edu__subjects-label' }, [icon('book'), 'Key subjects']),
            el('ul', { class: 'tags' }, item.subjects.map(subject => el('li', { class: 'tag', text: subject })))
        ])
        : null;

    return el('article', {
        class: 'edu card spotlight reveal',
        attrs: { 'data-reveal-delay': String(index % 3) }
    }, [
        el('div', { class: 'edu__head' }, [
            el('span', { class: 'edu__icon' }, [icon('cap')]),
            el('div', { class: 'edu__titles' }, [
                el('p', { class: 'edu__school', text: item.institution }),
                el('h3', { class: 'edu__degree', text: title }),
                meta
            ]),
            renderGpa(item.gpa)
        ]),
        item.description ? el('p', { class: 'edu__desc', text: item.description }) : null,
        subjects
    ]);
}
