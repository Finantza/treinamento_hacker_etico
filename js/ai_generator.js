/**
 * MOTOR DE GERAÇÃO PROCEDURAL OFFLINE v2 (ProceduralAI - Hacker Etico)
 * - 15 templates across 3 difficulty tiers (iniciante / logica / massiva)
 * - Anti-repeat: tracks last 5 shown templates, never repeats
 * - Category weights: focus category gets 3x weight vs others
 * - Difficulty adapts based on rolling accuracy window (last 10 answers)
 */

const ProceduralAI = {

  // ── Dictionaries ──────────────────────────────────────────────────
  dicts: {
    vars_int:  ['bytes', 'pacotes', 'ping', 'threads', 'tokens', 'nodes', 'frames', 'bits'],
    vars_sys:  ['servidor', 'firewall', 'sistema', 'root', 'banco', 'cluster', 'proxy', 'daemon'],
    strings:   ['Access Denied', 'Override', 'Exploit Injetado', 'Bypass Ativo', 'Rootkits', 'Payload', 'Malware', 'Cipher', 'SQL Injection'],
    numeros:   [404, 502, 1337, 8080, 256, 128, 64, 32, 200, 403, 500, 21, 22, 3306],
    pequenos:  [2, 3, 4, 5, 6, 8],
    ops:       ['+', '-', '*'],
    verbs:     ['conectar', 'injetar', 'snifar', 'validar', 'encriptar', 'bindar', 'explorar']
  },

  // Anti-repeat state
  _recentKeys: [],
  _maxRecent: 5,

  getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // Ensures exactly 4 unique options with the correct answer included
  buildOptions(correct, fakes) {
    const pool = [String(correct), ...fakes.map(String)];
    const unique = [...new Set(pool)];
    // Pad if needed
    while (unique.length < 4) unique.push(String(correct + unique.length * 7));
    const selected = this.shuffle(unique).slice(0, 4);
    // Guarantee correct is in
    if (!selected.includes(String(correct))) selected[0] = String(correct);
    return { options: this.shuffle(selected), answerIndex: this.shuffle(selected).indexOf(String(correct)) };
  },

  // ── Templates ─────────────────────────────────────────────────────
  templates: {

    // ════════ INICIANTE ════════

    sql_basic: function(sys, num, str, sm, verb) {
      return {
        code: `QUERY: SELECT * FROM admin WHERE user='admin' AND senha='password'\n\nINPUT DO ATACANTE: admin' OR '1'='1`,
        choices: [
          `Falta declarar o tipo do input no banco de dados.`,
          `O input não consegue fechar a aspa e causa erro de sintaxe.`,
          `A query aceita a injeção SQL, ignorando a senha e logando o atacante.`,
          `'OR' deve ser escrito em minúsculo na query database.`
        ],
        answer: 2,
        explain: `🤖 [SQL Injection] A entrada \`' OR '1'='1\` faz com que a cláusula WHERE seja avaliada como sempre verdadeira, permitindo bypass da autenticação.`,
        category: 'iniciante'
      };
    },

    port_scan: function(sys, num, str, sm, verb) {
      return {
        code: `root@kali:~# nmap -p 22,80,${num} target.internal`,
        choices: [
          `O comando não consegue varrer a porta ${num} porque não é padrão tcp.`,
          `Isso executa um port scan simples verificando os serviços SSH, HTTP e outro alvo.`,
          `Nmap precisa rodar no modo root obrigatoriamente.`,
          `Falta um parâmetro de script para achar vulnerabilidades ativas.`
        ],
        answer: 1,
        explain: `🤖 [Recon] O parâmetro -p instrui o Nmap a averiguar exatamente as portas requeridas, nesse caso SSH (22), HTTP (80) e a porta ${num} solicitada no buffer.`,
        category: 'iniciante'
      };
    },

    default_creds: function(sys, num, str, sm, verb) {
      return {
        code: `admin_portal:\n  host: ${sys}\n  user: "admin"\n  pass: "admin123"`,
        choices: [
          `A sintaxe YAML está corrompida.`,
          `O uso de aspas invalida o acesso ao host ${sys}.`,
          `A senha hardcoded e predizível abre brecha primária para acesso não autorizado.`,
          `O ${sys} não permite login remoto por padrão.`
        ],
        answer: 2,
        explain: `🤖 [Credenciais Fracas] O uso de senhas predefinidas e no código (hardcoded) como 'admin123' é uma das falhas mais frequentes enumeradas no OWASP Top 10.`,
        category: 'iniciante'
      };
    },

    xss_basic: function(sys, num, str, sm, verb) {
      return {
        code: `<!-- Perfil de Usuário -->\n<div>\n  Bem-vindo, <span class="user_name">{user_input}</span>!\n</div>`,
        choices: [
          `O HTML precisa do fechamento literal da div local.`,
          `Vulnerável a XSS. Se user_input contiver <script>, ele vai ser renderizado e executado pelo navegador.`,
          `Não é vulnerável caso user_input seja formatado em maiúsculas nativamente pelo CSS.`,
          `Nenhuma linguagem cliente aceita injeção maliciosa se estiver sem SSL (HTTPS).`
        ],
        answer: 1,
        explain: `🤖 [Cross-Site Scripting - XSS] Quando aplicativos web refletem inputs arbitrários sem sanitização, o navegador executa as tags maliciosas acreditando que pertencem à página.`,
        category: 'iniciante'
      };
    },

    // ════════ LÓGICA ════════

    auth_bypass: function(sys, num, str, sm, verb) {
      return {
        code: `def login(user, token):\n    if user == "admin" and str(token) == "${str}":\n        return True\n    return False\n# Input Atacante: token = None`,
        choices: [
          `Causa exceção TypeError ao somar string e null type.`,
          `A conversão str(None) avaliará como "None", podendo abrir um bypass inesperado do backdoor se "${str}" for igual a "None".`,
          `Dará IndexError local.`,
          `O login nunca ocorre sem parênteses estritos no Python.`
        ],
        answer: 1,
        explain: `🤖 [Type Mismatch Exploit] Converter brutalmente nulos orgânicos via cast \`str()\` transforma \`None\` na string Literal 'None'. Um invasor esperto insere payloads nulos para cruzar as validações mal implementadas.`,
        category: 'logica'
      };
    },

    path_traversal: function(sys, num, str, sm, verb) {
      return {
        code: `http://${sys}/view?file=../../../etc/passwd`,
        choices: [
          `O servidor bloqueará magicamente as vírgulas nulas no parse do bash.`,
          `Path Traversal. Permite ao invasor retroceder diretórios root e ler dados críticos do kernel Linux de fora da raiz da Web.`,
          `HTTP apenas suporta leitura em caminhos public_html.`,
          `Acesso restrito causará erro de 500 no Windows.`
        ],
        answer: 1,
        explain: `🤖 [Directory Traversal - LFI] Ao enviar manipulações '../', o servidor mal configurado escala o ponteiro do File System voltando diretórios absolutos até o pilar do sistema operacional (/etc/passwd).`,
        category: 'logica'
      };
    },

    csrf_token: function(sys, num, str, sm, verb) {
      return {
        code: `POST /${sys}/transfer HTTP/1.1\nHost: bank.com\nCookie: session_id=${str}`,
        choices: [
          `Vulnerável a CSRF. Não há token (anti-CSRF/XSRF) anexado no body validando a intenção autêntica da transação.`,
          `Falta injeção SSL encadeada pura.`,
          `O POST precisa de um JWT Bearer Token, o Cookie é cego no bank.com.`,
          `Os bytes ultrapassam o payload máximo da requisição.`
        ],
        answer: 0,
        explain: `🤖 [Cross-Site Request Forgery] O navegador sempre envia cookies de sessão passivamente para a origem. Se o form não tiver Token anti-CSRF validado, outro site malicioso forjará a ação do usuário na surdina.`,
        category: 'logica'
      };
    },

    idor_check: function(sys, num, str, sm, verb) {
      return {
        code: `GET /api/user/profile?id=${num} HTTP/1.1\nAuthorization: Bearer <user_regular>`,
        choices: [
          `Vulnerável a XSS via ID injection na resposta cega JSON.`,
          `Seguro caso o Bearer Token evite adulteração das senhas hash.`,
          `Vulnerável a IDOR. Se o backend não conferir o Token contra a \`ID do perfil (${num})\` demandado, o usuário lerá contas cruzadas alterando apenas o número na URL.`,
          `As requisições GET blindam manipulação manual algorítmica.`
        ],
        answer: 2,
        explain: `🤖 [Insecure Direct Object Reference] Mudar parâmetros previsíveis (como um ID) sem checagem severa de Autorização cruzada deixa o hacker ler qualquer fatura, perfil ou dados do sistema alheio livremente.`,
        category: 'logica'
      };
    },

    // ════════ MASSIVA ════════

    cmd_injection: function(sys, num, str, sm, verb) {
      return {
        code: `ping_host = params['ip']\nos.system(f"ping -c 4 {ping_host}")\n# Atacante: 8.8.8.8 ; cat /etc/shadow`,
        choices: [
          `Executa o ping mas a linha morre na string cega (TypeError).`,
          `Comando será engolido num Exception iterativa lenta.`,
          `Abreviação PING cega cancela o bash rooter c++ runtime log.`,
          `Vulnerável a RCE. A concatenação insere ponto e vírgula (;), encerrando o ping e forçando o terminal hospedeiro a executar OS Commands críticos livremente na sequência.`
        ],
        answer: 3,
        explain: `🤖 [OS Command Injection] Inputs de usuário jogados puros no terminal (OS Exec) criam shell remotos interativos. Os bypassers injetam pipe (\`|\`), duplo E (\`&&\`) ou (\`;\`) para emendar novos sub-comandos pesados.`,
        category: 'massiva'
      };
    },

    buffer_overflow: function(sys, num, str, sm, verb) {
      return {
        code: `char buffer[${sm*10}];\nstrcpy(buffer, user_input);`,
        choices: [
          `As proteções canário Nops C python bloqueiam strings maiores que 16 chars organicamente.`,
          `A cópia não delimitadora \`strcpy\` corrompe o buffer adjacente, transbordando o EIP permitindo executar payload shellcode injetado. (Buffer Overflow)`,
          `Sem chaves, o array C devolve um ponteiro seguro a string nativa nula.`,
          `Gera apenas KeyError Exception nativo que o frontend pega.`
        ],
        answer: 1,
        explain: `🤖 [Buffer Overflow Clássico] strcpy é cego para a escala (size) do destino. Quando bytes em demasia varrem um invólucro minúsculo de bits limitados (${sm*10}), vaza por cima das variáveis adjacentes do stack podendo reescrever o fluxo matriz (EIP).`,
        category: 'massiva'
      };
    },

    crypto_weakness: function(sys, num, str, sm, verb) {
      return {
        code: `import hashlib\ncriptografia = hashlib.md5(b"senhasecreta").hexdigest()`,
        choices: [
          `Algoritmos MD5 não são reversíveis mas sofrem bruteforce via Rainbow Tables num piscar de olhos; obsoletos para armazenagem passiva de senhas orgânicas.`,
          `O bytes literal 'b' corrompe a chave simétrica de hash digestiva do parser estrito Python iterado C.`,
          `MD5 não existe na lib, usá-lo invoca KeyError.`,
          `O Salt invisível contido no md5 blinda o bytearray de colisões.`
        ],
        answer: 0,
        explain: `🤖 [Criptografia Obsoleta] Hashing antigo como MD5 e SHA1 colidem facilmente nas arquiteturas quânticas de hoje e são dizimados por Rainbow Tables massivas. Use Bcrypt ou Argon2 com Salt local ativo.`,
        category: 'massiva'
      };
    },

    ssr_forgery: function(sys, num, str, sm, verb) {
      return {
        code: `url_foto = requests.get(request.form['url_avatar'])\nreturn url_foto.content`,
        choices: [
          `Vulnerável a SSRF. Sem sanitizar o Request interno, um atacante pode jogar "http://169.254.169.254/latest/meta-data/" e fazer seu servidor espelhar segredos do backend local/AWS Metadata pra ele livremente.`,
          `Exibirá imagens quebradas por conta do CSRF block cross origin CORS domain bypass orgânico nulo das regras strict default.`,
          `Dará IndexError Lógica list tuple byte int float array dictionary parser eval.`,
          `O Get requests do Python corrompe a API interna gerando Exception do Content.`
        ],
        answer: 0,
        explain: `🤖 [Server-Side Request Forgery] O backend torna-se uma marionete se forja requisições cegamente. Como o servidor goza de IP confiável na rede local interna dele, o hacker usa o próprio alvo para varrer Intranets, BDs sem chaves, ou instâncias Cloud.`,
        category: 'massiva'
      }
    }
  },

  // ── Cached category list (built once) ────────────────────────────
  _categoryMap: null,
  _buildCategoryMap() {
    if (this._categoryMap) return;
    this._categoryMap = {};
    for (const key in this.templates) {
      const tmpl = this.templates[key]('sys', 1, 'str', 3, 'ver');
      const cat = tmpl.category;
      if (!this._categoryMap[cat]) this._categoryMap[cat] = [];
      this._categoryMap[cat].push(key);
    }
  },

  // ── AI Target Selection (Cognitive Profiling) ───────────────────
  analisarTarget(perfMap) {
    if (!perfMap || Object.keys(perfMap).length === 0) return 'iniciante';
    
    const categories = ['iniciante', 'logica', 'massiva'];
    let lowestCat = 'iniciante';
    let lowestScore = 999;
    
    for (const cat of categories) {
        const perf = perfMap[cat] || { correct: 0, total: 0 };
        // Calculate accuracy, defaulting to a penalty if not enough samples
        let score = (perf.total === 0) ? -0.1 : (perf.correct / perf.total);
        
        if (score < lowestScore) {
            lowestScore = score;
            lowestCat = cat;
        }
    }
    
    // The lowest scoring category becomes the actual training target balancing their proficiency.
    return lowestCat;
  },

  // ── Main Generation Function ──────────────────────────────────────
  gerar(performanceData, focusCategory = null) {
    this._buildCategoryMap();

    const m = performanceData || {};
    const targetCat = focusCategory || this.analisarTarget(m);

    // Weighted pool: focus category gets 3× weight
    let pool = [];
    for (const cat in this._categoryMap) {
      const weight = cat === targetCat ? 3 : 1;
      for (let i = 0; i < weight; i++) {
        pool.push(...this._categoryMap[cat]);
      }
    }

    // Remove recently shown templates (anti-repeat)
    const eligible = pool.filter(k => !this._recentKeys.includes(k));
    const finalPool = eligible.length > 0 ? eligible : pool; // reset if all exhausted

    const chosen = this.getRandom(finalPool);

    // Track anti-repeat
    this._recentKeys.push(chosen);
    if (this._recentKeys.length > this._maxRecent) this._recentKeys.shift();

    // Roll variables
    const sys    = this.getRandom(this.dicts.vars_sys);
    const n      = this.getRandom(this.dicts.numeros);
    const str    = this.getRandom(this.dicts.strings);
    const sm     = this.getRandom(this.dicts.pequenos);
    const verb   = this.getRandom(this.dicts.verbs);

    const raw = this.templates[chosen](sys, n, str, sm, verb);

    // Determine actual category (may differ from target due to weighted pool)
    const actualCat = raw.category;

    return {
      id:       Date.now() + Math.random(),
      code:     raw.code,
      skillCategory: actualCat,
      category: `.EH.Intrusion[${actualCat.toUpperCase()}]`,
      options:  raw.choices,
      correct:  raw.answer,
      explain:  raw.explain,
      template: chosen,           // for debugging
      aiTarget: targetCat
    };
  }
};
