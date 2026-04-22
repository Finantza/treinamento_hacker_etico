/**
 * Gemma 4 System Optimizer - Cognitive Layer v1.0
 * Based on Gemma 4 architecture for specialized cybersecurity training optimization.
 */
class GemmaOptimizer {
    constructor(procAIInstance) {
        this.procAI = procAIInstance;
        this.optimizationLog = [];
        this.isOptimizing = false;
        this.lastAnalysisTime = 0;
        this.baselineWeights = JSON.parse(JSON.stringify(this.procAI.categories));
        
        // Technical Tracks mapping
        this.skillTracks = {
            'RECON': ['ssrf', 'lfi_rfi', 'idor', 'open_redirect'],
            'LOGIC': ['injection', 'auth', 'csrf', 'xxe'],
            'EXPLOITATION': ['rce', 'buffer_overflow', 'deserialization']
        };
    }

    /**
     * Calculate Proficiency in core tracks
     */
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

    /**
     * Deep Analysis of Player Performance
     */
    analyzeSystem() {
        const stats = this.procAI.playerStats;
        const analysis = {
            criticalWeaknesses: [],
            optimizationNeeds: false,
            recommendations: []
        };

        Object.entries(stats.categoryStats).forEach(([cat, data]) => {
            const total = data.solved + data.failed;
            if (total >= 3) {
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

    /**
     * Apply Dynamic Optimization (Gemma Weighting)
     */
    optimizeSystem() {
        if (this.isOptimizing) return;
        this.isOptimizing = true;
        
        const analysis = this.analyzeSystem();
        this.lastAnalysisTime = Date.now();

        if (analysis.optimizationNeeds) {
            this.log('Gemma 4: Detectada instabilidade cognitiva nos vetores reportados.');
            
            analysis.criticalWeaknesses.forEach(w => {
                // Increase weight for weaknesses to force more training
                const currentWeight = this.procAI.categories[w.cat].weight;
                const newWeight = Math.min(currentWeight * 1.5, 50); // Cap at 50
                this.procAI.categories[w.cat].weight = newWeight;
                
                this.log(`Otimizando pesos sinápticos para ${w.cat.toUpperCase()}: ${currentWeight} -> ${newWeight.toFixed(1)}`);
            });

            this.log('Gemma 4: Rebalanceamento de carga procedural concluído.');
        } else {
            this.log('Gemma 4: Sistemas em equilíbrio. Mantendobaseline operacional.');
        }

        setTimeout(() => { this.isOptimizing = false; }, 2000);
        return analysis;
    }

    log(message) {
        const entry = {
            time: new Date().toLocaleTimeString(),
            message,
            id: Date.now() + Math.random().toString(36).substr(2, 5)
        };
        this.optimizationLog.unshift(entry);
        if (this.optimizationLog.length > 50) this.optimizationLog.pop();
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('gemma_log', { detail: entry }));
    }

    getAuditReport() {
        const stats = this.procAI.playerStats;
        return {
            title: 'RELATÓRIO DE AUDITORIA GEMMA 4',
            timestamp: new Date().toISOString(),
            accuracy: stats.accuracy.toFixed(2) + '%',
            status: stats.accuracy > 80 ? 'EXCELENTE' : stats.accuracy > 50 ? 'ESTÁVEL' : 'CRÍTICO',
            logs: this.optimizationLog.slice(0, 10)
        };
    }
}

// Global Instance
window.gemma = new GemmaOptimizer(window.procAI);

// Periodic Analysis (every 60s)
setInterval(() => {
    if (window.gemma) window.gemma.optimizeSystem();
}, 60000);
