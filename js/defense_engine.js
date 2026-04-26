/**
 * DefenseEngine v2.0 - Advanced SOC Simulation
 * Blue Team training with MITRE ATT&CK, SIEM metrics (MTTD/MTTR), and modern attack vectors.
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
        this.customRules = [];
        this.startTime = null;
        this.detectedCount = 0;
        this.blockedCount = 0;
        this.survivalTicks = 0;
        this.winThreshold = 25; // survive 25 attack cycles to win
    }

    addCustomRule(name, pattern) {
        try {
            this.customRules.push({ name, pattern: new RegExp(pattern, 'i') });
            this.log(`[FIREWALL] Nova regra aplicada: "${name}" | Padrão: /${pattern}/i`, 'success');
            if (window.os) os.showNotification('Regra Customizada Ativada!', 'success');
        } catch(e) {
            this.log(`[FIREWALL] Padrão inválido: ${e.message}`, 'danger');
        }
    }

    startSimulation() {
        this.isActive = true;
        this.threatLevel = 0;
        this.logs = [];
        this.activeCountermeasures.clear();
        this.survivalTicks = 0;
        this.detectedCount = 0;
        this.blockedCount = 0;
        this.startTime = Date.now();
        this.log('SOC: Sistema de monitoramento ativado. SIEM online. Aguardando telemetria...', 'info');
        this.log('THREAT INTEL: Feeds MITRE ATT&CK carregados. CVE database atualizada.', 'info');
        this.simulationTimer = setInterval(() => this.generateAttack(), 3000);
    }

    stopSimulation() {
        this.isActive = false;
        clearInterval(this.simulationTimer);
    }

    getMTTD() {
        if (!this.detectedCount) return 'N/A';
        const elapsed = (Date.now() - this.startTime) / 1000;
        return Math.round(elapsed / this.detectedCount) + 's';
    }

    generateAttack() {
        if (!this.isActive) return;

        const attacks = [
            { type: 'INJECTION',       pattern: "GET /login?id=' OR 1=1--",                    risk: 15, mitre: 'T1190' },
            { type: 'BRUTEFORCE',      pattern: "POST /auth - 50 req/s from 192.168.1.45",      risk: 20, mitre: 'T1110' },
            { type: 'XSS',             pattern: "GET /search?q=<script>alert(document.cookie)</script>", risk: 10, mitre: 'T1059.007' },
            { type: 'SCAN',            pattern: "Nmap TCP SYN Scan from 10.0.0.15 [T4 -A]",   risk: 5,  mitre: 'T1046' },
            { type: 'RCE',             pattern: "POST /upload payload=; cat /etc/passwd",       risk: 30, mitre: 'T1059' },
            { type: 'RANSOMWARE',      pattern: "ALERT: Processo criptografando arquivos em massa (/var/data/*.enc)", risk: 40, mitre: 'T1486' },
            { type: 'LATERAL_MOVE',    pattern: "SMB lateral: 192.168.1.45 → 192.168.1.100 (Pass-the-Hash)", risk: 25, mitre: 'T1550.002' },
            { type: 'PHISHING',        pattern: "Email suspeito: 'Urgent: Reset your password' from noreply@c0rp.com", risk: 15, mitre: 'T1566.001' },
            { type: 'SUPPLY_CHAIN',    pattern: "Dependência npm maliciosa detectada: lodash@4.17.20 (typosquatting)", risk: 35, mitre: 'T1195.002' },
            { type: 'ZERO_DAY',        pattern: "Exploit desconhecido em Apache httpd 2.4.51 (WAF bypass detectado)", risk: 45, mitre: 'T1203' },
            { type: 'CREDENTIAL_DUMP', pattern: "LSASS.exe acessado por process injection - possível Mimikatz",      risk: 35, mitre: 'T1003.001' },
            { type: 'SSRF',            pattern: "GET /proxy?url=http://169.254.169.254/latest/meta-data/",            risk: 20, mitre: 'T1552.005' }
        ];

        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        this.detectedCount++;
        
        if (this.isMitigated(attack)) {
            this.blockedCount++;
            this.log(`[BLOQUEADO] [${attack.mitre}] ${attack.type} mitigado por contra-medida ativa.`, 'success');
            this.survivalTicks++;
            this.checkWinCondition();
            return;
        }

        this.threatLevel = Math.min(100, this.threatLevel + attack.risk);
        this.log(`[ALERTA] [${attack.mitre}] ${attack.type}: ${attack.pattern}`, 'danger');

        if (this.autoDefense && this.threatLevel > 40) {
            this.deployAutoDefense(attack.type);
        }

        if (this.threatLevel >= 100) {
            this.log('!!! BREACH DETECTADO - SISTEMA COMPROMETIDO !!!', 'critical');
            this.stopSimulation();
            window.dispatchEvent(new CustomEvent('defense_failed'));
        }

        window.dispatchEvent(new CustomEvent('threat_update', { detail: { level: this.threatLevel, mttd: this.getMTTD(), blocked: this.blockedCount, detected: this.detectedCount } }));
    }

    checkWinCondition() {
        if (this.survivalTicks >= this.winThreshold && this.threatLevel < 50) {
            this.log(`🏆 BLUE TEAM VENCEU! Sistema protegido por ${this.survivalTicks} ciclos. MTTD: ${this.getMTTD()}`, 'success');
            this.stopSimulation();
            window.dispatchEvent(new CustomEvent('defense_won', { detail: { ticks: this.survivalTicks, mttd: this.getMTTD() } }));
        }
        window.dispatchEvent(new CustomEvent('threat_update', { detail: { level: this.threatLevel, mttd: this.getMTTD(), blocked: this.blockedCount, detected: this.detectedCount } }));
    }

    isMitigated(attack) {
        const type = attack.type;
        if ((type === 'INJECTION' || type === 'XSS') && this.activeCountermeasures.has('WAF_SQLI')) return true;
        if (type === 'XSS' && this.activeCountermeasures.has('WAF_XSS')) return true;
        if ((type === 'BRUTEFORCE' || type === 'SCAN') && this.activeCountermeasures.has('IP_BLOCK')) return true;
        if ((type === 'RCE' || type === 'ZERO_DAY') && this.activeCountermeasures.has('VIRTUAL_PATCH')) return true;
        if (type === 'RANSOMWARE' && this.activeCountermeasures.has('EDR')) return true;
        if (type === 'LATERAL_MOVE' && this.activeCountermeasures.has('ZERO_TRUST')) return true;
        if (type === 'PHISHING' && this.activeCountermeasures.has('EMAIL_FILTER')) return true;
        if (type === 'SUPPLY_CHAIN' && this.activeCountermeasures.has('SCA_SCAN')) return true;
        if (type === 'CREDENTIAL_DUMP' && this.activeCountermeasures.has('MFA')) return true;
        if (type === 'SSRF' && this.activeCountermeasures.has('WAF_SQLI')) return true;

        for (const rule of this.customRules) {
            if (rule.pattern.test(attack.pattern)) {
                this.log(`[CUSTOM RULE] "${rule.name}" bloqueou: ${attack.type}`, 'success');
                return true;
            }
        }
        return false;
    }

    deployCountermeasure(id) {
        this.activeCountermeasures.add(id);
        const labels = {
            WAF_SQLI:     'WAF Anti-SQLi/SSRF ativado',
            WAF_XSS:      'WAF Anti-XSS/CSP ativado',
            IP_BLOCK:      'IPS: IP suspeito bloqueado',
            VIRTUAL_PATCH: 'Virtual Patch aplicado (RCE/ZeroDay)',
            EDR:           'EDR: Endpoint Detection & Response ativado',
            ZERO_TRUST:    'Zero Trust: Segmentação de rede aplicada',
            EMAIL_FILTER:  'Filtro Anti-Phishing/DMARC ativado',
            SCA_SCAN:      'SCA: Varredura de dependências ativada',
            MFA:           'MFA obrigatório: Credential Dump bloqueado'
        };
        this.log(`[DEFESA] ${labels[id] || id} implantado.`, 'success');
        this.threatLevel = Math.max(0, this.threatLevel - 20);
        window.dispatchEvent(new CustomEvent('threat_update', { detail: { level: this.threatLevel, mttd: this.getMTTD(), blocked: this.blockedCount, detected: this.detectedCount } }));
    }

    deployAutoDefense(type) {
        this.log('🤖 Gemma AI: Iniciando mitigação automatizada (SOAR)...', 'info');
        const mapping = {
            INJECTION: 'WAF_SQLI', BRUTEFORCE: 'IP_BLOCK', XSS: 'WAF_XSS',
            RCE: 'VIRTUAL_PATCH', RANSOMWARE: 'EDR', LATERAL_MOVE: 'ZERO_TRUST',
            PHISHING: 'EMAIL_FILTER', SUPPLY_CHAIN: 'SCA_SCAN', CREDENTIAL_DUMP: 'MFA',
            SSRF: 'WAF_SQLI', ZERO_DAY: 'VIRTUAL_PATCH', SCAN: 'IP_BLOCK'
        };
        const rule = mapping[type];
        if (rule && !this.activeCountermeasures.has(rule)) this.deployCountermeasure(rule);
    }

    log(msg, type = 'default') {
        const entry = { msg, type, time: new Date().toLocaleTimeString() };
        this.logs.unshift(entry);
        if (this.logs.length > 30) this.logs.pop();
        window.dispatchEvent(new CustomEvent('defense_log', { detail: entry }));
    }
}

window.defense = new DefenseEngine(window.gemma);
