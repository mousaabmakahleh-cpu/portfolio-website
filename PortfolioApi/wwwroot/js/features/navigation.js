/**
 * Header behaviour: condensed state on scroll, mobile menu, active-section highlighting.
 */
export function initNavigation() {
    const nav = document.getElementById('nav');
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('nav-toggle');
    const links = [...document.querySelectorAll('[data-nav-link]')];
    if (!nav || !menu || !toggle) return;

    // Condensed header once the page is scrolled
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    const setOpen = (open) => {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    links.forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });

    // Highlight the link of the section currently in view
    const byId = new Map(links.map(link => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            links.forEach(l => l.classList.remove('is-active'));
            byId.get(entry.target.id)?.classList.add('is-active');
        }
    }, { rootMargin: '-45% 0px -50% 0px' });

    byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
}
