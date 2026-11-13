import { el, icon } from '../core/dom.js';

/** Display order and look for each skill category. Unknown categories go last. */
export const SKILL_CATEGORIES = [
    { name: 'Frontend', icon: 'layout', tone: 'front' },
    { name: 'Backend', icon: 'server', tone: 'back' },
    { name: 'Database', icon: 'database', tone: 'db' },
    { name: 'UI/UX', icon: 'pen', tone: 'ux' },
    { name: 'Tools', icon: 'tool', tone: 'tools' }
];

export function categoryInfo(name) {
    return SKILL_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase())
        ?? { name, icon: 'code', tone: 'tools' };
}

function clampLevel(level) {
    const value = Number(level);
    return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
}

function levelLabel(level) {
    if (level >= 85) return 'Advanced';
    if (level >= 65) return 'Proficient';
    if (level >= 40) return 'Intermediate';
    return 'Learning';
}

function createSkillRow(skill, index) {
    const level = clampLevel(skill.level);

    return el('li', { class: 'skill' }, [
        el('div', { class: 'skill__label' }, [
            el('span', { class: 'skill__name', text: skill.name }),
            el('span', { class: 'skill__level', text: `${levelLabel(level)} · ${level}%` })
        ]),
        el('div', {
            class: 'skill__bar',
            attrs: { role: 'progressbar', 'aria-label': skill.name, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(level) }
        }, [el('span', { class: 'skill__fill', vars: { level, i: index } })])
    ]);
}

/**
 * Card for one skill category.
 * @param {string} category
 * @param {{ name: string, level: number }[]} skills
 */
export function createSkillGroup(category, skills, index) {
    const info = categoryInfo(category);

    return el('article', {
        class: `skill-group card spotlight reveal skill-group--${info.tone}`,
        attrs: { 'data-reveal-delay': String(index % 3), 'data-category': category }
    }, [
        el('header', { class: 'skill-group__head' }, [
            el('span', { class: 'skill-group__icon' }, [icon(info.icon)]),
            el('h3', { class: 'skill-group__title', text: category }),
            el('span', { class: 'skill-group__count', text: `${skills.length} ${skills.length === 1 ? 'skill' : 'skills'}` })
        ]),
        el('ul', { class: 'skill-list' }, skills.map(createSkillRow))
    ]);
}
