/**
 * Small shared UI services for the dashboard: toast messages and a confirm dialog.
 */
let toastTimer;

export function toast(message, kind = 'success') {
    const node = document.getElementById('toast');
    node.textContent = message;
    node.dataset.kind = kind;
    node.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('is-visible'), 3500);
}

export function confirmDelete(title, text) {
    const dialog = document.getElementById('confirm-dialog');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-text').textContent = text;
    dialog.returnValue = '';
    dialog.showModal();

    return new Promise(resolve => {
        dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ok'), { once: true });
    });
}
