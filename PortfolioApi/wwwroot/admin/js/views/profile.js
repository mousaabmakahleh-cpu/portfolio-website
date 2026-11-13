import { el } from '../../../js/core/dom.js';
import { http } from '../core/http.js';
import { toast } from '../core/ui.js';
import { createFieldSet } from '../crud/fields.js';

/** Single form for the public contact links and the CV file. */
export function createProfileView() {
    const fieldSet = createFieldSet([
        { name: 'cvUrl', label: 'CV (PDF)', type: 'file', accept: 'application/pdf', wide: true,
          hint: 'Upload your CV as a PDF. Visitors get a "Download CV" button.' },
        { name: 'email', label: 'Email (Gmail)', type: 'email', maxLength: 150, placeholder: 'name@gmail.com' },
        { name: 'location', label: 'Location', maxLength: 100, placeholder: 'Jordan' },
        { name: 'gitHubUrl', label: 'GitHub profile', type: 'url', placeholder: 'https://github.com/…' },
        { name: 'linkedInUrl', label: 'LinkedIn profile', type: 'url', placeholder: 'https://www.linkedin.com/in/…' }
    ]);

    const status = el('p', { class: 'status', attrs: { role: 'status' } });
    const save = el('button', { class: 'btn btn--primary', text: 'Save profile', attrs: { type: 'submit' } });
    const form = el('form', { class: 'panel form-grid', attrs: { novalidate: '' } }, [
        ...fieldSet.nodes,
        el('div', { class: 'form-actions' }, [save, status])
    ]);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        save.disabled = true;
        status.textContent = 'Saving…';
        try {
            fieldSet.write(await http.put('/api/profile', fieldSet.read()));
            status.textContent = '';
            toast('Profile saved.');
        } catch (error) {
            status.textContent = error.message;
        } finally {
            save.disabled = false;
        }
    });

    const root = el('section', { class: 'view' }, [
        el('header', { class: 'view__head' }, [
            el('div', {}, [
                el('h2', { text: 'Profile & CV' }),
                el('p', { class: 'muted', text: 'Links shown in the "Connect with me" section, and your downloadable CV.' })
            ])
        ]),
        form
    ]);

    async function load() {
        try {
            fieldSet.write(await http.get('/api/profile'));
        } catch (error) {
            toast(error.message, 'error');
        }
    }

    return { root, load };
}
