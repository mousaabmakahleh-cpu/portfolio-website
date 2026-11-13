import { el, icon } from '../core/dom.js';

const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

/** Only allow absolute http(s) or site-relative URLs coming from the API. */
function safeUrl(value) {
    if (typeof value !== 'string' || value.trim() === '') return null;
    try {
        const url = new URL(value, window.location.origin);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    } catch {
        return null;
    }
}

/** Stable hue (0–359) derived from a string, so each project keeps its own colours. */
function hueFrom(text) {
    let hash = 0;
    for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
    return 200 + (hash % 140); // stay in the violet → cyan → pink range of the brand
}

function initials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('') || '•';
}

function renderMedia(project) {
    const imageUrl = safeUrl(project.imageUrl);
    const media = el('div', { class: 'project__media' });

    if (imageUrl) {
        const img = el('img', { attrs: { src: imageUrl, alt: '', loading: 'lazy', decoding: 'async' } });
        // Fall back to the generated cover if the image fails to load
        img.addEventListener('error', () => img.replaceWith(renderCover(project.name)), { once: true });
        media.append(img);
    } else {
        media.append(renderCover(project.name));
    }
    return media;
}

function renderCover(name) {
    return el('div', { class: 'project__cover', vars: { hue: hueFrom(name) }, attrs: { 'aria-hidden': 'true' } }, [
        el('span', { class: 'project__initials', text: initials(name) })
    ]);
}

/**
 * Builds one project card.
 * @param {{ name: string, description: string, imageUrl?: string, projectUrl?: string, createdAt: string }} project
 * @param {number} index position in the list (for the "01" label and stagger)
 */
export function createProjectCard(project, index) {
    const projectUrl = safeUrl(project.projectUrl);
    const created = new Date(project.createdAt);

    const meta = el('div', { class: 'project__meta' }, [
        el('span', { class: 'project__index', text: String(index + 1).padStart(2, '0') }),
        Number.isNaN(created.getTime())
            ? null
            : el('time', { text: dateFormat.format(created), attrs: { datetime: created.toISOString() } })
    ]);

    const link = projectUrl
        ? el('a', {
            class: 'project__link',
            text: 'View project',
            attrs: { href: projectUrl, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `View project: ${project.name}` }
        }, [icon('arrow-up-right')])
        : null;

    return el('article', {
        class: 'project card spotlight reveal',
        attrs: { 'data-reveal-delay': String(index % 3) }
    }, [
        renderMedia(project),
        el('div', { class: 'project__body' }, [
            meta,
            el('h3', { class: 'project__title', text: project.name }),
            el('p', { class: 'project__desc', text: project.description }),
            link
        ])
    ]);
}
