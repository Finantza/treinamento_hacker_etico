/**
 * Academy Module v2.0 - CyberOS Elite
 * Integrated with HackerAIEngine for a complete technical library.
 */
class Academy {
    constructor() {
        this.tecnicas = null;
        this.engine = null;
    }

    async init(type = 'menu') {
        this.engine = window.HackerAIEngine;
        if (!this.tecnicas) {
            this.tecnicas = window.TECNICAS_DATA || { attacks: [], defenses: [] };
        }
        
        if (type === 'menu') this.renderMenu();
        else if (type === 'glossary') this.renderGlossary();
        else if (type === 'library') this.renderLibrary();
    }

    renderMenu() {
        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="text-center mb-5">
                    <h2 class="text-primary"><i class="fas fa-graduation-cap me-2"></i>CYBER ACADEMY</h2>
                    <p class="text-white-50">Escolha seu método de aprendizado</p>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="premium-glass p-4 border-danger h-100 shadow-hover transition-all cursor-pointer" onclick="academy.init('library')">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-danger p-3 rounded-circle me-3 shadow-glow"><i class="fas fa-book-reader fa-lg"></i></div>
                                <h4 class="text-danger mb-0">Biblioteca IA</h4>
                            </div>
                            <p class="small text-muted mb-4">15 módulos completos do HackerAI Engine, do básico ao avançado.</p>
                            <button class="btn btn-danger w-100 py-2">ABRIR BIBLIOTECA</button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="premium-glass p-4 border-info h-100 shadow-hover transition-all cursor-pointer" onclick="os.openWindow('pentest')">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-info p-3 rounded-circle me-3 shadow-glow"><i class="fas fa-user-secret fa-lg"></i></div>
                                <h4 class="text-info mb-0">Prática</h4>
                            </div>
                            <p class="small text-muted mb-4">Acesse a arena de Pentest para missões procedurais.</p>
                            <button class="btn btn-info w-100 py-2">ARENA PENTEST</button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="premium-glass p-4 border-warning h-100 shadow-hover transition-all cursor-pointer" onclick="academy.init('glossary')">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-warning p-3 rounded-circle me-3 shadow-glow"><i class="fas fa-database fa-lg text-dark"></i></div>
                                <h4 class="text-warning mb-0">Técnicas</h4>
                            </div>
                            <p class="small text-muted mb-4">Enciclopédia de TTPs e IDs do MITRE ATT&CK.</p>
                            <button class="btn btn-warning w-100 py-2">VER GLOSSÁRIO</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('body-academy');
        if (container) container.innerHTML = html;
    }

    renderLibrary() {
        const modules = this.engine ? this.engine.modules : {};
        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="text-primary mb-0"><i class="fas fa-book-reader me-2"></i>HACKERAI_ENGINE LIBRARY</h3>
                    <button class="btn btn-outline-secondary btn-sm" onclick="academy.init('menu')">VOLTAR</button>
                </div>

                <div class="row g-4">
                    ${Object.entries(modules).map(([id, mod]) => `
                        <div class="col-md-4">
                            <div class="glass-card p-4 h-100 border-primary shadow-hover cursor-pointer" onclick="academy.renderModuleDetail('${id}')">
                                <div class="d-flex justify-content-between align-items-start">
                                    <h5 class="text-white mb-2">${mod.name}</h5>
                                    <span class="badge bg-primary">ID: ${id}</span>
                                </div>
                                <div class="x-small text-muted mb-3">CONTÉUDO DISPONÍVEL</div>
                                <ul class="list-unstyled small text-white-50 mb-0">
                                    ${mod.lessons ? mod.lessons.map(l => `<li><i class="fas fa-caret-right text-primary me-2"></i>${l.title}</li>`).join('') : '<li>Técnicas e Payloads</li>'}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const container = document.getElementById('body-academy');
        if (container) container.innerHTML = html;
    }

    renderModuleDetail(id) {
        const mod = this.engine.getModule(id);
        if (!mod) return;

        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="text-primary mb-0">${mod.name.toUpperCase()}</h3>
                    <button class="btn btn-outline-secondary btn-sm" onclick="academy.renderLibrary()">VOLTAR</button>
                </div>

                <div class="premium-glass p-4 border-primary">
                    ${mod.lessons ? mod.lessons.map(lesson => `
                        <div class="mb-5 last-mb-0">
                            <h4 class="text-white mb-3"><i class="fas fa-chevron-right text-primary me-2"></i>${lesson.title}</h4>
                            <div class="row g-4">
                                <div class="col-md-7">
                                    <div class="bg-black p-3 rounded border border-secondary">
                                        <h6 class="text-info x-small fw-bold mb-2">TÓPICOS_CHAVE:</h6>
                                        <ul class="small text-white-50 mb-0">
                                            ${lesson.topics ? lesson.topics.map(t => `<li>${t}</li>`).join('') : ''}
                                            ${lesson.techniques ? lesson.techniques.map(t => `<li><b>${t.name || t}</b>: ${t.desc || ''}</li>`).join('') : ''}
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    ${lesson.commands ? `
                                        <div class="bg-dark p-3 rounded border border-warning h-100">
                                            <h6 class="text-warning x-small fw-bold mb-2">COMANDOS_ESSENCIAIS:</h6>
                                            <div class="d-flex flex-wrap gap-1">
                                                ${lesson.commands.linux.map(c => `<code class="bg-black text-warning px-2 py-1 mb-1 me-1">${c}</code>`).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${lesson.exercise ? `
                                        <div class="bg-dark p-3 rounded border border-success h-100">
                                            <h6 class="text-success x-small fw-bold mb-2">DESAFIO_PRÁTICO:</h6>
                                            <p class="x-small text-white-50 mb-1">${lesson.exercise.question}</p>
                                            <div class="bg-black p-2 rounded small text-success font-mono border border-success opacity-50">
                                                ${lesson.exercise.answer}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p class="text-muted">Este módulo contém geradores de payloads e técnicas avançadas. Acesse a Arena de Pentest para praticar.</p>'}
                </div>
            </div>
        `;

        const container = document.getElementById('body-academy');
        if (container) container.innerHTML = html;
    }

    renderGlossary(searchTerm = '') {
        const data = this.tecnicas;
        const attacks = data.attacks || [];
        const filtered = attacks.filter(a => 
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (a.simple && a.simple.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.mitre && a.mitre.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4 sticky-top bg-black py-2" style="z-index: 10;">
                    <div class="d-flex align-items-center gap-3">
                        <button class="btn btn-link text-white p-0" onclick="academy.init('menu')"><i class="fas fa-chevron-left"></i></button>
                        <h3 class="text-primary mb-0">ENCICLOPÉDIA HACKER</h3>
                    </div>
                    <div class="input-group w-50 shadow-glow">
                        <input type="text" id="glossary-search" class="form-control bg-dark border-primary text-white" placeholder="Buscar técnica ou ID MITRE..." value="${searchTerm}">
                    </div>
                </div>

                <div class="row g-3">
                    ${filtered.map(a => `
                        <div class="col-md-12">
                            <div class="premium-glass p-3 border-start border-4 border-danger mb-3 shadow-hover">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 class="text-danger mb-1"><i class="fas ${a.icon || 'fa-bug'} me-2"></i>${security.constructor.sanitize(a.name)}</h5>
                                        <span class="badge bg-dark border border-primary text-primary" style="font-size: 0.6rem;">${a.category?.toUpperCase() || 'GENERAL'}</span>
                                    </div>
                                    <span class="badge bg-danger opacity-75">${a.mitre || 'TTP'}</span>
                                </div>
                                
                                <p class="small text-white-50 mb-3">${security.constructor.sanitize(a.simple || '')}</p>
                                
                                <div class="bg-dark rounded p-2 border-start border-success border-3">
                                    <span class="text-success small"><i class="fas fa-shield-alt me-1"></i><b>DEFESA:</b> ${security.constructor.sanitize(a.defense || 'Monitoramento de anomalias.')}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${filtered.length === 0 ? '<p class="text-center text-muted p-5">Nenhuma técnica encontrada.</p>' : ''}
                </div>
            </div>
        `;

        const container = document.getElementById('body-academy');
        if (container) {
            container.innerHTML = html;
            const searchInput = document.getElementById('glossary-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.addEventListener('input', (e) => this.renderGlossary(e.target.value));
            }
        }
    }
}

window.academy = new Academy();
