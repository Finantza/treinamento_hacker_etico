// Ethical Hacker Premium v5.0 - CYBER-OS EDITION
// 100% Offline | ProceduralAI v3 | CyberOS Window Manager Integration

let userData = {};
let currentDifficulty = 'logica';
let currentChallenge = null;
let currentChallengeData = null;
let gameStartTime = 0;

let cachedGlossaryHTML = null;
let isGlossaryCaching = false;

const RANKS = [
    { xp: 0, rank: 'Script Kiddie', color: 'secondary', reward: 0 },
    { xp: 500, rank: 'Network Explorer', color: 'primary', reward: 100 },
    { xp: 1500, rank: 'Bug Bounty Hunter', color: 'success', reward: 250 },
    { xp: 4000, rank: 'SysAdmin Hacker', color: 'info', reward: 500 },
    { xp: 10000, rank: 'Elite White Hat', color: 'warning', reward: 1000 },
    { xp: 25000, rank: 'Zero-Day Architect', color: 'danger', reward: 2500 },
    { xp: 50000, rank: 'Cyber Overlord', color: 'light', reward: 5000 }
];

const MARKET_ITEMS = [
    { id: 'hint', name: 'Exploit Hint', desc: 'Revela detalhes da vulnerabilidade.', price: 100, icon: 'fa-lightbulb', color: 'info', minXP: 0 },
    { id: 'skip', name: 'Automation Script', desc: 'Força a conclusão da missão atual.', price: 250, icon: 'fa-fast-forward', color: 'danger', minXP: 500 },
    { id: 'vpn', name: 'Premium VPN', desc: 'Protege seu combo em caso de falha.', price: 400, icon: 'fa-user-shield', color: 'warning', minXP: 1500 },
    { id: 'zeroday', name: 'Zero-Day Access', desc: 'Dobra o ganho de XP na próxima missão.', price: 750, icon: 'fa-virus', color: 'primary', minXP: 4000 },
    { id: 'soc_ai', name: 'SOC AI Assistant', desc: 'A IA automatiza uma contra-medida extra no modo Defesa.', price: 1200, icon: 'fa-robot', color: 'info', minXP: 7500 },
    { id: 'botnet', name: 'Botnet Rental', desc: 'Poder massivo: Pula 3 missões seguidas.', price: 1500, icon: 'fa-network-wired', color: 'success', minXP: 10000 }
];

const getReputationStatus = (xp) => {
    let current = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.xp) current = r;
        else break;
    }
    return current;
};

const getNextRank = (xp) => {
    return RANKS.find(r => r.xp > xp) || null;
};

async function initGlossaryCache() {
    if (cachedGlossaryHTML || isGlossaryCaching) return;
    isGlossaryCaching = true;
    try {
        const data = window.TECNICAS_DATA;
        if (!data) throw new Error("Base de dados offline não encontrada.");
        
        const attacks = data.attacks || [];
        const defenses = data.defenses || [];

        const card = (title, icon, badge, badgeColor, body, example, extra, extraLabel, extraColor) => `
            <div class="bg-black rounded mb-3 border-start border-4 border-${badgeColor}" style="overflow:hidden;">
                <div class="p-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas ${icon} text-${badgeColor} me-2"></i>
                        <h6 class="mb-0 text-${badgeColor}">${title}</h6>
                        <span class="badge bg-${badgeColor} ms-auto opacity-75" style="font-size:0.6rem;">${badge}</span>
                    </div>
                    <p class="small text-white-50 mb-2">${body}</p>
                    ${example ? `<div class="bg-dark rounded p-2 mb-2"><code class="text-warning" style="font-size:0.7rem;">📌 ${example}</code></div>` : ''}
                    ${extra ? `<div class="bg-dark rounded p-2"><span class="text-${extraColor}" style="font-size:0.7rem;"><i class="fas fa-shield-alt me-1"></i><b>${extraLabel}:</b> ${extra}</span></div>` : ''}
                </div>
            </div>`;

        const attackCards = attacks.map(a => card(a.name, a.icon, a.mitre || 'TTP', 'danger', a.simple, a.example, a.defense, '🛡️ Defesa', 'success')).join('');
        const defenseCards = defenses.map(d => card(d.name, d.icon, 'Defesa', d.color, d.simple, null, d.protects, '✅ Protege contra', d.color)).join('');

        cachedGlossaryHTML = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex align-items-center mb-4 flex-wrap">
                    <h3 class="text-primary mb-0"><i class="fas fa-book-open me-2"></i>GLOSSÁRIO COMPLETO DE CIBERSEGURANÇA</h3>
                    <span class="badge bg-primary ms-3">${attacks.length} Ataques | ${defenses.length} Defesas</span>
                </div>
                <ul class="nav nav-pills mb-4 gap-2" id="glossaryTabs">
                    <li class="nav-item"><button class="nav-link active btn-sm" data-bs-toggle="pill" data-bs-target="#gAttacks"><i class="fas fa-skull me-1"></i>${attacks.length} Ataques</button></li>
                    <li class="nav-item"><button class="nav-link btn-sm" data-bs-toggle="pill" data-bs-target="#gDefenses"><i class="fas fa-shield-alt me-1"></i>${defenses.length} Defesas</button></li>
                    <li class="nav-item"><button class="nav-link btn-sm" data-bs-toggle="pill" data-bs-target="#gFrameworks"><i class="fas fa-chess me-1"></i>Frameworks</button></li>
                    <li class="nav-item"><button class="nav-link btn-sm" data-bs-toggle="pill" data-bs-target="#gCerts"><i class="fas fa-certificate me-1"></i>Certificações</button></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="gAttacks">
                        <p class="text-muted small mb-3"><i class="fas fa-info-circle me-1"></i>Todas as técnicas MITRE ATT&CK v16+ com explicações, exemplos e contramedidas.</p>
                        ${attackCards}
                    </div>
                    <div class="tab-pane fade" id="gDefenses">
                        <p class="text-muted small mb-3"><i class="fas fa-info-circle me-1"></i>Ferramentas, controles e práticas de segurança — do básico ao avançado.</p>
                        ${defenseCards}
                    </div>
                    <div class="tab-pane fade" id="gFrameworks">
                        ${defenses.filter(d => ['MITRE ATT&CK','MITRE D3FEND','NIST CSF 2.0','PTES','OWASP Top 10','CIS Controls v8'].includes(d.name)).map(d => card(d.name, d.icon, 'Framework', d.color, d.simple, null, d.protects, '✅ Uso', d.color)).join('')}
                    </div>
                    <div class="tab-pane fade" id="gCerts">
                        ${defenses.filter(d => d.name.includes('Security+') || d.name.includes('CEH') || d.name.includes('OSCP') || d.name.includes('CISSP') || d.name.includes('CISM') || d.name.includes('AWS Security')).map(d => card(d.name, d.icon, 'Certificação', d.color, d.simple, null, d.protects, '🎯 Benefício', d.color)).join('')}
                    </div>
                </div>
            </div>`;
    } catch (e) {
        console.error("Glossary preload failed", e);
    } finally {
        isGlossaryCaching = false;
    }
}

async function showGlossary() {
    if (cachedGlossaryHTML) {
        renderToModule('glossary', cachedGlossaryHTML);
        return;
    }

    renderToModule('glossary', '<div class="p-5 text-center"><i class="fas fa-spinner fa-spin fa-3x text-primary"></i><p class="mt-3 text-muted">Construindo índice enciclopédico...</p></div>');
    
    if (!isGlossaryCaching) {
        await initGlossaryCache();
    } else {
        // Wait until it finishes caching
        while (isGlossaryCaching && !cachedGlossaryHTML) {
            await new Promise(r => setTimeout(r, 100));
        }
    }
    
    if (cachedGlossaryHTML) {
        renderToModule('glossary', cachedGlossaryHTML);
    } else {
        renderToModule('glossary', '<div class="p-5 text-center text-danger"><i class="fas fa-exclamation-triangle fa-3x mb-3"></i><p>Erro ao carregar o banco de dados.</p></div>');
    }
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

function saveUserData(userToSave = null) {
    const username = localStorage.getItem('currentUser');
    if (!username) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (userToSave) {
        users[username] = userToSave;
    } else {
        // Fallback for safety, but usually you should pass the object
        console.warn("saveUserData called without user object.");
    }
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
    
    // Check for urgent mission on login
    if (!window.initialMissionChecked) {
        window.initialMissionChecked = true;
        checkUrgentMissionChance();
    }

    const currentRank = getReputationStatus(user.xp);
    const nextRank = getNextRank(user.xp);
    const progress = !nextRank ? 100 : Math.floor(((user.xp - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100);

    const dashboardHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="text-white mb-0"><i class="fas fa-terminal me-2 text-primary"></i>CENTRAL DE COMANDO</h3>
                <div class="d-flex gap-3 align-items-center">
                    <div class="bg-dark rounded px-3 py-1 border border-warning">
                        <i class="fas fa-coins text-warning me-1"></i> <span class="fw-bold text-warning">${user.coins} CC</span>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" onclick="logout()">
                        <i class="fas fa-power-off me-1"></i> SAIR
                    </button>
                </div>
            </div>
            <div class="row g-4">
                <!-- COLUNA DO JOGADOR -->
                <div class="col-lg-4">
                    <div class="premium-glass p-4 text-center border-start border-4 border-${currentRank.color} h-100 position-relative">
                        ${user.combo > 1 ? `<div class="position-absolute top-0 end-0 m-3 combo-text">x${user.combo} COMBO</div>` : ''}
                        
                        <div class="mx-auto bg-${currentRank.color} rounded-circle mb-3 d-flex align-items-center justify-content-center shadow-glow" style="width: 80px; height: 80px;">
                            <i class="fas fa-user-ninja fa-2x text-dark"></i>
                        </div>
                        <h3 class="text-white mb-0">${user.name}</h3>
                        <p class="text-muted small mb-3">@${user.username}</p>
                        
                        <div class="badge bg-dark border border-${currentRank.color} text-${currentRank.color} px-3 py-2 mb-3 fs-6">
                            ${currentRank.rank}
                        </div>
                        
                        <div class="mt-4 text-start">
                            <div class="d-flex justify-content-between small text-muted mb-1">
                                <span>XP: <span class="text-white fw-bold">${user.xp}</span></span>
                                <span>${nextRank ? `Faltam ${nextRank.xp - user.xp} XP para ${nextRank.rank}` : 'RANK MÁXIMO'}</span>
                            </div>
                            <div class="progress bg-black" style="height: 10px;">
                                <div class="progress-bar bg-${currentRank.color} progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${progress}%"></div>
                            </div>
                        </div>

                        <div class="row g-2 mt-4">
                            <div class="col-6"><div class="bg-black p-2 rounded small border border-secondary"><i class="fas fa-check text-success me-1"></i> ${user.playerStats?.solved || 0} Resolvidos</div></div>
                            <div class="col-6"><div class="bg-black p-2 rounded small border border-secondary"><i class="fas fa-times text-danger me-1"></i> ${user.playerStats?.failed || 0} Falhas</div></div>
                        </div>
                    </div>
                </div>

                <!-- COLUNA DE APPS -->
                <div class="col-lg-8">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <div class="glass-card p-4 h-100 cursor-pointer border-primary shadow-hover transition-all" onclick="showAcademy()">
                                <h5 class="text-primary"><i class="fas fa-university me-2"></i>CYBER ACADEMY</h5>
                                <p class="small text-muted">Aprenda táticas ofensivas e defensivas de forma guiada com módulos interativos.</p>
                                <button class="btn btn-sm btn-outline-primary mt-2">ACESSAR ACADEMIA</button>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="glass-card p-4 cursor-pointer border-danger" style="background: linear-gradient(45deg, rgba(20,0,0,0.8), rgba(0,0,0,0.9));" onclick="showBlackMarket()">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 class="text-danger mb-1"><i class="fas fa-shopping-cart me-2"></i>BLACK MARKET</h5>
                                        <p class="small text-muted mb-0">Use seus CyberCoins para comprar ferramentas exclusivas e dicas.</p>
                                    </div>
                                    <button class="btn btn-danger btn-sm"><i class="fas fa-lock-open me-1"></i> ACESSAR LOJA</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 mt-2">
                            <h6 class="text-white-50 mb-3"><i class="fas fa-trophy text-warning me-2"></i>RANKING LOCAL (DARKNET)</h6>
                            <div class="glass-card p-0 overflow-hidden border-secondary" style="max-height: 200px; overflow-y: auto;">
                                <ul class="list-group list-group-flush bg-transparent">
                                    ${generateLeaderboard(user.xp, user.username)}
                                </ul>
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
                <p class="text-white-50 mb-2"><i class="fas fa-info-circle me-2"></i>${security.escapeHTML(currentChallengeData.description) || 'Analise o código abaixo e identifique a vulnerabilidade.'}</p>
                ${currentChallengeData.cve ? `<span class="badge bg-danger me-2 mb-2"><i class="fas fa-bug me-1"></i>${security.escapeHTML(currentChallengeData.cve)}</span>` : ''}
                ${currentChallengeData.mitre ? `<span class="badge bg-warning text-dark mb-2"><i class="fas fa-crosshairs me-1"></i>MITRE: ${security.escapeHTML(currentChallengeData.mitre)}</span>` : ''}
                <div class="bg-black p-3 rounded position-relative mt-2">
                    <pre class="mb-0"><code class="text-success">${currentChallengeData.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
            </div>

            <div class="row g-3">
                ${currentChallengeData.options.map((opt, i) => `
                    <div class="col-md-6">
                        <button class="btn btn-outline-primary w-100 py-3 text-start px-4 position-relative overflow-hidden" onclick="checkPentestAnswer(${i})">
                            <span class="opacity-25 me-2">${String.fromCharCode(65 + i)}|</span> ${security.escapeHTML(opt)}
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
        const oldRank = getReputationStatus(user.xp).rank;
        
        // Speed Bonus calculation
        const timeTaken = (Date.now() - gameStartTime) / 1000;
        let speedMultiplier = 1;
        let speedLabel = "";
        if (timeTaken < 10) { speedMultiplier = 1.5; speedLabel = "⚡ SPEED DEMON! (+50%)"; }
        else if (timeTaken < 20) { speedMultiplier = 1.25; speedLabel = "🚀 RÁPIDO! (+25%)"; }

        // Zero-Day Exploit Check
        let zeroDayMultiplier = 1;
        if (user.inventory?.zeroday > 0) {
            user.inventory.zeroday--;
            zeroDayMultiplier = 2.0;
            speedLabel = "☣️ ZERO-DAY EXPLOIT ATIVO! (XP x2) " + speedLabel;
        }

        user.combo = (user.combo || 0) + 1;
        const comboMultiplier = user.combo > 1 ? parseFloat((1 + (user.combo * 0.1)).toFixed(1)) : 1;
        
        const finalMultiplier = speedMultiplier * comboMultiplier * zeroDayMultiplier;
        const earnedXp = Math.floor(currentChallengeData.xp * finalMultiplier);
        const earnedCoins = Math.floor((currentChallengeData.xp / 10) * finalMultiplier) + 5;
        
        user.xp += earnedXp;
        user.coins = (user.coins || 0) + earnedCoins;
        user.reputation += currentChallengeData.rep;
        user.playerStats = user.playerStats || { solved: 0, failed: 0 };
        user.playerStats.solved += 1;
        
        // Rank-Up Detection
        const newRank = getReputationStatus(user.xp);
        let rankUpMsg = "";
        if (newRank.rank !== oldRank) {
            user.coins += newRank.reward;
            rankUpMsg = `<div class="mt-3 p-3 border border-${newRank.color} rounded bg-black animate__animated animate__bounceIn">
                <h5 class="text-${newRank.color} mb-1"><i class="fas fa-arrow-up me-2"></i>NOVO RANK: ${newRank.rank.toUpperCase()}</h5>
                <p class="small text-white-50 mb-0">Bônus de Promoção: <b class="text-warning">+${newRank.reward} CC</b></p>
            </div>`;
            if (window.os) os.showNotification(`PROMOÇÃO: Você agora é ${newRank.rank}!`, 'success');
        }

        saveUserData(user);
        
        const pentestBody = document.getElementById('body-pentest');
        if (pentestBody) {
            pentestBody.classList.add('flash-success');
            setTimeout(() => pentestBody.classList.remove('flash-success'), 500);
        }

        if (window.os) os.showNotification(`Acesso Concedido! +${earnedXp} XP | +${earnedCoins} CC`, 'success');
        feedback.innerHTML = `
            <div class="alert alert-success border-success bg-dark shadow-glow animate__animated animate__headShake">
                <h4 class="text-success mb-2">🔥 ACESSO CONCEDIDO!</h4>
                <div class="small text-white-50 mb-2">${speedLabel ? `<span class="text-info fw-bold me-2">${speedLabel}</span>` : ''} <span class="text-success">Combo x${comboMultiplier}</span></div>
                <p class="mb-0 text-white-50">XP Ganho: <b class="text-white">${earnedXp}</b> | <i class="fas fa-coins text-warning"></i> <b class="text-warning">+${earnedCoins} CC</b></p>
                ${rankUpMsg}
                <button class="btn btn-success mt-3 pulse w-100 fw-bold" onclick="loadGameInterface(); checkUrgentMissionChance();">PULAR PARA PRÓXIMO ALVO <i class="fas fa-arrow-right"></i></button>
            </div>`;
    } else {
        sfx.wrong();
        const user = getCurrentUser();
        
        // VPN Check
        if (user.inventory?.vpn > 0) {
            user.inventory.vpn--;
            saveUserData(user);
            if (window.os) os.showNotification('🛡️ VPN PROTEGEU SEU COMBO!', 'warning');
            feedback.innerHTML = `
                <div class="alert alert-warning bg-dark border-warning animate__animated animate__tada">
                    <h4 class="text-warning mb-2"><i class="fas fa-user-shield me-2"></i>FALHA DETECTADA!</h4>
                    <p class="mb-0 text-white-50">Sua VPN Premium redirecionou o tráfego. <b>O combo foi preservado!</b></p>
                    <button class="btn btn-warning mt-3 w-100 fw-bold" onclick="window.answered=false; this.parentElement.innerHTML='';">TENTAR NOVAMENTE (SIGILO MANTIDO)</button>
                </div>`;
            return;
        }

        user.combo = 1; // Reset combo
        user.playerStats = user.playerStats || { solved: 0, failed: 0 };
        user.playerStats.failed += 1;
        saveUserData(user);
        
        const pentestBody = document.getElementById('body-pentest');
        if (pentestBody) {
            pentestBody.classList.add('shake');
            setTimeout(() => pentestBody.classList.remove('shake'), 300);
        }

        if (window.os) os.showNotification('ALERTA: IDS Detectou sua assinatura! Combo Perdido.', 'danger');
        feedback.innerHTML = `
            <div class="alert alert-danger bg-dark border-danger animate__animated animate__shakeX">
                <h4 class="text-danger">❌ CONEXÃO BLOQUEADA PELO FIREWALL</h4>
                <p class="mb-0 text-white-50">O alvo rastreou sua requisição. Posição comprometida.</p>
                <button class="btn btn-danger mt-3 w-100 fw-bold" onclick="loadGameInterface()">ABORTAR E ESCONDER RASTROS</button>
            </div>`;
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
        const redWin = e.detail.result === 'red_win';
        const icon  = redWin ? 'fa-skull' : 'fa-trophy';
        const color = redWin ? 'danger'   : 'success';
        const glow  = redWin ? '#f00'     : '#0f0';
        const title = redWin ? 'SISTEMA COMPROMETIDO' : 'BLUE TEAM VITORIOSO!';
        const isUrgent = window.urgentMissionActive;
        const xpGain  = redWin ? 20  : (isUrgent ? 300 : 150);
        const repGain = redWin ? 5   : (isUrgent ? 100 : 50);
        const coinsGain = redWin ? 0 : (isUrgent ? 50 : 25);
        
        // Reset flag
        window.urgentMissionActive = false;
        
        const user = getCurrentUser();
        
        if (user) {
            if (!redWin) {
                user.combo = (user.combo || 0) + 1;
                sfx.correct();
                body.classList.add('flash-success');
                setTimeout(() => body.classList.remove('flash-success'), 500);
            } else {
                user.combo = 1;
                sfx.wrong();
                body.classList.add('shake');
                setTimeout(() => body.classList.remove('shake'), 500);
            }
            
            const multiplier = user.combo > 1 ? parseFloat((1 + (user.combo * 0.1)).toFixed(1)) : 1;
            const finalXp = Math.floor(xpGain * multiplier);
            const finalCoins = Math.floor(coinsGain * multiplier);
            
            user.xp += finalXp; 
            user.reputation += repGain;
            user.coins = (user.coins || 0) + finalCoins;
            saveUserData(user);
            
            body.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center h-100 p-5 animate__animated animate__zoomIn">
                    <div class="mx-auto mb-4 bg-${color} rounded-circle d-flex align-items-center justify-content-center shadow-glow" style="width:100px;height:100px;">
                        <i class="fas ${icon} fa-3x text-dark"></i>
                    </div>
                    <h1 class="text-${color} glitch-text mb-2">${title}</h1>
                    <p class="text-white-50 mb-4 text-center">${redWin ? 'Red Bot venceu. Combo zerado.' : 'Onda neutralizada! Adrenalina ativada.'}</p>
                    <div class="row g-3 w-100 mb-4" style="max-width:500px;">
                        <div class="col-4"><div class="bg-black p-3 rounded border border-${color} text-center small text-${color} fw-bold">+${finalXp} XP ${!redWin ? `<span class="opacity-50">(x${multiplier})</span>` : ''}</div></div>
                        <div class="col-4"><div class="bg-black p-3 rounded border border-warning text-center small text-warning fw-bold">+${finalCoins} CC</div></div>
                        <div class="col-4"><div class="bg-black p-3 rounded border border-${color} text-center small text-${color} fw-bold">+${repGain} REP</div></div>
                    </div>
                    <button class="btn btn-outline-${color} btn-lg px-5 py-3 fw-bold pulse" onclick="startBotWar()">REINICIAR PROTOCOLO</button>
                </div>
            `;
        }
        if (window.os) os.showNotification(redWin ? '💀 Sistema derrubado pelo Red Bot!' : '🏆 Blue Team venceu a Arena!', redWin ? 'danger' : 'success');
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

    if (window.defense) {
        const user = getCurrentUser();
        if (user && user.inventory && user.inventory.soc_ai > 0) {
            window.defense.autoDefense = true;
            if (window.os) os.showNotification('SOC AI Assistant Ativado! Mitigação automática ligada.', 'info');
        } else {
            window.defense.autoDefense = false;
        }
        window.defense.startSimulation();
    }
}

function getDifficultyByXP(xp) {
    if (xp >= 10000) return 'massiva';
    if (xp >= 1500) return 'logica';
    return 'iniciante';
}

function checkUrgentMissionChance() {
    // Avoid multiple invitations or triggers during active missions
    if (document.getElementById('urgent-invitation-overlay')) return;
    if (window.botWar && window.botWar.isActive) return;

    if (Math.random() < 0.15) {
        setTimeout(showUrgentMissionInvitation, 800);
    }
}

function showUrgentMissionInvitation() {
    const user = getCurrentUser();
    const missionType = Math.random() > 0.5 ? 'attack' : 'defense';
    const difficulty = getDifficultyByXP(user ? user.xp : 0);
    const container = document.createElement('div');
    container.id = 'urgent-invitation-overlay';
    container.className = 'position-fixed inset-0 d-flex align-items-center justify-content-center z-index-30000';
    container.style.background = 'rgba(0,0,0,0.85)';
    container.style.webkitBackdropFilter = 'blur(10px)';
    container.style.backdropFilter = 'blur(10px)';
    
    const diffColor = difficulty === 'massiva' ? 'danger' : (difficulty === 'logica' ? 'warning' : 'primary');
    
    container.innerHTML = `
        <div class="premium-glass p-5 border-warning text-center animate__animated animate__zoomIn" style="max-width: 500px; border-width: 2px !important;">
            <div class="mb-4">
                <i class="fas fa-satellite-dish fa-3x text-warning animate__animated animate__pulse animate__infinite"></i>
            </div>
            <h2 class="text-warning fw-bold mb-3">CONTRATO URGENTE DETECTADO</h2>
            <p class="text-white-50 mb-4">Interceptei uma transmissão da Darknet. Há uma operação de alto risco compatível com seu nível.</p>
            
            <div class="bg-black p-3 rounded border border-secondary mb-4 text-start">
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">TIPO:</span>
                    <span class="text-white fw-bold">${missionType === 'attack' ? 'OFENSIVA (RED)' : 'DEFENSIVA (BLUE)'}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">DIFICULDADE:</span>
                    <span class="text-${diffColor} fw-bold">${difficulty.toUpperCase()}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-muted small">RECOMPENSA:</span>
                    <span class="text-success fw-bold">+250 XP | +100 CC</span>
                </div>
            </div>
            
            <div class="d-grid gap-3">
                <button class="btn btn-warning py-3 fw-bold" onclick="startUrgentMission('${missionType}', '${difficulty}')">ACEITAR CONTRATO</button>
                <button class="btn btn-outline-secondary py-2 small" onclick="document.getElementById('urgent-invitation-overlay').remove()">IGNORAR TRANSMISSÃO</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
    sfx.recon();
    if (window.os) os.showNotification('CONTRATO URGENTE RECEBIDO', 'warning');
}

function startUrgentMission(type = null, diff = 'logica') {
    const overlay = document.getElementById('urgent-invitation-overlay');
    if (overlay) overlay.remove();

    window.urgentMissionActive = true;
    const missionType = type || (Math.random() > 0.5 ? 'attack' : 'defense');
    startBotWar(missionType, diff);
    
    setTimeout(() => {
        const title = document.querySelector(`#win-botwar .fw-bold`);
        if (title) title.innerHTML = `<i class="fas fa-exclamation-triangle text-warning me-2"></i> MISSÃO URGENTE: ${missionType === 'attack' ? 'OFENSIVA' : 'DEFENSIVA'} (${diff.toUpperCase()})`;
        if (window.os) os.showNotification(`ALERTA: Missão Urgente Iniciada! Objetivo: ${missionType.toUpperCase()}`, 'warning');
    }, 200);
}

function startBotWar(missionType = 'duel', diff = 'logica') {
    const isAttackOnly = missionType === 'attack';
    const isDefenseOnly = missionType === 'defense';

    if (window.botWar) window.botWar.startDuel(diff);
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
                        <h6 class="text-danger small mb-2"><i class="fas fa-skull me-1"></i>ATAQUES RED ${isAttackOnly ? '(MISSÃO)' : ''}</h6>
                        <div class="d-flex gap-1 flex-wrap">
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('sqli')">SQLi</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('bof')">BoF</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('xss')">XSS</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('ransomware')">Ransom</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('phishing')">Phish</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="botWar.manualAttack('zeroday')">0-Day</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="botWar.manualAttack('ssrf')">SSRF</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="botWar.manualAttack('dos')">DDoS</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="botWar.manualAttack('supply')">SCA</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="botWar.manualAttack('advanced_sqli')">BlindSQLi</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="premium-glass p-3 border-info ${isAttackOnly ? 'd-none' : ''}">
                        <h6 class="text-info small mb-2"><i class="fas fa-shield-alt me-1"></i>DEFESAS BLUE ${isDefenseOnly ? '(MISSÃO)' : ''}</h6>
                        <div class="d-flex gap-1 flex-wrap">
                            <button class="btn btn-sm btn-outline-info" onclick="botWar.manualDefend('WAF')">WAF</button>
                            <button class="btn btn-sm btn-outline-info" onclick="botWar.manualDefend('IPS')">IPS</button>
                            <button class="btn btn-sm btn-outline-info" onclick="botWar.manualDefend('PATCH')">Patch</button>
                            <button class="btn btn-sm btn-outline-success" onclick="botWar.manualDefend('EDR')">EDR</button>
                            <button class="btn btn-sm btn-outline-primary" onclick="botWar.manualDefend('ZT')">ZeroTrust</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="botWar.manualDefend('MFA')">MFA</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="botWar.manualDefend('RATE_LIMIT')">RateLimit</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="botWar.manualDefend('IMDSV2')">IMDSv2</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="botWar.manualDefend('SCA')">SCA</button>
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
        <div id="briefingOverlay" class="fixed-top w-100 h-100 d-flex align-items-center justify-content-center p-4" style="z-index: 30000; background: rgba(0,0,0,0.9); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);">
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
window.triggerLoginFlow = function() {
    const user = getCurrentUser();
    if (!user) return;
    document.getElementById('desktop-layer').classList.remove('d-none');
    showDashboard();
    if (!user.briefingShown) {
        showMissionBriefing();
        user.briefingShown = true;
        saveUserData(user);
    }
};

window.addEventListener('load', () => {
    sfx.init();
    // Do NOT hide splash immediately here. Let index.html initIntro handle the transition.
    // The splash screen will call triggerLoginFlow() when it finishes.
    
    // Pre-cache the glossary in the background to ensure instant load
    initGlossaryCache();

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const hp = await security.hash(p);
        
        // Suporte a login legado (migração automática) ou hash correto
        if (users[u] && (users[u].password === hp || users[u].password === p)) {
            if (users[u].password !== hp) {
                users[u].password = hp; // Migrar para hash
                localStorage.setItem('users', JSON.stringify(users));
            }
            localStorage.setItem('currentUser', u);
            window.location.reload();
        } else if (u === 'admin' && p === 'admin123') {
            localStorage.setItem('currentUser', 'admin');
            if (!users['admin']) {
                users['admin'] = { name:'Admin', username:'admin', password:hp, reputation:500, xp:1000, level:10, briefingShown:false, performance:{}, inventory:{hints:5,skips:3}, coins:500 };
                localStorage.setItem('users', JSON.stringify(users));
            }
            window.location.reload();
        } else {
            if (window.os) os.showNotification('Acesso Negado: credenciais inválidas.', 'danger');
            else alert('Acesso Negado');
        }
    });

    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const username = document.getElementById('registerUsername').value.trim().toLowerCase();
        const password = document.getElementById('registerPassword').value;
        if (!name || !username || !password) return;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[username]) { alert('Codinome já em uso. Escolha outro.'); return; }
        const hp = await security.hash(password);
        users[username] = { name, username, password: hp, reputation:0, xp:0, level:1, coins:100, briefingShown:false, performance:{}, inventory:{hints:5, skips:3} };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        window.location.reload();
    });
});

// ================= BLACK MARKET =================
function showBlackMarket() {
    const user = getCurrentUser();
    if (!user) return;

    const availableItems = MARKET_ITEMS.map(item => {
        const isLocked = user.xp < item.minXP;
        const requiredRank = getReputationStatus(item.minXP).rank;
        
        return `
            <div class="col-md-6">
                <div class="glass-card p-4 border-secondary shadow-hover h-100 position-relative ${isLocked ? 'opacity-50' : ''}">
                    ${isLocked ? `<div class="position-absolute inset-0 d-flex flex-column align-items-center justify-content-center bg-black bg-opacity-75 rounded z-index-1">
                        <i class="fas fa-lock fa-2x mb-2 text-muted"></i>
                        <span class="small text-muted text-center px-3">Requer Rank: <br><b class="text-white">${requiredRank}</b></span>
                    </div>` : ''}
                    <div class="d-flex justify-content-between">
                        <h5 class="text-${item.color}"><i class="fas ${item.icon} me-2"></i>${item.name}</h5>
                        <span class="badge bg-warning text-dark fs-6">${item.price} CC</span>
                    </div>
                    <p class="small text-white-50 mt-2">${item.desc}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="small text-white">Inventário: <b class="text-${item.color}">${user.inventory?.[item.id] || 0}</b></span>
                        <button class="btn btn-sm btn-outline-${item.color}" onclick="buyMarketItem('${item.id}', ${item.price})" ${isLocked ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart me-1"></i> COMPRAR
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const marketHTML = `
        <div class="p-4 animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="text-danger mb-0"><i class="fas fa-shopping-cart me-2"></i>BLACK MARKET</h3>
                <div class="bg-dark rounded px-3 py-1 border border-warning">
                    <i class="fas fa-coins text-warning me-1"></i> <span class="fw-bold text-warning" id="bm-coins">${user.coins || 0} CC</span>
                </div>
            </div>
            <p class="text-white-50 mb-4 small"><i class="fas fa-shield-alt me-2"></i>Nível de Anonimato: <span class="text-success">HIGH (Encrypted Tunnel)</span></p>
            
            <div class="row g-4 mb-4">
                ${availableItems}
            </div>

            <div class="glass-card p-4 border-success mt-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h5 class="text-success mb-1"><i class="fas fa-university me-2"></i>RECARGA DE CRÉDITOS (PIX)</h5>
                        <p class="small text-muted mb-0">Adquira CyberCoins instantaneamente via transferência criptografada.</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-success btn-sm" onclick="showPixPayment(500, 10)">500 CC (R$ 10)</button>
                        <button class="btn btn-success btn-sm" onclick="showPixPayment(1500, 25)">1500 CC (R$ 25)</button>
                        <button class="btn btn-success btn-sm" onclick="showPixPayment(5000, 75)">5000 CC (R$ 75)</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderToModule('blackmarket', marketHTML);
}

window.buyMarketItem = function(item, price) {
    const user = getCurrentUser();
    if (!user) return;
    if ((user.coins || 0) < price) {
        if (window.os) os.showNotification('Saldo insuficiente. Complete mais missões para ganhar CC.', 'danger');
        sfx.wrong();
        return;
    }
    
    user.coins -= price;
    if (!user.inventory) user.inventory = { hints: 0, skips: 0, vpn: 0, zeroday: 0, botnet: 0 };
    
    user.inventory[item] = (user.inventory[item] || 0) + 1;
    
    saveUserData(user);
    sfx.correct();
    if (window.os) os.showNotification('Compra efetuada com sucesso! Entrega anônima realizada.', 'success');
    
    const coinsEl = document.getElementById('bm-coins');
    const hintsEl = document.getElementById('inv-hints');
    const skipsEl = document.getElementById('inv-skips');
    
    if (coinsEl) coinsEl.innerHTML = `${user.coins} CC`;
    if (hintsEl && item === 'hint') {
        hintsEl.textContent = user.inventory.hints;
        hintsEl.parentElement.parentElement.classList.add('flash-success');
        setTimeout(() => hintsEl.parentElement.parentElement.classList.remove('flash-success'), 500);
    }
    if (skipsEl && item === 'skip') {
        skipsEl.textContent = user.inventory.skips;
        skipsEl.parentElement.parentElement.classList.add('flash-success');
        setTimeout(() => skipsEl.parentElement.parentElement.classList.remove('flash-success'), 500);
    }
};

// ================= RIVALS & LEADERBOARD =================
const npcRivals = [
    { name: 'PhantomByte', xp: 12500 },
    { name: '0xG3n', xp: 8200 },
    { name: 'NullSec', xp: 5100 },
    { name: 'DarkNet_44', xp: 2400 },
    { name: 'ScriptRunner', xp: 800 }
];

function generateLeaderboard(userXp, username) {
    const allPlayers = [...npcRivals, { name: username + ' (Você)', xp: userXp, isUser: true }];
    allPlayers.sort((a, b) => b.xp - a.xp);
    
    return allPlayers.map((p, index) => {
        const bg = p.isUser ? 'bg-primary text-white' : 'bg-transparent text-white-50';
        const rankColor = index === 0 ? 'text-warning' : (index === 1 ? 'text-secondary' : (index === 2 ? 'text-danger' : 'text-muted'));
        
        return `
            <li class="list-group-item ${bg} border-secondary d-flex justify-content-between align-items-center py-3">
                <div><span class="${rankColor} fw-bold me-3">#${index + 1}</span> ${p.name}</div>
                <span class="badge ${p.isUser ? 'bg-dark text-primary' : 'bg-secondary'}">${p.xp} XP</span>
            </li>
        `;
    }).join('');
}

// Rival notifications ticker
setInterval(() => {
    if (!window.os || !getCurrentUser()) return;
    if (Math.random() > 0.8) {
        const randomRival = npcRivals[Math.floor(Math.random() * npcRivals.length)];
        const events = [
            `${randomRival.name} resolveu um contrato da DarkWeb e ganhou XP!`,
            `${randomRival.name} invadiu um mainframe corporativo.`,
            `${randomRival.name} comprou um novo Exploit no Black Market.`
        ];
        if (window.os) os.showNotification(events[Math.floor(Math.random() * events.length)], 'secondary');
    }
}, 45000);

// Urgent Mission Periodic Check (Every 2 Minutes)
setInterval(() => {
    if (getCurrentUser()) {
        checkUrgentMissionChance();
    }
}, 120000);

// ================= PIX PAYMENT SYSTEM =================
window.showPixPayment = function(ccAmount, brlPrice) {
    const pixKey = "31984359511";
    const transactionId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const pixHTML = `
        <div id="pixModal" class="fixed-top w-100 h-100 d-flex align-items-center justify-content-center p-4" style="z-index: 40000; background: rgba(0,0,0,0.9); -webkit-backdrop-filter: blur(15px); backdrop-filter: blur(15px);">
            <div class="glass-card p-4 border-success text-center animate__animated animate__zoomIn" style="max-width: 450px;">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h4 class="text-success mb-0"><i class="fas fa-qrcode me-2"></i>SINCRO. BANCÁRIA PIX</h4>
                    <button class="btn-close btn-close-white" onclick="stopPixPolling(); document.getElementById('pixModal').remove()"></button>
                </div>
                
                <p class="text-white-50 small mb-3">Após o pagamento, o sistema detectará o crédito automaticamente via rede bancária.</p>
                
                <div class="bg-white p-2 rounded mb-3 mx-auto" style="width: 200px; height: 200px;">
                    <img src="pix_qr.png" class="img-fluid" alt="PIX QR Code">
                </div>

                <div class="input-group mb-2">
                    <span class="input-group-text bg-dark border-success text-success small">CHAVE:</span>
                    <input type="text" class="form-control bg-black border-success text-white small text-center" value="${pixKey}" readonly id="pixKeyInput">
                    <button class="btn btn-outline-success" onclick="copyPixKey()"><i class="fas fa-copy"></i></button>
                </div>
                <div class="text-muted mb-3" style="font-size: 0.6rem;">ID TRANSAÇÃO: <span class="text-success fw-bold">${transactionId}</span></div>
                
                <div id="pixStatus" class="p-3 bg-black rounded border border-secondary mb-3">
                    <div class="d-flex align-items-center justify-content-center text-info">
                        <div class="spinner-grow spinner-grow-sm me-2" role="status"></div>
                        <span class="small fw-bold">AGUARDANDO RECEBIMENTO...</span>
                    </div>
                </div>

                <div class="d-grid gap-2">
                    <button class="btn btn-outline-secondary" onclick="stopPixPolling(); document.getElementById('pixModal').remove()">CANCELAR E VOLTAR</button>
                </div>
                <p class="text-muted mt-3 mb-0" style="font-size: 0.6rem;">Segurança CyberOS: Verificação criptografada de ponta-a-ponta.</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', pixHTML);
    sfx.recon();

    startPixPolling(transactionId, ccAmount);
};

let pixPollingInterval = null;

window.startPixPolling = function(txId, amount) {
    stopPixPolling();
    const startTime = Date.now();
    const timeoutLimit = 120000; // 2 minutos para pagar
    
    console.log(`[CyberBank] Monitorando transação: ${txId}`);
    
    pixPollingInterval = setInterval(() => {
        const statusEl = document.getElementById('pixStatus');
        if (!statusEl) { stopPixPolling(); return; }

        const elapsed = Date.now() - startTime;
        
        // Verificação de Timeout
        if (elapsed > timeoutLimit) {
            stopPixPolling();
            statusEl.innerHTML = `
                <div class="d-flex align-items-center justify-content-center text-danger">
                    <i class="fas fa-times-circle me-2"></i>
                    <span class="small fw-bold">TRANSAÇÃO CANCELADA (TIMEOUT)</span>
                </div>
            `;
            sfx.wrong();
            if (window.os) os.showNotification('O tempo limite para o pagamento PIX expirou.', 'danger');
            setTimeout(() => document.getElementById('pixModal')?.remove(), 3000);
            return;
        }

        // Simulação de detecção
        if (window.FORCE_PIX_SUCCESS) {
            clearInterval(pixPollingInterval);
            statusEl.innerHTML = `
                <div class="d-flex align-items-center justify-content-center text-success animate__animated animate__pulse">
                    <i class="fas fa-check-circle me-2"></i>
                    <span class="small fw-bold">PAGAMENTO CONFIRMADO!</span>
                </div>
            `;
            sfx.correct();
            setTimeout(() => simulatePixSuccess(amount), 2000);
        }
    }, 3000);
};

window.stopPixPolling = function() {
    if (pixPollingInterval) clearInterval(pixPollingInterval);
    window.FORCE_PIX_SUCCESS = false;
};

window.copyPixKey = function() {
    const input = document.getElementById('pixKeyInput');
    input.select();
    document.execCommand('copy');
    if (window.os) os.showNotification('Chave PIX copiada!', 'success');
};

window.simulatePixSuccess = function(amount) {
    const user = getCurrentUser();
    if (!user) return;
    
    user.coins = (user.coins || 0) + amount;
    saveUserData(user);
    
    document.getElementById('pixModal')?.remove();
    sfx.correct();
    
    if (window.os) {
        os.showNotification(`+${amount} CyberCoins adicionados à sua conta!`, 'success');
        showBlackMarket();
    }
};