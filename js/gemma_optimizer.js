/**
 * ONYX System Assistant - Cybernetic & Training Layer v4.0
 */
class OnyxAssistant {
    constructor(procAIInstance) {
        this.procAI = procAIInstance;
        this.optimizationLog = [];
        this.lastAnalysisTime = 0;
        this.isBubbleOpen = false;
        this.autoHideTimer = null;
        this.isScanning = false;
        
        // Technical Tracks mapping
        this.skillTracks = {
            'injection': ['sql', 'nosql', 'ldap', 'command'],
            'xss': ['dom', 'stored', 'reflected'],
            'auth': ['jwt', 'session', 'oauth'],
            'recon': ['nmap', 'dns', 'whois']
        };

        this.greetings = [
            "ONYX online! Notei que você está explorando o sistema. Precisa de uma explicação detalhada sobre algo?",
            "Olá! Sou seu assistente ONYX. Estou monitorando sua performance para te ajudar a subir de nível!",
            "Conexão neural estabelecida. ONYX pronto para suporte técnico.",
            "Detectando atividade incomum... Deseja uma análise de vulnerabilidade?"
        ];
    }

    initBuddy() {
        const buddy = document.getElementById('onyx-buddy');
        if (buddy) {
            console.log('[ONYX] Inicializando Assistente...');
            buddy.classList.remove('d-none');
            buddy.style.display = 'flex'; // Force display
            setTimeout(() => {
                this.speak(this.greetings[Math.floor(Math.random() * this.greetings.length)]);
            }, 2000);
        } else {
            console.warn('[ONYX] Erro: Elemento #onyx-buddy não encontrado no DOM.');
        }
    }

    toggleBubble() {
        const bubble = document.getElementById('onyx-bubble');
        this.isBubbleOpen = !this.isBubbleOpen;
        if (this.isBubbleOpen) {
            bubble.classList.add('show');
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = setTimeout(() => this.toggleBubble(), 10000);
        } else {
            bubble.classList.remove('show');
        }
    }

    speak(text, duration = 6000) {
        const bubble = document.getElementById('onyx-bubble');
        const content = document.getElementById('onyx-bubble-content');
        if (!bubble || !content) return;

        content.innerHTML = `
            <div class="animate__animated animate__fadeIn">
                <p class="mb-2 text-info small fw-bold"><i class="fas fa-comment-dots me-2"></i>MENSAGEM DE ONYX</p>
                <div class="small">${text}</div>
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

    getAdvice(context) {
        const user = JSON.parse(localStorage.getItem('users') || '{}')[localStorage.getItem('currentUser')];
        if (!user) return "Aguardando login...";

        if (context === 'dashboard') {
            if (user.level < 2) return "ONYX: Comece com os desafios de Lógica para ganhar Reputation!";
            if (user.reputation < 100) return "ONYX: Você precisa de mais Reputation para desbloquear o Toolkit.";
            return "ONYX: Sistema estável. Continue explorando novas vulnerabilidades.";
        }
        return "Sempre valide os inputs antes de processar qualquer dado.";
    }

    analyzeChallenge(challenge) {
        if (!challenge) return;
        
        const cat = challenge.category;
        const hint = this.procAI.generateHint(challenge);
        
        const msg = `
            <b>Análise de Missão Detectada!</b><br>
            Você está enfrentando um desafio de <b>${cat.toUpperCase()}</b>. 
            Basicamente, o sistema tem uma falha onde ele aceita comandos que não deveria.<br>
            <div class='gemma-detail-box'>
                <i class='fas fa-lightbulb text-warning me-2'></i><b>DICA SIMPLIFICADA:</b><br>
                ${hint}<br><br>
                <span class='text-muted small'>Em termos leigos: Tente 'quebrar' a lógica do código usando caracteres especiais como aspas ou barras.</span>
            </div>
        `;
        this.speak(msg, 15000);
    }

    calculateTechnicalProfile() {
        const stats = this.procAI.playerStats.categoryStats;
        const profile = { RECON: 0, LOGIC: 0, EXPLOITATION: 0 };
        
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

    analyzeSystem() {
        const stats = this.procAI.playerStats;
        const analysis = {
            criticalWeaknesses: [],
            optimizationNeeds: false,
            recommendations: []
        };

        Object.entries(stats.categoryStats).forEach(([cat, data]) => {
            const total = data.solved + data.failed;
            if (total >= 2) {
                const accuracy = (data.solved / total) * 100;
                if (accuracy < 60) {
                    analysis.criticalWeaknesses.push({ cat, accuracy });
                    analysis.optimizationNeeds = true;
                }
            }
        });

        analysis.technicalProfile = this.calculateTechnicalProfile();
        return analysis;
    }

    optimizeSystem() {
        if (this.isOptimizing) return;
        this.isOptimizing = true;
        
        const analysis = this.analyzeSystem();
        this.lastAnalysisTime = Date.now();

        if (analysis.optimizationNeeds) {
            const weak = analysis.criticalWeaknesses[0].cat;
            this.speak(`Detectei que você está tendo um pouco de dificuldade em <b>${weak.toUpperCase()}</b>. Vou ajustar o sistema para te ajudar a praticar mais esse ponto!`, 10000);
            
            analysis.criticalWeaknesses.forEach(w => {
                const currentWeight = this.procAI.categories[w.cat].weight;
                const newWeight = Math.min(currentWeight * 1.5, 50);
                this.procAI.categories[w.cat].weight = newWeight;
            });
        }

        setTimeout(() => { this.isOptimizing = false; }, 2000);
        return analysis;
    }

    scanSystem() {
        if (this.isScanning) return;
        this.isScanning = true;
        this.speak("Iniciando varredura profunda de integridade do Kernel... Aguarde.", 3000);
        
        setTimeout(() => {
            const vfs = JSON.parse(localStorage.getItem('cyberos_virtual_fs') || '{"/var/log/invasions": []}');
            const logs = vfs["/var/log/invasions"];
            
            if (logs.length > 0) {
                this.speak(`Varredura concluída. Atenção: Detectei <b>${logs.length}</b> incidentes de segurança registrados em <code>/var/log/invasions</code>. O sistema de hardening está operando nominalmente.`, 10000);
            } else {
                this.speak("Varredura concluída. Integridade do sistema em 100%. Nenhuma violação detectada nos logs internos.", 8000);
            }
            this.isScanning = false;
        }, 3000);
    }

    log(message) {
        const entry = {
            time: new Date().toLocaleTimeString(),
            message,
            id: Date.now() + Math.random().toString(36).substr(2, 5)
        };
        this.optimizationLog.unshift(entry);
        if (this.optimizationLog.length > 50) this.optimizationLog.pop();
        window.dispatchEvent(new CustomEvent('gemma_log', { detail: entry }));
    }
}

// Global Instance & Integration
window.gemma = new GemmaAssistant(window.procAI);

// Global Toggle for UI
window.toggleGemmaBubble = () => {
    if (window.gemma) window.gemma.toggleBubble();
};

// Periodic Analysis (every 60s)
setInterval(() => {
    if (window.gemma) window.gemma.optimizeSystem();
}, 60000);
