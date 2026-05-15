/**
 * Dashboard Module - CyberOS Elite
 * Manages player profile, stats, and navigation hub.
 */

class Dashboard {
    constructor() {
        this.RANKS = [
            { xp: 0, rank: 'Script Kiddie', color: 'secondary', reward: 0 },
            { xp: 500, rank: 'Network Explorer', color: 'primary', reward: 100 },
            { xp: 1500, rank: 'Bug Bounty Hunter', color: 'success', reward: 250 },
            { xp: 4000, rank: 'SysAdmin Hacker', color: 'info', reward: 500 },
            { xp: 10000, rank: 'Elite White Hat', color: 'warning', reward: 1000 },
            { xp: 25000, rank: 'Zero-Day Architect', color: 'danger', reward: 2500 },
            { xp: 50000, rank: 'Cyber Overlord', color: 'light', reward: 5000 }
        ];
    }

    render() {
        const username = storage.getCurrentUsername();
        const user = storage.getUserData(username);
        
        if (!user) {
            os.showNotification("Sessão expirada. Entre novamente.", "warning");
            return;
        }

        const currentRank = this.getReputationStatus(user.xp || 0);
        const nextRank = this.getNextRank(user.xp || 0);
        const progress = !nextRank ? 100 : Math.floor(((user.xp - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100);

        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="text-white mb-0"><i class="fas fa-terminal me-2 text-primary"></i>CENTRAL DE COMANDO</h3>
                    <div class="d-flex gap-3 align-items-center">
                        <div class="bg-dark rounded px-3 py-1 border border-warning">
                            <i class="fas fa-coins text-warning me-1"></i> <span class="fw-bold text-warning">${user.coins || 0} CC</span>
                        </div>
                        <button class="btn btn-outline-danger btn-sm" onclick="logout()">
                            <i class="fas fa-power-off me-1"></i> SAIR
                        </button>
                    </div>
                </div>
                
                <div class="row g-4">
                    <!-- PLAYER CARD -->
                    <div class="col-lg-4">
                        <div class="premium-glass p-4 text-center border-start border-4 border-${currentRank.color} h-100">
                            <div class="mx-auto bg-${currentRank.color} rounded-circle mb-3 d-flex align-items-center justify-content-center shadow-glow" style="width: 80px; height: 80px;">
                                <i class="fas fa-user-ninja fa-2x text-dark"></i>
                            </div>
                            <h3 class="text-white mb-0">${security.constructor.sanitize(user.name || user.username)}</h3>
                            <p class="text-muted small mb-3">@${security.constructor.sanitize(user.username)}</p>
                            
                            <div class="badge bg-dark border border-${currentRank.color} text-${currentRank.color} px-3 py-2 mb-3 fs-6">
                                ${currentRank.rank}
                            </div>
                            
                            <div class="mt-4 text-start">
                                <div class="d-flex justify-content-between small text-muted mb-1">
                                    <span>XP: <span class="text-white fw-bold">${user.xp || 0}</span></span>
                                    <span>${nextRank ? `Faltam ${nextRank.xp - user.xp} XP` : 'RANK MÁXIMO'}</span>
                                </div>
                                <div class="progress bg-black" style="height: 10px;">
                                    <div class="progress-bar bg-${currentRank.color} progress-bar-striped progress-bar-animated" style="width: ${progress}%"></div>
                                </div>
                            </div>

                            <div class="row g-2 mt-4">
                                <div class="col-6"><div class="bg-black p-2 rounded small border border-secondary"><i class="fas fa-check text-success me-1"></i> ${user.playerStats?.solved || 0} Resolvidos</div></div>
                                <div class="col-6"><div class="bg-black p-2 rounded small border border-secondary"><i class="fas fa-times text-danger me-1"></i> ${user.playerStats?.failed || 0} Falhas</div></div>
                            </div>
                        </div>
                    </div>

                    <!-- APPS GRID -->
                    <div class="col-lg-8">
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <div class="glass-card p-4 h-100 cursor-pointer border-primary shadow-hover transition-all" onclick="os.openWindow('academy')">
                                    <h5 class="text-primary"><i class="fas fa-university me-2"></i>CYBER ACADEMY</h5>
                                    <p class="small text-muted">Aprenda táticas ofensivas e defensivas de forma guiada com a enciclopédia MITRE.</p>
                                    <button class="btn btn-sm btn-outline-primary mt-2 w-100">ACESSAR ACADEMIA</button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="glass-card p-4 h-100 cursor-pointer border-info shadow-hover transition-all" onclick="os.openWindow('pentest')">
                                    <h5 class="text-info"><i class="fas fa-bug me-2"></i>PENTEST ARENA</h5>
                                    <p class="small text-muted">Teste suas habilidades em missões procedurais e ganhe XP.</p>
                                    <button class="btn btn-sm btn-outline-info mt-2 w-100">INICIAR MISSÃO</button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="glass-card p-4 h-100 cursor-pointer border-danger shadow-hover transition-all" onclick="os.openWindow('blackmarket')">
                                    <h5 class="text-danger"><i class="fas fa-shopping-cart me-2"></i>BLACK MARKET</h5>
                                    <p class="small text-muted">Adquira ferramentas, exploits e scripts de automação.</p>
                                    <button class="btn btn-sm btn-outline-danger mt-2 w-100">ACESSAR LOJA</button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="glass-card p-4 h-100 cursor-pointer border-warning shadow-hover transition-all" onclick="os.openWindow('botwar')">
                                    <h5 class="text-warning"><i class="fas fa-robot me-2"></i>BOT WAR</h5>
                                    <p class="small text-muted">Duelos autônomos Red vs Blue baseados em IA.</p>
                                    <button class="btn btn-sm btn-outline-warning mt-2 w-100">ENTRAR NA ARENA</button>
                                </div>
                            </div>
                        </div>

                        <!-- AI ENGINE STATUS -->
                        <div class="premium-glass p-4 border-info mb-4">
                            <h5 class="text-info mb-3"><i class="fas fa-brain me-2"></i>NÚCLEO DE INTELIGÊNCIA</h5>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="x-small text-muted mb-1">STATUS_IA</div>
                                    <div class="badge bg-success-subtle text-success border border-success w-100 py-2">GEMMA_CORE: ONLINE</div>
                                </div>
                                <div class="col-6">
                                    <div class="x-small text-muted mb-1">ADAPTIVE_TRAINING</div>
                                    <div class="badge bg-primary-subtle text-primary border border-primary w-100 py-2" id="dash-training-level">BÁSICO</div>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="x-small text-muted mb-1">PERFIL_TÉCNICO (ANALISADO PELA IA)</div>
                                <div class="d-flex flex-column gap-2" id="dash-ai-profile">
                                    <div class="small opacity-50">Aguardando análise heurística...</div>
                                </div>
                            </div>
                        </div>

                        <!-- ACHIEVEMENTS -->
                        <div class="premium-glass p-4 border-primary">
                            <h5 class="text-primary mb-3"><i class="fas fa-medal me-2"></i>CONQUISTAS & MEDALHAS</h5>
                            <div class="d-flex flex-wrap gap-3">
                                ${this.renderMedals(user)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (container) {
            container.innerHTML = html;
            this.updateAIStats();
        }
    }

    renderMedals(user) {
        const medals = [
            { id: 'first', name: 'First Blood', icon: 'fa-tint', color: 'danger', check: (u) => (u.playerStats?.solved || 0) >= 1 },
            { id: 'net', name: 'Networker', icon: 'fa-network-wired', color: 'primary', check: (u) => (u.xp || 0) >= 1000 },
            { id: 'bug', name: 'Bug Hunter', icon: 'fa-spider', color: 'success', check: (u) => (u.playerStats?.solved || 0) >= 10 },
            { id: 'rich', name: 'Capitalist', icon: 'fa-piggy-bank', color: 'warning', check: (u) => (u.coins || 0) >= 5000 },
            { id: 'elite', name: 'Elite Agent', icon: 'fa-crown', color: 'info', check: (u) => (u.xp || 0) >= 10000 }
        ];

        return medals.map(m => {
            const has = m.check(user);
            return `
                <div class="medal-item text-center ${has ? '' : 'opacity-25'}" title="${m.name}">
                    <div class="bg-dark rounded-circle p-2 border border-${m.color} mb-1" style="width: 45px; height: 45px; margin: 0 auto;">
                        <i class="fas ${m.icon} text-${m.color}"></i>
                    </div>
                    <div style="font-size: 0.6rem;" class="text-${m.color} fw-bold">${m.name.toUpperCase()}</div>
                </div>
            `;
        }).join('');
    }

    getReputationStatus(xp) {
        let current = this.RANKS[0];
        for (const r of this.RANKS) {
            if (xp >= r.xp) current = r;
            else break;
        }
        return current;
    }

    updateAIStats() {
        const pathEl = document.getElementById('dash-training-level');
        if (pathEl && window.intelligence) {
            pathEl.textContent = window.intelligence.trainingPath.toUpperCase();
        }

        const profileEl = document.getElementById('dash-ai-profile');
        if (profileEl && window.gemma) {
            const profile = window.gemma.calculateTechnicalProfile();
            if (Object.keys(profile).length > 0) {
                profileEl.innerHTML = Object.entries(profile).map(([track, score]) => `
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="x-small font-mono text-white-50">${track}</span>
                        <span class="x-small font-mono text-info">${score}%</span>
                    </div>
                    <div class="progress-track" style="height: 2px;">
                        <div class="progress-fill bg-info" style="width: ${score}%"></div>
                    </div>
                `).join('');
            }
        }
    }

    getNextRank(xp) {
        return this.RANKS.find(r => r.xp > xp) || null;
    }
}

window.dashboard = new Dashboard();
