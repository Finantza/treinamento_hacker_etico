/**
 * GemmaOptimizer v4.5 - Neural System Assistant
 * Adaptive performance, heuristic analysis, and elite guidance.
 */
class GemmaOptimizer {
    constructor(procAIInstance) {
        this.procAI = procAIInstance;
        this.optimizationLog = [];
        this.lastAnalysisTime = 0;
        this.isBubbleOpen = false;
        this.autoHideTimer = null;
        this.isScanning = false;
        this.isOptimizing = false;
        
        // Technical Tracks mapping (Basic -> Advanced)
        this.skillTracks = {
            'RECON': ['nmap', 'dns', 'whois', 'osint'],
            'LOGIC': ['sqli', 'nosql', 'broken_auth'],
            'EXPLOITATION': ['rce', 'bof', 'xss', 'deserialization']
        };

        this.greetings = [
            "Gemma Core online. Detectando padrões de aprendizado...",
            "Conexão neural estabilizada. Otimização do sistema em 98.4%.",
            "Saudações, Agente. Deseja uma análise heurística da sua última missão?",
            "Monitorando vetores de ataque em tempo real. Como posso ajudar?"
        ];
    }

    init() {
        const buddy = document.getElementById('onyx-buddy');
        if (buddy) {
            console.log('%c[GEMMA AI] Interface Neural Inicializada.', 'color: #00d9ff; font-weight: bold;');
            buddy.classList.remove('d-none');
            buddy.style.display = 'flex'; 
            
            // Welcome message
            setTimeout(() => {
                this.speak(this.greetings[Math.floor(Math.random() * this.greetings.length)]);
            }, 3000);
        }
    }

    toggleBubble() {
        const bubble = document.getElementById('onyx-bubble');
        if (!bubble) return;

        this.isBubbleOpen = !this.isBubbleOpen;
        if (this.isBubbleOpen) {
            bubble.classList.add('show');
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = setTimeout(() => {
                if (this.isBubbleOpen) this.toggleBubble();
            }, 12000);
        } else {
            bubble.classList.remove('show');
        }
    }

    speak(text, duration = 8000) {
        const bubble = document.getElementById('onyx-bubble');
        const content = document.getElementById('onyx-bubble-content');
        if (!bubble || !content) return;

        content.innerHTML = `
            <div class="animate__animated animate__fadeIn">
                <div class="d-flex align-items-center mb-2">
                    <div class="onyx-status-dot me-2 animate__animated animate__pulse animate__infinite"></div>
                    <span class="text-info x-small fw-bold">GEMMA_INTEL_STREAM</span>
                </div>
                <div class="small text-white-50">${text}</div>
                <div class="onyx-typing-dots mt-2"><span></span><span></span><span></span></div>
            </div>
        `;
        
        if (!this.isBubbleOpen) {
            bubble.classList.add('show');
            this.isBubbleOpen = true;
        }

        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(() => {
            bubble.classList.remove('show');
            this.isBubbleOpen = false;
        }, duration);
    }

    /**
     * Heuristic analysis of player performance
     */
    analyzeSystem() {
        if (!this.procAI || !this.procAI.playerStats) return null;

        const stats = this.procAI.playerStats;
        const analysis = {
            weaknesses: [],
            needsOptimization: false,
            technicalProfile: this.calculateTechnicalProfile()
        };

        // Check for struggling areas (accuracy < 50%)
        Object.entries(stats.categoryStats || {}).forEach(([cat, data]) => {
            const total = data.solved + data.failed;
            if (total >= 2) {
                const accuracy = (data.solved / total) * 100;
                if (accuracy < 50) {
                    analysis.weaknesses.push({ cat, accuracy });
                    analysis.needsOptimization = true;
                }
            }
        });

        return analysis;
    }

    calculateTechnicalProfile() {
        if (!this.procAI || !this.procAI.playerStats) return {};
        const stats = this.procAI.playerStats.categoryStats || {};
        const profile = {};
        
        Object.entries(this.skillTracks).forEach(([track, cats]) => {
            let solved = 0;
            let total = 0;
            cats.forEach(cat => {
                const data = stats[cat] || { solved: 0, failed: 0 };
                solved += data.solved;
                total += (data.solved + data.failed);
            });
            profile[track] = total > 0 ? Math.round((solved / total) * 100) : 0;
        });
        
        return profile;
    }

    /**
     * Adaptive System Optimization
     * Adjusts challenge weights and system feedback based on analysis
     */
    optimizeSystem() {
        if (this.isOptimizing) return;
        this.isOptimizing = true;
        
        const analysis = this.analyzeSystem();
        if (!analysis) {
            this.isOptimizing = false;
            return;
        }

        this.lastAnalysisTime = Date.now();

        if (analysis.needsOptimization) {
            const primaryWeakness = analysis.weaknesses[0].cat;
            this.speak(`Análise Heurística completa. Detectada baixa eficiência em <b>${primaryWeakness.toUpperCase()}</b>. Otimizando trilha de treinamento para reforçar fundamentos.`, 10000);
            
            // Adjust weights in Procedural AI
            analysis.weaknesses.forEach(w => {
                if (this.procAI.categories[w.cat]) {
                    const currentWeight = this.procAI.categories[w.cat].weight;
                    this.procAI.categories[w.cat].weight = Math.min(currentWeight * 1.4, 60);
                }
            });
            this.log(`Otimização aplicada para: ${primaryWeakness}`);
        } else {
            this.log(`Sistema operando em alta eficiência.`);
        }

        setTimeout(() => { this.isOptimizing = false; }, 3000);
    }

    scanIntegrity() {
        if (this.isScanning) return;
        this.isScanning = true;
        this.speak("Iniciando auditoria de integridade do Kernel e memória volátil...", 4000);
        
        setTimeout(() => {
            const auditResult = Math.random() > 0.8 ? "Anomalias leves detectadas no SecurityVault." : "Integridade do sistema verificada: 100%.";
            this.speak(`<b>Relatório de Auditoria:</b><br>${auditResult}<br>Status: Protegido.`, 8000);
            this.isScanning = false;
            this.log("Auditoria manual concluída.");
        }, 4000);
    }

    log(message) {
        const entry = {
            time: new Date().toLocaleTimeString(),
            message,
            id: 'gemma-' + Date.now()
        };
        this.optimizationLog.unshift(entry);
        if (this.optimizationLog.length > 30) this.optimizationLog.pop();
        window.dispatchEvent(new CustomEvent('gemma_log', { detail: entry }));
    }
}

// Global initialization logic handled by IntelligenceCore
window.GemmaOptimizer = GemmaOptimizer;
