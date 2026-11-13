import { api } from '../core/api.js';
import { createCertificateCard } from '../components/certificate-card.js';
import { observeReveal } from '../features/reveal.js';
import { setSectionVisible } from '../features/sections.js';

/** Certificate grid. Hidden (with its nav link) when there are no certificates. */
export async function renderCertifications(container = document.getElementById('certifications-list')) {
    if (!container) return 0;
    try {
        const items = (await api.getCertifications()) ?? [];
        container.replaceChildren(...items.map(createCertificateCard));
        setSectionVisible('certifications', items.length > 0);
        observeReveal(container);
        return items.length;
    } catch {
        setSectionVisible('certifications', false);
        return 0;
    }
}
