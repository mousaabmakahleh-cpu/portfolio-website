import { api } from '../core/api.js';
import { createEducationCard } from '../components/education-card.js';
import { observeReveal } from '../features/reveal.js';

/** Renders education cards inside the About section. Hidden entirely when there are none. */
export async function renderEducation(container = document.getElementById('education-list')) {
    if (!container) return 0;
    try {
        const items = (await api.getEducation()) ?? [];
        container.hidden = items.length === 0;
        container.replaceChildren(...items.map(createEducationCard));
        observeReveal(container);
        return items.length;
    } catch {
        container.hidden = true;
        return 0;
    }
}
