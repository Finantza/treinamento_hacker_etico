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
            // === FALSOS POSITIVOS (Tráfego Legítimo) ===
            { type: 'LEGIT_TRAFFIC',      pattern: "Acesso legítimo: CEO acessando o ERP via VPN", risk: 0, mitre: 'N/A', isFalsePositive: true },
            { type: 'LEGIT_TRAFFIC',      pattern: "Scanner de vulnerabilidade interno (Nessus Autorizado)", risk: 0, mitre: 'N/A', isFalsePositive: true },
            { type: 'LEGIT_TRAFFIC',      pattern: "Backup agendado para S3", risk: 0, mitre: 'N/A', isFalsePositive: true },
            
            // === RECONNAISSANCE (TA0043) ===
            { type: 'ACTIVE_SCANNING',    pattern: "TCP SYN Scan - 192.168.1.0/24 [Nmap -sS]",                    risk: 5,  mitre: 'T1595' },
            { type: 'VULN_SCANNING',       pattern: "Vulnerability Scan - Nessus detected CVE-2024-1234",            risk: 10, mitre: 'T1595.002' },
            
            // === INITIAL ACCESS (TA0001) ===
            { type: 'INJECTION',          pattern: "GET /login?id=' OR 1=1--",                                       risk: 15, mitre: 'T1190' },
            { type: 'PHISHING',           pattern: "Email: 'Urgent: Invoice attached' from ceo@legit-company.com",  risk: 15, mitre: 'T1566.001' },
            { type: 'EXTERNAL_REMOTE',    pattern: "VPN brute force from 45.33.32.156 - 5000 attempts",             risk: 20, mitre: 'T1133' },
            { type: 'VALID_ACCOUNTS',     pattern: "Compromised admin account - login from unusual location",      risk: 25, mitre: 'T1078' },
            
            // === EXECUTION (TA0002) ===
            { type: 'POWERSHELL_MALICIOUS', pattern: "PowerShell encoded command - DownloadString + IEX",          risk: 20, mitre: 'T1059.001' },
            { type: 'SCHEDULED_TASK',     pattern: "Suspicious scheduled task: 'Update-Service' at 02:00",          risk: 15, mitre: 'T1053.005' },
            { type: 'RCE',                pattern: "POST /upload payload=; cat /etc/passwd",                         risk: 30, mitre: 'T1059' },
            
            // === PERSISTENCE (TA0003) ===
            { type: 'REGISTRY_RUN_KEY',   pattern: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run - malware.exe", risk: 20, mitre: 'T1547.001' },
            { type: 'WEB_SHELL',          pattern: "Web shell detected: /uploads/backdoor.php",                     risk: 25, mitre: 'T1505.003' },
            { type: 'SERVICE_PERSISTENCE',pattern: "New service 'SecurityUpdate' pointing to C:\\Temp\\malware.exe", risk: 25, mitre: 'T1543.003' },
            
            // === PRIVILEGE ESCALATION (TA0004) ===
            { type: 'PROCESS_INJECTION',  pattern: "DLL Injection into svchost.exe - suspicious module loaded",    risk: 30, mitre: 'T1055.001' },
            { type: 'TOKEN_MANIPULATION', pattern: "Token theft detected - SeImpersonatePrivilege used",            risk: 35, mitre: 'T1134.001' },
            { type: 'SUID_EXPLOIT',       pattern: "SUID binary /usr/local/bin/vuln-app executing as root",        risk: 30, mitre: 'T1548.001' },
            
            // === DEFENSE EVASION (TA0005) ===
            { type: 'OBFUSCATED_FILES',   pattern: "Packed executable detected - UPX compressed payload",       risk: 20, mitre: 'T1027.002' },
            { type: 'DISABLE_AV',         pattern: "Windows Defender disabled via registry",                        risk: 25, mitre: 'T1562.001' },
            { type: 'LOG_CLEARING',       pattern: "Event logs cleared - wevtutil /cl /q",                          risk: 15, mitre: 'T1070.001' },
            { type: 'MASQUERADING',       pattern: "Process masquerading as 'svchost.exe' - wrong path",           risk: 20, mitre: 'T1036.005' },
            { type: 'LOLBIN_EXECUTION',   pattern: "Mshta.exe executing VBScript from network location",         risk: 25, mitre: 'T1218.010' },
            
            // === CREDENTIAL ACCESS (TA0006) ===
            { type: 'LSASS_DUMP',         pattern: "LSASS.exe memory dump - possible Mimikatz activity",         risk: 35, mitre: 'T1003.001' },
            { type: 'KERBEROS_ATTACK',    pattern: "Kerberoasting detected - TGS requests for SPNs",               risk: 30, mitre: 'T1558.003' },
            { type: 'GOLDEN_TICKET',      pattern: "Suspicious TGT with lifetime > 10 years",                      risk: 40, mitre: 'T1558.001' },
            { type: 'CREDENTIALS_BROWSER', pattern: "Chrome credential database accessed",                          risk: 25, mitre: 'T1555.003' },
            { type: 'BRUTEFORCE',         pattern: "POST /auth - 50 req/s from 192.168.1.45",                       risk: 20, mitre: 'T1110' },
            
            // === DISCOVERY (TA0007) ===
            { type: 'ACCOUNT_ENUM',       pattern: "net user /domain - enumeration of domain users",              risk: 10, mitre: 'T1087.002' },
            { type: 'FILE_DISCOVERY',     pattern: "Directory traversal - ../../../../etc/passwd",                risk: 15, mitre: 'T1083' },
            { type: 'SYSTEM_INFO',       pattern: "systeminfo executed - collecting system information",         risk: 5,  mitre: 'T1082' },
            
            // === LATERAL MOVEMENT (TA0008) ===
            { type: 'PASS_THE_HASH',     pattern: "SMB lateral: 192.168.1.45 → 192.168.1.100 (Pass-the-Hash)",    risk: 25, mitre: 'T1550.002' },
            { type: 'REMOTE_SSH',         pattern: "SSH connection from unusual IP - key-based auth",             risk: 20, mitre: 'T1021.004' },
            { type: 'WMI_EXECUTION',      pattern: "WMI exec from 10.0.0.55 - lateral movement detected",         risk: 25, mitre: 'T1021.003' },
            
            // === COLLECTION (TA0009) ===
            { type: 'SCREEN_CAPTURE',     pattern: "Screenshot taken - GDI+ screen capture detected",             risk: 15, mitre: 'T1056.002' },
            { type: 'KEYLOGGING',         pattern: "Keylogger active - hooks installed in keyboard driver",      risk: 25, mitre: 'T1056.001' },
            
            // === EXFILTRATION (TA0010) ===
            { type: 'DATA_EXFILTRATION',  pattern: "Large data transfer to external IP 185.220.101.x",            risk: 30, mitre: 'T1041' },
            { type: 'DNS_EXFILTRATION',   pattern: "DNS TXT queries with encoded data to attacker domain",        risk: 25, mitre: 'T1041' },
            
            // === IMPACT (TA0011) ===
            { type: 'RANSOMWARE',         pattern: "ALERT: Processo criptografando arquivos em massa (/var/data/*.enc)", risk: 40, mitre: 'T1486' },
            { type: 'DESTRUCTION',        pattern: "Data destruction - shred / -P on Linux systems",             risk: 35, mitre: 'T1485' },
            { type: 'DOS_ATTACK',         pattern: "DDoS attack - 10Gbps UDP flood targeting gateway",           risk: 30, mitre: 'T1498' },
            
            // === ADDITIONAL ATTACKS ===
            { type: 'XSS',                pattern: "GET /search?q=<script>alert(document.cookie)</script>",        risk: 10, mitre: 'T1059.007' },
            { type: 'SCAN',               pattern: "Nmap TCP SYN Scan from 10.0.0.15 [T4 -A]",                     risk: 5,  mitre: 'T1046' },
            { type: 'SUPPLY_CHAIN',       pattern: "Dependência npm maliciosa: lodash@4.17.20 (typosquatting)",    risk: 35, mitre: 'T1195.002' },
            { type: 'ZERO_DAY',           pattern: "Exploit desconhecido em Apache httpd 2.4.51 (WAF bypass)",    risk: 45, mitre: 'T1203' },
            { type: 'SSRF',               pattern: "GET /proxy?url=http://169.254.169.254/latest/meta-data/",     risk: 20, mitre: 'T1552.005' }
        ];

        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        
        if (attack.isFalsePositive) {
            this.log(`[INFO] Tráfego normal: ${attack.pattern}`, 'info');
            return;
        }

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
        if ((type === 'INJECTION' || type === 'SSRF') && this.activeCountermeasures.has('WAF_SQLI')) return true;
        if (type === 'XSS' && this.activeCountermeasures.has('WAF_XSS')) return true;
        if ((type === 'BRUTEFORCE' || type === 'SCAN' || type === 'ACTIVE_SCANNING' || type === 'VULN_SCANNING' || type === 'EXTERNAL_REMOTE' || type === 'DOS_ATTACK') && this.activeCountermeasures.has('IP_BLOCK')) return true;
        if ((type === 'RCE' || type === 'ZERO_DAY' || type === 'WEB_SHELL' || type === 'SUID_EXPLOIT') && this.activeCountermeasures.has('VIRTUAL_PATCH')) return true;
        if ((type === 'RANSOMWARE' || type === 'DESTRUCTION' || type === 'POWERSHELL_MALICIOUS' || type === 'PROCESS_INJECTION' || type === 'OBFUSCATED_FILES' || type === 'DISABLE_AV' || type === 'KEYLOGGING') && this.activeCountermeasures.has('EDR')) return true;
        if ((type === 'LATERAL_MOVE' || type === 'PASS_THE_HASH' || type === 'REMOTE_SSH' || type === 'WMI_EXECUTION' || type === 'VALID_ACCOUNTS' || type === 'DATA_EXFILTRATION') && this.activeCountermeasures.has('ZERO_TRUST')) return true;
        if (type === 'PHISHING' && this.activeCountermeasures.has('EMAIL_FILTER')) return true;
        if (type === 'SUPPLY_CHAIN' && this.activeCountermeasures.has('SCA_SCAN')) return true;
        if ((type === 'CREDENTIAL_DUMP' || type === 'LSASS_DUMP' || type === 'KERBEROS_ATTACK' || type === 'GOLDEN_TICKET' || type === 'CREDENTIALS_BROWSER' || type === 'ACCOUNT_ENUM') && this.activeCountermeasures.has('MFA')) return true;

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
            RCE: 'VIRTUAL_PATCH', RANSOMWARE: 'EDR', PASS_THE_HASH: 'ZERO_TRUST',
            REMOTE_SSH: 'ZERO_TRUST', WMI_EXECUTION: 'ZERO_TRUST',
            PHISHING: 'EMAIL_FILTER', SUPPLY_CHAIN: 'SCA_SCAN', 
            LSASS_DUMP: 'MFA', KERBEROS_ATTACK: 'MFA', GOLDEN_TICKET: 'MFA',
            CREDENTIALS_BROWSER: 'MFA', ACCOUNT_ENUM: 'MFA',
            SSRF: 'WAF_SQLI', ZERO_DAY: 'VIRTUAL_PATCH', SCAN: 'IP_BLOCK',
            ACTIVE_SCANNING: 'IP_BLOCK', VULN_SCANNING: 'IP_BLOCK', EXTERNAL_REMOTE: 'IP_BLOCK', DOS_ATTACK: 'IP_BLOCK',
            WEB_SHELL: 'VIRTUAL_PATCH', SUID_EXPLOIT: 'VIRTUAL_PATCH',
            DESTRUCTION: 'EDR', POWERSHELL_MALICIOUS: 'EDR', PROCESS_INJECTION: 'EDR', OBFUSCATED_FILES: 'EDR', DISABLE_AV: 'EDR', KEYLOGGING: 'EDR',
            VALID_ACCOUNTS: 'ZERO_TRUST', DATA_EXFILTRATION: 'ZERO_TRUST'
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
