/**
 * UI Engine - CyberOS Elite
 * Premium effects, responsive layout, and adaptive performance.
 */

class UIEngine {
    constructor() {
        this.performanceMode = 'high'; // high, medium, low
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.activeIntervals = [];
        this.activeAnimations = [];
    }

    init() {
        this.detectHardware();
        this.applyMobileFixes();
        this.initParallax();
        console.log(`[UI Engine] Mode: ${this.performanceMode} | iOS: ${this.isIOS}`);
    }

    detectHardware() {
        // Detect weak devices (simple heuristics)
        const isMobile = window.innerWidth < 768;
        const memory = navigator.deviceMemory || 4; // GB
        const cores = navigator.hardwareConcurrency || 4;

        if (isMobile || memory < 4 || cores < 4) {
            this.performanceMode = 'low';
            document.body.classList.add('perf-low');
        } else if (memory < 8) {
            this.performanceMode = 'medium';
            document.body.classList.add('perf-medium');
        } else {
            this.performanceMode = 'high';
        }
    }

    applyMobileFixes() {
        if (this.isIOS) {
            // Fix 100vh on Safari
            const fixVH = () => {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            window.addEventListener('resize', fixVH);
            fixVH();
            
            // Disable elastic scroll on body
            document.body.style.overscrollBehavior = 'none';
        }
    }

    /**
     * Optimized Particle System
     */
    initParticles(canvasId, count = 50) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: true });
        let particles = [];
        
        // Adjust count based on performance mode
        if (this.performanceMode === 'low') count = Math.floor(count * 0.3);
        if (this.performanceMode === 'medium') count = Math.floor(count * 0.6);

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2 + 1,
                a: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            if (!document.getElementById(canvasId)) return;
            
            // Performance: Only render if tab is active and element is visible
            if (document.hidden) {
                requestAnimationFrame(animate);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.globalAlpha = p.a;
                ctx.fill();
            });

            const animId = requestAnimationFrame(animate);
            this.activeAnimations.push(animId);
        };

        animate();
    }

    initParallax() {
        if (this.performanceMode === 'low') return;

        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            
            const grid = document.querySelector('.cyber-grid');
            if (grid) {
                grid.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    /**
     * Throttles a function call
     */
    throttle(callback, limit) {
        let wait = false;
        return function () {
            if (!wait) {
                callback.apply(this, arguments);
                wait = true;
                setTimeout(() => {
                    wait = false;
                }, limit);
            }
        };
    }

    /**
     * Hero Hub initialization and visibility management
     */
    initHeroHub() {
        const hub = document.getElementById('hero-hub');
        if (!hub) return;

        // Sync visibility with windows
        const syncVisibility = () => {
            const hasWindows = !!document.querySelector('#window-container .window');
            hub.classList.toggle('visible', !hasWindows);
        };
        
        const observer = new MutationObserver(syncVisibility);
        const container = document.getElementById('window-container');
        if (container) observer.observe(container, { childList: true });
        syncVisibility();

        // Counter animations
        document.querySelectorAll('.stat-num').forEach(el => {
            const target = parseInt(el.dataset.target);
            let current = 0;
            const timer = setInterval(() => {
                current += Math.ceil(target / 20);
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 50);
        });

        // Rotating words
        const words = ['HACKER.', 'DEFENSOR.', 'ANALISTA.', 'PENTESTER.'];
        let i = 0;
        const wordEl = document.getElementById('hero-rotating-word');
        if (wordEl) {
            const rotationInterval = setInterval(() => {
                i = (i + 1) % words.length;
                wordEl.style.opacity = '0';
                setTimeout(() => {
                    wordEl.textContent = words[i];
                    wordEl.style.opacity = '1';
                }, 300);
            }, 2500);
            this.activeIntervals.push(rotationInterval);
        }

        this.initParticles('hero-particles', 60);
    }
}

window.ui = new UIEngine();
