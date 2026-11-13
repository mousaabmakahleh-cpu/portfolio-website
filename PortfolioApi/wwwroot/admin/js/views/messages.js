import { el } from '../../../js/core/dom.js';
import { http } from '../core/http.js';
import { toast, confirmDelete } from '../core/ui.js';

/** Inbox for contact-form messages. */
export function createMessagesView() {
    const list = el('div', { class: 'messages' });
    const count = el('span', { class: 'count-badge', text: '0' });

    const root = el('section', { class: 'view' }, [
        el('header', { class: 'view__head' }, [
            el('div', {}, [el('h2', {}, ['Messages ', count]), el('p', { class: 'muted', text: 'Sent from the contact form on your site.' })])
        ]),
        list
    ]);

    function renderMessage(message) {
        const actions = el('div', { class: 'row-actions' });

        if (!message.isRead) {
            const read = el('button', { class: 'btn btn--ghost btn--sm', text: 'Mark as read', attrs: { type: 'button' } });
            read.addEventListener('click', () => run(() => http.put(`/api/messages/${message.id}/read`), 'Marked as read.'));
            actions.append(read);
        }

        const remove = el('button', { class: 'btn btn--danger-ghost btn--sm', text: 'Delete', attrs: { type: 'button' } });
        remove.addEventListener('click', async () => {
            if (await confirmDelete(`Delete the message from ${message.name}?`, 'This cannot be undone.')) {
                run(() => http.delete(`/api/messages/${message.id}`), 'Message deleted.');
            }
        });
        actions.append(remove);

        return el('article', { class: `message panel${message.isRead ? '' : ' message--unread'}` }, [
            el('header', { class: 'message__head' }, [
                el('strong', { text: message.name }),
                el('time', { class: 'muted', text: new Date(message.createdAt).toLocaleString('en-GB') })
            ]),
            el('a', { class: 'message__email', text: message.email, attrs: { href: `mailto:${encodeURIComponent(message.email)}` } }),
            el('p', { class: 'message__body', text: message.content }),
            actions
        ]);
    }

    async function run(action, success) {
        try {
            await action();
            toast(success);
            await load();
        } catch (error) {
            toast(error.message, 'error');
        }
    }

    async function load() {
        try {
            const messages = await http.get('/api/messages');
            count.textContent = String(messages.filter(m => !m.isRead).length);
            list.replaceChildren(...(messages.length
                ? messages.map(renderMessage)
                : [el('p', { class: 'empty', text: 'No messages yet.' })]));
        } catch (error) {
            list.replaceChildren(el('p', { class: 'empty', text: error.message }));
        }
    }

    return { root, load };
}
