import { session } from '../../../js/core/storage.js';

/**
 * Holds the JWT for the current browser tab and notifies listeners when the session ends.
 */
const TOKEN_KEY = 'admin-token';
const listeners = new Set();

export const auth = {
    get token() {
        return session.get(TOKEN_KEY);
    },
    get isLoggedIn() {
        return Boolean(this.token);
    },
    signIn(token) {
        session.set(TOKEN_KEY, token);
    },
    signOut() {
        try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
        listeners.forEach(listener => listener());
    },
    onSignOut(listener) {
        listeners.add(listener);
    }
};
