/**
 * Bot War Module - CyberOS Elite
 * Red vs Blue AI Simulation.
 */

class BotWarEngine {
    constructor() {
        this.systemIntegrity = 100;
        this.exploitProgress = 0;
        this.isActive = false;
        this.interval = null;
        this.history = [];
        this.blueWinTicks = 0;
        this.blueWinThreshold = 15;
    }

    init() {
        this.render();
    }

    render() {
        const html = `
            <div class="p-4 animate__animated animate__fadeIn h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 class="text-danger mb-0"><i class="fas fa-robot me-2"></i>BOT WAR ARENA</h3>
                        <p class="text-muted small">Simulação de ataque e defesa autônomos</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-danger btn-sm px-4" id="bot-start" ${this.isActive ? 'disabled' : ''}>INICIAR</button>
                        <button class="btn btn-outline-secondary btn-sm" id="bot-stop" ${!this.isActive ? 'disabled' : ''}>PARAR</button>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <div class="premium-glass p-3 border-success">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="small fw-bold text-success">INTEGRIDADE DO SISTEMA</span>
                                <span class="small fw-bold">${this.systemIntegrity}%</span>
                            </div>
                            <div class="progress bg-black" style="height: 10px;">
                                <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" style="width: ${this.systemIntegrity}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="premium-glass p-3 border-danger">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="small fw-bold text-danger">PROGRESSO DO EXPLOIT</span>
                                <span class="small fw-bold">${this.exploitProgress}%</span>
                            </div>
                            <div class="progress bg-black" style="height: 10px;">
                                <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width: ${this.exploitProgress}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-grow-1 bg-black rounded p-3 border border-secondary font-monospace small mb-3" style="overflow-y: auto;" id="bot-logs">
                    ${this.history.length === 0 ? '<div class="text-muted">[SISTEMA] Aguardando início do protocolo...</div>' : ''}
                    ${this.history.map(h => `<div class="mb-1 text-${h.type}"><span class="text-muted">[${h.time}]</span> ${h.msg}</div>`).join('')}
                </div>
            </div>
        `;

        const container = document.getElementById('body-botwar');
        if (container) {
            container.innerHTML = html;
            document.getElementById('bot-start').addEventListener('click', () => botWar.startDuel());
            document.getElementById('bot-stop').addEventListener('click', () => botWar.stopDuel());
        }
    }

    startDuel() {
        this.isActive = true;
        this.systemIntegrity = 100;
        this.exploitProgress = 0;
        this.history = [];
        this.blueWinTicks = 0;
        this.log("Protocolo de simulação iniciado.", "info");
        this.render();
        this.interval = setInterval(() => this.tick(), 2000);
    }

    stopDuel() {
        this.isActive = false;
        clearInterval(this.interval);
        this.log("Protocolo interrompido pelo usuário.", "warning");
        this.render();
    }

    tick() {
        if (!this.isActive) return;

        const attacks = [
            { name: 'SQL Injection', damage: 15, mitre: 'T1190' },
            { name: 'Buffer Overflow', damage: 25, mitre: 'T1203' },
            { name: 'Ransomware', damage: 40, mitre: 'T1486' },
            { name: 'Phishing', damage: 10, mitre: 'T1566' }
        ];
        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        
        this.log(`[RED] Ataque detectado: ${attack.name} (${attack.mitre})`, 'danger');

        setTimeout(() => {
            const success = Math.random() < 0.6; // 60% chance of defense
            if (success) {
                this.log(`[BLUE] Ameaça neutralizada via Virtual Patching.`, 'success');
                this.exploitProgress = Math.max(0, this.exploitProgress - 5);
                this.blueWinTicks++;
            } else {
                this.log(`[RED] Exploit bem sucedido! Integridade afetada.`, 'warning');
                this.systemIntegrity = Math.max(0, this.systemIntegrity - attack.damage);
                this.exploitProgress = Math.min(100, this.exploitProgress + 10);
                this.blueWinTicks = 0;
            }

            if (this.systemIntegrity <= 0 || this.exploitProgress >= 100) {
                this.log("!!! SISTEMA COMPROMETIDO !!!", "danger");
                this.stopDuel();
            } else if (this.blueWinTicks >= this.blueWinThreshold) {
                this.log("!!! VITÓRIA DA DEFESA: ALVO SEGURO !!!", "success");
                this.stopDuel();
            }

            this.render();
        }, 800);
    }

    log(msg, type = 'info') {
        const entry = { msg, type, time: new Date().toLocaleTimeString() };
        this.history.unshift(entry);
        if (this.history.length > 50) this.history.pop();
    }
}

window.botWar = new BotWarEngine();
