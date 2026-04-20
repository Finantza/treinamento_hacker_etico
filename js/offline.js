// Offline Logic for Ethical Hacker - 100% Client-Side
let userData = JSON.parse(localStorage.getItem('userData') || '{}');
let globalPerformance = JSON.parse(localStorage.getItem('globalPerformance') || '{}');
let gameStartTime = 0;
let currentDifficulty = 'facil'; // Default difficulty

// Sound FX Manager (Intect Premium Engine)
const sfx = {
    ctx: null,
    muted: localStorage.getItem('sfx_muted') === 'true',
    init() {
        if (!this.ctx) {
            try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
        }
    },
    play(freq, type, dur, vol = 0.1) {
        if (this.muted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    },
    tick() { this.play(800, 'square', 0.05, 0.01); },
    tap() { this.play(300, 'triangle', 0.05, 0.03); },
    correct() { this.play(800, 'sine', 0.1, 0.05); setTimeout(() => this.play(1200, 'sine', 0.2, 0.05), 100); },
    wrong() { this.play(200, 'sawtooth', 0.3, 0.05); },
    win() { this.play(500, 'sine', 0.1, 0.1); setTimeout(() => this.play(700, 'sine', 0.3, 0.1), 150); }
};

// Mouse Tracking & Global Clicks
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});

// Initialize SFX context on first user interaction (avoids AudioContext autoplay restriction)
let sfxInited = false;
document.addEventListener('click', () => {
    if (!sfxInited) {
        sfx.init();
        sfxInited = true;
    }
}, { once: false });

// Smooth scroll to features section
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// No Pyodide needed for Ethical Hacker

// Generate Bug (client-side)
function generateBug(mode) {
    const user = getCurrentUser();
    let perfMatrix = { total: 0, correct: 0 };
    
    if (user && user.performance) {
        Object.values(user.performance).forEach(p => {
            perfMatrix.total += p.total; 
            perfMatrix.correct += p.correct;
        });
    }
    
    // IA Mode uses the dynamic performance metrics to select the category
    if (mode === 'ia') {
        return ProceduralAI.gerar(perfMatrix);
    }
    
    // Other modes map directly to procedural categories
    let categoryMap = {
        'facil': 'iniciante',
        'medio': 'logica',
        'dificil': 'massiva',
        'inferno': 'massiva'
    };
    
    let targetCategory = categoryMap[mode] || 'iniciante';
    return ProceduralAI.gerar(perfMatrix, targetCategory);
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    const label = document.getElementById('currentDifficultyLabel');
    if (label) {
        label.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }

    // Update button active styling
    ['ia', 'facil', 'medio', 'dificil', 'inferno'].forEach((level) => {
        const btn = document.getElementById(`btn-dificuldade-${level}`);
        if (btn) {
            btn.classList.remove('active', 'border-white');
            if (level === difficulty) btn.classList.add('active', 'border-white');
        }
    });
}

// User Management (enhanced with metrics)
function loginUser(username, password) {
    if (userData[username] && userData[username].password === password) {
        localStorage.setItem('currentUser', username);
        return userData[username];
    }
    return null;
}

function registerUser(username, password, name) {
    if (userData[username]) return { error: "Usuário já existe" };
    userData[username] = {
        name,
        password,
        xp: 0,
        level: 1,
        coins: 0,
        performance: {},
        streak: 0,
        bestStreak: 0,
        totalBugsFound: 0,
        totalCorrect: 0,
        totalWrong: 0,
        averageTime: 0,
        achievements: [],
        inventory: { hints: 0, skips: 0 },
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    return userData[username];
}

// Create Test User for Development
function createTestUser() {
    const testUsername = 'teste';
    const testPassword = 'offline';
    const testName = 'Usuário de Teste';

    // Always create/overwrite test user with sample data
    userData[testUsername] = {
        name: testName,
        password: testPassword,
        xp: 250, // Level 3
        level: 3,
        coins: 25,
        performance: {
            logica: { correct: 8, total: 10 },
            sintaxe: { correct: 7, total: 9 }
        },
        streak: 3,
        bestStreak: 5,
        totalBugsFound: 19,
        totalCorrect: 15,
        totalWrong: 4,
        averageTime: 12.5,
        achievements: ['first_10', 'streak_5'],
        inventory: { hints: 2, skips: 1 }, // Comeca com alguns itens de teste
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Usuário de teste criado/atualizado:', testUsername);
    return userData[testUsername];
}

// Reset Test Data (for development)
function resetTestData() {
    localStorage.removeItem('userData');
    localStorage.removeItem('globalPerformance');
    localStorage.removeItem('currentUser');
    userData = {};
    globalPerformance = {};
    console.log('Dados de teste resetados');
    location.reload();
}

function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    const user = username ? userData[username] : null;

    // Safety merge para adicionar o inventory em perfis antigos (Patch Retrocompatibilidade)
    if (user && !user.inventory) {
        user.inventory = { hints: 0, skips: 0 };
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    return user;
}

// ── Bonus System Constants ─────────────────────────────────────────
const DIFFICULTY_XP = {
    facil:   { xp: 10, coins: 2,  label: 'Iniciante'    },
    logica:  { xp: 20, coins: 4,  label: 'Lógica'       },
    medio:   { xp: 20, coins: 4,  label: 'Médio'        },
    ia:      { xp: 25, coins: 5,  label: 'IA Adaptativa'},
    dificil: { xp: 35, coins: 7,  label: 'Pro'          },
    massiva: { xp: 35, coins: 7,  label: 'Massiva'      },
    inferno: { xp: 50, coins: 10, label: 'Inferno'      }
};

const STREAK_MILESTONES = [
    { at: 3,  bonusXP: 10, bonusCoins: 3,  label: '🔥 Combo x3'    },
    { at: 5,  bonusXP: 20, bonusCoins: 5,  label: '⚡ Combo x5'    },
    { at: 10, bonusXP: 50, bonusCoins: 15, label: '💥 STREAK x10!' },
    { at: 20, bonusXP: 100,bonusCoins: 30, label: '🌟 LENDÁRIO x20!'}
];

function saveScore(mode, baseScore, timeTaken = 0) {
    const user = getCurrentUser();
    if (!user) return null;

    const tier   = DIFFICULTY_XP[mode] || DIFFICULTY_XP['facil'];
    let earnedXP    = tier.xp;
    let earnedCoins = tier.coins;
    const bonuses = [];

    // ── 1. Combo Multiplier (5% per streak, max +100%) ─────────────
    const comboBonus = Math.min(1.0, user.streak * 0.05);
    earnedXP    = Math.floor(earnedXP * (1 + comboBonus));
    earnedCoins = Math.floor(earnedCoins * (1 + comboBonus * 0.5));
    if (comboBonus > 0) bonuses.push({ label: `🔄 Combo +${Math.round(comboBonus * 100)}%`, xp: 0 });

    // ── 2. Speed Bonus (under 8s = fast, under 4s = lightning) ─────
    let speedBonusXP = 0;
    if (timeTaken > 0 && timeTaken < 4) {
        speedBonusXP = 10; bonuses.push({ label: '⚡ Relâmpago! (<4s)', xp: 10 });
    } else if (timeTaken > 0 && timeTaken < 8) {
        speedBonusXP = 5;  bonuses.push({ label: '🚀 Velocidade! (<8s)', xp: 5 });
    }
    earnedXP    += speedBonusXP;
    earnedCoins += Math.floor(speedBonusXP / 2);

    // ── 3. Streak Milestone Bonus ───────────────────────────────────
    const nextStreak = user.streak + 1;
    const milestone = STREAK_MILESTONES.find(m => m.at === nextStreak);
    if (milestone) {
        earnedXP    += milestone.bonusXP;
        earnedCoins += milestone.bonusCoins;
        bonuses.push({ label: milestone.label, xp: milestone.bonusXP });
    }

    // ── 4. First Correct of Session ─────────────────────────────────
    if (user.totalCorrect === 0) {
        earnedXP += 5; bonuses.push({ label: '🎯 Primeira Caçada!', xp: 5 });
    }

    // ── 5. Apply to user ────────────────────────────────────────────
    user.xp    += earnedXP;
    user.level  = Math.floor(user.xp / 100) + 1;
    user.coins += earnedCoins;
    user.totalBugsFound += 1;
    user.totalCorrect   += 1;
    user.streak += 1;
    if (user.streak > user.bestStreak) user.bestStreak = user.streak;

    // Rolling average time (Welford)
    if (timeTaken > 0) {
        if (user.averageTime === 0) {
            user.averageTime = timeTaken;
        } else {
            user.averageTime = parseFloat(((user.averageTime * (user.totalCorrect - 1) + timeTaken) / user.totalCorrect).toFixed(2));
        }
    }

    // Performance by actual skill category (Cognitive Profiling)
    const recordCat = window.currentBug ? (window.currentBug.skillCategory || mode) : mode;
    if (!user.performance[recordCat]) user.performance[recordCat] = { correct: 0, total: 0 };
    user.performance[recordCat].correct += 1;
    user.performance[recordCat].total   += 1;

    // ── 6. Achievements ─────────────────────────────────────────────
    const newAchievements = checkAchievements(user);

    localStorage.setItem('userData', JSON.stringify(userData));

    return {
        earnedXP,
        earnedCoins,
        bonuses,
        comboBonus: Math.round(comboBonus * 100),
        speedBonus: speedBonusXP,
        newAchievements
    };
}

function wrongAnswer(mode) {
    const user = getCurrentUser();
    if (!user) return;

    // Reset streak — but save "near miss" if streak was high
    if (user.streak >= 5 && !user.performance['near_miss_recorded']) {
        user.bestStreak = Math.max(user.bestStreak, user.streak);
    }
    user.streak = 0;
    user.totalWrong += 1;

    const recordCat = window.currentBug ? (window.currentBug.skillCategory || mode) : mode;
    if (!user.performance[recordCat]) user.performance[recordCat] = { correct: 0, total: 0 };
    user.performance[recordCat].total += 1;

    localStorage.setItem('userData', JSON.stringify(userData));
}

// ── Achievement Definitions ─────────────────────────────────────────
const ACHIEVEMENT_DEFS = [
    { id: 'first_blood',  label: '🩸 Primeira Caçada',   desc: 'Acertou a primeira',   check: u => u.totalCorrect >= 1   },
    { id: 'first_10',     label: '🎯 Caçador x10',        desc: '10 bugs eliminados',   check: u => u.totalCorrect >= 10  },
    { id: 'first_50',     label: '💀 Eliminador x50',     desc: '50 bugs eliminados',   check: u => u.totalCorrect >= 50  },
    { id: 'first_100',    label: '☠️ Centurião',           desc: '100 bugs eliminados',  check: u => u.totalCorrect >= 100 },
    { id: 'streak_3',     label: '🔥 Tríplice',           desc: 'Sequência de 3',       check: u => u.bestStreak >= 3     },
    { id: 'streak_5',     label: '⚡ Combo Mestre',        desc: 'Sequência de 5',       check: u => u.bestStreak >= 5     },
    { id: 'streak_10',    label: '💥 Combo Lendário',      desc: 'Sequência de 10',      check: u => u.bestStreak >= 10    },
    { id: 'level_5',      label: '📡 Nível 5',             desc: 'Atingiu o nível 5',    check: u => u.level >= 5          },
    { id: 'level_10',     label: '🛡️ Agente Elite',        desc: 'Atingiu o nível 10',   check: u => u.level >= 10         },
    { id: 'speed_demon',  label: '⚡ Demônio da Velocidade',desc: 'Respondeu em <3s',    check: u => (u.averageTime > 0 && u.averageTime < 3) },
    { id: 'inferno',      label: '🔥 Sobrevivente do Inferno', desc: 'Acertou no Inferno', check: u => (u.performance['inferno'] && u.performance['inferno'].correct >= 1) },
    { id: 'collector',    label: '💰 Colecionador',         desc: 'Acumulou 100 créditos', check: u => u.coins >= 100       }
];

function checkAchievements(user) {
    const newOnes = [];
    for (const def of ACHIEVEMENT_DEFS) {
        if (!user.achievements.includes(def.id) && def.check(user)) {
            user.achievements.push(def.id);
            newOnes.push(def);
        }
    }
    return newOnes;
}

// Helper: get label for an achievement id
function getAchievementLabel(id) {
    const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
    return def ? def.label : id.replace(/_/g, ' ').toUpperCase();
}




// Start Offline Game (enhanced login)
function startOfflineGame() {
    const user = getCurrentUser();
    if (!user) {
        showLoginModal();
    } else {
        showDashboard();
    }
}

// Show Login Modal
// Show Login Modal (improved layout)
function showLoginModal() {
    const modalHTML = `
        <div class="modal fade show" id="loginModal" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-dark text-white border-primary">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-primary">🛡️ Ethical Hacker</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="hideModal()"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-center mb-4">Entre com seu perfil</p>

                        <form onsubmit="handleLogin(event)">
                            <div class="mb-3">
                                <label for="username" class="form-label text-light">Nome de Usuário</label>
                                <input type="text" id="username" class="form-control bg-secondary text-white border-primary" required placeholder="Digite seu nome">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label text-light">Senha (opcional)</label>
                                <input type="password" id="password" class="form-control bg-secondary text-white border-primary" placeholder="Deixe vazio para offline">
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mb-3">Entrar</button>
                        </form>

                        <div class="text-center">
                            <button class="btn btn-success w-100" onclick="showRegistrationModal()">Cadastrar Novo Perfil</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body without replacing everything
    if (!document.getElementById('loginModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Show Registration Modal
function showRegistrationModal() {
    const modalHTML = `
        <div class="modal fade show" id="registrationModal" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-dark text-white border-success">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-success">🛡️ Cadastrar Novo Perfil</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="hideModal()"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-center mb-4">Crie seu perfil para começar</p>

                        <form onsubmit="handleRegistration(event)">
                            <div class="mb-3">
                                <label for="regUsername" class="form-label text-light">Nome de Usuário</label>
                                <input type="text" id="regUsername" class="form-control bg-secondary text-white border-success" required placeholder="Digite seu nome">
                            </div>
                            <div class="mb-3">
                                <label for="regPassword" class="form-label text-light">Senha (opcional)</label>
                                <input type="password" id="regPassword" class="form-control bg-secondary text-white border-success" placeholder="Deixe vazio para offline">
                            </div>
                            <div class="mb-3">
                                <label for="regName" class="form-label text-light">Nome Completo</label>
                                <input type="text" id="regName" class="form-control bg-secondary text-white border-success" placeholder="Seu nome completo">
                            </div>
                            <button type="submit" class="btn btn-success w-100 mb-3">Cadastrar e Entrar</button>
                        </form>

                        <div class="text-center">
                            <button class="btn btn-outline-light w-100" onclick="showLoginModal()">Voltar ao Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    hideModal(); // Hide any existing modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Handle Registration Form
function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value || 'offline';
    const name = document.getElementById('regName').value.trim() || username;

    if (!username) {
        alert('Digite um nome de usuário!');
        return;
    }

    const result = registerUser(username, password, name);
    if (result && result.error) {
        alert(result.error);
    } else {
        localStorage.setItem('currentUser', username);
        hideModal();
        showDashboard();
    }
}

// Handle Login Form
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value || 'offline';

    if (!username) {
        alert('Digite um nome de usuário!');
        return;
    }

    // Try to login
    const user = loginUser(username, password);
    if (user) {
        hideModal();
        showDashboard();
    } else {
        // User doesn't exist or wrong password
        alert(`Usuário "${username}" não encontrado ou senha incorreta.`);
    }
}

// Hide Modal
function hideModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Show User Selection (modal)
function showUserSelection() {
    const users = Object.keys(userData);
    if (users.length === 0) {
        alert('Nenhum perfil encontrado.');
        return;
    }

    const modalHTML = `
        <div class="modal fade show" id="userSelectionModal" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content bg-dark text-white border-primary">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-primary">🛡️ Selecionar Perfil</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="hideModal()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            ${users.map(u => `
                                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-secondary rounded">
                                    <div>
                                        <strong class="text-light">${u}</strong> 
                                        <br><small class="text-muted">Level ${userData[u].level} | XP ${userData[u].xp} | Sequência ${userData[u].streak}</small>
                                    </div>
                                    <button class="btn btn-primary" onclick="selectUser('${u}')">Selecionar</button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="text-center">
                            <button class="btn btn-success w-100 mb-2" onclick="showRegistrationModal()">Cadastrar Novo Perfil</button>
                            <button class="btn btn-outline-light w-100" onclick="showLoginModal()">Voltar ao Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    hideModal(); // Hide any existing modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Select Existing User - bypasses password for known-user selection
function selectUser(username) {
    if (!userData[username]) {
        alert('Usuário não encontrado.');
        return;
    }
    localStorage.setItem('currentUser', username);
    hideModal();
    showDashboard();
}

// Show Dashboard (SPA approach with Premium Components)
// Performance Evolution Chart - rendered after showDashboard injects HTML
function renderEvolutionChart() {
    const user = getCurrentUser();
    const container = document.getElementById('evolutionChart');
    if (!container || !user) return;

    // Build data from XP and level progression
    const base = user.level * 10;
    const correct = user.totalCorrect || 0;
    const data = [
        Math.max(5, base - 25),
        Math.max(8, base - 15),
        Math.max(10, base - 10),
        Math.max(15, base - 5),
        Math.max(20, base),
        Math.max(20, base + Math.min(correct, 10)),
        Math.max(20, base + Math.min(correct * 1.5, 20))
    ];
    const maxVal = Math.max(...data);

    container.innerHTML = data.map((val, i) => {
        const pct = Math.min(100, (val / maxVal) * 100);
        const color = val >= base + 5
            ? 'linear-gradient(0deg, var(--primary), var(--secondary))'
            : val < base - 10
                ? 'linear-gradient(0deg, var(--danger), #fb7185)'
                : 'linear-gradient(0deg, #6366f1, var(--secondary))';
        return `<div class="chart-bar" style="height:${pct}%;background:${color}" data-val="${Math.round(val)}"></div>`;
    }).join('');
}

function renderCognitiveProfile() {
    const user = getCurrentUser();
    if (!user) return '';
    
    const categories = [
        { id: 'iniciante', label: 'Reconhecimento e Scans', color: 'var(--success)' },
        { id: 'logica', label: 'Lógica e Bypass', color: 'var(--warning)' },
        { id: 'massiva', label: 'Exploração Severa', color: 'var(--danger)' }
    ];

    let html = '<div class="premium-glass p-4 mb-4"><h5 class="mb-4" style="color: var(--primary)"><i class="fas fa-brain me-2"></i> Perfil Cognitivo / Análise de Potencial</h5>';
    
    let scores = [];
    categories.forEach(cat => {
        const perf = user.performance[cat.id] || { correct: 0, total: 0 };
        const pct = perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
        scores.push({ id: cat.id, pct: pct, total: perf.total });
        
        html += `
            <div class="mb-3">
                <div class="d-flex justify-content-between small text-muted mb-1">
                    <span><i class="fas fa-circle ms-1 me-2" style="font-size: 8px; color: ${cat.color}"></i>${cat.label}</span>
                    <span>${pct}% (${perf.correct}/${perf.total})</span>
                </div>
                <div class="progress" style="height: 6px; background: rgba(255,255,255,0.05); overflow: visible;">
                    <div class="progress-bar position-relative" style="width: ${pct}%; background: ${cat.color}; box-shadow: 0 0 10px ${cat.color}; overflow: visible;">
                        <div style="position: absolute; right: 0; top: 50%; width: 12px; height: 12px; background: #fff; border-radius: 50%; transform: translate(50%, -50%); box-shadow: 0 0 10px #fff, 0 0 5px ${cat.color};"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    const validScores = scores.filter(s => s.total >= 3);
    if (validScores.length > 0) {
        validScores.sort((a,b) => b.pct - a.pct);
        const top = validScores[0];
        const bottom = validScores[validScores.length - 1];
        const catMap = { 'iniciante': 'Reconhecimento', 'logica': 'Lógica', 'massiva': 'Exploração' };
        
        html += `
            <div class="mt-4 p-3 rounded bg-surface border border-primary border-opacity-25">
                <p class="small mb-1 text-muted"><i class="fas fa-robot text-primary"></i> <strong>TUTOR IA:</strong></p>
                <p class="small mb-0">Seu potencial máximo comprovado é em <span class="text-white fw-bold">${catMap[top.id]}</span> (${top.pct}%). 
                ${top.id !== bottom.id && top.pct - bottom.pct >= 15 ? `No entanto, foque seu treinamento em <span class="text-white fw-bold">${catMap[bottom.id]}</span> para reequilibrar seu arsenal cibernético.` : 'Seu perfil está balanceado. Continue expandindo sua zona de conforto e quebrando barreiras.'}</p>
            </div>
        `;
    } else {
        html += `
            <div class="mt-4 p-3 rounded bg-surface border border-secondary border-opacity-25 text-muted small">
                <i class="fas fa-info-circle me-1"></i> O Motor Neural precisa de mais dados (mín. 3 missões por categoria) para mapear seu real potencial e montar um plano de ensino seguro.
            </div>
        `;
    }

    html += '</div>';
    return html;
}

function showDashboard() {
    const user = getCurrentUser();
    const dashboardHTML = `
        <div class="container py-4 page-transition">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div>
                    <h1 class="text-gradient-primary mb-0">${t('label_agent')}: ${user.name.toUpperCase()}</h1>
                    <p class="text-muted small mb-0">${t('dash_security_level')} - ${t('label_level')} ${user.level}</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn-cyber" onclick="showUserSelection()">
                        <i class="fas fa-user-secret"></i> ${t('dash_change_agent')}
                    </button>
                    <button class="btn-cyber danger" onclick="logout()">
                        <i class="fas fa-power-off"></i>
                    </button>
                </div>
            </div>

            <!-- XP & Level HUD -->
            <div class="premium-glass p-4 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                <div class="d-flex align-items-center gap-4">
                    <div class="level-badge" style="width: 80px; height: 80px; background: var(--bg-surface); border: 2px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 2rem; color: var(--primary); box-shadow: 0 0 20px var(--primary-glow);">
                        ${user.level}
                    </div>
                    <div>
                        <h4 class="mb-1">${t('dash_reputation')}</h4>
                        <div class="d-flex align-items-center gap-3">
                            <div class="progress" style="width: 250px; height: 8px;">
                                <div class="progress-bar" style="width: ${user.xp % 100}%"></div>
                            </div>
                            <span class="text-primary fw-bold">${user.xp % 100}/100 XP</span>
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <div class="hud-pill"><i class="fas fa-coins text-warning"></i> ${user.coins} ${t('label_credits')}</div>
                    <div class="hud-pill"><i class="fas fa-fire text-danger"></i> STREAK: ${user.streak}</div>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-md-3">
                    <div class="premium-glass card-stats h-100">
                        <div class="value text-primary glow-primary">${user.totalCorrect}</div>
                        <div class="label">${t('dash_bugs_found')}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="premium-glass card-stats h-100">
                        <div class="value text-danger glow-secondary">${user.totalWrong}</div>
                        <div class="label">${t('dash_failures')}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="premium-glass card-stats h-100">
                        <div class="value text-success glow-primary">${user.bestStreak}</div>
                        <div class="label">${t('dash_best_streak')}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="premium-glass card-stats h-100">
                        <div class="value text-warning glow-primary">${user.averageTime.toFixed(1)}s</div>
                        <div class="label">${t('dash_reaction_time')}</div>
                    </div>
                </div>
            </div>

            ${renderCognitiveProfile()}

            <div class="row g-4 mb-5">
                <div class="col-lg-8">
                    <div class="premium-glass p-0 overflow-hidden h-100">
                        <div class="p-4 border-bottom border-light border-opacity-10 bg-surface">
                            <h5 class="mb-0 text-gradient-primary"><i class="fas fa-terminal me-2"></i> ${t('dash_select_mission')}</h5>
                        </div>
                        <div class="p-4">
                            <div class="d-flex flex-wrap gap-3 justify-content-center">
                                <label class="difficulty-option">
                                    <input type="radio" name="difficulty" value="ia" onchange="setDifficulty('ia')" ${currentDifficulty === 'ia' ? 'checked' : ''} hidden>
                                    <div class="btn-cyber ${currentDifficulty === 'ia' ? 'primary' : ''}"><i class="fas fa-brain"></i> ${t('btn_level_ai')}</div>
                                </label>
                                <label class="difficulty-option">
                                    <input type="radio" name="difficulty" value="facil" onchange="setDifficulty('facil')" ${currentDifficulty === 'facil' ? 'checked' : ''} hidden>
                                    <div class="btn-cyber ${currentDifficulty === 'facil' ? 'primary' : ''}">${t('btn_level_1')}</div>
                                </label>
                                <label class="difficulty-option">
                                    <input type="radio" name="difficulty" value="medio" onchange="setDifficulty('medio')" ${currentDifficulty === 'medio' ? 'checked' : ''} hidden>
                                    <div class="btn-cyber ${currentDifficulty === 'medio' ? 'primary' : ''}">${t('btn_level_2')}</div>
                                </label>
                                <label class="difficulty-option">
                                    <input type="radio" name="difficulty" value="dificil" onchange="setDifficulty('dificil')" ${currentDifficulty === 'dificil' ? 'checked' : ''} hidden>
                                    <div class="btn-cyber ${currentDifficulty === 'dificil' ? 'primary' : ''}">${t('btn_level_pro')}</div>
                                </label>
                                <label class="difficulty-option">
                                    <input type="radio" name="difficulty" value="inferno" onchange="setDifficulty('inferno')" ${currentDifficulty === 'inferno' ? 'checked' : ''} hidden>
                                    <div class="btn-cyber ${currentDifficulty === 'inferno' ? 'primary' : ''} text-danger">${t('btn_level_3')}</div>
                                </label>
                            </div>
                            
                            <div class="text-center mt-5">
                                <button class="btn-cyber primary px-5 py-3 fs-5" onclick="loadGameInterface()">
                                    <i class="fas fa-play-circle fs-4"></i> ${t('btn_start')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="premium-glass p-0 h-100">
                        <div class="p-4 border-bottom border-light border-opacity-10 bg-surface">
                            <h5 class="mb-0 text-success"><i class="fas fa-medal me-2"></i> ${t('dash_achievements')}</h5>
                        </div>
                        <div class="p-4 d-flex flex-wrap gap-2">
                             ${user.achievements.length > 0 ? 
                                user.achievements.map(achievement => `
                                    <div class="hud-pill" title="Conquista Desbloqueada">
                                        <i class="fas fa-check-circle text-success"></i> ${achievement.replace('_', ' ').toUpperCase()}
                                    </div>
                                `).join('') :
                                `<div class="text-center w-100 py-5 opacity-30"><i class="fas fa-lock fs-1 d-block mb-3"></i><p>${t('dash_no_records')}</p></div>`
                            }
                        </div>
                    </div>
                    <div class="premium-glass p-4 mt-4 h-auto">
                        <h5 class="mb-3"><i class="fas fa-chart-line me-2"></i> ${t('dash_reputation')}</h5>
                        <div id="evolutionChart" class="chart-container"></div>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <button class="btn-cyber" style="border-color: var(--warning); color: var(--warning);" onclick="showStore()">
                    <i class="fas fa-shopping-cart"></i> ${t('shop_title')}
                </button>
            </div>
        </div>
    `;

    const mainElement = document.querySelector('main') || document.body;
    mainElement.innerHTML = dashboardHTML;
    renderEvolutionChart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Load Game Interface (SPA approach with Prism.js)
function loadGameInterface() {
    const user = getCurrentUser();
    const bug = generateBug(currentDifficulty);
    window.currentBug = bug; 
    window.answered = false;
    gameStartTime = Date.now();

    const escapedCode = bug.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const langClass = escapedCode.includes('&lt;') ? 'language-markup' : (escapedCode.includes('SELECT') ? 'language-sql' : (escapedCode.includes('strcpy') ? 'language-c' : 'language-bash'));

    const gameHTML = `
        <div class="container py-4 page-transition">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div class="d-flex align-items-center gap-3">
                    <button class="btn-cyber" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2 class="text-gradient-primary mb-0">${t('game_mission')}</h2>
                </div>
                <div class="d-flex gap-2">
                    <div class="hud-pill"><i class="fas fa-layer-group text-primary"></i> ${t('label_level')} ${user.level}</div>
                    <div class="hud-pill"><i class="fas fa-fire text-danger"></i> STREAK: ${user.streak}</div>
                </div>
            </div>

            <div class="premium-glass p-0 overflow-hidden mb-4">
                <div class="p-3 border-bottom border-light border-opacity-10 bg-surface d-flex justify-content-between align-items-center">
                    <span class="text-muted small"><i class="fas fa-bug me-2"></i> ${t('game_analyze')}:</span>
                    <span class="badge-cyber warning">${currentDifficulty.toUpperCase()}</span>
                </div>
                <div class="p-0">
                    <pre class="line-numbers"><code class="${langClass}">${escapedCode}</code></pre>
                </div>
            </div>

            <div class="row g-3 mb-5" id="optionsContainer">
                ${bug.options.map((opt, i) => `
                    <div class="col-md-6">
                        <button class="btn-cyber w-100 py-3 text-start px-4 op-btn" 
                                onclick="checkAnswer(${i}, ${bug.correct}, this)">
                            <span class="badge-cyber me-3" style="min-width: 30px; text-align: center;">${String.fromCharCode(65 + i)}</span> 
                            ${opt}
                        </button>
                    </div>
                `).join('')}
            </div>

            <div id="feedbackContainer" class="mb-4"></div>
            
            <div class="d-flex justify-content-center gap-4 flex-wrap">
                <button class="btn-cyber" id="hintBtn" onclick="useHint(this)" ${user.inventory.hints > 0 ? '' : 'disabled'}>
                    <i class="fas fa-lightbulb text-warning"></i> ${t('btn_hint')} (${user.inventory.hints})
                </button>
                <button class="btn-cyber" id="skipBtn" onclick="useSkip(this)" ${user.inventory.skips > 0 ? '' : 'disabled'}>
                    <i class="fas fa-forward text-info"></i> ${t('btn_skip')} (${user.inventory.skips})
                </button>
            </div>
        </div>
    `;

    const mainElement = document.querySelector('main') || document.body;
    mainElement.innerHTML = gameHTML;
    
    // Trigger Prism.js Highlighting
    if (window.Prism) {
        window.Prism.highlightAll();
    }
}

// Function to handle answer checking with animations
function checkAnswer(selectedIndex, correctIndex, buttonElement) {
    if (window.answered) return;
    window.answered = true;

    const isCorrect = selectedIndex === correctIndex;
    const feedbackContainer = document.getElementById('feedbackContainer');
    const timeTaken = (Date.now() - gameStartTime) / 1000;

    // Apply animations to buttons
    const buttons = document.querySelectorAll('.op-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIndex) {
            btn.classList.add('ans-correct');
            btn.style.borderColor = 'var(--success)';
        } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('ans-wrong');
            btn.style.borderColor = 'var(--danger)';
        }
    });

    if (isCorrect) {
        sfx.correct();
        const results = saveScore(currentDifficulty, 10, timeTaken);
        feedbackContainer.innerHTML = `
            <div class="premium-glass p-4 border-success page-transition" style="background: hsla(var(--neon-green), 0.1);">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <i class="fas fa-check-circle text-success fs-2"></i>
                    <h4 class="mb-0 text-success">${t('game_success')}</h4>
                </div>
                <p class="text-light-50">${window.currentBug.explain}</p>
                <div class="d-flex gap-3 mt-3">
                    <div class="hud-pill">+${results.earnedXP} XP</div>
                    <div class="hud-pill">+${results.earnedCoins} ${t('label_credits')}</div>
                </div>
                ${results.bonuses.length > 0 ? `<div class="mt-3 small text-warning fw-bold pulse"><i class="fas fa-bolt me-1"></i> ${results.bonuses.map(b => b.label).join(' | ')}</div>` : ''}
                <button class="btn-cyber primary mt-4 w-100" onclick="loadGameInterface()">${t('game_next')}</button>
            </div>
        `;
    } else {
        sfx.wrong();
        wrongAnswer(currentDifficulty);
        feedbackContainer.innerHTML = `
            <div class="premium-glass p-4 border-danger page-transition" style="background: hsla(0, 100%, 50%, 0.1);">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <i class="fas fa-times-circle text-danger fs-2"></i>
                    <h4 class="mb-0 text-danger">${t('game_failure')}</h4>
                </div>
                <p class="text-light-50">${t('game_failure_desc')}</p>
                <p class="small text-muted">${window.currentBug.explain}</p>
                <div class="d-flex gap-3 mt-2">
                    <button class="btn-cyber primary mt-3" onclick="loadGameInterface()">${t('game_retry')}</button>
                    <button class="btn-cyber mt-3" onclick="showDashboard()">${t('game_back_hq')}</button>
                </div>
            </div>
        `;
    }
}

// Item functions
function useHint(btn) {
    const user = getCurrentUser();
    if (!user || user.inventory.hints <= 0) return;
    
    const bug = window.currentBug;
    const buttons = document.querySelectorAll('.op-btn');
    let incorrectIndexes = [];
    
    for (let i = 0; i < bug.options.length; i++) {
        if (i !== bug.correct) incorrectIndexes.push(i);
    }
    
    incorrectIndexes.sort(() => 0.5 - Math.random());
    const toDisable = incorrectIndexes.slice(0, 2);
    
    toDisable.forEach(idx => {
        buttons[idx].disabled = true;
        buttons[idx].style.opacity = '0.3';
        buttons[idx].innerHTML = `<span class="badge-cyber me-3">#</span> [SISTEMA OCULTADO]`;
    });
    
    user.inventory.hints -= 1;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-lightbulb text-warning"></i> ${t('hint_applied')} (${user.inventory.hints})`;
}

function useSkip(btn) {
    const user = getCurrentUser();
    if (!user || user.inventory.skips <= 0) return;
    
    user.inventory.skips -= 1;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-forward text-info"></i> ${t('skip_active')} (${user.inventory.skips})`;
    
    setTimeout(() => loadGameInterface(), 500);
}

// ====== CYBER MARKET (STORE) ======
function showStore() {
    const user = getCurrentUser();
    if (!user) return;
    
    if (!user.inventory) user.inventory = { hints: 0, skips: 0 };

    const storeHTML = `
        <div class="container py-4 page-transition">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div class="d-flex align-items-center gap-3">
                    <button class="btn-cyber" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2 class="text-gradient-primary mb-0">${t('shop_title')}</h2>
                </div>
                <div class="hud-pill fs-5"><i class="fas fa-coins text-warning"></i> ${t('store_balance')}: <span id="storeBalance">${user.coins}</span> ${t('label_credits')}</div>
            </div>

            <div class="row g-4 justify-content-center">
                <div class="col-md-5">
                    <div class="premium-glass p-0 h-100 feature-card">
                        <div class="p-4 text-center">
                            <div class="icon-box mx-auto" style="color: var(--warning)">
                                <i class="fas fa-lightbulb fs-1"></i>
                            </div>
                            <h3 class="mb-3">${t('store_decoder')}</h3>
                            <p class="text-muted small mb-4">${t('store_decoder_desc')}</p>
                            
                            <div class="bg-surface p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                                <span class="text-dim">${t('store_price')}</span>
                                <span class="text-warning fw-bold fs-4">15 <i class="fas fa-coins"></i></span>
                            </div>
                            
                            <button class="btn-cyber primary w-100 py-3" onclick="buyItem('hints', 15, this)">
                                <i class="fas fa-shopping-cart"></i> ${t('store_buy')}
                            </button>
                            <p class="mt-3 text-dim small">${t('store_stock')}: <span id="inv-hints">${user.inventory.hints}</span></p>
                        </div>
                    </div>
                </div>

                <div class="col-md-5">
                    <div class="premium-glass p-0 h-100 feature-card">
                        <div class="p-4 text-center">
                            <div class="icon-box mx-auto" style="color: var(--primary)">
                                <i class="fas fa-forward fs-1"></i>
                            </div>
                            <h3 class="mb-3">${t('store_bypass')}</h3>
                            <p class="text-muted small mb-4">${t('store_bypass_desc')}</p>
                            
                            <div class="bg-surface p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                                <span class="text-dim">${t('store_price')}</span>
                                <span class="text-primary fw-bold fs-4">30 <i class="fas fa-coins"></i></span>
                            </div>
                            
                            <button class="btn-cyber primary w-100 py-3" onclick="buyItem('skips', 30, this)">
                                <i class="fas fa-shopping-cart"></i> ${t('store_buy_protocol')}
                            </button>
                            <p class="mt-3 text-dim small">${t('store_stock')}: <span id="inv-skips">${user.inventory.skips}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const mainElement = document.querySelector('main') || document.body;
    mainElement.innerHTML = storeHTML;
}

function buyItem(itemType, cost, btn) {
    const user = getCurrentUser();
    if (!user) return;
    
    if (user.coins >= cost) {
        user.coins -= cost;
        user.inventory[itemType] += 1;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        document.getElementById('storeBalance').innerText = user.coins;
        document.getElementById(`inv-${itemType}`).innerText = user.inventory[itemType];
        
        const originalContent = btn.innerHTML;
        btn.innerHTML = `✔ ${t('store_acquired')}`;
        btn.style.background = 'var(--success)';
        btn.style.color = 'var(--bg-base)';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.color = '';
        }, 1000);
    } else {
        alert(t('store_insufficient'));
    }
}

// Initialize System
window.addEventListener('load', () => {
    // Only create test user if the system is completely empty
    if (Object.keys(userData).length === 0) {
        createTestUser();
    }
    
    // Restore mute state on button icon
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn && sfx.muted) {
        muteBtn.querySelector('i').className = 'fas fa-volume-mute';
        muteBtn.style.opacity = '0.5';
    }
    
    // Remove splash screen after short delay
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
            splash.style.opacity = '0';
            splash.style.filter = 'blur(20px)';
            setTimeout(() => splash.remove(), 500);
        }
    }, 1500);
});

// Toggle SFX Mute
function toggleMute(btn) {
    sfx.muted = !sfx.muted;
    localStorage.setItem('sfx_muted', sfx.muted);
    const icon = btn.querySelector('i');
    if (sfx.muted) {
        icon.className = 'fas fa-volume-mute';
        btn.style.opacity = '0.5';
    } else {
        icon.className = 'fas fa-volume-up';
        btn.style.opacity = '1';
        sfx.init();
        sfx.tap();
    }
}
