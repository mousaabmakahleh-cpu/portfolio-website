/**
 * Admin entry point: login, sidebar routing (by URL hash) and view registry.
 */
import { el } from '../../js/core/dom.js';
import { auth } from './core/auth.js';
import { login } from './core/http.js';
import { createResourceView } from './crud/resource-view.js';
import { createOverviewView } from './views/overview.js';
import { createProfileView } from './views/profile.js';
import { createMessagesView } from './views/messages.js';
import { education } from './resources/education.js';
import { experience } from './resources/experience.js';
import { skills } from './resources/skills.js';
import { projects } from './resources/projects.js';
import { certifications } from './resources/certifications.js';

const VIEWS = [
    { id: 'overview', label: 'Overview', create: createOverviewView },
    { id: 'profile', label: 'Profile & CV', create: createProfileView },
    { id: 'education', label: 'Education', create: () => createResourceView(education) },
    { id: 'experience', label: 'Experience', create: () => createResourceView(experience) },
    { id: 'skills', label: 'Skills', create: () => createResourceView(skills) },
    { id: 'projects', label: 'Projects', create: () => createResourceView(projects) },
    { id: 'certifications', label: 'Certifications', create: () => createResourceView(certifications) },
    { id: 'messages', label: 'Messages', create: createMessagesView }
];

const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const content = document.getElementById('content');
const nav = document.getElementById('sidebar-nav');
const instances = new Map();

function currentViewId() {
    const id = location.hash.slice(1);
    return VIEWS.some(view => view.id === id) ? id : 'overview';
}

function showView() {
    const id = currentViewId();
    const definition = VIEWS.find(view => view.id === id);

    if (!instances.has(id)) instances.set(id, definition.create());
    const view = instances.get(id);

    content.replaceChildren(view.root);
    view.load();
    content.focus({ preventScroll: true });
    window.scrollTo(0, 0);

    nav.querySelectorAll('a').forEach(link =>
        link.setAttribute('aria-current', link.hash === `#${id}` ? 'page' : 'false'));
}

function showDashboard(loggedIn) {
    loginView.hidden = loggedIn;
    dashboardView.hidden = !loggedIn;
    if (loggedIn) showView();
    else instances.clear();
}

function initLogin() {
    const form = document.getElementById('login-form');
    const status = document.getElementById('login-status');
    const button = form.querySelector('button');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        button.disabled = true;
        status.textContent = 'Signing in…';
        try {
            const token = await login(
                document.getElementById('login-username').value.trim(),
                document.getElementById('login-password').value);
            auth.signIn(token);
            form.reset();
            status.textContent = '';
            showDashboard(true);
        } catch (error) {
            status.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    });
}

nav.append(...VIEWS.map(view => el('a', { class: 'sidebar__link', text: view.label, attrs: { href: `#${view.id}` } })));
window.addEventListener('hashchange', () => { if (auth.isLoggedIn) showView(); });
document.getElementById('logout-button').addEventListener('click', () => auth.signOut());
auth.onSignOut(() => showDashboard(false));

initLogin();
showDashboard(auth.isLoggedIn);
