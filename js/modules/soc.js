/**
 * SOC Module - CyberOS Elite
 * Security Operations Center simulation.
 */

class DefenseEngine {
    constructor() {
        this.threatLevel = 0;
        this.mttd = 0; // Mean Time To Detect
        this.interval = null;
        this.logs = [];
    }

    init() {
        this.threatLevel = 10;
        this.mttd = 0;
        this.logs = [{ time: new Date().toLocaleTimeString(), msg: "Sistemas normalizados. Monitoramento iniciado.", type: "success" }];
        this.render();
        this.startSimulation();
    }

    startSimulation() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            const vectors = [
                { name: 'Brute Force SSH', type: 'danger', weight: 15 },
                { name: 'SQL Injection Attempt', type: 'warning', weight: 8 },
                { name: 'Port Scan Detected', type: 'info', weight: 3 },
                { name: 'Lateral Movement Suspected', type: 'danger', weight: 20 },
                { name: 'DDoS Traffic Spike', type: 'danger', weight: 12 }
            ];

            const event = vectors[Math.floor(Math.random() * vectors.length)];
            this.threatLevel = Math.min(100, this.threatLevel + event.weight);
            this.logs.unshift({ time: new Date().toLocaleTimeString(), msg: `AMEAÇA: ${event.name}`, type: event.type });
            
            if (this.logs.length > 20) this.logs.pop();

            if (this.threatLevel >= 100) {
                this.threatLevel = 100;
                this.stopSimulation();
                os.showNotification("SISTEMA COMPROMETIDO!", "danger");
            }
            this.render();
        }, 3000);
    }

    stopSimulation() {
        if (this.interval) clearInterval(this.interval);
    }

    render() {
        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="premium-glass p-4 text-center border-info h-100">
                            <h6 class="text-info mb-1">NÍVEL DE AMEAÇA</h6>
                            <h2 class="${this.threatLevel > 70 ? 'text-danger' : 'text-success'}">${this.threatLevel}%</h2>
                            <div class="progress bg-dark mt-3" style="height: 5px;">
                                <div class="progress-bar ${this.threatLevel > 70 ? 'bg-danger' : 'bg-info'}" style="width: ${this.threatLevel}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="premium-glass p-4 h-100">
                            <h6 class="text-primary mb-3">LOGS DE SEGURANÇA (SOC)</h6>
                            <div class="bg-black p-3 rounded font-monospace small" style="height: 180px; overflow-y: auto;" id="soc-logs-container">
                                ${this.logs.map(l => `<div class="text-${l.type} mb-1">[${l.time}] ${l.msg}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row g-3 mt-4">
                    <div class="col-md-6">
                        <button class="btn btn-outline-info w-100 py-3" id="mitigate-btn">
                            <i class="fas fa-shield-alt me-2"></i> MITIGAR AMEAÇA
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-outline-warning w-100 py-3" id="scan-btn">
                            <i class="fas fa-search me-2"></i> ESCANEAMENTO PROFUNDO
                        </button>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('body-soc');
        if (container) {
            container.innerHTML = html;
            document.getElementById('mitigate-btn').addEventListener('click', () => this.mitigate());
            document.getElementById('scan-btn').addEventListener('click', () => this.scan());
        }
    }

    scan() {
        os.showNotification("Escaneamento profundo em andamento...", "info");
        this.logs.unshift({ time: new Date().toLocaleTimeString(), msg: "Iniciando verificação de integridade heurística...", type: "info" });
        setTimeout(() => {
            const result = Math.random() > 0.5 ? "Nenhum rootkit detectado." : "Processos suspeitos isolados.";
            this.logs.unshift({ time: new Date().toLocaleTimeString(), msg: `SCAN COMPLETO: ${result}`, type: "success" });
            this.render();
        }, 2000);
        this.render();
    }

    mitigate() {
        this.threatLevel = Math.max(0, this.threatLevel - 20);
        this.logs.unshift({ time: new Date().toLocaleTimeString(), msg: "Contra-medida aplicada. Ameaça reduzida.", type: "info" });
        this.render();
        os.showNotification("Ameaça mitigada.", "success");
    }
}

window.soc = new DefenseEngine();
