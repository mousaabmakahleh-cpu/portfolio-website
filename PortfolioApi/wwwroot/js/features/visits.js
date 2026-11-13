import { api } from '../core/api.js';
import { session } from '../core/storage.js';

const KEY = 'visit-recorded';

/**
 * Records one visit per browser session. Failures are silent by design.
 */
export async function recordVisit() {
    if (session.get(KEY)) return;
    try {
        await api.recordVisit();
        session.set(KEY, '1');
    } catch {
        // analytics must never break the page
    }
}
