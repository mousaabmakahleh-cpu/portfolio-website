import { prefersReducedMotion } from '../core/dom.js';

/**
 * Animates a number from 0 to `target` with an ease-out curve.
 */
export function animateCount(element, target, duration = 1400) {
    if (!element) return;
    if (prefersReducedMotion() || target <= 0) {
        element.textContent = String(target);
        return;
    }

    const start = performance.now();
    const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        element.textContent = String(Math.round(eased * target));
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
