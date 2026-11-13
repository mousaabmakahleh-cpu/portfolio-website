/**
 * Thin HTTP client for the Portfolio API.
 * Responsibility: talk to the server and normalise errors — nothing else.
 */
export class ApiError extends Error {
    constructor(status, message = `Request failed with status ${status}`) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request(url, { method = 'GET', body } = {}) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (!response.ok) throw new ApiError(response.status);

    const type = response.headers.get('content-type') ?? '';
    return response.status !== 204 && type.includes('json') ? response.json() : null;
}

export const api = {
    getProfile: () => request('/api/profile'),
    getEducation: () => request('/api/education'),
    getExperience: () => request('/api/experience'),
    getProjects: () => request('/api/projects'),
    getSkills: () => request('/api/skills'),
    getCertifications: () => request('/api/certifications'),
    sendMessage: (message) => request('/api/messages', { method: 'POST', body: message }),
    recordVisit: () => request('/api/visits', { method: 'POST' })
};
