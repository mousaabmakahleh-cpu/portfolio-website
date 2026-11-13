import { api } from '../core/api.js';
import { createExperienceItem } from '../components/experience-item.js';
import { observeReveal } from '../features/reveal.js';
import { setSectionVisible } from '../features/sections.js';

/** Experience timeline. The whole section (and its nav link) is hidden until there is data. */
export async function renderExperience(container = document.getElementById('experience-list')) {
    if (!container) return 0;
    try {
        const items = (await api.getExperience()) ?? [];
        container.replaceChildren(...items.map(createExperienceItem));
        setSectionVisible('experience', items.length > 0);
        observeReveal(container);
        return items.length;
    } catch {
        setSectionVisible('experience', false);
        return 0;
    }
}
