/**
 * Duplicates the marquee list so the CSS animation can loop seamlessly.
 */
export function initMarquee(track = document.getElementById('marquee-track')) {
    const list = track?.querySelector('.marquee__list');
    if (!list) return;
    const clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(clone);
}
