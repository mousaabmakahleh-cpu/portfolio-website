import { prefersReducedMotion } from '../core/dom.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Deletes and re-types a rotating list of phrases inside `target`.
 * Starts from whatever text is already rendered (phrases[0]).
 */
export function initTypewriter(target, phrases, { typeMs = 70, deleteMs = 35, holdMs = 2000 } = {}) {
    if (!target || phrases.length < 2 || prefersReducedMotion()) return;

    let index = 0;

    (async function loop() {
        for (;;) {
            await sleep(holdMs);

            const current = phrases[index];
            for (let i = current.length; i >= 0; i--) {
                target.textContent = current.slice(0, i);
                await sleep(deleteMs);
            }

            index = (index + 1) % phrases.length;
            const next = phrases[index];
            for (let i = 1; i <= next.length; i++) {
                target.textContent = next.slice(0, i);
                await sleep(typeMs);
            }
        }
    })();
}
