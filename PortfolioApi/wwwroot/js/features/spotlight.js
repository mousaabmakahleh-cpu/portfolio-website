/**
 * Pointer-following glow for any `.spotlight` element (one delegated listener).
 */
export function initSpotlight() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.addEventListener('pointermove', (event) => {
        const card = event.target instanceof Element ? event.target.closest('.spotlight') : null;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }, { passive: true });
}
