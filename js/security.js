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
    /**
     * Generates a signed session token to prevent financial tampering
     */
    generateSessionToken(username, balance) {
        const secret = "CYBER_OS_SECURE_KEY_2025";
        return btoa(`${username}:${balance}:${secret}:${Date.now()}`);
    },

    /**
     * Hardening & Anti-Inspection Module
     */
    hardening: {
        init() {
            this.disableContextMenu();
            this.disableShortcuts();
            this.preventSelection();
            this.antiDebug();
            this.detectConsoleOpen();
            this.blockDragAndDrop();
            console.log("%c[CyberOS Security] Advanced Hardening Active", "color: #ff0000; font-weight: bold;");
        },

        disableContextMenu() {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.triggerTrace('TENTATIVA DE ACESSO VIA MOUSE (BOTÃO DIREITO)');
                return false;
            });
        },

        disableShortcuts() {
            document.addEventListener('keydown', (e) => {
                const forbiddenKeys = [
                    e.keyCode === 123, // F12
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)), // I, J, C
                    (e.ctrlKey && e.keyCode === 85), // Ctrl+U (View Source)
                    (e.ctrlKey && e.keyCode === 83), // Ctrl+S (Save)
                    (e.ctrlKey && e.keyCode === 80), // Ctrl+P (Print)
                    (e.metaKey && e.altKey && e.keyCode === 73) // Cmd+Option+I (Mac)
                ];

                if (forbiddenKeys.some(k => k)) {
                    e.preventDefault();
                    this.triggerTrace(`VIOLAÇÃO DE ATALHO BLOQUEADO: ${e.key.toUpperCase()}`);
                    return false;
                }
            });
        },

        detectConsoleOpen() {
            // Check if window was resized in a way that suggests console opened
            let threshold = 160;
            window.addEventListener('resize', () => {
                if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                    this.triggerTrace('TERMINAL DE DESENVOLVEDOR DETECTADO (RESIDE)');
                }
            });
        },

        blockDragAndDrop() {
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        },

        triggerTrace(reason) {
            if (window.os && os.showNotification) {
                os.showNotification('ALERTA: VIOLAÇÃO DE SEGURANÇA DETECTADA!', 'danger');
            }
            this.fetchTraceData().then(data => {
                this.logCriminalActivity(data, reason);
                this.showInvasionAlert(data, reason);
            });
        },

        logCriminalActivity(data, reason) {
            const logs = JSON.parse(localStorage.getItem('cyberos_security_logs') || '[]');
            const entry = {
                timestamp: new Date().toISOString(),
                reason: reason,
                ip: data.ip,
                location: `${data.city}, ${data.country}`,
                userAgent: navigator.userAgent
            };
            logs.push(entry);
            localStorage.setItem('cyberos_security_logs', JSON.stringify(logs.slice(-50))); // Keep last 50
            
            // Automatic Report Generation (Thematic Download)
            if (logs.length % 3 === 0) { // Every 3 attempts, "leak" their own report
                this.downloadEvidenceFile(entry);
            }
        },

        downloadEvidenceFile(entry) {
            const content = `
[CYBER-OS CRIMINAL REPORT]
-------------------------------------------
ID DE RASTREAMENTO: ${btoa(entry.timestamp)}
DATA/HORA: ${entry.timestamp}
VIOLAÇÃO: ${entry.reason}

DADOS DO INVASOR:
-------------------------------------------
ENDEREÇO IP: ${entry.ip}
GEOLOCALIZAÇÃO: ${entry.location}
BROWSER: ${entry.userAgent}

ESTADO: POSIÇÃO COMPROMETIDA.
-------------------------------------------
RELATÓRIO GERADO AUTOMATICAMENTE PELO KERNEL CYBER-OS.
`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `EVIDENCE_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        },

        async fetchTraceData() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                return {
                    ip: data.ip || 'DESCONHECIDO',
                    city: data.city || 'DESCONHECIDA',
                    region: data.region || 'DESCONHECIDA',
                    country: data.country_name || 'DESCONHECIDO',
                    isp: data.org || 'DESCONHECIDO',
                    lat: data.latitude,
                    lon: data.longitude
                };
            } catch (err) {
                return { ip: '127.0.0.1', city: 'Proxy Local', country: 'Ciberespaço', isp: 'Shadow Protocol' };
            }
        },

        showInvasionAlert(data, reason) {
            // Remove existing alert if any
            const existing = document.getElementById('invasion-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'invasion-overlay';
            overlay.className = 'invasion-overlay animate__animated animate__fadeIn';
            overlay.innerHTML = `
                <div class="invasion-content">
                    <div class="invasion-header">
                        <i class="fas fa-skull-crossbones me-2"></i> RASTREAMENTO ATIVO
                    </div>
                    <div class="invasion-body">
                        <p class="text-danger fw-bold mb-3">CONEXÃO NÃO AUTORIZADA DETECTADA</p>
                        <div class="invasion-data-grid">
                            <div class="data-item"><span>MOTIVO:</span> ${reason}</div>
                            <div class="data-item"><span>ENDEREÇO IP:</span> <span class="text-white">${data.ip}</span></div>
                            <div class="data-item"><span>LOCALIZAÇÃO:</span> <span class="text-white">${data.city}, ${data.region} - ${data.country}</span></div>
                            <div class="data-item"><span>PROVEDOR:</span> <span class="text-white">${data.isp}</span></div>
                            ${data.lat ? `<div class="data-item"><span>COORDENADAS:</span> <span class="text-white">${data.lat}, ${data.lon}</span></div>` : ''}
                        </div>
                        <div class="mt-4 text-center">
                            <div class="progress bg-dark mb-2" style="height: 5px;">
                                <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                            </div>
                            <p class="small text-muted mb-0">ENVIANDO RELATÓRIO PARA A UNIDADE CYBER-OS CENTRAL...</p>
                        </div>
                    </div>
                    <div class="invasion-footer">
                        <button class="btn btn-outline-danger btn-sm w-100" onclick="document.getElementById('invasion-overlay').remove()">FECHAR CONEXÃO E VOLTAR</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            
            // Add sound effect if available
            if (window.sfx && typeof sfx.wrong === 'function') sfx.wrong();
        },

        preventSelection() {
            document.addEventListener('selectstart', (e) => {
                // Allow selection in inputs and textareas
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    return true;
                }
                e.preventDefault();
                return false;
            });
        },

        antiDebug() {
            // Self-invoking function that triggers debugger
            // This makes it annoying to keep DevTools open as it constantly pauses
            const blocker = function() {
                setInterval(function() {
                    (function() {
                        return false;
                    }
                    ['constructor']('debugger')
                    ['call']());
                }, 1000);
            };
            
            try {
                // Only start if we are not in a development environment (optional check)
                blocker();
            } catch (err) {}
        }
    }
};

window.security = security;
