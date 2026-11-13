/**
 * Thin gradient bar at the top of the page showing reading progress.
 */
export function initScrollProgress(bar = document.getElementById('scroll-progress-bar')) {
    if (!bar) return;
    let ticking = false;

    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });
    update();
}
