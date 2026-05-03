/**
 * Black Market Module - CyberOS Elite
 * Store for purchasing tools and exploits.
 */

class BlackMarket {
    constructor() {
        this.ITEMS = [
            { id: 'hint', name: 'Exploit Hint', desc: 'Revela detalhes da vulnerabilidade.', price: 100, icon: 'fa-lightbulb', color: 'info' },
            { id: 'skip', name: 'Automation Script', desc: 'Pula a missão atual garantindo XP.', price: 250, icon: 'fa-fast-forward', color: 'danger' },
            { id: 'vpn', name: 'Premium VPN', desc: 'Protege seu combo em caso de falha.', price: 400, icon: 'fa-user-shield', color: 'warning' },
            { id: 'zeroday', name: 'Zero-Day Access', desc: 'Dobra o ganho de XP na próxima missão.', price: 750, icon: 'fa-virus', color: 'primary' },
            { id: 'soc_ai', name: 'SOC AI Assistant', desc: 'Automatiza contra-medidas no modo SOC.', price: 1200, icon: 'fa-robot', color: 'info' },
            { id: 'botnet', name: 'Botnet Rental', desc: 'Poder massivo: Pula 3 missões seguidas.', price: 1500, icon: 'fa-network-wired', color: 'success' }
        ];
    }

    init() {
        this.render();
    }

    render() {
        const username = storage.getCurrentUsername();
        const user = storage.getUserData(username);
        
        if (!user) return;

        const html = `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 class="text-danger mb-0"><i class="fas fa-shopping-cart me-2"></i>MERCADO NEGRO</h3>
                        <p class="text-muted small">Adquira ferramentas proibidas para suas operações</p>
                    </div>
                    <div class="bg-black border border-warning rounded px-3 py-2">
                        <i class="fas fa-coins text-warning me-1"></i>
                        <span class="text-warning fw-bold">${user.coins || 0} CC</span>
                    </div>
                </div>

                <div class="row g-3">
                    ${this.ITEMS.map(item => {
                        const canAfford = (user.coins || 0) >= item.price;
                        return `
                        <div class="col-md-6 col-lg-4">
                            <div class="premium-glass p-3 border-${item.color} h-100 d-flex flex-column">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="bg-${item.color} p-2 rounded me-2 text-dark">
                                        <i class="fas ${item.icon}"></i>
                                    </div>
                                    <h6 class="mb-0 text-white">${item.name}</h6>
                                </div>
                                <p class="small text-muted flex-grow-1">${item.desc}</p>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="text-warning fw-bold small">${item.price} CC</span>
                                    <button class="btn btn-sm ${canAfford ? 'btn-' + item.color : 'btn-dark disabled'}" 
                                            onclick="market.buyItem('${item.id}')">
                                        ${canAfford ? 'COMPRAR' : 'SALDO INSUF'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        const container = document.getElementById('body-blackmarket');
        if (container) container.innerHTML = html;
    }

    buyItem(id) {
        const item = this.ITEMS.find(i => i.id === id);
        const username = storage.getCurrentUsername();
        const user = storage.getUserData(username);

        if (user.coins >= item.price) {
            user.coins -= item.price;
            user.inventory = user.inventory || [];
            user.inventory.push(id);
            storage.saveUserData(username, user);
            os.showNotification(`Item adquirido: ${item.name}`, 'success');
            this.render();
            if (document.getElementById('body-dashboard')) dashboard.render();
        } else {
            os.showNotification("Saldo insuficiente!", "danger");
        }
    }
}

window.market = new BlackMarket();
