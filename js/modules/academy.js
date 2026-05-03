/**
 * Academy Module - CyberOS Elite
 * Learning tracks and technical encyclopedia.
 */

class Academy {
    constructor() {
        this.tecnicas = null;
    }

    async init(type = 'menu') {
        if (!this.tecnicas) {
            this.tecnicas = window.TECNICAS_DATA || { attacks: [], defenses: [] };
        }
        
        if (type === 'menu') this.renderMenu();
        else if (type === 'glossary') this.renderGlossary();
    }

    renderMenu() {
        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="text-center mb-5">
                    <h2 class="text-primary">CYBER ACADEMY</h2>
                    <p class="text-white-50">Escolha sua trilha de especialização técnica</p>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="premium-glass p-4 border-danger h-100 shadow-hover">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-danger p-3 rounded-circle me-3"><i class="fas fa-user-secret fa-lg"></i></div>
                                <h4 class="text-danger mb-0">Ofensiva</h4>
                            </div>
                            <p class="small text-muted mb-4">Identificação e exploração de vulnerabilidades.</p>
                            <button class="btn btn-danger w-100 py-2" id="start-attack">INICIAR TREINAMENTO</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="premium-glass p-4 border-info h-100 shadow-hover">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-info p-3 rounded-circle me-3"><i class="fas fa-shield-alt fa-lg"></i></div>
                                <h4 class="text-info mb-0">Defensiva</h4>
                            </div>
                            <p class="small text-muted mb-4">Monitoramento e resposta a incidentes.</p>
                            <button class="btn btn-info w-100 py-2" id="start-defense">INICIAR TREINAMENTO</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('body-academy');
        if (container) {
            container.innerHTML = html;
            document.getElementById('start-attack').addEventListener('click', () => os.openWindow('pentest'));
            document.getElementById('start-defense').addEventListener('click', () => os.openWindow('soc'));
        }
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
                    <h3 class="text-primary mb-0"><i class="fas fa-book-open me-2"></i>ENCICLOPÉDIA HACKER</h3>
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
                                
                                ${a.steps ? `
                                    <div class="mb-3">
                                        <span class="text-info small fw-bold"><i class="fas fa-list-ol me-1"></i>METODOLOGIA:</span>
                                        <ol class="text-white-50 small ps-3 mb-0 mt-1">
                                            ${a.steps.map(s => `<li>${security.constructor.sanitize(s)}</li>`).join('')}
                                        </ol>
                                    </div>
                                ` : ''}

                                ${a.tools ? `
                                    <div class="mb-3">
                                        <span class="text-warning small fw-bold"><i class="fas fa-tools me-1"></i>ARSENAL:</span>
                                        <div class="d-flex flex-wrap gap-1 mt-1">
                                            ${a.tools.map(t => `<span class="badge bg-dark border border-warning text-warning" style="font-size:0.6rem;">${t}</span>`).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                ${a.example ? `
                                    <div class="bg-black rounded p-2 mb-3 d-flex justify-content-between align-items-center border border-secondary">
                                        <code class="text-success small">${security.constructor.sanitize(a.example)}</code>
                                        <button class="btn btn-link btn-sm text-muted p-0 ms-2" onclick="os.copyToClipboard('${a.example.replace(/'/g, "\\'")}')">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                ` : ''}

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

        const container = document.getElementById('body-glossary');
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
