/**
 * Scroll-triggered reveal. Elements with `.reveal` get `.is-visible` once on screen.
 * `data-reveal-delay="n"` staggers them. Call observeReveal(root) for content added later.
 */
const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target;
            target.classList.add('is-visible');
            target.addEventListener('transitionend', function done(e) {
                if (e.target !== target || e.propertyName !== 'opacity') return;
                target.classList.add('reveal-done');
                target.removeEventListener('transitionend', done);
            });
            observer.unobserve(target);
        }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;

export function observeReveal(root = document) {
    for (const item of root.querySelectorAll('.reveal:not(.is-visible)')) {
        if (item.dataset.revealDelay) item.style.setProperty('--reveal-delay', item.dataset.revealDelay);
        if (observer) observer.observe(item);
        else item.classList.add('is-visible');
    }
}
