/**
 * Main Entry Point - CyberOS Elite
 * Initializes the OS and handles bootstrapping.
 */

class Main {
    constructor() {
        this.introInterval = null;
    }

    async init() {
        try {
            console.log("%c[CyberOS] Starting boot sequence...", "color: #00ffff; font-weight: bold;");
            
            // Initialize Core Systems
            os.init();
            ui.init();
            
            // Security Audit & Anti-Tamper
            if (typeof security !== 'undefined') {
                security.performIntegrityAudit();
                security.initAntiTamper();
            }
            
            this.setupAppEvents();
            
            // Setup Splash Screen
            this.initIntro();
            
            // Expose global logout for legacy support
            window.logout = () => {
                storage.setCurrentUser('');
                window.location.reload();
            };

            // Initialize Hero Hub (if user is logged in)
            const currentUser = storage.getCurrentUsername();
            if (currentUser) {
                this.triggerLoginFlow();
            }

            // Safety fallback: Ensure splash is hidden after 5 seconds no matter what
            setTimeout(() => {
                const splash = document.getElementById('splash-intro');
                if (splash && !splash.classList.contains('loading-hidden')) {
                    console.warn("[CyberOS] Boot taking too long, forcing entry.");
                    this.finalizeBoot();
                }
            }, 5000);

        } catch (error) {
            console.error("[CyberOS Boot Failure]", error);
            // Even if we fail, try to show the UI so the user isn't stuck
            this.finalizeBoot();
        }
    }

    initIntro() {
        const term = document.getElementById('splash-terminal');
        const progress = document.getElementById('splash-progress');
        const logs = [
            "> INITIALIZING KERNEL...",
            "> LOADING NEURAL MODULES...",
            "> ESTABLISHING SECURE TUNNEL...",
            "> VERIFYING SYSTEM INTEGRITY...",
            "> SYSTEM READY."
        ];
        
        let i = 0;
        if (this.introInterval) clearInterval(this.introInterval);
        this.introInterval = setInterval(() => {
            if (i < logs.length) {
                const div = document.createElement('div');
                div.textContent = logs[i];
                if (term) {
                    term.appendChild(div);
                    term.scrollTop = term.scrollHeight;
                }
                if (progress) progress.style.width = ((i + 1) / logs.length) * 100 + '%';
                i++;
            } else {
                clearInterval(this.introInterval);
                setTimeout(() => this.finalizeBoot(), 500);
            }
        }, 150);
    }

    finalizeBoot() {
        const splash = document.getElementById('splash-intro');
        if (splash) splash.classList.add('loading-hidden');

        const currentUser = storage.getCurrentUsername();
        if (!currentUser) {
            const auth = document.getElementById('auth-layer');
            if (auth) auth.classList.remove('d-none');
        } else {
            this.showDesktop();
        }
    }

    triggerLoginFlow() {
        this.finalizeBoot();
        this.showDesktop();
        if (typeof onyx !== 'undefined') onyx.init();
    }

    showDesktop() {
        const desktop = document.getElementById('desktop-layer');
        const auth = document.getElementById('auth-layer');
        if (desktop) desktop.classList.remove('d-none');
        if (auth) auth.classList.add('d-none');
        
        // Initialize Hero Hub
        ui.initHeroHub();
        
        // Pre-render dashboard
        if (typeof dashboard !== 'undefined') dashboard.render();
    }

    setupAppEvents() {
        // Auth Forms
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('loginUsername').value;
                // Simple login for simulation
                storage.setCurrentUser(user);
                // Initialize default user if not exists
                if (!storage.getUserData(user)) {
                    storage.saveUserData(user, {
                        name: user,
                        username: user,
                        xp: 0,
                        coins: 0,
                        playerStats: { solved: 0, failed: 0 }
                    });
                }
                this.triggerLoginFlow();
            });
        }

        const guestBtn = document.getElementById('guest-login-btn');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                storage.setCurrentUser('guest');
                if (!storage.getUserData('guest')) {
                    storage.saveUserData('guest', {
                        name: 'Convidado',
                        username: 'guest',
                        xp: 0,
                        coins: 0,
                        playerStats: { solved: 0, failed: 0 }
                    });
                }
                this.triggerLoginFlow();
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const user = document.getElementById('registerUsername').value;
                const pass = document.getElementById('registerPassword').value;
                
                storage.saveUserData(user, {
                    name,
                    username: user,
                    xp: 0,
                    coins: 0,
                    playerStats: { solved: 0, failed: 0 }
                });
                
                os.showNotification("Cadastro realizado!", "success");
                storage.setCurrentUser(user);
                this.triggerLoginFlow();
            });
        }

        // Window Overrides for Kernel
        const originalOpen = os.openWindow.bind(os);
        os.openWindow = (id, title) => {
            originalOpen(id, title);
            
            // Dispatch to global instances
            if (id === 'dashboard' && typeof dashboard !== 'undefined') dashboard.render();
            if (id === 'pentest' && typeof pentest !== 'undefined') pentest.init();
            if (id === 'academy' && typeof academy !== 'undefined') academy.init('menu');
            if (id === 'glossary' && typeof academy !== 'undefined') academy.init('glossary');
            if (id === 'soc' && typeof soc !== 'undefined') soc.init();
            if (id === 'onyx' && typeof onyx !== 'undefined') onyx.renderWindow();
            if (id === 'tracking' && typeof tracking !== 'undefined') tracking.init();
            if (id === 'blackmarket' && typeof market !== 'undefined') market.init();
            if (id === 'botwar' && typeof botWar !== 'undefined') botWar.init();
        };
    }
}

// Global instance
window.app = new Main();

// Boot System when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
