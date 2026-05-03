/**
 * StorageService - CyberOS Elite
 * Secure wrapper for localStorage with integrity checks.
 */

class StorageService {
    constructor() {
        this.PREFIX = 'cyberos_';
    }

    /**
     * Saves data securely
     */
    save(key, data) {
        const encrypted = security.encrypt(data);
        localStorage.setItem(this.PREFIX + key, encrypted);
    }

    /**
     * Loads data securely
     */
    load(key) {
        const data = localStorage.getItem(this.PREFIX + key);
        if (!data) return null;

        // Try to decrypt
        const decrypted = security.decrypt(data);
        if (decrypted) return decrypted;

        // Fallback for legacy data (one-time migration)
        try {
            const legacyData = JSON.parse(data);
            console.log(`[Storage] Migrating legacy key: ${key}`);
            this.save(key, legacyData);
            return legacyData;
        } catch (e) {
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(this.PREFIX + key);
    }

    /**
     * Current User Management
     */
    setCurrentUser(username) {
        localStorage.setItem('currentUser', username);
    }

    getCurrentUsername() {
        return localStorage.getItem('currentUser');
    }

    getUserData(username) {
        const users = this.load('users') || {};
        return users[username] || null;
    }

    saveUserData(username, userData) {
        const users = this.load('users') || {};
        users[username] = userData;
        this.save('users', users);
    }
}

window.storage = new StorageService();
