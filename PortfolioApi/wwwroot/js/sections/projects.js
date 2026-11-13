import { api } from '../core/api.js';
import { createProjectCard, PROJECT_STATUS } from '../components/project-card.js';
import { createSkeletons, createState } from '../components/feedback.js';
import { observeReveal } from '../features/reveal.js';
import { renderFilter } from '../features/filter.js';

/** Builds filter options for the statuses that actually occur, in a fixed order. */
function statusOptions(projects) {
    return Object.entries(PROJECT_STATUS)
        .map(([value, { label }]) => ({ value, label, count: projects.filter(p => p.status === value).length }))
        .filter(option => option.count > 0);
}

/**
 * Loads projects (already ordered by the API), renders cards and a status filter.
 * Resolves with the number of projects shown.
 */
export async function renderProjects(
    container = document.getElementById('projects-list'),
    filterBar = document.getElementById('projects-filter')
) {
    if (!container) return 0;
    container.replaceChildren(...createSkeletons(3, 'project-skeleton'));

    try {
        const projects = (await api.getProjects()) ?? [];
        if (projects.length === 0) {
            container.replaceChildren(createState('New projects are on the way — check back soon.'));
            if (filterBar) filterBar.hidden = true;
            return 0;
        }

        const cards = projects.map(createProjectCard);
        container.replaceChildren(...cards);
        observeReveal(container);

        renderFilter(filterBar, statusOptions(projects), (status) => {
            cards.forEach(card => { card.hidden = status !== 'all' && card.dataset.status !== status; });
        });
        return projects.length;
    } catch {
        container.replaceChildren(createState("Couldn't load projects right now. Please try again later.", 'zap'));
        if (filterBar) filterBar.hidden = true;
        return 0;
    } finally {
        container.setAttribute('aria-busy', 'false');
    }
}
