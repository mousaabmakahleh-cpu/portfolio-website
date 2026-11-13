import { el } from '../../../js/core/dom.js';
import { http } from '../core/http.js';
import { toast, confirmDelete } from '../core/ui.js';
import { createFieldSet } from './fields.js';

/**
 * Generic list + form screen for one API resource.
 *
 * Resource config:
 *   {
 *     id, title, singular, description,
 *     endpoint,                 // e.g. '/api/education' (admin list is `${endpoint}/all`)
 *     fields: FieldDef[],
 *     columns: { label, render(item) => string | Node }[],
 *     itemName(item) => string,
 *     toPayload?(values) => object   // optional transform before sending
 *   }
 */
export function createResourceView(config) {
    const fieldSet = createFieldSet(config.fields);
    let editingId = null;

    // ----- Elements -----
    const count = el('span', { class: 'count-badge', text: '0' });
    const addButton = el('button', { class: 'btn btn--primary', text: `+ Add ${config.singular}`, attrs: { type: 'button' } });
    const formTitle = el('h3', { class: 'panel__title' });
    const status = el('p', { class: 'status', attrs: { role: 'status' } });
    const saveButton = el('button', { class: 'btn btn--primary', text: 'Save', attrs: { type: 'submit' } });
    const cancelButton = el('button', { class: 'btn btn--ghost', text: 'Cancel', attrs: { type: 'button' } });

    const form = el('form', { class: 'panel form-grid', attrs: { novalidate: '' } }, [
        formTitle,
        ...fieldSet.nodes,
        el('div', { class: 'form-actions' }, [saveButton, cancelButton, status])
    ]);
    form.hidden = true;

    const tbody = el('tbody');
    const table = el('div', { class: 'table-wrap' }, [
        el('table', { class: 'table' }, [
            el('thead', {}, [el('tr', {}, [
                ...config.columns.map(column => el('th', { text: column.label })),
                el('th', { text: 'Actions', attrs: { class: 'table__actions' } })
            ])]),
            tbody
        ])
    ]);

    const root = el('section', { class: 'view' }, [
        el('header', { class: 'view__head' }, [
            el('div', {}, [
                el('h2', {}, [config.title + ' ', count]),
                config.description ? el('p', { class: 'muted', text: config.description }) : null
            ]),
            addButton
        ]),
        form,
        table
    ]);

    // ----- Behaviour -----
    function openForm(item) {
        editingId = item?.id ?? null;
        formTitle.textContent = item ? `Edit ${config.singular}: ${config.itemName(item)}` : `New ${config.singular}`;
        fieldSet.write(item ?? {});
        status.textContent = '';
        form.hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        form.querySelector('input:not([type=checkbox]), textarea, select')?.focus({ preventScroll: true });
    }

    function closeForm() {
        form.hidden = true;
        editingId = null;
    }

    function messageRow(text) {
        tbody.replaceChildren(el('tr', {}, [el('td', { class: 'table__empty', text, attrs: { colspan: String(config.columns.length + 1) } })]));
    }

    async function load() {
        messageRow('Loading…');
        try {
            const items = await http.get(`${config.endpoint}/all`);
            count.textContent = String(items.length);
            if (items.length === 0) {
                messageRow(`No ${config.title.toLowerCase()} yet — add the first one.`);
                return;
            }
            tbody.replaceChildren(...items.map(renderRow));
        } catch (error) {
            messageRow(error.message);
        }
    }

    function renderRow(item) {
        const edit = el('button', { class: 'btn btn--ghost btn--sm', text: 'Edit', attrs: { type: 'button' } });
        const remove = el('button', { class: 'btn btn--danger-ghost btn--sm', text: 'Delete', attrs: { type: 'button' } });
        edit.addEventListener('click', () => openForm(item));
        remove.addEventListener('click', () => removeItem(item));

        return el('tr', {}, [
            ...config.columns.map(column => {
                const value = column.render(item);
                return el('td', {}, [value instanceof Node ? value : String(value ?? '—')]);
            }),
            el('td', { class: 'table__actions' }, [el('div', { class: 'row-actions' }, [edit, remove])])
        ]);
    }

    async function removeItem(item) {
        const ok = await confirmDelete(`Delete "${config.itemName(item)}"?`, 'This permanently removes it from the database. To keep it but hide it from the site, edit it and untick "Visible on the site" instead.');
        if (!ok) return;
        try {
            await http.delete(`${config.endpoint}/${item.id}`);
            if (editingId === item.id) closeForm();
            toast(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} deleted.`);
            await load();
        } catch (error) {
            toast(error.message, 'error');
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const values = fieldSet.read();
        const payload = config.toPayload ? config.toPayload(values) : values;
        const isEdit = editingId !== null;

        saveButton.disabled = true;
        status.textContent = 'Saving…';
        try {
            if (isEdit) await http.put(`${config.endpoint}/${editingId}`, payload);
            else await http.post(config.endpoint, payload);
            closeForm();
            toast(isEdit ? 'Changes saved.' : `${config.singular[0].toUpperCase()}${config.singular.slice(1)} added.`);
            await load();
        } catch (error) {
            status.textContent = error.message;
        } finally {
            saveButton.disabled = false;
        }
    });

    addButton.addEventListener('click', () => openForm(null));
    cancelButton.addEventListener('click', closeForm);

    return { root, load };
}
