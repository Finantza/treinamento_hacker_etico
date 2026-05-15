/**
 * IntelligenceCore v2.0 - The "Hacker AI Engine"
 * Orchestrates ProceduralAI, EvoGenEngine, GemmaOptimizer, and HackerAIEngine.
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
        this.hackerAI = null; // HackerAIEngine
    }

    async init() {
        console.log('%c[INTELLIGENCE_CORE] Iniciando motor de IA Hacker...', 'color: #00ff00; font-weight: bold;');
        
        // 1. Initialize HackerAI Engine (Knowledge Base)
        this.hackerAI = window.HackerAIEngine;
        
        // 2. Initialize Procedural AI (Content Engine)
        this.ai = window.procAI || new window.ProceduralAI();
        window.procAI = this.ai;

        // 3. Initialize EvoGen (Neural/Evolutionary Engine)
        this.evo = window.evogen || new window.EvoGenEngine();
        window.evogen = this.evo;

        // 4. Initialize Gemma (Optimization/Assistant Engine)
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
            const baseLoad = 5 + Math.random() * 5;
            const taskLoad = this.activeMissions * 15;
            this.neuralLoad = Math.min(100, Math.round(baseLoad + taskLoad));
            
            window.dispatchEvent(new CustomEvent('intelligence_heartbeat', {
                detail: {
                    status: this.status,
                    load: this.neuralLoad,
                    path: this.trainingPath
                }
            }));

            if (this.neuralLoad > 60 && Math.random() > 0.8) {
                this.gemma.optimizeSystem();
            }
        }, 3000);
    }

    /**
     * Enhanced Training Motor
     * @param {string} moduleFilter - ID of the HackerAI module to focus on
     */
    async getNextTrainingMission(moduleFilter = null) {
        this.activeMissions++;
        
        let challenge;
        
        if (moduleFilter && this.hackerAI) {
            // Generate a specialized challenge based on the selected module
            const module = this.hackerAI.getModule(moduleFilter);
            challenge = this.generateSpecializedChallenge(module, moduleFilter);
        } else {
            // standard procedural generation
            challenge = this.ai.gerar({}, this.trainingPath);
        }
        
        // Feed to Gemma for guidance
        setTimeout(() => {
            if (this.gemma) this.gemma.analyzeChallenge(challenge);
        }, 1000);

        return challenge;
    }

    generateSpecializedChallenge(module, moduleId) {
        // Create a challenge object that matches the ProceduralAI format
        const difficulty = this.trainingPath;
        const category = module.name;
        
        // Select a random lesson or technique from the module
        let target = "General Knowledge";
        let detail = "Multiple technical aspects.";
        
        if (module.lessons && module.lessons.length > 0) {
            const lesson = module.lessons[Math.floor(Math.random() * module.lessons.length)];
            target = lesson.title;
            detail = lesson.topics ? lesson.topics[0] : (lesson.techniques ? lesson.techniques[0].name : "Training");
        }

        return {
            id: `specialized_${moduleId}_${Date.now()}`,
            category: category,
            title: `Missão: ${target}`,
            description: `A IA identificou necessidade de reforço em ${category}. Alvo: ${target}.`,
            objective: `Explorar vulnerabilidades relacionadas a ${detail}.`,
            difficulty: difficulty,
            mitre: `T${1000 + parseInt(moduleId)}`,
            options: this.ai.gerarAlternativas(target, difficulty), // Reuse ProcAI helper
            answer: 0 // Placeholder, we'd need more logic for real answers here
        };
    }

    recordMissionResult(challenge, success, timeSpent) {
        this.activeMissions = Math.max(0, this.activeMissions - 1);
        
        if (this.ai) this.ai.recordAttempt(challenge.id, success);
        if (this.evo) this.evo.observe(challenge.category, success, timeSpent);
        
        if (success && this.ai && this.ai.playerStats.streak >= 5 && this.trainingPath === 'iniciante') {
            this.gemma.speak("Performance excepcional. Recomendo evoluir para a Trilha de Lógica.");
        }
    }

    setTrainingPath(path) {
        if (['iniciante', 'logica', 'massiva'].includes(path)) {
            this.trainingPath = path;
            if (this.gemma) this.gemma.speak(`Trilha alterada para: <b>${path.toUpperCase()}</b>.`);
            return true;
        }
        return false;
    }

    enhanceSystemEfficiency() {
        if (this.gemma) {
            this.gemma.optimizeSystem();
            this.gemma.speak("Aprimorando alocação de recursos do Kernel... Eficiência aumentada em 12%.");
        }
    }
}

window.intelligence = new IntelligenceCore();
