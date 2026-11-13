import { api } from '../core/api.js';
import { createProjectCard } from '../components/project-card.js';
import { createSkeletons, createState } from '../components/feedback.js';
import { observeReveal } from '../features/reveal.js';

/**
 * Loads projects from the API and renders them. Resolves with the number of projects shown.
 */
export async function renderProjects(container = document.getElementById('projects-list')) {
    if (!container) return 0;
    container.replaceChildren(...createSkeletons(3, 'project-skeleton'));

    try {
        const projects = (await api.getProjects()) ?? [];
        projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        container.replaceChildren(
            ...(projects.length
                ? projects.map(createProjectCard)
                : [createState('New projects are on the way — check back soon.')])
        );
        observeReveal(container);
        return projects.length;
    } catch {
        container.replaceChildren(createState("Couldn't load projects right now. Please try again later.", 'zap'));
        return 0;
    } finally {
        container.setAttribute('aria-busy', 'false');
    }
}
