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
        const mttdEl = document.getElementById('socMTTD');
        const blockedEl = document.getElementById('socBlocked');
        if (mttdEl && e.detail.mttd) mttdEl.textContent = e.detail.mttd;
        if (blockedEl && e.detail.blocked !== undefined) blockedEl.textContent = e.detail.blocked + '/' + (e.detail.detected || 0);
        if (level > 70) { progress.className = 'progress-bar bg-danger'; badge.className = 'badge bg-danger'; badge.textContent = 'STATUS: CRÍTICO'; }
        else if (level > 30) { progress.className = 'progress-bar bg-warning'; badge.className = 'badge bg-warning'; badge.textContent = 'STATUS: ALERTA'; }
        else { progress.className = 'progress-bar bg-success'; badge.className = 'badge bg-success'; badge.textContent = 'STATUS: NORMAL'; }
    }
};

window.addEventListener('defense_won', (e) => {
    const body = document.getElementById('body-soc');
    if (!body) return;
    body.innerHTML = `<div class="d-flex flex-column align-items-center justify-content-center h-100 p-5 animate__animated animate__zoomIn">
        <div class="mx-auto mb-4 bg-success rounded-circle d-flex align-items-center justify-content-center" style="width:100px;height:100px;box-shadow:0 0 30px #0f0">
            <i class="fas fa-trophy fa-3x text-dark"></i>
        </div>
        <h1 class="text-success glitch-text mb-2">BLUE TEAM VENCEU!</h1>
        <p class="text-white-50 mb-2">Sistema protegido com sucesso! MTTD: <strong class="text-info">${e.detail.mttd}</strong></p>
        <p class="text-white-50 mb-4">${e.detail.ticks} ciclos de ataque neutralizados.</p>
        <button class="btn btn-outline-success btn-lg px-5 py-3 fw-bold" onclick="startDefenseMode()">NOVA SIMULAÇÃO SOC</button>
    </div>`;
    if (window.os) os.showNotification('🏆 BLUE TEAM VENCEU! Sistema protegido!', 'success');
});

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
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-success mb-0"><i class="fas fa-satellite-dish me-2"></i>SIEM - MONITORAMENTO</h5>
                            <span id="threatBadge" class="badge bg-success">STATUS: NORMAL</span>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-4"><div class="bg-black p-2 rounded text-center small border border-success"><div class="text-success fw-bold" id="threatValue">0%</div><div class="text-muted" style="font-size:0.65rem">THREAT LEVEL</div></div></div>
                            <div class="col-4"><div class="bg-black p-2 rounded text-center small border border-info"><div class="text-info fw-bold" id="socMTTD">N/A</div><div class="text-muted" style="font-size:0.65rem">MTTD</div></div></div>
                            <div class="col-4"><div class="bg-black p-2 rounded text-center small border border-warning"><div class="text-warning fw-bold" id="socBlocked">0/0</div><div class="text-muted" style="font-size:0.65rem">BLOQUEADO/DETECT.</div></div></div>
                        </div>
                        <div class="progress mb-3" style="height:8px;background:rgba(0,0,0,0.5);">
                            <div id="threatProgress" class="progress-bar bg-success" style="width:0%"></div>
                        </div>
                        <div id="socLogs" class="bg-black p-3 rounded font-monospace small overflow-auto" style="height:340px;border:1px solid #0f03;">
                            <div class="text-muted">Aguardando telemetria do Firewall...</div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="premium-glass p-3 mb-3 border-info">
                        <h6 class="text-info mb-2"><i class="fas fa-shield-virus me-2"></i>CONTRA-MEDIDAS</h6>
                        <div class="d-grid gap-1">
                            <button class="btn btn-outline-info btn-sm text-start" onclick="defense.deployCountermeasure('WAF_SQLI')"><i class="fas fa-code me-2"></i>WAF Anti-SQLi/XSS</button>
                            <button class="btn btn-outline-info btn-sm text-start" onclick="defense.deployCountermeasure('WAF_XSS')"><i class="fas fa-terminal me-2"></i>WAF Anti-XSS/CSP</button>
                            <button class="btn btn-outline-danger btn-sm text-start" onclick="defense.deployCountermeasure('IP_BLOCK')"><i class="fas fa-user-slash me-2"></i>IPS: Bloquear IP</button>
                            <button class="btn btn-outline-warning btn-sm text-start" onclick="defense.deployCountermeasure('VIRTUAL_PATCH')"><i class="fas fa-tools me-2"></i>Virtual Patch (RCE/ZeroDay)</button>
                            <button class="btn btn-outline-danger btn-sm text-start" onclick="defense.deployCountermeasure('EDR')"><i class="fas fa-virus-slash me-2"></i>EDR: Anti-Ransomware</button>
                            <button class="btn btn-outline-primary btn-sm text-start" onclick="defense.deployCountermeasure('ZERO_TRUST')"><i class="fas fa-lock me-2"></i>Zero Trust (Lateral Move)</button>
                            <button class="btn btn-outline-warning btn-sm text-start" onclick="defense.deployCountermeasure('EMAIL_FILTER')"><i class="fas fa-envelope-open-text me-2"></i>Anti-Phishing/DMARC</button>
                            <button class="btn btn-outline-success btn-sm text-start" onclick="defense.deployCountermeasure('MFA')"><i class="fas fa-key me-2"></i>MFA (Credential Dump)</button>
                            <button class="btn btn-outline-secondary btn-sm text-start" onclick="defense.deployCountermeasure('SCA_SCAN')"><i class="fas fa-cubes me-2"></i>SCA: Supply Chain</button>
                        </div>
                    </div>
                    <div class="premium-glass p-3 mb-3 border-warning">
                        <h6 class="text-warning small mb-2">REGRA PERSONALIZADA</h6>
                        <input type="text" id="customRuleName" class="form-control form-control-sm bg-dark text-white border-primary mb-1" placeholder="Nome da Regra">
                        <input type="text" id="customRulePattern" class="form-control form-control-sm bg-dark text-white border-primary mb-2" placeholder="Padrão Regex (Ex: SELECT|UNION)">
                        <button class="btn btn-primary btn-sm w-100" onclick="applyCustomRule()">APLICAR FILTRO</button>
                    </div>
                    <div class="premium-glass p-3 border-muted">
                        <h6 class="text-muted small mb-1"><i class="fas fa-book me-2"></i>MITRE ATT&CK</h6>
                        <p class="text-white-50" style="font-size:0.65rem;"><b>T1190:</b> Exploit Public App<br><b>T1110:</b> Brute Force<br><b>T1486:</b> Ransomware<br><b>T1566:</b> Phishing<br><b>T1195:</b> Supply Chain<br><b>T1550:</b> Pass-the-Hash<br><b>T1003:</b> Credential Dumping</p>
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

    window.removeEventListener('defense_log', socHandlers.log);
    window.removeEventListener('threat_update', socHandlers.threat);
    window.addEventListener('defense_log', socHandlers.log);
    window.addEventListener('threat_update', socHandlers.threat);

    if (window.defense) window.defense.startSimulation();
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

// ================= PENTEST TOOLKIT =================
function showToolkit() {
    const tools = [
        { id:'nmap', name:'Nmap', icon:'fa-network-wired', color:'info', desc:'Scanner de rede e portas', cmd:'nmap -sV -sC -A 192.168.1.1', output:`Starting Nmap 7.94 scan...\n22/tcp  open  ssh      OpenSSH 8.9p1\n80/tcp  open  http     Apache httpd 2.4.51\n443/tcp open  ssl/http nginx 1.18.0\n3306/tcp open  mysql   MySQL 8.0.31\nOS: Linux 5.15 (Ubuntu 22.04)\n[!] Apache 2.4.51 vulnerável a CVE-2021-41773 (Path Traversal)` },
        { id:'sqlmap', name:'SQLmap', icon:'fa-database', color:'danger', desc:'Exploração automática de SQLi', cmd:"sqlmap -u 'http://alvo.com/page?id=1' --dbs --batch", output:`[*] testing connection...\n[*] testing parameter 'id'\n[!] GET parameter 'id' is vulnerable to UNION-based injection!\n[*] backend DBMS: MySQL >= 8.0\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] webapp_db\n[+] Done! Use --dump to extract data.` },
        { id:'metasploit', name:'Metasploit', icon:'fa-bomb', color:'danger', desc:'Framework de exploração', cmd:'msfconsole -q -x "use exploit/multi/handler"', output:`msf6 > search apache 2.4.51\n  0  exploit/multi/handler\n  1  exploit/unix/http/apache_normalize_path_rce\nmsf6 > use 1\nmsf6 exploit(apache_normalize_path_rce) > set RHOSTS 192.168.1.1\nmsf6 exploit(apache_normalize_path_rce) > run\n[*] Started reverse handler on 0.0.0.0:4444\n[+] Shell opened!\nwhoami: www-data` },
        { id:'burpsuite', name:'Burp Suite', icon:'fa-bug', color:'warning', desc:'Proxy web para testes de API', cmd:'Interceptar requisição POST /login', output:`POST /login HTTP/1.1\nHost: alvo.com\nContent-Type: application/json\n\n{"username":"admin","password":"test"}\n\n--- RESPONSE ---\nHTTP/1.1 200 OK\n{"token":"eyJhbGciOiJub25lIn0.eyJyb2xlIjoidXNlciJ9."}\n[!] JWT com alg=none detectado! Possível bypass de auth.` },
        { id:'nikto', name:'Nikto', icon:'fa-search', color:'info', desc:'Scanner de vulnerabilidades web', cmd:'nikto -h http://192.168.1.1', output:`Nikto v2.1.6\n+ Target IP: 192.168.1.1\n+ Server: Apache/2.4.51\n+ /: Apache default page found\n+ /admin/: Admin interface found (no auth)\n+ /phpMyAdmin/: phpMyAdmin found\n+ OSVDB-3092: /.git/ found - might contain source\n+ CVE-2021-41773: Path traversal possible\n35 items checked, 6 vulnerabilities found.` },
        { id:'hashcat', name:'Hashcat', icon:'fa-key', color:'warning', desc:'Quebra de hashes por dicionário', cmd:'hashcat -m 0 hash.txt rockyou.txt', output:`hashcat v6.2.6\nHash: 5f4dcc3b5aa765d61d8327deb882cf99\nAlgorithm: MD5\nDictionary: rockyou.txt (14M palavras)\n\n5f4dcc3b5aa765d61d8327deb882cf99:password\n\nSession..........: hashcat\nStatus...........: Cracked\nTime.Estimated...: 00:00:01\nSpeed.#1.........: 1258.4 MH/s` }
    ];
    const toolsHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="text-primary mb-0"><i class="fas fa-toolbox me-2"></i>PENTEST TOOLKIT</h3>
                <span class="badge bg-danger">APENAS EM AMBIENTES AUTORIZADOS</span>
            </div>
            <div class="row g-3">
                ${tools.map(t => `
                <div class="col-md-6">
                    <div class="premium-glass p-3 border-${t.color} h-100">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-${t.color} p-2 rounded me-2"><i class="fas ${t.icon}"></i></div>
                            <div><h6 class="mb-0 text-${t.color}">${t.name}</h6><small class="text-muted">${t.desc}</small></div>
                        </div>
                        <code class="small text-success d-block bg-black p-2 rounded mb-2">$ ${t.cmd}</code>
                        <button class="btn btn-${t.color} btn-sm w-100" onclick="runTool('${t.id}')"><i class="fas fa-play me-2"></i>EXECUTAR SIMULAÇÃO</button>
                        <pre id="output-${t.id}" class="mt-2 small text-success bg-black p-2 rounded d-none" style="font-size:0.65rem;max-height:120px;overflow:auto;"></pre>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    `;
    renderToModule('toolkit', toolsHTML);
    const toolMap = {};
    tools.forEach(t => toolMap[t.id] = t.output);
    window.runTool = (id) => {
        const el = document.getElementById('output-' + id);
        if (!el) return;
        el.classList.remove('d-none');
        el.textContent = '';
        const lines = toolMap[id].split('\n');
        lines.forEach((line, i) => setTimeout(() => { el.textContent += line + '\n'; el.scrollTop = el.scrollHeight; }, i * 80));
        if (window.os) os.showNotification(id.toUpperCase() + ' executado com sucesso!', 'success');
    };
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
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[u] && users[u].password === p) {
            localStorage.setItem('currentUser', u);
            window.location.reload();
        } else if (u === 'admin' && p === 'admin123') {
            localStorage.setItem('currentUser', 'admin');
            if (!users['admin']) {
                users['admin'] = { name:'Admin', username:'admin', password:'admin123', reputation:500, xp:1000, level:10, briefingShown:false, performance:{}, inventory:{hints:5,skips:3}, coins:500 };
                localStorage.setItem('users', JSON.stringify(users));
            }
            window.location.reload();
        } else {
            if (window.os) os.showNotification('Acesso Negado: credenciais inválidas.', 'danger');
            else alert('Acesso Negado');
        }
    });

    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const username = document.getElementById('registerUsername').value.trim().toLowerCase();
        const password = document.getElementById('registerPassword').value;
        if (!name || !username || !password) return;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[username]) { alert('Codinome já em uso. Escolha outro.'); return; }
        users[username] = { name, username, password, reputation:0, xp:0, level:1, coins:100, briefingShown:false, performance:{}, inventory:{hints:5, skips:3} };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        window.location.reload();
    });
});