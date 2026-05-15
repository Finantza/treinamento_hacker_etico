/**
 * Process Manager v1.0 - CyberOS Task Controller
 * Visualizes system resource allocation and active tasks.
 */

class ProcessManager {
    constructor() {
        this.processes = [
            { id: 101, name: 'KERNEL_CORE', cpu: '2.4%', mem: '128MB', status: 'RUNNING', user: 'SYSTEM' },
            { id: 204, name: 'SECURITY_VAULT', cpu: '1.1%', mem: '64MB', status: 'RUNNING', user: 'SYSTEM' },
            { id: 512, name: 'UI_ENGINE_3D', cpu: '12.5%', mem: '256MB', status: 'RUNNING', user: 'USER' },
            { id: 888, name: 'ONYX_NEURAL', cpu: '4.2%', mem: '512MB', status: 'SLEEP', user: 'USER' },
            { id: 1024, name: 'NETWORK_UPLINK', cpu: '0.8%', mem: '32MB', status: 'RUNNING', user: 'SYSTEM' }
        ];
        this.interval = null;
    }

    init() {
        this.render();
        this.startMonitoring();
        
        window.addEventListener('cleanup_procmgr', () => {
            if (this.interval) clearInterval(this.interval);
        }, { once: true });
    }

    startMonitoring() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.processes.forEach(p => {
                if (p.status === 'RUNNING') {
                    const base = parseFloat(p.cpu);
                    const jitter = (Math.random() - 0.5) * 0.5;
                    p.cpu = Math.max(0.1, base + jitter).toFixed(1) + '%';
                }
            });
            this.renderTable();
        }, 2000);
    }

    render() {
        const container = document.getElementById('body-procmgr');
        if (!container) return;

        container.innerHTML = `
            <div class="p-4 animate__animated animate__fadeIn font-mono h-100 d-flex flex-column">
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="glass-card p-3 border-primary bg-black">
                            <div class="x-small text-muted mb-1">CPU_LOAD</div>
                            <div class="h4 mb-0 text-primary" id="pm-total-cpu">21.0%</div>
                            <div class="progress-track mt-2" style="height: 4px;"><div class="progress-fill bg-primary" style="width: 21%"></div></div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="glass-card p-3 border-info bg-black">
                            <div class="x-small text-muted mb-1">MEM_USAGE</div>
                            <div class="h4 mb-0 text-info" id="pm-total-mem">1.2GB</div>
                            <div class="progress-track mt-2" style="height: 4px;"><div class="progress-fill bg-info" style="width: 45%"></div></div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="glass-card p-3 border-danger bg-black">
                            <div class="x-small text-muted mb-1">ACTIVE_THREADS</div>
                            <div class="h4 mb-0 text-danger">42</div>
                            <div class="progress-track mt-2" style="height: 4px;"><div class="progress-fill bg-danger" style="width: 15%"></div></div>
                        </div>
                    </div>
                </div>

                <div class="glass-card flex-grow-1 bg-black overflow-hidden d-flex flex-column">
                    <div class="p-2 border-bottom border-secondary bg-dark d-flex justify-content-between align-items-center">
                        <span class="x-small text-muted">PROCESS_LISTING</span>
                        <button class="btn btn-outline-danger btn-sm x-small py-0" onclick="procmgr.killAll()">KILL_ALL_USER</button>
                    </div>
                    <div class="flex-grow-1 overflow-auto">
                        <table class="table table-dark table-hover table-sm x-small font-mono mb-0">
                            <thead class="sticky-top bg-black">
                                <tr>
                                    <th>PID</th>
                                    <th>PROCESS_NAME</th>
                                    <th>CPU</th>
                                    <th>MEMORY</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody id="pm-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.renderTable();
    }

    renderTable() {
        const tbody = document.getElementById('pm-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.processes.map(p => `
            <tr>
                <td class="text-muted">${p.id}</td>
                <td class="fw-bold">${p.name}</td>
                <td class="text-primary">${p.cpu}</td>
                <td>${p.mem}</td>
                <td><span class="badge ${p.status === 'RUNNING' ? 'bg-success' : 'bg-secondary'} x-small">${p.status}</span></td>
                <td>
                    <button class="btn btn-link text-danger p-0 x-small" onclick="procmgr.killProcess(${p.id})">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    killProcess(id) {
        const idx = this.processes.findIndex(p => p.id === id);
        if (idx === -1) return;
        
        const p = this.processes[idx];
        if (p.user === 'SYSTEM') {
            os.notify('CRITICAL_PROCESS: ACCESS_DENIED', 'danger');
            window.sound?.play('alert');
            return;
        }

        this.processes.splice(idx, 1);
        os.notify(`PROCESS ${p.name} TERMINATED`, 'warning');
        window.sound?.play('click');
        this.renderTable();
    }

    killAll() {
        this.processes = this.processes.filter(p => p.user === 'SYSTEM');
        os.notify('ALL USER PROCESSES TERMINATED', 'danger');
        window.sound?.play('alert');
        this.renderTable();
    }
}

window.procmgr = new ProcessManager();
