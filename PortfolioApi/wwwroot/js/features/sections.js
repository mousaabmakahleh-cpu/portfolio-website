/**
 * Shows or hides a whole page section together with its navigation link,
 * so empty content (e.g. no experience yet) never leaves a blank area.
 */
export function setSectionVisible(id, visible) {
    const section = document.getElementById(id);
    if (section) section.hidden = !visible;
    document.querySelectorAll(`[data-nav-link][href="#${id}"]`).forEach(link => { link.hidden = !visible; });
}
