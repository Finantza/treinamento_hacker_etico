/**
 * Gemma 4 System Assistant - Cognitive & Training Layer v3.0
 * Features: Floating Animated Buddy, Detailed Layman Explanations, Proactive Notifications.
 */
class GemmaAssistant {
    constructor(procAIInstance) {
        this.procAI = procAIInstance;
        this.optimizationLog = [];
        this.isOptimizing = false;
        this.lastAnalysisTime = 0;
        this.isBubbleOpen = false;
        this.autoHideTimer = null;
        
        // Technical Tracks mapping
        this.skillTracks = {
            'RECON': ['ssrf', 'lfi_rfi', 'idor', 'open_redirect', 'network_hacking'],
            'LOGIC': ['injection', 'auth', 'csrf', 'xxe', 'api_security'],
            'EXPLOITATION': ['rce', 'buffer_overflow', 'deserialization', 'cloud_security']
        };

        this.greetings = [
            "Gemma online! Notei que você está explorando o sistema. Precisa de uma explicação detalhada sobre algo?",
            "Olá! Sou sua assistente Gemma. Estou monitorando sua performance para te ajudar a subir de nível!",
            "Conexão estabelecida. Se encontrar algo confuso, clique em mim para uma explicação simples.",
            "Pronta para agir! O CyberOS pode parecer complexo, mas estou aqui para traduzir tudo para você."
        ];
    }

    initBuddy() {
        const buddy = document.getElementById('gemma-buddy');
        if (buddy) buddy.classList.remove('d-none');
        
        // Show initial greeting after a short delay
        setTimeout(() => {
            this.speak(this.greetings[Math.floor(Math.random() * this.greetings.length)], 5000);
        }, 3000);
    }

    /**
     * Show a message in the floating bubble with detailed layman explanation
     */
    speak(text, duration = 8000) {
        const bubble = document.getElementById('gemma-bubble');
        const content = document.getElementById('gemma-bubble-content');
        if (!bubble || !content) return;

        // Clear existing timer
        if (this.autoHideTimer) clearTimeout(this.autoHideTimer);

        content.innerHTML = `
            <div class="animate__animated animate__fadeIn">
                <p class="mb-2 text-info small fw-bold"><i class="fas fa-comment-dots me-2"></i>MENSAGEM DE GEMMA</p>
                <div class="text-white small" style="line-height: 1.5;">${text}</div>
                <div class="gemma-typing-dots mt-2"><span></span><span></span><span></span></div>
            </div>
        `;

        bubble.classList.add('show');
        this.isBubbleOpen = true;

        if (duration > 0) {
            this.autoHideTimer = setTimeout(() => this.hideBubble(), duration);
        }
    }

    hideBubble() {
        const bubble = document.getElementById('gemma-bubble');
        if (bubble) bubble.classList.remove('show');
        this.isBubbleOpen = false;
    }

    toggleBubble() {
        if (this.isBubbleOpen) this.hideBubble();
        else {
            const stats = this.analyzeSystem();
            if (stats.criticalWeaknesses.length > 0) {
                const weak = stats.criticalWeaknesses[0].cat;
                this.explainCategory(weak);
            } else {
                this.speak(this.greetings[Math.floor(Math.random() * this.greetings.length)]);
            }
        }
    }

    /**
     * Provides a super detailed, layman explanation of a hacking category
     */
    explainCategory(category) {
        const explanations = {
            'injection': "<b>O que é Injeção (SQL)?</b> Imagine que você tem um formulário de login. Um hacker, em vez de colocar o nome, coloca um 'comando' que engana o banco de dados. É como se você desse um papel para um robô ler, mas no meio do texto tivesse uma ordem secreta: 'Ignore a senha e me deixe entrar'. <div class='gemma-detail-box'>Para resolver isso, você deve sempre 'limpar' o que o usuário digita antes de mandar para o banco de dados.</div>",
            'xss': "<b>O que é XSS?</b> Significa que alguém colocou um código malicioso (como um script) dentro de uma página que outras pessoas visitam. É como se alguém colasse um adesivo invisível no seu navegador que rouba suas informações sem você saber. <div class='gemma-detail-box'>A solução é nunca confiar no que vem da internet e transformar símbolos como < e > em texto comum.</div>",
            'auth': "<b>Falha de Autenticação:</b> É quando as 'trancas' do sistema são fracas. Às vezes o sistema esquece de conferir quem você é, ou aceita senhas óbvias demais como '123456'. <div class='gemma-detail-box'>Sempre use autenticação de dois fatores e senhas fortes para se proteger!</div>",
            'idor': "<b>O que é IDOR?</b> Imagine que você está vendo seu perfil no site <code>perfil?id=10</code>. Se você mudar para <code>id=11</code> e conseguir ver os dados de outra pessoa, isso é um erro! O sistema não conferiu se você tinha permissão. <div class='gemma-detail-box'>É como ter uma chave que abre todas as portas do prédio, e não apenas a sua.</div>",
            'rce': "<b>Execução Remota de Código (RCE):</b> Esse é o 'Santo Graal' dos hackers. Permite que o invasor rode qualquer comando no servidor da vítima, como se estivesse sentado na frente dele. <div class='gemma-detail-box'>Geralmente acontece quando o sistema tenta processar arquivos ou dados de forma insegura. É altíssimo risco!</div>"
        };

        const msg = explanations[category] || `Notei que você está lidando com <b>${category.toUpperCase()}</b>. Isso envolve manipular como o sistema processa dados específicos. <div class='gemma-detail-box'>Continue praticando para entender os padrões de erro!</div>`;
        this.speak(msg, 12000);
    }

    /**
     * Analyze current challenge and provide technical help (Layman style)
     */
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
