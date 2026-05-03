/**
 * Kernel Module - CyberOS Elite
 * Main OS engine and window manager.
 */

class Kernel {
    constructor() {
        this.windows = {};
        this.zindex = 100;
        this.isInitialized = false;
        this.processes = new Set();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log("%c[CyberOS Kernel] Initializing...", "color: #00ff88; font-weight: bold;");
        
        this.setupEventListeners();
        this.createNotificationContainer();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('start-menu');
            const btn = document.getElementById('start-btn');
            if (menu && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                menu.classList.add('d-none');
            }
        });

        // Global error handling
        window.onerror = (msg, url, line, col, error) => {
            this.showNotification(`System Error: ${msg}`, 'danger');
            console.error("[Kernel Crash Report]", { msg, url, line, error });
            return false;
        };
    }

    updateClock() {
        const now = new Date();
        const clock = document.getElementById('os-clock');
        const dateEl = document.getElementById('os-date');
        if (clock) clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (dateEl) {
            const day = now.getDate();
            const month = now.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
            dateEl.textContent = `${day} ${month}`;
        }
    }

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(msg, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `notification-toast animate__animated animate__slideInRight`;
        
        const colors = {
            success: '#00ff88',
            danger: '#ff3366',
            warning: '#ffcc00',
            info: '#00ccff'
        };
        
        toast.style.borderLeftColor = colors[type] || colors.info;

        const icon = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        }[type] || 'fa-info-circle';

        const safeMsg = typeof security !== 'undefined' ? security.constructor.sanitize(msg) : msg;
        
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${icon} me-3"></i>
                <div>${safeMsg}</div>
            </div>
        `;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.replace('animate__slideInRight', 'animate__slideOutRight');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    openWindow(id, title = null) {
        if (this.windows[id]) {
            this.focusWindow(id);
            return;
        }

        const win = document.createElement('div');
        win.id = `win-${id}`;
        win.className = 'window animate__animated animate__zoomIn';
        
        const w = Math.min(window.innerWidth * 0.9, 1100);
        const h = window.innerHeight * 0.8;
        
        win.style.width = w + 'px';
        win.style.height = h + 'px';
        win.style.left = ((window.innerWidth - w) / 2) + 'px';
        win.style.top = ((window.innerHeight - h) / 2) + 'px';
        win.style.zIndex = ++this.zindex;

        const displayTitle = title || id.toUpperCase();

        win.innerHTML = `
            <div class="window-header">
                <span class="fw-bold"><i class="fas fa-terminal me-2"></i> ${displayTitle}</span>
                <div class="window-controls">
                    <span class="bg-warning" onclick="os.minimizeWindow('${id}')"></span>
                    <span class="bg-danger" onclick="os.closeWindow('${id}')"></span>
                </div>
            </div>
            <div class="window-body" id="body-${id}">
                <div class="p-5 text-center">
                    <i class="fas fa-spinner fa-spin fa-3x text-primary"></i>
                    <p class="mt-3 text-muted">CARREGANDO MÓDULO...</p>
                </div>
            </div>
        `;

        const container = document.getElementById('window-container');
        if (container) {
            container.appendChild(win);
            this.windows[id] = win;
            this.addToTaskbar(id);
            this.makeDraggable(win);
        }
    }

    closeWindow(id) {
        if (this.windows[id]) {
            this.windows[id].classList.add('animate__zoomOut');
            setTimeout(() => {
                if (this.windows[id]) {
                    this.windows[id].remove();
                    delete this.windows[id];
                }
                const t = document.getElementById(`task-${id}`);
                if (t) t.remove();
                
                // Trigger memory cleanup for this module
                this.cleanupModule(id);
            }, 200);
        }
    }

    cleanupModule(id) {
        // Emit event for module to cleanup
        window.dispatchEvent(new CustomEvent(`cleanup_${id}`));
    }

    minimizeWindow(id) {
        if (this.windows[id]) {
            const isMin = this.windows[id].style.display === 'none';
            this.windows[id].style.display = isMin ? 'flex' : 'none';
            const task = document.getElementById(`task-${id}`);
            if (task) task.classList.toggle('active', !isMin);
        }
    }

    focusWindow(id) {
        if (this.windows[id]) {
            this.windows[id].style.display = 'flex';
            this.windows[id].style.zIndex = ++this.zindex;
            document.querySelectorAll('.task-item').forEach(el => el.classList.remove('active'));
            const task = document.getElementById(`task-${id}`);
            if (task) task.classList.add('active');
        }
    }

    addToTaskbar(id) {
        const items = document.getElementById('taskbar-items');
        if (items) {
            const item = document.createElement('div');
            item.id = `task-${id}`;
            item.className = 'task-item active';
            item.textContent = id.toUpperCase();
            item.onclick = () => this.toggleWindow(id);
            items.appendChild(item);
        }
    }

    toggleWindow(id) {
        const win = this.windows[id];
        if (!win) return;
        
        if (win.style.display === 'none') {
            this.minimizeWindow(id);
            this.focusWindow(id);
        } else if (win.style.zIndex == this.zindex) {
            this.minimizeWindow(id);
        } else {
            this.focusWindow(id);
        }
    }

    makeDraggable(el) {
        const header = el.querySelector('.window-header');
        let nx = 0, ny = 0, x = 0, y = 0;
        
        const onDrag = (e) => {
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            e.preventDefault();
            x = nx - clientX;
            y = ny - clientY;
            nx = clientX;
            ny = clientY;
            
            el.style.top = (el.offsetTop - y) + "px";
            el.style.left = (el.offsetLeft - x) + "px";
        };

        const stopDrag = () => {
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('touchend', stopDrag);
            document.removeEventListener('touchmove', onDrag);
        };

        const startDrag = (e) => {
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            
            nx = clientX;
            ny = clientY;
            
            this.focusWindow(el.id.replace('win-', ''));
            
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchend', stopDrag);
            document.addEventListener('touchmove', onDrag);
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag, { passive: false });
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copiado para a área de transferência!', 'success');
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
    }

    toggleStartMenu() {
        const menu = document.getElementById('start-menu');
        if (menu) menu.classList.toggle('d-none');
    }
}

window.os = new Kernel();
