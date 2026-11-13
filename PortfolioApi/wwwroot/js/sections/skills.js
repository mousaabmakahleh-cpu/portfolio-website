import { api } from '../core/api.js';
import { createSkillGroup, SKILL_CATEGORIES } from '../components/skill-group.js';
import { createSkeletons, createState } from '../components/feedback.js';
import { observeReveal } from '../features/reveal.js';
import { renderFilter } from '../features/filter.js';

/** Groups skills by category in the fixed order Frontend → Backend → Database → UI/UX → Tools → others. */
function groupByCategory(skills) {
    const groups = new Map();
    for (const skill of skills) {
        const key = skill.category?.trim() || 'Other';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(skill);
    }

    const rank = (name) => {
        const index = SKILL_CATEGORIES.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
        return index === -1 ? SKILL_CATEGORIES.length : index;
    };
    return [...groups].sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));
}

/**
 * Loads skills and renders one card per category plus a category filter.
 * Resolves with the number of skills shown.
 */
export async function renderSkills(
    container = document.getElementById('skills-list'),
    filterBar = document.getElementById('skills-filter')
) {
    if (!container) return 0;
    container.replaceChildren(...createSkeletons(3, 'skill-skeleton'));

    try {
        const skills = (await api.getSkills()) ?? [];
        const groups = groupByCategory(skills);

        if (groups.length === 0) {
            container.replaceChildren(createState('Skills will be listed here soon.', 'code'));
            if (filterBar) filterBar.hidden = true;
            return 0;
        }

        const cards = groups.map(([category, items], i) => createSkillGroup(category, items, i));
        container.replaceChildren(...cards);
        observeReveal(container);

        renderFilter(filterBar, groups.map(([category, items]) => ({ value: category, label: category, count: items.length })), (category) => {
            cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
        });
        return skills.length;
    } catch {
        container.replaceChildren(createState("Couldn't load skills right now. Please try again later.", 'zap'));
        if (filterBar) filterBar.hidden = true;
        return 0;
    } finally {
        container.setAttribute('aria-busy', 'false');
    }
}
