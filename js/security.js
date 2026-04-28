/**
 * Security Utility for CyberOS
 * Implementing SHA-256 Hashing and String Sanitization
 */

const security = {
    /**
     * Hashes a string using SHA-256
     * @param {string} text 
     * @returns {Promise<string>}
     */
    async hash(text) {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },

    /**
     * Escapes HTML characters to prevent XSS
     * @param {string} str 
     * @returns {string}
     */
    escapeHTML(str) {
        if (!str) return '';
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    },

    /**
     * Sanitizes a string for use in terminal/code contexts
     * @param {string} str 
     * @returns {string}
     */
    sanitizeCode(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
};

window.security = security;
