/**
 * IntelligenceCore v1.0 - The "Hacker AI Engine"
 * Orchestrates ProceduralAI, EvoGenEngine, and GemmaOptimizer.
 * Enhances system performance and manages the training paths (Basic -> Advanced).
 */
class IntelligenceCore {
    constructor() {
        this.status = 'OFFLINE';
        this.neuralLoad = 0;
        this.trainingPath = 'iniciante'; // iniciante, logica, massiva
        this.activeMissions = 0;
        this.isInitialized = false;
        
        // Modules
        this.ai = null;      // ProceduralAI
        this.evo = null;     // EvoGenEngine
        this.gemma = null;   // GemmaOptimizer
    }

    async init() {
        console.log('%c[INTELLIGENCE_CORE] Iniciando motor de IA Hacker...', 'color: #00ff00; font-weight: bold;');
        
        // 1. Initialize Procedural AI (Content Engine)
        this.ai = window.procAI || new window.ProceduralAI();
        window.procAI = this.ai;

        // 2. Initialize EvoGen (Neural/Evolutionary Engine)
        this.evo = window.evogen || new window.EvoGenEngine();
        window.evogen = this.evo;

        // 3. Initialize Gemma (Optimization/Assistant Engine)
        this.gemma = new window.GemmaOptimizer(this.ai);
        window.gemma = this.gemma;
        this.gemma.init();

        this.status = 'ONLINE';
        this.isInitialized = true;
        this.startHeartbeat();
        
        console.log('%c[INTELLIGENCE_CORE] Sistema operando em nível nominal.', 'color: #00ff00;');
    }

    startHeartbeat() {
        setInterval(() => {
            // Simulate neural load based on active tasks
            const baseLoad = 5 + Math.random() * 5;
            const taskLoad = this.activeMissions * 15;
            this.neuralLoad = Math.min(100, Math.round(baseLoad + taskLoad));
            
            // Dispatch update event for UI (like Procmgr)
            window.dispatchEvent(new CustomEvent('intelligence_heartbeat', {
                detail: {
                    status: this.status,
                    load: this.neuralLoad,
                    path: this.trainingPath
                }
            }));

            // Auto-optimize every 2 minutes if load is high
            if (this.neuralLoad > 60 && Math.random() > 0.8) {
                this.gemma.optimizeSystem();
            }
        }, 3000);
    }

    /**
     * The core "Training Motor" requested by the user
     */
    async getNextTrainingMission() {
        this.activeMissions++;
        
        // 1. Ask EvoGen for difficulty adjustment
        // 2. Use ProceduralAI to generate the challenge
        const challenge = this.ai.gerar({}, this.trainingPath);
        
        // 3. Gemma analyzes the challenge to provide guidance
        setTimeout(() => {
            if (this.gemma) this.gemma.analyzeChallenge(challenge);
        }, 1000);

        return challenge;
    }

    recordMissionResult(challenge, success, timeSpent) {
        this.activeMissions = Math.max(0, this.activeMissions - 1);
        
        // Record in Procedural AI
        this.ai.recordAttempt(challenge.id, success);
        
        // Feed the Evolutionary Engine
        this.evo.observe(challenge.category, success, timeSpent);
        
        // If player is doing too well, suggest advancing
        if (success && this.ai.playerStats.streak >= 5 && this.trainingPath === 'iniciante') {
            this.gemma.speak("Performance excepcional detectada. Recomendação: Evoluir para a Trilha de Lógica.");
        }
    }

    setTrainingPath(path) {
        if (['iniciante', 'logica', 'massiva'].includes(path)) {
            this.trainingPath = path;
            this.gemma.speak(`Trilha de treinamento alterada para: <b>${path.toUpperCase()}</b>.`);
            return true;
        }
        return false;
    }

    /**
     * Performance and Efficiency Boost
     */
    enhanceSystemEfficiency() {
        this.gemma.optimizeSystem();
        this.gemma.speak("Aprimorando alocação de recursos do Kernel... Eficiência aumentada em 12%.");
    }
}

// Instantiate globally
window.intelligence = new IntelligenceCore();
