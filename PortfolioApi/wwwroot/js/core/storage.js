/**
 * Storage access that never throws (private mode, blocked site data, etc.).
 */
function safe(getStore) {
    return {
        get(key) {
            try { return getStore().getItem(key); } catch { return null; }
        },
        set(key, value) {
            try { getStore().setItem(key, value); } catch { /* ignore */ }
        }
    };
}

export const local = safe(() => window.localStorage);
export const session = safe(() => window.sessionStorage);
