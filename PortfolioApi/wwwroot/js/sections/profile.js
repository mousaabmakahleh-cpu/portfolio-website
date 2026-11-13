import { api } from '../core/api.js';
import { safeUrl } from '../core/url.js';
import { createConnectCard, createSocialIcon } from '../components/connect-card.js';
import { observeReveal } from '../features/reveal.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Turns the profile into the list of channels that are actually filled in. */
function toChannels(profile) {
    const channels = [];

    const github = safeUrl(profile.gitHubUrl);
    if (github) {
        const handle = new URL(github).pathname.replace(/^\/+|\/+$/g, '');
        channels.push({ href: github, label: 'GitHub', value: handle ? `@${handle}` : 'GitHub', iconName: 'github', tone: 'github', external: true });
    }

    const linkedin = safeUrl(profile.linkedInUrl);
    if (linkedin) {
        const handle = new URL(linkedin).pathname.split('/').filter(Boolean).pop();
        channels.push({ href: linkedin, label: 'LinkedIn', value: handle ? `in/${handle}` : 'LinkedIn', iconName: 'linkedin', tone: 'linkedin', external: true });
    }

    if (profile.email && EMAIL_PATTERN.test(profile.email)) {
        channels.push({ href: `mailto:${profile.email}`, label: 'Email', value: profile.email, iconName: 'mail', tone: 'mail' });
    }
    return channels;
}

/** Wires every [data-cv-link] / [data-cv-view] element and the CV banner to the uploaded CV. */
function applyCv(cvUrl) {
    const url = safeUrl(cvUrl);
    document.getElementById('cv-banner')?.toggleAttribute('hidden', !url);
    document.querySelectorAll('[data-cv-link], [data-cv-view]').forEach(link => {
        link.hidden = !url;
        if (url) link.href = url;
    });
}

/**
 * Loads the public profile and fills the CV buttons, the "Connect" cards and the social icons.
 */
export async function renderProfile() {
    let profile;
    try {
        profile = (await api.getProfile()) ?? {};
    } catch {
        profile = {};
    }

    applyCv(profile.cvUrl);

    const channels = toChannels(profile);
    const connect = document.getElementById('connect-list');
    if (connect) {
        connect.hidden = channels.length === 0;
        connect.replaceChildren(...channels.map(createConnectCard));
        observeReveal(connect);
    }

    document.querySelectorAll('[data-social-list]').forEach(list => {
        list.replaceChildren(...channels.map(createSocialIcon));
    });
}
