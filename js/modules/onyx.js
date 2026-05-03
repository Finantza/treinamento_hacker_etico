/**
 * Onyx Assistant Module - CyberOS Elite
 * Floating AI assistant for real-time guidance.
 */

class OnyxAssistant {
    constructor() {
        this.isVisible = false;
    }

    init() {
        const buddy = document.getElementById('onyx-buddy');
        if (buddy) {
            buddy.classList.remove('d-none');
            buddy.addEventListener('click', () => this.say("Analisando vetores de ataque em tempo real... O sistema está 98.4% otimizado."));
            this.say("Saudações, Agente. Onyx v2.4 (Gemma Core) está operacional.");
        }
    }

    say(msg) {
        const bubble = document.querySelector('.onyx-bubble');
        if (bubble) {
            bubble.innerHTML = `
                <div class="small fw-bold text-primary mb-1">ONYX INTEL</div>
                <div class="text-white small mb-2">${msg}</div>
                <div class="onyx-detail-box bg-black p-2 rounded border-start border-primary" style="font-size: 0.7rem;">
                    <span class="text-info cursor-pointer" onclick="onyx.performAudit()">[ EXECUTAR AUDITORIA ]</span>
                </div>
            `;
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), 6000);
        }
    }

    performAudit() {
        this.say("Varredura Heurística: <br>• Kernel: Íntegro<br>• Firewall: Ativo<br>• Vulnerabilidades: 0 críticas<br>• Status: Protegido.");
        os.showNotification("Auditoria de segurança concluída.", "success");
    }

    renderWindow() {
        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="text-center mb-4">
                    <div class="mx-auto bg-primary rounded-circle mb-3 d-flex align-items-center justify-content-center shadow-glow" style="width: 60px; height: 60px;">
                        <i class="fas fa-robot fa-2x text-dark"></i>
                    </div>
                    <h4 class="text-primary">CENTRAL DE INTELIGÊNCIA ONYX</h4>
                    <p class="text-muted small">Otimização via Gemma AI & Neural Engine</p>
                </div>
                
                <div class="premium-glass p-3 font-monospace small bg-black border-primary mb-3" style="height: 180px; overflow-y: auto;">
                    <div class="text-info">[SYSTEM] Gemma Optimizer v2.4 inicializado...</div>
                    <div class="text-success">[OK] Latência de rede mitigada.</div>
                    <div class="text-info">[STATUS] Monitorando tráfego criptografado...</div>
                    <div class="text-warning">[WARN] Atividade suspeita detectada no Arena.</div>
                </div>

                <div class="row g-2">
                    <div class="col-6"><button class="btn btn-outline-primary w-100 btn-sm" onclick="onyx.performAudit()">AUDITORIA</button></div>
                    <div class="col-6"><button class="btn btn-outline-info w-100 btn-sm">OTIMIZAR OS</button></div>
                </div>
            </div>
        `;
        const container = document.getElementById('body-onyx');
        if (container) container.innerHTML = html;
    }
}

window.onyx = new OnyxAssistant();
