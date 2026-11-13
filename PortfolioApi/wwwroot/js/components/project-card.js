import { el, icon } from '../core/dom.js';
import { monthYear } from '../core/format.js';
import { safeUrl } from '../core/url.js';

export const PROJECT_STATUS = {
    Completed: { label: 'Completed', className: 'status--done' },
    InProgress: { label: 'In progress', className: 'status--progress' },
    Planned: { label: 'Planned', className: 'status--planned' }
};

const VISIBLE_FEATURES = 4;

/** Stable hue derived from the project name so each fallback cover keeps its colours. */
function hueFrom(text) {
    let hash = 0;
    for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
    return 220 + (hash % 100); // indigo → violet → pink, matching the brand
}

function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('') || '•';
}

function renderCover(name) {
    return el('div', { class: 'project__cover', vars: { hue: hueFrom(name) }, attrs: { 'aria-hidden': 'true' } }, [
        el('span', { class: 'project__initials', text: initials(name) })
    ]);
}

/** Screenshot inside a faux browser window; click opens it full size. */
function renderMedia(project) {
    const image = safeUrl(project.imageUrl);
    const status = PROJECT_STATUS[project.status] ?? PROJECT_STATUS.Completed;

    let screen;
    if (image) {
        const img = el('img', { attrs: { src: image, alt: `${project.name} home page`, loading: 'lazy', decoding: 'async' } });
        img.addEventListener('error', () => screen.replaceWith(renderCover(project.name)), { once: true });
        screen = el('button', {
            class: 'project__shot',
            attrs: { type: 'button', 'data-lightbox': image, 'data-lightbox-caption': project.name, 'aria-label': `View screenshot of ${project.name}` }
        }, [img]);
    } else {
        screen = renderCover(project.name);
    }

    return el('div', { class: 'project__media' }, [
        el('div', { class: 'project__browser', attrs: { 'aria-hidden': 'true' } }, [el('i'), el('i'), el('i')]),
        el('div', { class: 'project__screen' }, [screen]),
        el('span', { class: `status ${status.className}`, text: status.label })
    ]);
}

function renderFeatures(features = []) {
    if (!features.length) return null;
    const item = (text) => el('li', {}, [icon('check'), el('span', { text })]);

    const list = el('ul', { class: 'checklist checklist--compact' }, features.slice(0, VISIBLE_FEATURES).map(item));
    if (features.length <= VISIBLE_FEATURES) return el('div', { class: 'project__features' }, [list]);

    const more = el('details', { class: 'project__more' }, [
        el('summary', { text: `+ ${features.length - VISIBLE_FEATURES} more features` }),
        el('ul', { class: 'checklist checklist--compact' }, features.slice(VISIBLE_FEATURES).map(item))
    ]);
    return el('div', { class: 'project__features' }, [list, more]);
}

function renderLinks(project) {
    const links = [
        { url: project.frontendRepoUrl, label: 'Frontend', iconName: 'github' },
        { url: project.backendRepoUrl, label: 'Backend', iconName: 'github' },
        {
            url: project.projectUrl,
            label: /github\.com/i.test(project.projectUrl ?? '') ? 'Repository' : 'Live demo',
            iconName: /github\.com/i.test(project.projectUrl ?? '') ? 'github' : 'globe'
        }
    ]
        .map(link => ({ ...link, url: safeUrl(link.url) }))
        // A bare "https://github.com" is a placeholder, not a real repository
        .filter(link => link.url && !/^https?:\/\/(www\.)?github\.com\/?$/i.test(link.url));

    if (!links.length) return null;
    return el('div', { class: 'project__links' }, links.map(link =>
        el('a', {
            class: 'project__link',
            attrs: { href: link.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${link.label}: ${project.name}` }
        }, [icon(link.iconName), link.label, icon('arrow-up-right', 'icon icon--sm')])));
}

/**
 * @param {{ name: string, description: string, imageUrl?: string, projectUrl?: string, frontendRepoUrl?: string,
 *           backendRepoUrl?: string, status: string, features: string[], technologies: string[], createdAt: string }} project
 */
export function createProjectCard(project, index) {
    const created = monthYear(project.createdAt);

    return el('article', {
        class: 'project card spotlight reveal',
        attrs: { 'data-reveal-delay': String(index % 3), 'data-status': project.status }
    }, [
        renderMedia(project),
        el('div', { class: 'project__body' }, [
            el('div', { class: 'project__meta' }, [
                el('span', { class: 'project__index', text: String(index + 1).padStart(2, '0') }),
                created ? el('time', { text: created }) : null
            ]),
            el('h3', { class: 'project__title', text: project.name }),
            el('p', { class: 'project__desc', text: project.description }),
            renderFeatures(project.features),
            project.technologies?.length
                ? el('ul', { class: 'tags' }, project.technologies.map(tech => el('li', { class: 'tag', text: tech })))
                : null,
            renderLinks(project)
        ])
    ]);
}
