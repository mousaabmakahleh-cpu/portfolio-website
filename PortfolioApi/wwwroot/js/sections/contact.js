import { api, ApiError } from '../core/api.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
    sending: 'Sending your message…',
    success: "Thanks! Your message is on its way — I'll be in touch soon.",
    invalid: 'Please check the highlighted fields.',
    rateLimited: 'Too many messages in a short time. Please wait a minute and try again.',
    server: 'Something went wrong on my side. Please try again later.',
    network: "Couldn't reach the server. Check your connection and try again."
};

/** Validates the form fields and marks invalid ones. Returns the payload or null. */
function validate(fields) {
    const payload = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        content: fields.content.value.trim()
    };

    const errors = {
        name: payload.name.length === 0,
        email: !EMAIL_PATTERN.test(payload.email),
        content: payload.content.length === 0
    };

    for (const [key, invalid] of Object.entries(errors)) {
        fields[key].closest('.field')?.classList.toggle('is-invalid', invalid);
        fields[key].setAttribute('aria-invalid', String(invalid));
    }

    const firstInvalid = Object.keys(errors).find(key => errors[key]);
    if (firstInvalid) {
        fields[firstInvalid].focus();
        return null;
    }
    return payload;
}

function errorMessage(error) {
    if (!(error instanceof ApiError)) return MESSAGES.network;
    if (error.status === 400) return MESSAGES.invalid;
    if (error.status === 429) return MESSAGES.rateLimited;
    return MESSAGES.server;
}

/**
 * Wires up the contact form: live counter, validation, submission and status feedback.
 */
export function initContactForm(form = document.getElementById('contact-form')) {
    if (!form) return;

    const fields = {
        name: form.querySelector('#contact-name'),
        email: form.querySelector('#contact-email'),
        content: form.querySelector('#contact-content')
    };
    const status = document.getElementById('form-status');
    const counter = document.getElementById('contact-counter');
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector('.btn__label');
    const max = Number(fields.content.maxLength) || 2000;

    const setStatus = (text, state = '') => {
        status.textContent = text;
        status.dataset.state = state;
    };

    const updateCounter = () => { counter.textContent = `${fields.content.value.length} / ${max}`; };
    fields.content.addEventListener('input', updateCounter);

    // Clear the error state as soon as the user edits a field
    Object.values(fields).forEach(input => input.addEventListener('input', () => {
        input.closest('.field')?.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
    }));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = validate(fields);
        if (!payload) {
            setStatus(MESSAGES.invalid, 'error');
            return;
        }

        button.disabled = true;
        buttonLabel.textContent = 'Sending…';
        setStatus(MESSAGES.sending);

        try {
            await api.sendMessage(payload);
            form.reset();
            updateCounter();
            setStatus(MESSAGES.success, 'success');
        } catch (error) {
            setStatus(errorMessage(error), 'error');
        } finally {
            button.disabled = false;
            buttonLabel.textContent = 'Send message';
        }
    });
}
