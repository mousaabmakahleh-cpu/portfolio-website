import { auth } from './auth.js';
import { ApiError } from '../../../js/core/api.js';

/**
 * Authenticated JSON client for the admin API. A 401 ends the session.
 */
async function send(url, { method = 'GET', body, form } = {}) {
    const headers = { Authorization: `Bearer ${auth.token}` };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
        method,
        headers,
        body: form ?? (body === undefined ? undefined : JSON.stringify(body))
    });

    if (response.status === 401) {
        auth.signOut();
        throw new ApiError(401, 'Your session expired. Please sign in again.');
    }

    const type = response.headers.get('content-type') ?? '';
    const data = type.includes('json') ? await response.json().catch(() => null) : null;

    if (!response.ok) throw new ApiError(response.status, describeError(response.status, data));
    return data;
}

/** Turns ASP.NET validation problem details into a readable sentence. */
function describeError(status, data) {
    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }
    if (data?.message) return data.message;
    if (status === 404) return 'That item no longer exists.';
    if (status === 413) return 'The file is too large.';
    return 'Something went wrong. Please try again.';
}

export const http = {
    get: (url) => send(url),
    post: (url, body) => send(url, { method: 'POST', body }),
    put: (url, body) => send(url, { method: 'PUT', body }),
    delete: (url) => send(url, { method: 'DELETE' }),
    upload(file) {
        const form = new FormData();
        form.append('file', file);
        return send('/api/files', { method: 'POST', form });
    }
};

export async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.status === 401) throw new ApiError(401, 'Invalid username or password.');
    if (response.status === 429) throw new ApiError(429, 'Too many attempts. Wait a minute and try again.');
    if (!response.ok) throw new ApiError(response.status, 'Something went wrong. Try again.');
    return (await response.json()).token;
}
