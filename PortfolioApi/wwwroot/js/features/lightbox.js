/**
 * Full-size image viewer built on <dialog>. Any element with
 * data-lightbox="<image url>" (and optional data-lightbox-caption) opens it.
 */
export function initLightbox() {
    const dialog = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    if (!dialog || !image) return;

    document.addEventListener('click', (event) => {
        const trigger = event.target instanceof Element ? event.target.closest('[data-lightbox]') : null;
        if (!trigger) return;
        event.preventDefault();

        image.src = trigger.dataset.lightbox;
        image.alt = trigger.dataset.lightboxCaption ?? '';
        caption.textContent = trigger.dataset.lightboxCaption ?? '';
        dialog.showModal();
    });

    // Clicking the dark backdrop (outside the figure) closes the viewer
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', () => { image.removeAttribute('src'); });
}
