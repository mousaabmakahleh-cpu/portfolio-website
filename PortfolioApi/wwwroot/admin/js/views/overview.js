import { el } from '../../../js/core/dom.js';
import { http } from '../core/http.js';

/** Dashboard home: visit statistics and content counts. */
export function createOverviewView() {
    const tiles = [
        { key: 'total', label: 'Total visits' },
        { key: 'today', label: 'Visits today' },
        { key: 'lastWeek', label: 'Last 7 days' },
        { key: 'unread', label: 'Unread messages' },
        { key: 'projects', label: 'Projects' },
        { key: 'skills', label: 'Skills' },
        { key: 'experience', label: 'Experience entries' },
        { key: 'certifications', label: 'Certifications' }
    ];
    const values = new Map(tiles.map(tile => [tile.key, el('span', { class: 'tile__value', text: '–' })]));

    const root = el('section', { class: 'view' }, [
        el('header', { class: 'view__head' }, [
            el('div', {}, [el('h2', { text: 'Overview' }), el('p', { class: 'muted', text: 'A quick look at your portfolio.' })])
        ]),
        el('div', { class: 'tiles' }, tiles.map(tile =>
            el('div', { class: 'tile' }, [values.get(tile.key), el('span', { class: 'tile__label', text: tile.label })])))
    ]);

    const set = (key, value) => { values.get(key).textContent = String(value); };
    const countOf = (url) => http.get(url).then(items => items.length).catch(() => '–');

    async function load() {
        const [stats, messages, projects, skills, experience, certifications] = await Promise.all([
            http.get('/api/visits/stats').catch(() => null),
            http.get('/api/messages').catch(() => null),
            countOf('/api/projects/all'),
            countOf('/api/skills/all'),
            countOf('/api/experience/all'),
            countOf('/api/certifications/all')
        ]);
        set('total', stats?.total ?? '–');
        set('today', stats?.today ?? '–');
        set('lastWeek', stats?.lastWeek ?? '–');
        set('unread', messages ? messages.filter(m => !m.isRead).length : '–');
        set('projects', projects);
        set('skills', skills);
        set('experience', experience);
        set('certifications', certifications);
    }

    return { root, load };
}
