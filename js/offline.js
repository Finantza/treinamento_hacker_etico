// Ethical Hacker Premium v5.0 - CYBER-OS EDITION
// 100% Offline | ProceduralAI v3 | CyberOS Window Manager Integration

let userData = {};
let currentDifficulty = 'logica';
let currentChallenge = null;
let currentChallengeData = null;
let gameStartTime = 0;

function showGlossary() {
    const glossaryHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <h3 class="text-primary mb-4"><i class="fas fa-book-open me-2"></i>GLOSSÁRIO DE CIBERSEGURANÇA</h3>
            
            <ul class="nav nav-tabs border-primary mb-4" id="glossaryTabs">
                <li class="nav-item"><button class="nav-link active text-danger" data-bs-toggle="tab" data-bs-target="#attacksTab">ATAQUES (RED)</button></li>
                <li class="nav-item"><button class="nav-link text-info" data-bs-toggle="tab" data-bs-target="#defenseTab">DEFESAS (BLUE)</button></li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="attacksTab">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="bg-black p-3 rounded border-start border-danger border-4 mb-3">
                                <h6 class="text-danger">SQL INJECTION (SQLi)</h6>
                                <p class="small text-white-50">Inserção de comandos SQL maliciosos em campos de entrada. Permite ler, modificar ou deletar dados do banco de dados.</p>
                                <code class="text-muted">Ex: ' OR '1'='1</code>
                            </div>
                            <div class="bg-black p-3 rounded border-start border-danger border-4 mb-3">
                                <h6 class="text-danger">CROSS-SITE SCRIPTING (XSS)</h6>
                                <p class="small text-white-50">Injeção de scripts (geralmente JavaScript) em páginas web visualizadas por outros usuários. Pode roubar cookies e sessões.</p>
                                <code class="text-muted">Ex: &lt;script&gt;alert(1)&lt;/script&gt;</code>
                            </div>
                            <div class="bg-black p-3 rounded border-start border-danger border-4 mb-3">
                                <h6 class="text-danger">REMOTE CODE EXECUTION (RCE)</h6>
                                <p class="small text-white-50">O ataque mais grave. Permite que o invasor execute comandos diretamente no sistema operacional do servidor.</p>
                                <code class="text-muted">Ex: ; cat /etc/passwd</code>
                            </div>
                            <div class="bg-black p-3 rounded border-start border-danger border-4 mb-3">
                                <h6 class="text-danger">IDOR / LFI</h6>
                                <p class="small text-white-50">Falhas de controle de acesso que permitem visualizar arquivos internos ou perfis de outros usuários sem permissão.</p>
                                <code class="text-muted">Ex: ../../../etc/passwd</code>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="defenseTab">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="bg-black p-3 rounded border-start border-info border-4 mb-3">
                                <h6 class="text-info">WAF (Web Application Firewall)</h6>
                                <p class="small text-white-50">Proteção que analisa o tráfego HTTP e bloqueia padrões suspeitos de SQLi e XSS antes que cheguem à aplicação.</p>
                            </div>
                            <div class="bg-black p-3 rounded border-start border-info border-4 mb-3">
                                <h6 class="text-info">IPS / IP BLOCK</h6>
                                <p class="small text-white-50">Intrusion Prevention System. Detecta comportamentos anômalos (como força bruta) e bloqueia o endereço IP do atacante.</p>
                            </div>
                            <div class="bg-black p-3 rounded border-start border-info border-4 mb-3">
                                <h6 class="text-info">VIRTUAL PATCHING</h6>
                                <p class="small text-white-50">Aplicação de uma regra de segurança imediata para mitigar uma falha conhecida sem precisar alterar o código fonte original.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderToModule('glossary', glossaryHTML);
}

// ================= CORE HELPERS =================
function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    if (!username) return null;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[username] || null;
}

function loginGuest() {
    localStorage.setItem('currentUser', 'guest');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users['guest']) {
        users['guest'] = {
            name: 'Convidado',
            username: 'guest',
            reputation: 0,
            xp: 0,
            level: 1,
            coins: 0,
            briefingShown: false,
            performance: {},
            inventory: { hints: 5, skips: 3 }
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
    window.location.reload();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function saveUserData() {
    const username = localStorage.getItem('currentUser');
    if (!username) return;
    const user = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[username] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

// ================= SFX =================
const sfx = {
    ctx: null,
    init() { if (!this.ctx) try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} },
    play(f, t, d, v=0.1) {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = t; o.frequency.setValueAtTime(f, this.ctx.currentTime);
        g.gain.setValueAtTime(v, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + d);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime + d);
    },
    correct() { this.play(800, 'sine', 0.2); },
    wrong() { this.play(200, 'sawtooth', 0.3); },
    recon() { this.play(400, 'sine', 0.1); }
};

// ================= RENDER ENGINE =================
function renderToModule(moduleId, html) {
    const tryRender = () => {
        const body = document.getElementById(`body-${moduleId}`);
        if (body) {
            body.innerHTML = html;
        } else if (window.os) {
            os.openWindow(moduleId);
            setTimeout(tryRender, 100);
        }
    };
    tryRender();
}

// ================= DASHBOARD =================
function showDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    const getReputationStatus = (rep) => {
        if (rep >= 1000) return 'Cyber Legend';
        if (rep >= 500) return 'Elite White Hat';
        return 'Aspirante';
    };

    const dashboardHTML = `
        <div class="p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="text-white mb-0">CENTRAL DE COMANDO</h3>
                <button class="btn btn-outline-danger btn-sm" onclick="logout()">
                    <i class="fas fa-power-off me-2"></i> SAIR DO SISTEMA
                </button>
            </div>
            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="premium-glass p-4 text-center">
                        <div class="mx-auto bg-primary rounded-circle mb-3 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                            <i class="fas fa-user-secret fa-2x"></i>
                        </div>
                        <h3 class="text-white mb-0">${user.name}</h3>
                        <p class="text-primary small mb-3">@${user.username}</p>
                        <div class="badge bg-dark border border-primary px-3 py-2 mb-3">
                            ${getReputationStatus(user.reputation)}
                        </div>
                        <div class="row g-2 mt-2">
                            <div class="col-6"><div class="bg-black p-2 rounded small">Lvl ${user.level}</div></div>
                            <div class="col-6"><div class="bg-black p-2 rounded small">${user.xp} XP</div></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="glass-card p-4 h-100 cursor-pointer border-primary" onclick="showAcademy()">
                                <h5 class="text-primary"><i class="fas fa-university me-2"></i>CYBER ACADEMY</h5>
                                <p class="small text-muted">Trilhas de aprendizado guiado para iniciantes.</p>
                                <button class="btn btn-sm btn-primary">ACESSAR AULAS</button>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="glass-card p-4 h-100 cursor-pointer border-warning" onclick="startUrgentMission()">
                                <h5 class="text-warning"><i class="fas fa-bolt me-2"></i>MISSÃO URGENTE</h5>
                                <p class="small text-muted">Desafios de alta pressão com tempo limitado.</p>
                                <button class="btn btn-sm btn-outline-warning">SOLICITAR AGORA</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderToModule('dashboard', dashboardHTML);
}

function showAcademy() {
    const academyHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="text-center mb-5">
                <h2 class="text-primary glitch-text">CYBER ACADEMY</h2>
                <p class="text-white-50">Escolha sua trilha de especialização técnica</p>
            </div>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="premium-glass p-4 border-danger h-100">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-danger p-3 rounded-circle me-3"><i class="fas fa-user-secret fa-lg"></i></div>
                            <h4 class="text-danger mb-0">Trilha de Ofensiva</h4>
                        </div>
                        <p class="small text-muted mb-4">Aprenda a identificar vulnerabilidades e explorar falhas de segurança em ambientes controlados.</p>
                        <ul class="list-unstyled small text-white-50 mb-4">
                            <li><i class="fas fa-check text-danger me-2"></i> Injeção de Comandos (SQLi)</li>
                            <li><i class="fas fa-check text-danger me-2"></i> Scripts em Sites (XSS)</li>
                            <li><i class="fas fa-check text-danger me-2"></i> Quebra de Autenticação</li>
                        </ul>
                        <button class="btn btn-danger w-100 py-2" onclick="startAcademy('attack')">INICIAR TREINAMENTO</button>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="premium-glass p-4 border-info h-100">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-info p-3 rounded-circle me-3"><i class="fas fa-shield-alt fa-lg"></i></div>
                            <h4 class="text-info mb-0">Trilha de Defesa</h4>
                        </div>
                        <p class="small text-muted mb-4">Aprenda a monitorar redes, detectar invasões e aplicar contra-medidas imediatas.</p>
                        <ul class="list-unstyled small text-white-50 mb-4">
                            <li><i class="fas fa-check text-info me-2"></i> Configuração de WAF</li>
                            <li><i class="fas fa-check text-info me-2"></i> Bloqueio de IP Suspeito</li>
                            <li><i class="fas fa-check text-info me-2"></i> Resposta a Incidentes (IR)</li>
                        </ul>
                        <button class="btn btn-info w-100 py-2" onclick="startAcademy('defense')">INICIAR TREINAMENTO</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderToModule('academy', academyHTML);
}

function startAcademy(type) {
    if (type === 'attack') {
        os.showNotification('Academia de Ataque: Carregando Módulo 01...', 'danger');
        startGame('iniciante');
    } else {
        os.showNotification('Academia de Defesa: Ativando Sensores...', 'info');
        startDefenseMode();
    }
}
function startGame(difficulty = 'logica') {
    currentDifficulty = difficulty;
    loadGameInterface();
}

function loadGameInterface() {
    const user = getCurrentUser();
    
    // Integrated Procedural AI Mission Engine
    if (window.procAI) {
        currentChallengeData = window.procAI.gerar({}, currentDifficulty);
    } else {
        // Fallback placeholder if AI fails to load
        currentChallengeData = {
            category: 'injection',
            code: "SELECT * FROM users WHERE id = '" + (Math.random() > 0.5 ? "' OR '1'='1" : "1") + "'",
            options: ["SQL Injection", "XSS", "IDOR", "RCE"],
            correct: 0,
            explain: "Vulnerabilidade crítica de injeção SQL detectada.",
            xp: 30, rep: 10
        };
    }

    gameStartTime = Date.now();
    window.answered = false;

    const gameHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="text-primary mb-0"><i class="fas fa-terminal me-2"></i>MISSÃO: ${currentChallengeData.category.toUpperCase()}</h4>
                    <span class="badge bg-dark border border-primary text-primary mt-1">${currentChallengeData.difficulty.toUpperCase()}</span>
                </div>
                <div class="hud-pill bg-black p-2 rounded border border-primary small">
                    <i class="fas fa-clock text-primary me-2"></i><span id="gameTimer">00s</span>
                </div>
            </div>

            <div class="premium-glass p-4 mb-4 border-primary">
                <p class="text-white-50 mb-3"><i class="fas fa-info-circle me-2"></i>${currentChallengeData.description || 'Analise o código abaixo e identifique a vulnerabilidade.'}</p>
                <div class="bg-black p-3 rounded position-relative">
                    <pre class="mb-0"><code class="text-success">${currentChallengeData.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
            </div>

            <div class="row g-3">
                ${currentChallengeData.options.map((opt, i) => `
                    <div class="col-md-6">
                        <button class="btn btn-outline-primary w-100 py-3 text-start px-4 position-relative overflow-hidden" onclick="checkPentestAnswer(${i})">
                            <span class="opacity-25 me-2">${String.fromCharCode(65 + i)}|</span> ${opt}
                        </button>
                    </div>
                `).join('')}
            </div>
            <div id="pentestFeedback" class="mt-4"></div>
        </div>
    `;
    renderToModule('pentest', gameHTML);
    sfx.recon();

    // Simple timer
    let seconds = 0;
    const timerInterval = setInterval(() => {
        seconds++;
        const timerEl = document.getElementById('gameTimer');
        if (timerEl) timerEl.textContent = seconds.toString().padStart(2, '0') + 's';
        if (window.answered || !document.getElementById('body-pentest')) clearInterval(timerInterval);
    }, 1000);
}

function checkPentestAnswer(idx) {
    if (window.answered) return;
    window.answered = true;
    const isWin = idx === currentChallengeData.correct;
    const feedback = document.getElementById('pentestFeedback');
    
    if (isWin) {
        sfx.correct();
        const user = getCurrentUser();
        user.xp += currentChallengeData.xp;
        user.reputation += currentChallengeData.rep;
        user.level = Math.floor(user.xp / 100) + 1;
        saveUserData();
        if (window.os) os.showNotification('Missão Concluída! +' + currentChallengeData.xp + ' XP', 'success');
        feedback.innerHTML = `<div class="alert alert-success">🔥 SUCESSO! Acesso concedido. <button class="btn btn-success ms-3" onclick="loadGameInterface()">PRÓXIMO</button></div>`;
    } else {
        sfx.wrong();
        if (window.os) os.showNotification('ALERTA: IDS Detectou sua assinatura!', 'danger');
        feedback.innerHTML = `<div class="alert alert-danger">❌ FALHA! Conexão encerrada pelo Firewall. <button class="btn btn-danger ms-3" onclick="loadGameInterface()">RECOBRAR</button></div>`;
    }
}

// ================= GLOBAL EVENT HANDLERS =================
const socHandlers = {
    log: (e) => {
        const logsContainer = document.getElementById('socLogs');
        if (!logsContainer) return;
        const entry = document.createElement('div');
        entry.className = `mb-1 ${e.detail.type === 'danger' ? 'text-danger' : e.detail.type === 'success' ? 'text-success' : 'text-info'}`;
        entry.innerHTML = `<span class="opacity-50">[${e.detail.time}]</span> ${e.detail.msg}`;
        logsContainer.insertBefore(entry, logsContainer.firstChild);
    },
    threat: (e) => {
        const progress = document.getElementById('threatProgress');
        const val = document.getElementById('threatValue');
        const badge = document.getElementById('threatBadge');
        if (!progress) return;
        const level = e.detail.level;
        progress.style.width = level + '%';
        val.textContent = level + '%';
        if (level > 70) { progress.className = 'progress-bar bg-danger'; badge.className = 'badge bg-danger'; badge.textContent = 'STATUS: CRÍTICO'; }
        else if (level > 30) { progress.className = 'progress-bar bg-warning'; badge.className = 'badge bg-warning'; badge.textContent = 'STATUS: ALERTA'; }
        else { progress.className = 'progress-bar bg-success'; badge.className = 'badge bg-success'; badge.textContent = 'STATUS: NORMAL'; }
    }
};

const arenaHandlers = {
    log: (e) => {
        const logsContainer = document.getElementById('arenaLogs');
        if (!logsContainer) return;
        const entry = document.createElement('div');
        entry.className = `mb-1 ${e.detail.type === 'danger' ? 'text-danger' : e.detail.type === 'success' ? 'text-success' : e.detail.type === 'warning' ? 'text-warning' : 'text-info'}`;
        entry.innerHTML = `<span class="opacity-50">[${e.detail.time}]</span> ${e.detail.msg}`;
        logsContainer.insertBefore(entry, logsContainer.firstChild);
    },
    update: (e) => {
        const iBar = document.getElementById('integrityProgress');
        const eBar = document.getElementById('exploitProgress');
        const iVal = document.getElementById('integrityVal');
        const eVal = document.getElementById('exploitVal');
        if (iBar) { iBar.style.width = e.detail.integrity + '%'; iVal.textContent = e.detail.integrity + '%'; }
        if (eBar) { eBar.style.width = e.detail.progress + '%'; eVal.textContent = e.detail.progress + '%'; }
    },
    over: (e) => {
        const body = document.getElementById('body-botwar');
        if (!body) return;
        const isWin = e.detail.result === 'red_win';
        body.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 p-5 animate__animated animate__zoomIn">
                <div class="mx-auto mb-4 bg-${isWin ? 'danger' : 'info'} rounded-circle d-flex align-items-center justify-content-center" style="width: 100px; height: 100px; box-shadow: 0 0 30px ${isWin ? '#f00' : '#0ff'};">
                    <i class="fas ${isWin ? 'fa-skull' : 'fa-shield-alt'} fa-3x text-dark"></i>
                </div>
                <h1 class="text-${isWin ? 'danger' : 'info'} glitch-text mb-2">${isWin ? 'SISTEMA COMPROMETIDO' : 'SISTEMA PROTEGIDO'}</h1>
                <p class="text-white-50 mb-4 text-center">O duelo IA chegou ao fim. Resultados processados pelo CyberOS.</p>
                <div class="row g-3 w-100 mb-5" style="max-width: 400px;">
                    <div class="col-6"><div class="bg-black p-3 rounded border border-primary text-center small">+50 XP</div></div>
                    <div class="col-6"><div class="bg-black p-3 rounded border border-primary text-center small">+20 REP</div></div>
                </div>
                <button class="btn btn-outline-primary btn-lg px-5 py-3 fw-bold" onclick="startBotWar()">REINICIAR PROTOCOLO</button>
            </div>
        `;
        if (window.os) os.showNotification(isWin ? 'Alerta: Sistema Derrubado!' : 'Sucesso: Defesa Concluída!', isWin ? 'danger' : 'success');
    }
};

// ================= SOC & ARENA =================
function startDefenseMode() {
    const socHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="premium-glass p-4 h-100 border-success">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="text-success mb-0"><i class="fas fa-satellite-dish me-2"></i>MONITORAMENTO DE TRÁFEGO</h5>
                            <span id="threatBadge" class="badge bg-success">STATUS: NORMAL</span>
                        </div>
                        <div id="socLogs" class="bg-black p-3 rounded font-monospace small overflow-auto" style="height: 400px; border: 1px solid #0f03;">
                            <div class="text-muted">Aguardando telemetria do Firewall...</div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="premium-glass p-4 mb-4 border-warning">
                        <h6 class="text-warning mb-3"><i class="fas fa-radiation me-2"></i>NÍVEL DE AMEAÇA</h6>
                        <div class="progress mb-2" style="height: 10px; background: rgba(0,0,0,0.5);">
                            <div id="threatProgress" class="progress-bar bg-success" style="width: 0%"></div>
                        </div>
                        <div class="text-center fw-bold text-white h4" id="threatValue">0%</div>
                    </div>
                    <div class="premium-glass p-4 mb-4 border-info">
                        <h6 class="text-info mb-3"><i class="fas fa-shield-virus me-2"></i>CONTRA-MEDIDAS PADRÃO</h6>
                        <div class="d-grid gap-2 mb-4">
                            <button class="btn btn-outline-info btn-sm text-start" onclick="defense.deployCountermeasure('WAF_SQLI')">
                                <i class="fas fa-code me-2"></i> Ativar WAF (SQLi)
                            </button>
                            <button class="btn btn-outline-info btn-sm text-start" onclick="defense.deployCountermeasure('WAF_XSS')">
                                <i class="fas fa-terminal me-2"></i> Ativar WAF (XSS)
                            </button>
                            <button class="btn btn-outline-danger btn-sm text-start" onclick="defense.deployCountermeasure('IP_BLOCK')">
                                <i class="fas fa-user-slash me-2"></i> Bloquear IP Suspeito
                            </button>
                            <button class="btn btn-outline-warning btn-sm text-start" onclick="defense.deployCountermeasure('VIRTUAL_PATCH')">
                                <i class="fas fa-tools me-2"></i> Aplicar Patch Virtual
                            </button>
                        </div>

                        <h6 class="text-white small mb-3 border-top pt-3">CRIAR REGRA PERSONALIZADA</h6>
                        <div class="mb-3">
                            <input type="text" id="customRuleName" class="form-control form-control-sm bg-dark text-white border-primary mb-2" placeholder="Nome da Regra">
                            <input type="text" id="customRulePattern" class="form-control form-control-sm bg-dark text-white border-primary mb-2" placeholder="Padrão (Ex: SELECT|alert)">
                            <button class="btn btn-primary btn-sm w-100" onclick="applyCustomRule()">APLICAR FILTRO</button>
                        </div>
                    </div>

                    <div class="premium-glass p-4 border-muted">
                        <h6 class="text-muted small mb-2"><i class="fas fa-book me-2"></i>MANUAL RÁPIDO</h6>
                        <p class="text-white-50" style="font-size: 0.7rem;">
                            <b>WAF:</b> Filtra requisições web maliciosas.<br>
                            <b>IP BLOCK:</b> Corta conexão de origens suspeitas.<br>
                            <b>PATCH:</b> Corrige a falha no código fonte.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderToModule('soc', socHTML);

    window.applyCustomRule = () => {
        const name = document.getElementById('customRuleName').value;
        const pattern = document.getElementById('customRulePattern').value;
        if (name && pattern && window.defense) {
            defense.addCustomRule(name, pattern);
            document.getElementById('customRuleName').value = '';
            document.getElementById('customRulePattern').value = '';
        }
    };

    // Initialize Defense Listeners
    const logHandler = (e) => {
        const logsContainer = document.getElementById('socLogs');
        if (!logsContainer) return;
        const entry = document.createElement('div');
        entry.className = `mb-1 ${e.detail.type === 'danger' ? 'text-danger' : e.detail.type === 'success' ? 'text-success' : 'text-info'}`;
        entry.innerHTML = `<span class="opacity-50">[${e.detail.time}]</span> ${e.detail.msg}`;
        logsContainer.insertBefore(entry, logsContainer.firstChild);
    };

    const threatHandler = (e) => {
        const progress = document.getElementById('threatProgress');
        const val = document.getElementById('threatValue');
        const badge = document.getElementById('threatBadge');
        if (!progress) return;

        const level = e.detail.level;
        progress.style.width = level + '%';
        val.textContent = level + '%';

        if (level > 70) {
            progress.className = 'progress-bar bg-danger';
            badge.className = 'badge bg-danger';
            badge.textContent = 'STATUS: CRÍTICO';
        } else if (level > 30) {
            progress.className = 'progress-bar bg-warning';
            badge.className = 'badge bg-warning';
            badge.textContent = 'STATUS: ALERTA';
        } else {
            progress.className = 'progress-bar bg-success';
            badge.className = 'badge bg-success';
            badge.textContent = 'STATUS: NORMAL';
        }
    };

    window.removeEventListener('defense_log', socHandlers.log);
    window.removeEventListener('threat_update', socHandlers.threat);
    window.addEventListener('defense_log', socHandlers.log);
    window.addEventListener('threat_update', socHandlers.threat);

    // Start Simulation
    if (window.defense) {
        window.defense.startSimulation();
    }
}

function startUrgentMission(type = null) {
    const missionType = type || (Math.random() > 0.5 ? 'attack' : 'defense');
    startBotWar(missionType);
    
    setTimeout(() => {
        const title = document.querySelector(`#win-botwar .fw-bold`);
        if (title) title.innerHTML = `<i class="fas fa-exclamation-triangle text-warning me-2"></i> MISSÃO URGENTE: ${missionType === 'attack' ? 'OFENSIVA' : 'DEFENSIVA'}`;
        
        if (window.os) os.showNotification(`ALERTA: Missão Urgente Iniciada! Objetivo: ${missionType.toUpperCase()}`, 'warning');
    }, 200);
}

function startBotWar(missionType = 'duel') {
    const isAttackOnly = missionType === 'attack';
    const isDefenseOnly = missionType === 'defense';

    const arenaHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="premium-glass p-4 border-danger ${isDefenseOnly ? 'opacity-50' : ''}">
                        <h5 class="text-danger mb-3"><i class="fas fa-skull me-2"></i>RED BOT (Ataque)</h5>
                        <div class="progress mb-2" style="height: 10px; background: rgba(0,0,0,0.5);">
                            <div id="exploitProgress" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width: 0%"></div>
                        </div>
                        <div class="small text-muted">Progresso do Exploit: <span id="exploitVal">0%</span></div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="premium-glass p-4 border-info ${isAttackOnly ? 'opacity-50' : ''}">
                        <h5 class="text-info mb-3"><i class="fas fa-shield-alt me-2"></i>BLUE BOT (Defesa)</h5>
                        <div class="progress mb-2" style="height: 10px; background: rgba(0,0,0,0.5);">
                            <div id="integrityProgress" class="progress-bar bg-info" style="width: 100%"></div>
                        </div>
                        <div class="small text-muted">Integridade do Sistema: <span id="integrityVal">100%</span></div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="premium-glass p-3 border-danger ${isDefenseOnly ? 'd-none' : ''}">
                        <h6 class="text-danger small mb-2">COMANDOS DE ATAQUE ${isAttackOnly ? '(MISSÃO)' : ''}</h6>
                        <div class="d-flex gap-2 flex-wrap">
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('sqli')">SQLi</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('bof')">BoF</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('xss')">XSS</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="premium-glass p-3 border-info ${isAttackOnly ? 'd-none' : ''}">
                        <h6 class="text-info small mb-2">COMANDOS DE DEFESA ${isDefenseOnly ? '(MISSÃO)' : ''}</h6>
                        <div class="d-flex gap-2 flex-wrap">
                            <button class="btn btn-sm btn-outline-info" onclick="botWar.manualDefend('WAF')">WAF</button>
                            <button class="btn btn-sm btn-outline-info" onclick="botWar.manualDefend('IPS')">IPS</button>
                            <button class="btn btn-sm btn-outline-info" onclick="botWar.manualDefend('PATCH')">PATCH</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="premium-glass p-4 border-primary">
                <h6 class="text-primary mb-3"><i class="fas fa-terminal me-2"></i>ARENA BATTLE FEED</h6>
                <div id="arenaLogs" class="bg-black p-3 rounded font-monospace small overflow-auto" style="height: 250px; border: 1px solid #00f3;">
                    <div class="text-muted">Iniciando protocolo de duelo IA...</div>
                </div>
            </div>
        </div>
    `;
    renderToModule('botwar', arenaHTML);

    const logHandler = (e) => {
        const logsContainer = document.getElementById('arenaLogs');
        if (!logsContainer) return;
        const entry = document.createElement('div');
        entry.className = `mb-1 ${e.detail.type === 'danger' ? 'text-danger' : e.detail.type === 'success' ? 'text-success' : e.detail.type === 'warning' ? 'text-warning' : 'text-info'}`;
        entry.innerHTML = `<span class="opacity-50">[${e.detail.time}]</span> ${e.detail.msg}`;
        logsContainer.insertBefore(entry, logsContainer.firstChild);
    };

    const updateHandler = (e) => {
        const integrityBar = document.getElementById('integrityProgress');
        const exploitBar = document.getElementById('exploitProgress');
        const integrityVal = document.getElementById('integrityVal');
        const exploitVal = document.getElementById('exploitVal');
        
        if (integrityBar) {
            integrityBar.style.width = e.detail.integrity + '%';
            integrityVal.textContent = e.detail.integrity + '%';
        }
        if (exploitBar) {
            exploitBar.style.width = e.detail.progress + '%';
            exploitVal.textContent = e.detail.progress + '%';
        }
    };

    const overHandler = (e) => {
        const arenaBody = document.getElementById('body-botwar');
        if (!arenaBody) return;

        const isWin = e.detail.result === 'red_win'; // Or blue_win if implemented
        arenaBody.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 p-5 animate__animated animate__zoomIn">
                <div class="mx-auto mb-4 bg-${isWin ? 'danger' : 'info'} rounded-circle d-flex align-items-center justify-content-center" style="width: 100px; height: 100px; box-shadow: 0 0 30px ${isWin ? '#f00' : '#0ff'};">
                    <i class="fas ${isWin ? 'fa-skull' : 'fa-shield-alt'} fa-3x text-dark"></i>
                </div>
                <h1 class="text-${isWin ? 'danger' : 'info'} glitch-text mb-2">${isWin ? 'SISTEMA COMPROMETIDO' : 'SISTEMA PROTEGIDO'}</h1>
                <p class="text-white-50 mb-4 text-center">O duelo IA chegou ao fim. Resultados processados pelo CyberOS.</p>
                <div class="row g-3 w-100 mb-5" style="max-width: 400px;">
                    <div class="col-6"><div class="bg-black p-3 rounded border border-primary text-center small">+50 XP</div></div>
                    <div class="col-6"><div class="bg-black p-3 rounded border border-primary text-center small">+20 REP</div></div>
                </div>
                <button class="btn btn-outline-primary btn-lg px-5 py-3 fw-bold" onclick="startBotWar()">REINICIAR PROTOCOLO</button>
            </div>
        `;
        if (window.os) os.showNotification(isWin ? 'Alerta: Sistema Derrubado!' : 'Sucesso: Defesa Concluída!', isWin ? 'danger' : 'success');
    };

    window.removeEventListener('bot_war_log', arenaHandlers.log);
    window.removeEventListener('bot_war_update', arenaHandlers.update);
    window.removeEventListener('bot_war_over', arenaHandlers.over);
    window.addEventListener('bot_war_log', arenaHandlers.log);
    window.addEventListener('bot_war_update', arenaHandlers.update);
    window.addEventListener('bot_war_over', arenaHandlers.over);

    if (window.botWar) {
        window.botWar.startDuel();
    }
}

// ================= BRIEFING =================
function showMissionBriefing() {
    const briefingHTML = `
        <div id="briefingOverlay" class="fixed-top w-100 h-100 d-flex align-items-center justify-content-center p-4" style="z-index: 30000; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px);">
            <div class="glass-card p-5 border-primary animate__animated animate__zoomIn" style="max-width: 600px;">
                <h1 class="text-primary text-center mb-4">MODO TUTORIAL</h1>
                <p class="text-white-50">Bem-vindo, Agente. O CyberOS é sua plataforma de treinamento.</p>
                <ul class="text-white small mb-4">
                    <li>Use os ícones no Desktop para abrir ferramentas.</li>
                    <li>Ganhe XP no PENTEST para subir de nível.</li>
                    <li>Proteja o sistema no SOC.</li>
                </ul>
                <button class="btn btn-primary w-100 py-3" onclick="document.getElementById('briefingOverlay').remove()">ENTENDI, VAMOS LÁ</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', briefingHTML);
}

// ================= AUTH =================
window.addEventListener('load', () => {
    sfx.init();
    const user = getCurrentUser();
    if (user) {
        if (window.os) os.hideSplash();
        document.getElementById('desktop-layer').classList.remove('d-none');
        showDashboard();
        if (!user.briefingShown) {
            showMissionBriefing();
            user.briefingShown = true;
            saveUserData();
        }
    }

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value;
        const p = document.getElementById('loginPassword').value;
        if (u === 'admin' && p === 'admin123') {
            localStorage.setItem('currentUser', 'admin');
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (!users['admin']) {
                users['admin'] = { name: 'Admin', username: 'admin', reputation: 500, xp: 1000, level: 10, briefingShown: false, performance: {}, inventory: { hints: 5, skips: 3 } };
                localStorage.setItem('users', JSON.stringify(users));
            }
            window.location.reload();
        } else {
            alert('Acesso Negado');
        }
    });
});