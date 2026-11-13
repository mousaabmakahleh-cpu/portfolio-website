import { el, icon } from '../core/dom.js';

/** Picks an icon for a category name; falls back to a generic code icon. */
function iconFor(category) {
    const name = category.toLowerCase();
    if (/front|ui|ux|design|web|css|html/.test(name)) return 'layout';
    if (/back|server|api|\.net|c#/.test(name)) return 'server';
    if (/data|sql|db|postgres/.test(name)) return 'database';
    if (/secur|auth/.test(name)) return 'shield';
    if (/tool|devops|cloud/.test(name)) return 'zap';
    return 'code';
}

function clampLevel(level) {
    const value = Number(level);
    return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
}

function createSkillRow(skill, index) {
    const level = clampLevel(skill.level);

    return el('li', { class: 'skill' }, [
        el('div', { class: 'skill__label' }, [
            el('span', { text: skill.name }),
            el('span', { class: 'skill__level', text: `${level}%` })
        ]),
        el('div', {
            class: 'skill__bar',
            attrs: {
                role: 'progressbar',
                'aria-label': skill.name,
                'aria-valuemin': '0',
                'aria-valuemax': '100',
                'aria-valuenow': String(level)
            }
        }, [
            el('span', { class: 'skill__fill', vars: { level, i: index } })
        ])
    ]);
}

/**
 * Builds a card for one skill category.
 * @param {string} category
 * @param {{ name: string, level: number }[]} skills
 * @param {number} index
 */
export function createSkillGroup(category, skills, index) {
    return el('article', {
        class: 'skill-group card spotlight reveal',
        attrs: { 'data-reveal-delay': String(index % 3) }
    }, [
        el('header', { class: 'skill-group__head' }, [
            el('span', { class: 'skill-group__icon' }, [icon(iconFor(category))]),
            el('h3', { class: 'skill-group__title', text: category }),
            el('span', { class: 'skill-group__count', text: String(skills.length) })
        ]),
        el('ul', { class: 'skill-list' }, skills.map(createSkillRow))
    ]);
}
