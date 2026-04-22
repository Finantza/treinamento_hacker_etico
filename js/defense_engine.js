/**
 * DefenseEngine v1.0 - Active Intrusion Tracking & Countermeasures
 * Simulates a SOC environment for Blue Team training.
 */
class DefenseEngine {
    constructor(gemmaInstance) {
        this.gemma = gemmaInstance;
        this.threatLevel = 0;
        this.isActive = false;
        this.logs = [];
        this.activeCountermeasures = new Set();
        this.autoDefense = false;
        this.simulationTimer = null;
        this.customRules = []; // User-created rules
    }

    addCustomRule(name, pattern) {
        this.customRules.push({ name, pattern: new RegExp(pattern, 'i') });
        this.log(`[FIREWALL] Nova regra personalizada aplicada: ${name}`, 'success');
        os.showNotification('Regra Customizada Ativada!', 'success');
    }

    startSimulation() {
        this.isActive = true;
        this.threatLevel = 0;
        this.logs = [];
        this.activeCountermeasures.clear();
        this.log('SOC: Sistema de monitoramento ativado. Aguardando telemetria...');
        
        this.simulationTimer = setInterval(() => this.generateAttack(), 3000);
    }

    stopSimulation() {
        this.isActive = false;
        clearInterval(this.simulationTimer);
    }

    generateAttack() {
        if (!this.isActive) return;

        const attacks = [
            { type: 'INJECTION', pattern: "GET /login?id=' OR 1=1--", risk: 15 },
            { type: 'BRUTEFORCE', pattern: "POST /auth - 50 attempts/sec from 192.168.1.45", risk: 20 },
            { type: 'XSS', pattern: "GET /search?q=<script>alert(document.cookie)</script>", risk: 10 },
            { type: 'SCAN', pattern: "TCP Port Scan detected from 10.0.0.15", risk: 5 },
            { type: 'RCE', pattern: "POST /upload payload=; cat /etc/passwd", risk: 30 }
        ];

        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        
        // Check if mitigated
        if (this.isMitigated(attack)) {
            this.log(`[BLOQUEADO] Tentativa de ${attack.type} mitigada por regra ativa.`);
            return;
        }

        this.threatLevel += attack.risk;
        this.log(`[ALERTA] ${attack.type} detectado: ${attack.pattern}`, 'danger');

        if (this.autoDefense && this.threatLevel > 40) {
            this.deployAutoDefense(attack.type);
        }

        if (this.threatLevel >= 100) {
            this.log('!!! SISTEMA COMPROMETIDO !!!', 'critical');
            this.stopSimulation();
            window.dispatchEvent(new CustomEvent('defense_failed'));
        }

        window.dispatchEvent(new CustomEvent('threat_update', { detail: { level: this.threatLevel } }));
    }

    isMitigated(attack) {
        // 1. Check Standard Countermeasures
        const type = attack.type;
        if (type === 'INJECTION' && this.activeCountermeasures.has('WAF_SQLI')) return true;
        if (type === 'BRUTEFORCE' && this.activeCountermeasures.has('IP_BLOCK')) return true;
        if (type === 'XSS' && this.activeCountermeasures.has('WAF_XSS')) return true;
        if (type === 'SCAN' && this.activeCountermeasures.has('IP_BLOCK')) return true;
        if (type === 'RCE' && this.activeCountermeasures.has('VIRTUAL_PATCH')) return true;

        // 2. Check Custom User Rules
        for (const rule of this.customRules) {
            if (rule.pattern.test(attack.pattern)) {
                this.log(`[CUSTOM] Ataque mitigado por regra do usuário: ${rule.name}`, 'success');
                return true;
            }
        }
        
        return false;
    }

    deployCountermeasure(id) {
        this.activeCountermeasures.add(id);
        this.log(`[DEFESA] Contra-medida ${id} implantada com sucesso.`, 'success');
        this.threatLevel = Math.max(0, this.threatLevel - 20);
        window.dispatchEvent(new CustomEvent('threat_update', { detail: { level: this.threatLevel } }));
    }

    deployAutoDefense(type) {
        this.log('Gemma AI: Iniciando mitigação automatizada...', 'info');
        const mapping = {
            'INJECTION': 'WAF_SQLI',
            'BRUTEFORCE': 'IP_BLOCK',
            'XSS': 'WAF_XSS',
            'RCE': 'VIRTUAL_PATCH'
        };
        const rule = mapping[type];
        if (rule) this.deployCountermeasure(rule);
    }

    log(msg, type = 'default') {
        const entry = { msg, type, time: new Date().toLocaleTimeString() };
        this.logs.unshift(entry);
        if (this.logs.length > 20) this.logs.pop();
        window.dispatchEvent(new CustomEvent('defense_log', { detail: entry }));
    }
}

window.defense = new DefenseEngine(window.gemma);
