/**
 * Tracking Module - CyberOS Elite
 * Demonstrates Geolocation and IP-based tracking.
 */

class Tracking {
    constructor() {
        this.containerId = 'body-tracking';
    }

    init() {
        this.render();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="container-fluid p-4 animate__animated animate__fadeIn">
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="glass-card p-4 h-100 border-start border-primary border-4">
                            <h5 class="text-primary mb-3"><i class="fas fa-satellite-dish me-2"></i> MÉTODOS DE RASTREAMENTO</h5>
                            <p class="small text-muted">Escolha o vetor de ataque para obter as coordenadas do alvo.</p>
                            
                            <div class="d-grid gap-3">
                                <button class="btn btn-cyber primary py-3" onclick="tracking.getGPSLocation()">
                                    <i class="fas fa-crosshairs me-2"></i> LOCALIZAÇÃO GPS (PROMPT)
                                </button>
                                
                                <button class="btn btn-cyber outline-info py-3" onclick="tracking.getIPLocation()">
                                    <i class="fas fa-network-wired me-2"></i> RASTREAMENTO IP (SILENCIOSO)
                                </button>

                                <button class="btn btn-cyber outline-warning py-3" onclick="tracking.getFingerprint()">
                                    <i class="fas fa-fingerprint me-2"></i> BROWSER FINGERPRINT
                                </button>

                                <button class="btn btn-cyber outline-danger py-3" onclick="tracking.checkPermissions()">
                                    <i class="fas fa-user-shield me-2"></i> AUDITORIA DE PERMISSÕES
                                </button>
                            </div>

                            <hr class="border-secondary my-4">

                            <div id="tracking-status" class="font-monospace small text-muted">
                                STATUS: AGUARDANDO COMANDO...
                            </div>
                        </div>
                    </div>

                    <div class="col-md-8">
                        <div class="glass-card p-0 h-100 overflow-hidden d-flex flex-column" style="min-height: 400px;">
                            <div class="p-3 border-bottom border-secondary bg-dark-50 d-flex justify-content-between align-items-center">
                                <span class="small font-monospace"><i class="fas fa-map-marked-alt me-2"></i> VISUALIZADOR DE MAPA TÁTICO</span>
                                <div id="tracking-coords" class="badge bg-primary font-monospace">00.0000, 00.0000</div>
                            </div>
                            <div id="map-container" class="flex-grow-1 bg-dark d-flex align-items-center justify-content-center">
                                <div class="text-center text-muted">
                                    <i class="fas fa-globe-americas fa-4x mb-3 opacity-25"></i>
                                    <p>MAPA NÃO INICIALIZADO</p>
                                </div>
                            </div>
                            <div id="tracking-details" class="p-3 bg-dark-50 border-top border-secondary font-monospace small d-none">
                                <!-- Details will be injected here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateStatus(msg, type = 'info') {
        const status = document.getElementById('tracking-status');
        if (status) {
            status.textContent = `STATUS: ${msg.toUpperCase()}`;
            status.className = `font-monospace small text-${type}`;
        }
    }

    async getGPSLocation() {
        this.updateStatus('SOLICITANDO PERMISSÃO GPS...', 'warning');
        
        if (!navigator.geolocation) {
            this.updateStatus('GPS NÃO SUPORTADO PELO NAVEGADOR', 'danger');
            os.showNotification('Erro: Navegador sem suporte a GPS', 'danger');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                this.updateStatus('LOCALIZAÇÃO OBTIDA COM SUCESSO', 'success');
                this.displayResult(latitude, longitude, {
                    Metodo: 'GPS / Satélite',
                    Precisao: `${accuracy.toFixed(1)} metros`,
                    Timestamp: new Date(pos.timestamp).toLocaleString()
                });
                os.showNotification('Alvo localizado via GPS!', 'success');
            },
            (err) => {
                this.updateStatus(`ERRO: ${this.getGeoErrorMsg(err.code)}`, 'danger');
                os.showNotification(`Falha no GPS: ${this.getGeoErrorMsg(err.code)}`, 'danger');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    async getIPLocation() {
        this.updateStatus('EXECUTANDO SCAN SILENCIOSO VIA IP...', 'info');
        
        try {
            // Get local IP first
            const localIp = await security.getLocalIP();

            // Using ipapi.co as it's free and simple for demos
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.error) throw new Error(data.reason);

            this.updateStatus('SCAN IP CONCLUÍDO (SILENCIOSO)', 'success');
            this.displayResult(data.latitude, data.longitude, {
                Metodo: 'IP Geolocation (Silent)',
                'IP Público': data.ip,
                'IP Local (LAN)': localIp,
                Cidade: data.city,
                Regiao: data.region,
                Pais: data.country_name,
                Provedor: data.org
            });
            os.showNotification('Rastreamento silencioso concluído!', 'info');

        } catch (error) {
            console.warn('IP Tracking failed, falling back to simulation:', error);
            this.simulateIPTracking();
        }
    }

    simulateIPTracking() {
        this.updateStatus('SCAN IP CONCLUÍDO (SIMULADO)', 'warning');
        // Simulated data for local environments or if API fails
        const simData = {
            latitude: -23.5505,
            longitude: -46.6333,
            IP: '189.123.45.67',
            Cidade: 'São Paulo',
            Pais: 'Brasil',
            Provedor: 'Telefônica Brasil S.A'
        };
        this.displayResult(simData.latitude, simData.longitude, simData);
        os.showNotification('Usando dados de simulação (IP API Offline)', 'warning');
    }

    displayResult(lat, lon, details) {
        // Update coordinates badge
        const coords = document.getElementById('tracking-coords');
        if (coords) coords.textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

        // Render Map (OpenStreetMap iframe)
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}" 
                    style="border: 0; filter: grayscale(1) invert(1) hue-rotate(180deg);">
                </iframe>
            `;
        }

        // Display Details
        const detailsContainer = document.getElementById('tracking-details');
        if (detailsContainer) {
            detailsContainer.classList.remove('d-none');
            let html = '<div class="row">';
            for (const [key, value] of Object.entries(details)) {
                html += `<div class="col-6 mb-1"><span class="text-primary">${key}:</span> ${value}</div>`;
            }
            html += '</div>';
            detailsContainer.innerHTML = html;
        }
    }

    async getFingerprint() {
        this.updateStatus('COLETANDO ATRIBUTOS DO NAVEGADOR...', 'warning');
        
        try {
            const fp = await security.getFingerprint();
            this.updateStatus('FINGERPRINT GERADO COM SUCESSO', 'success');
            
            // Show details
            this.displayResult(0, 0, {
                'Identidade (Hash)': fp.hash,
                'Navegador': fp.data.ua.substring(0, 40) + '...',
                'Idioma': fp.data.lang,
                'Resolução': fp.data.screen,
                'CPU Cores': fp.data.cores,
                'Memória RAM': fp.data.memory + ' GB',
                'Timezone': fp.data.timezone,
                'Touch Support': fp.data.touch ? 'Sim' : 'Não'
            });

            // Specific visualization for Fingerprint
            const mapContainer = document.getElementById('map-container');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div class="p-4 text-center animate__animated animate__zoomIn">
                        <i class="fas fa-fingerprint fa-5x text-warning mb-3"></i>
                        <h4 class="text-warning font-monospace">${fp.hash}</h4>
                        <p class="text-muted small">Esta é a sua identidade digital persistente.<br>Mesmo que você mude de IP, este hash continuará o mesmo.</p>
                        <canvas id="fp-canvas-demo" width="200" height="50" class="border border-secondary rounded mt-3"></canvas>
                    </div>
                `;
                // Draw the canvas fingerprint to show how it's done
                const demoCanvas = document.getElementById('fp-canvas-demo');
                const ctx = demoCanvas.getContext('2d');
                ctx.textBaseline = "top"; ctx.font = "14px 'Arial'"; ctx.fillStyle = "#f60";
                ctx.fillRect(125,1,62,20); ctx.fillStyle = "#069";
                ctx.fillText("CyberOS-Elite-Fingerprint", 2, 15);
            }

            os.showNotification('Fingerprint gerado com sucesso!', 'warning');

        } catch (error) {
            console.error('Fingerprint failed:', error);
            this.updateStatus('ERRO AO GERAR FINGERPRINT', 'danger');
        }
    }

    async checkPermissions() {
        this.updateStatus('AUDITANDO PERMISSÕES DO NAVEGADOR...', 'info');
        const permissions = ['geolocation', 'notifications', 'push', 'camera', 'microphone'];
        const results = {};

        for (const name of permissions) {
            try {
                const result = await navigator.permissions.query({ name });
                results[name] = result.state;
            } catch (e) {
                results[name] = 'unsupported';
            }
        }

        this.displayResult(0, 0, {
            'INFO': 'Estado das permissões de hardware',
            'GPS': results.geolocation,
            'Notificações': results.notifications,
            'Câmera': results.camera,
            'Microfone': results.microphone
        });

        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="p-4 animate__animated animate__fadeIn">
                    <h5 class="text-info mb-4 font-monospace">RELATÓRIO DE PRIVACIDADE DO BROWSER</h5>
                    <div class="row g-3">
                        ${Object.entries(results).map(([key, val]) => `
                            <div class="col-6">
                                <div class="p-3 border border-secondary rounded bg-dark-50">
                                    <div class="small text-muted text-uppercase">${key}</div>
                                    <div class="fw-bold ${val === 'granted' ? 'text-success' : (val === 'denied' ? 'text-danger' : 'text-warning')}">
                                        <i class="fas ${val === 'granted' ? 'fa-unlock' : 'fa-lock'} me-2"></i>${val.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-4 p-3 glass-card border-warning">
                        <small class="text-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Análise Hacker:</strong> Se o estado for 'GRANTED', o acesso é silencioso. Se for 'PROMPT', o navegador mostrará o alerta. Se for 'DENIED', o acesso está bloqueado no hardware.
                        </small>
                    </div>
                </div>
            `;
        }
    }

    getGeoErrorMsg(code) {
        switch(code) {
            case 1: return "PERMISSÃO NEGADA";
            case 2: return "POSIÇÃO INDISPONÍVEL";
            case 3: return "TIMEOUT";
            default: return "ERRO DESCONHECIDO";
        }
    }
}

// Global instance
window.tracking = new Tracking();
