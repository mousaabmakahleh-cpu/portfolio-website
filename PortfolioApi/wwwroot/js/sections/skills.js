import { api } from '../core/api.js';
import { createSkillGroup } from '../components/skill-group.js';
import { createSkeletons, createState } from '../components/feedback.js';
import { observeReveal } from '../features/reveal.js';

/** Groups skills by category, preserving the API's order. */
function groupByCategory(skills) {
    const groups = new Map();
    for (const skill of skills) {
        const key = skill.category?.trim() || 'Other';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(skill);
    }
    return groups;
}

/**
 * Loads skills from the API and renders them grouped by category.
 * Resolves with the number of skills shown.
 */
export async function renderSkills(container = document.getElementById('skills-list')) {
    if (!container) return 0;
    container.replaceChildren(...createSkeletons(3, 'skill-skeleton'));

    try {
        const skills = (await api.getSkills()) ?? [];
        const groups = [...groupByCategory(skills)];

        container.replaceChildren(
            ...(groups.length
                ? groups.map(([category, items], i) => createSkillGroup(category, items, i))
                : [createState('Skills will be listed here soon.', 'code')])
        );
        observeReveal(container);
        return skills.length;
    } catch {
        container.replaceChildren(createState("Couldn't load skills right now. Please try again later.", 'zap'));
        return 0;
    } finally {
        container.setAttribute('aria-busy', 'false');
    }
}
