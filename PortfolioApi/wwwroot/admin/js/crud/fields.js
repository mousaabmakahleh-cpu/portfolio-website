import { el } from '../../../js/core/dom.js';
import { http } from '../core/http.js';
import { toast } from '../core/ui.js';

/**
 * Form field factory. Each field returns { node, get(), set(value) } so forms
 * never need to know how a given input type stores its value.
 *
 * Field definition:
 *   { name, label, type, required?, hint?, options?, accept?, min?, max?, maxLength?, wide? }
 * Types: text | email | url | number | date | textarea | select | checkbox | range | list | file
 */
let uid = 0;

function wrap(def, control, extra = []) {
    const id = control.id;
    return el('div', { class: `form-field${def.wide ? ' form-field--wide' : ''}` }, [
        el('label', { class: 'form-field__label', text: def.label + (def.required ? ' *' : ''), attrs: { for: id } }),
        control,
        ...extra,
        def.hint ? el('small', { class: 'form-field__hint', text: def.hint }) : null
    ]);
}

function baseAttrs(def, id) {
    const attrs = { id, name: def.name };
    if (def.required) attrs.required = '';
    if (def.maxLength) attrs.maxlength = String(def.maxLength);
    if (def.placeholder) attrs.placeholder = def.placeholder;
    return attrs;
}

function inputField(def, id) {
    const type = def.type === 'url' ? 'text' : def.type; // relative "/api/files/..." paths are valid too
    const attrs = { ...baseAttrs(def, id), type };
    if (def.min != null) attrs.min = String(def.min);
    if (def.max != null) attrs.max = String(def.max);
    const input = el('input', { attrs });

    return {
        node: wrap(def, input),
        get: () => {
            const raw = input.value.trim();
            // blank → null so optional [EmailAddress]/dates validate; numbers fall back to their default
            if (raw === '') return def.type === 'number' ? (def.default ?? null) : null;
            return def.type === 'number' ? Number(raw) : raw;
        },
        set: (value) => { input.value = value ?? ''; }
    };
}

function textareaField(def, id) {
    const area = el('textarea', { attrs: { ...baseAttrs(def, id), rows: String(def.rows ?? 4) } });
    return {
        node: wrap(def, area),
        get: () => area.value.trim() || null,
        set: (value) => { area.value = value ?? ''; }
    };
}

function listField(def, id) {
    const area = el('textarea', { attrs: { ...baseAttrs(def, id), rows: String(def.rows ?? 5) } });
    const hint = { ...def, hint: def.hint ?? 'One item per line.' };
    return {
        node: wrap(hint, area),
        get: () => area.value.split('\n').map(line => line.trim()).filter(Boolean),
        set: (value) => { area.value = Array.isArray(value) ? value.join('\n') : ''; }
    };
}

function selectField(def, id) {
    const select = el('select', { attrs: baseAttrs(def, id) },
        def.options.map(option => el('option', { text: option.label, attrs: { value: option.value } })));
    return {
        node: wrap(def, select),
        get: () => select.value,
        set: (value) => { select.value = value ?? def.options[0].value; }
    };
}

function checkboxField(def, id) {
    const box = el('input', { attrs: { id, name: def.name, type: 'checkbox' } });
    const node = el('label', { class: 'form-check' }, [box, el('span', { text: def.label })]);
    return {
        node,
        get: () => box.checked,
        set: (value) => { box.checked = value ?? true; }
    };
}

function rangeField(def, id) {
    const output = el('output', { class: 'form-field__output', attrs: { for: id } });
    const range = el('input', { attrs: { id, name: def.name, type: 'range', min: String(def.min ?? 0), max: String(def.max ?? 100) } });
    range.addEventListener('input', () => { output.textContent = `${range.value}%`; });
    return {
        node: wrap(def, range, [output]),
        get: () => Number(range.value),
        set: (value) => { range.value = String(value ?? 70); output.textContent = `${range.value}%`; }
    };
}

/** URL input + upload button + preview. Uploads go to /api/files and fill the URL in. */
function fileField(def, id) {
    const input = el('input', { attrs: { ...baseAttrs(def, id), type: 'text', placeholder: 'Upload a file or paste a URL' } });
    const picker = el('input', { class: 'visually-hidden', attrs: { type: 'file', accept: def.accept ?? 'image/*', tabindex: '-1' } });
    const button = el('button', { class: 'btn btn--ghost btn--sm', text: 'Upload…', attrs: { type: 'button' } });
    const clear = el('button', { class: 'btn btn--ghost btn--sm', text: 'Clear', attrs: { type: 'button' } });
    const preview = el('div', { class: 'file-preview' });

    const renderPreview = () => {
        const url = input.value.trim();
        preview.replaceChildren();
        if (!url) return;
        const isPdf = /\.pdf$/i.test(url) || def.accept === 'application/pdf';
        preview.append(isPdf
            ? el('a', { text: 'Open file ↗', attrs: { href: url, target: '_blank', rel: 'noopener' } })
            : el('img', { attrs: { src: url, alt: 'Preview' } }));
    };

    button.addEventListener('click', () => picker.click());
    clear.addEventListener('click', () => { input.value = ''; renderPreview(); });
    input.addEventListener('change', renderPreview);
    picker.addEventListener('change', async () => {
        const file = picker.files?.[0];
        if (!file) return;
        button.disabled = true;
        button.textContent = 'Uploading…';
        try {
            const result = await http.upload(file);
            input.value = result.url;
            renderPreview();
            toast('File uploaded. Remember to save.');
        } catch (error) {
            toast(error.message, 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'Upload…';
            picker.value = '';
        }
    });

    const row = el('div', { class: 'file-row' }, [input, button, clear, picker]);
    return {
        node: wrap(def, row, [preview]),
        get: () => input.value.trim() || null,
        set: (value) => { input.value = value ?? ''; renderPreview(); }
    };
}

const FACTORIES = {
    text: inputField, email: inputField, url: inputField, number: inputField, date: inputField,
    textarea: textareaField, list: listField, select: selectField,
    checkbox: checkboxField, range: rangeField, file: fileField
};

export function createField(def) {
    const factory = FACTORIES[def.type ?? 'text'];
    if (!factory) throw new Error(`Unknown field type: ${def.type}`);
    return factory(def, `f-${def.name}-${++uid}`);
}

/** Builds all fields for a form and exposes read/write of the whole value object. */
export function createFieldSet(defs) {
    const fields = defs.map(def => ({ def, field: createField(def) }));
    return {
        nodes: fields.map(({ field }) => field.node),
        read: () => Object.fromEntries(fields.map(({ def, field }) => [def.name, field.get()])),
        write(values = {}) {
            fields.forEach(({ def, field }) => field.set(values[def.name] ?? def.default));
        }
    };
}
