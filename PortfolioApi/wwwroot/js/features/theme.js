import { local } from '../core/storage.js';

/**
 * Light / dark theme toggle. The initial theme is applied by theme-init.js before paint;
 * this module only handles switching and persisting.
 */
export function initTheme(button = document.getElementById('theme-toggle')) {
    if (!button) return;
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    const sync = () => {
        const isLight = root.dataset.theme === 'light';
        button.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        meta?.setAttribute('content', isLight ? '#f7f7fb' : '#07070d');
    };

    button.addEventListener('click', () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';
        const apply = () => {
            root.dataset.theme = next;
            sync();
        };
        // Smooth cross-fade where the View Transitions API is supported
        if (document.startViewTransition) document.startViewTransition(apply);
        else apply();
        local.set('theme', next);
    });

    sync();
}
