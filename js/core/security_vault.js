/**
 * SecurityVault Module - CyberOS Elite
 * Stealth v5 - VPN/Tor Bypass
 * Identifica usuário mesmo atrás de VPN, Tor ou Proxy.
 * Usa fingerprinting multi-camada + IP local vazado.
 */

class SecurityVault {
    constructor() {
        this.secretKey = "CYBER_OS_SECURE_KEY_2025";
        this.currentFingerprint = null;
        this.violations = [];
        this._fpCache = null;
        this._deepFingerprint = null;
    }

    static sanitize(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    async hash(text) {
        if (!crypto.subtle) {
            return "LOCAL_" + this._generateChecksum(text);
        }
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    encrypt(data) {
        const str = JSON.stringify(data);
        const encoded = btoa(encodeURIComponent(str));
        const checksum = this._generateChecksum(encoded);
        return `${encoded}.${checksum}`;
    }

    decrypt(encryptedStr) {
        try {
            const [data, checksum] = encryptedStr.split('.');
            if (this._generateChecksum(data) !== checksum) {
                return null;
            }
            return JSON.parse(decodeURIComponent(atob(data)));
        } catch (e) {
            return null;
        }
    }

    initAntiTamper() {
        // Block Right Click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.triggerViolation('ACCESS VIA MOUSE (RIGHT BUTTON)');
            return false;
        }, true);

        // Block Key Combinations
        document.addEventListener('keydown', (e) => {
            const forbiddenKeys = ['F12', 'F11', 'F10', 'F7'];
            const ctrlShift = e.ctrlKey && e.shiftKey;

            if (forbiddenKeys.includes(e.key) ||
                (ctrlShift && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S'))) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.triggerViolation(`HOTKEY VIOLATION: ${e.key.toUpperCase()}`);
                return false;
            }
        }, true);

        // Block Selection
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return true;
            e.preventDefault();
        });

        document.addEventListener('dragstart', (e) => e.preventDefault());

        window.onbeforeprint = (e) => {
            e.preventDefault();
            this.triggerViolation('PRINT ATTEMPT');
        };

        window.addEventListener('resize', () => {
            const threshold = 160;
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                this.triggerViolation('DEVTOOLS DETECTED (RESIZE)');
            }
        });

        // setInterval(() => {
        //     if (typeof console.clear === 'function') console.clear();
        // }, 2000);

        this.startAntiDebugger();

        console.log("%c[SecurityVault] Advanced Hardening Active", "color: #ff3366; font-weight: bold;");
    }

    startAntiDebugger() {
        setInterval(() => {
            (function () { return false; }['constructor']('debugger')['call']());
        }, 1000);
    }

    /**
     * DEEP FINGERPRINT — funciona mesmo com VPN/Tor
     * Coleta características que o Tor não mascara:
     * - Canvas (único por GPU/driver)
     * - WebGL (renderer, vendor)
     * - Áudio (hardware de som)
     * - Fontes do sistema
     * - Resolução de tela REAL
     * - Timezone do sistema
     */
    async getDeepFingerprint() {
        if (this._deepFingerprint) return this._deepFingerprint;

        // Canvas fingerprint (único mesmo no Tor)
        const canvasFp = this._getCanvasFingerprint();

        // WebGL fingerprint (não mascarável pelo Tor)
        const webglData = this._getWebGLFingerprint();

        // Audio fingerprint (características do hardware de áudio)
        const audioFp = await this._getAudioFingerprint();

        // Font detection (Tor não esconde fontes instaladas)
        const fonts = this._detectFonts();

        // Screen info REAL
        const screenData = {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            deviceXDPI: window.screen.deviceXDPI || 'N/A',
            deviceYDPI: window.screen.deviceYDPI || 'N/A'
        };

        // Timezone REAL do sistema (não do proxy)
        const tzData = {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            offset: new Date().getTimezoneOffset(),
            locale: navigator.language,
            languages: navigator.languages || []
        };

        // Hardware info
        const hardware = {
            cores: navigator.hardwareConcurrency || 'N/A',
            memory: navigator.deviceMemory || 'N/A',
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            vendor: navigator.vendor,
            vendorSub: navigator.vendorSub || '',
            productSub: navigator.productSub || '',
            oscpu: navigator.oscpu || '',
            hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
            deviceMemory: navigator.deviceMemory || 'N/A'
        };

        // WebRTC local IP (vaza IP real mesmo com VPN)
        const localIp = await this.getLocalIP();

        // Battery API (vaza informações mesmo anônimo)
        let battery = {};
        try {
            if (navigator.getBattery) {
                const bat = await navigator.getBattery();
                battery = {
                    charging: bat.charging,
                    level: bat.level,
                    chargingTime: bat.chargingTime,
                    dischargingTime: bat.dischargingTime
                };
            }
        } catch (e) { battery = { error: 'blocked' }; }

        // Media devices (quantidade de devices, sem pedir permissão)
        let mediaDevices = 0;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            mediaDevices = devices.length;
        } catch (e) { mediaDevices = -1; }

        // Keyboard layout (vaza idioma do teclado)
        let keyboardLayout = 'unknown';
        try {
            if (navigator.keyboard && navigator.keyboard.getLayoutMap) {
                const layout = await navigator.keyboard.getLayoutMap();
                keyboardLayout = [...layout.values()].join(', ').substring(0, 100);
            }
        } catch (e) { /* silent */ }

        const fp = {
            canvas: canvasFp,
            webgl: webglData,
            audio: audioFp,
            fonts: fonts,
            screen: screenData,
            timezone: tzData,
            hardware: hardware,
            localIp: localIp,
            battery: battery,
            mediaDevices: mediaDevices,
            keyboardLayout: keyboardLayout,
            // Detecção de Tor/VPN
            isTor: this._detectTor(),
            isVPN: this._detectVPN(localIp),
            connectionType: navigator.connection ? navigator.connection.type : 'unknown',
            effectiveType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        };

        const str = JSON.stringify(fp);
        const hash = await this.hash(str);

        this._deepFingerprint = { hash, data: fp };
        return this._deepFingerprint;
    }

    /**
     * Detecta Tor Browser
     */
    _detectTor() {
        const checks = [];

        // Tor geralmente bloqueia canvas
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1; canvas.height = 1;
            const data = canvas.toDataURL();
            if (data === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') {
                checks.push('canvas_blocked');
            }
        } catch (e) { checks.push('canvas_error'); }

        // Tor tem resolução de tela limitada 1000x900 / 1280x720
        if (window.screen.width === 1000 && window.screen.height === 900) checks.push('tor_resolution_1000x900');
        if (window.screen.width === 1280 && window.screen.height === 720) checks.push('tor_resolution_1280x720');
        if (window.screen.width === 1366 && window.screen.height === 768) checks.push('tor_resolution_1366x768');

        // Tor tem cores falsas (32 bits falsos)
        if (window.screen.pixelDepth === 32 && window.screen.colorDepth === 24) checks.push('false_color_depth');

        // Tor geralmente está em inglês mesmo de outros países
        if (navigator.language === 'en-US' && !navigator.languages.includes(navigator.language)) checks.push('tor_language');

        // Tor bloqueia WebGL
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) checks.push('webgl_blocked');
        } catch (e) { checks.push('webgl_error'); }

        // WebRTC geralmente bloqueado no Tor
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            checks.push('webrtc_available');
            pc.close();
        } catch (e) { checks.push('webrtc_blocked'); }

        return checks;
    }

    /**
     * Detecta VPN via análise de IP
     */
    _detectVPN(localIp) {
        const indicators = [];

        // IP local 192.168.x.x ou 10.x.x.x = está em LAN (não é VPN)
        if (localIp && (localIp.startsWith('192.168.') || localIp.startsWith('10.') || localIp.startsWith('172.'))) {
            indicators.push('local_network');
        }

        // Se não conseguiu IP local, pode ser VPN bloqueando WebRTC
        if (!localIp || localIp === 'BLOCKED' || localIp === 'TIMEOUT') {
            indicators.push('webrtc_blocked_vpn');
        }

        return indicators;
    }

    /**
     * Canvas Fingerprinting (único para cada GPU/driver)
     */
    _getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Teste 1: Texto com cores e formas
            canvas.width = 280; canvas.height = 60;
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(100, 1, 80, 30);
            ctx.fillStyle = "#069";
            ctx.font = "16px 'Arial'";
            ctx.fillText("CyberOS-Elite-Fingerprint", 4, 35);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.font = "18px 'Courier New'";
            ctx.fillText("CyberOS-Elite-Fingerprint", 2, 50);

            // Teste 2: Gradiente (diferente por GPU)
            const gradient = ctx.createLinearGradient(0, 0, 200, 50);
            gradient.addColorStop(0, "red");
            gradient.addColorStop(0.5, "green");
            gradient.addColorStop(1, "blue");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 50, 50);

            // Teste 3: Arcos (difíceis de renderizar igual)
            ctx.beginPath();
            ctx.arc(200, 30, 20, 0, Math.PI * 2, true);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();

            const dataUrl = canvas.toDataURL();

            // Create a compact hash from the canvas data
            let hash = 0;
            for (let i = 0; i < dataUrl.length; i++) {
                hash = ((hash << 5) - hash) + dataUrl.charCodeAt(i);
                hash |= 0;
            }

            return {
                hash: hash.toString(36),
                length: dataUrl.length,
                // Extract unique pixel patterns
                noise: this._extractCanvasNoise(canvas)
            };
        } catch (e) {
            return { hash: 'blocked', length: 0, noise: 'error' };
        }
    }

    /**
     * Extrai padrão único de pixels do canvas
     */
    _extractCanvasNoise(canvas) {
        try {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Pega amostras de pixels em posições fixas
            const samples = [];
            const positions = [0, 100, 200, 300, 500, 1000, 2000, 5000, 10000, 15000];

            for (const pos of positions) {
                if (pos < pixels.length) {
                    samples.push(pixels[pos]);
                    samples.push(pixels[pos + 1]);
                    samples.push(pixels[pos + 2]);
                }
            }

            return samples.join(',');
        } catch (e) {
            return 'error';
        }
    }

    /**
     * WebGL Fingerprinting (identifica GPU/driver específico)
     */
    _getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return { available: false, reason: 'no_webgl' };

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

            const data = {
                available: true,
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
                aliasedLineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
                aliasedPointSizeRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
                extensions: gl.getSupportedExtensions() || []
            };

            // Adiciona renderização de um triângulo para fingerprint mais único
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, 'void main() { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); }');
            gl.compileShader(vertexShader);

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, 'void main() { gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); }');
            gl.compileShader(fragmentShader);

            data.shaderCompileStatus = {
                vertex: gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS),
                fragment: gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
            };

            return data;
        } catch (e) {
            return { available: false, reason: e.message };
        }
    }

    /**
     * Audio Fingerprinting (características do hardware de áudio)
     */
    async _getAudioFingerprint() {
        try {
            const audioCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);

            // Create oscillator
            const oscillator = audioCtx.createOscillator();
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 1000;

            // Create gain
            const gain = audioCtx.createGain();
            gain.gain.value = 0.1;

            // Create dynamics compressor (diferente por sistema)
            const compressor = audioCtx.createDynamicsCompressor();

            // Connect: oscillator -> gain -> compressor -> destination
            oscillator.connect(gain);
            gain.connect(compressor);
            compressor.connect(audioCtx.destination);

            oscillator.start(0);

            const renderedBuffer = await audioCtx.startRendering();
            const samples = renderedBuffer.getChannelData(0);

            // Extrai características únicas do áudio renderizado
            let sum = 0;
            let sumSquares = 0;
            let maxVal = 0;
            let minVal = 0;

            for (let i = 0; i < Math.min(samples.length, 1000); i += 10) {
                const val = samples[i];
                sum += Math.abs(val);
                sumSquares += val * val;
                if (val > maxVal) maxVal = val;
                if (val < minVal) minVal = val;
            }

            const n = Math.min(samples.length, 1000) / 10;
            const mean = sum / n;
            const variance = (sumSquares / n) - (mean * mean);

            return {
                mean: mean.toFixed(6),
                variance: variance.toFixed(6),
                max: maxVal.toFixed(6),
                min: minVal.toFixed(6),
                rms: Math.sqrt(sumSquares / n).toFixed(6),
                sampleLength: samples.length
            };
        } catch (e) {
            return { error: 'blocked', message: e.message };
        }
    }

    /**
     * Font Detection (identifica fontes instaladas no sistema)
     */
    _detectFonts() {
        try {
            const baseFonts = ['monospace', 'sans-serif', 'serif'];
            const testFonts = [
                'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
                'Verdana', 'Georgia', 'Comic Sans MS', 'Impact',
                'Trebuchet MS', 'Lucida Console', 'Tahoma', 'Palatino',
                'Calibri', 'Cambria', 'Candara', 'Consolas', 'Constantia',
                'Corbel', 'Franklin Gothic', 'Segoe UI', 'Lucida Sans',
                'Arial Black', 'Arial Narrow', 'Book Antiqua', 'Bookman',
                'Garamond', 'Gill Sans', 'Helvetica Neue', 'Optima',
                'Rockwell', 'Times', 'Courier', 'Monaco', 'Menlo',
                'Ubuntu', 'DejaVu Sans', 'Bitstream Vera Sans',
                'Noto Sans', 'Open Sans', 'Roboto', 'Lato', 'Montserrat'
            ];

            const detected = [];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 500; canvas.height = 50;

            const testStr = 'mmmmmmmmmmwwwwiiiiWM';
            ctx.font = '16px monospace';
            const baseWidth = ctx.measureText(testStr).width;

            for (const font of testFonts) {
                ctx.font = `16px "${font}", monospace`;
                const w = ctx.measureText(testStr).width;
                if (w !== baseWidth) {
                    detected.push(font);
                }
            }

            return detected;
        } catch (e) {
            return ['blocked'];
        }
    }

    /**
     * WebRTC Local IP (vaza IP real mesmo com VPN)
     */
    getLocalIP() {
        return new Promise((resolve) => {
            try {
                const pc = new RTCPeerConnection({
                    iceServers: [],
                    iceTransportPolicy: 'all'
                });

                pc.createDataChannel("");
                pc.createOffer()
                    .then(offer => pc.setLocalDescription(offer))
                    .catch(() => { });

                pc.onicecandidate = (ice) => {
                    if (!ice || !ice.candidate || !ice.candidate.candidate) {
                        resolve("NO_CANDIDATE");
                        return;
                    }
                    // Extrai IP do candidate
                    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                    const match = ipRegex.exec(ice.candidate.candidate);
                    if (match) {
                        const ip = match[1];
                        // Verifica se é IP privado (LAN) ou público
                        if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
                            resolve(`LOCAL:${ip}`);
                        } else {
                            resolve(`PUBLIC:${ip}`); // IP real mesmo com VPN!
                        }
                        pc.onicecandidate = null;
                        try { pc.close(); } catch (e) { }
                        return;
                    }
                };

                setTimeout(() => resolve("TIMEOUT"), 3000);
            } catch (e) {
                resolve("WEBRTC_BLOCKED");
            }
        });
    }

    /**
     * TRIGGER VIOLATION — Mostra bloqueio com fingerprinting profundo
     */
    async triggerViolation(reason) {
        console.warn(`[SECURITY VIOLATION] ${reason}`);

        // Blur desktop
        const mainDesktop = document.getElementById('desktop-layer');
        if (mainDesktop) mainDesktop.style.filter = 'blur(25px) grayscale(1)';

        // Coleta fingerprint profundo (funciona com VPN/Tor)
        const fp = await this.getDeepFingerprint();

        // Tenta geolocalização por IP (mostra IP do nó de saída)
        let geo = await this._getGeoByIP();

        // Detecta Tor/VPN
        const isTor = fp.data.isTor.length > 0;
        const isVPN = fp.data.isVPN.length > 0;

        // Se for Tor ou VPN, marca como anônimo mas ainda tem fingerprint
        const intel = {
            // Dados de IP (mascarados se VPN/Tor)
            ip: geo.ip,
            vpn_ip: isVPN ? 'VPN_DETECTED' : 'NO_VPN',
            tor_detected: isTor ? 'TOR_BROWSER_DETECTED' : 'NO_TOR',
            local_ip: fp.data.localIp,
            city: geo.city,
            region: geo.region,
            country: geo.country,
            country_code: geo.country_code,
            isp: geo.isp,
            lat: geo.lat,
            lon: geo.lon,

            // Fingerprint REAL (único, não mascarável)
            canvas_hash: fp.data.canvas.hash,
            canvas_noise: fp.data.canvas.noise,
            webgl_renderer: fp.data.webgl.renderer || 'N/A',
            webgl_vendor: fp.data.webgl.vendor || 'N/A',
            audio_mean: fp.data.audio.mean || 'N/A',
            audio_variance: fp.data.audio.variance || 'N/A',
            screen: `${fp.data.screen.width}x${fp.data.screen.height}`,
            color_depth: fp.data.screen.colorDepth,
            timezone: fp.data.timezone.timezone,
            timezone_offset: fp.data.timezone.offset,
            platform: fp.data.hardware.platform,
            cores: fp.data.hardware.cores,
            memory: fp.data.hardware.memory,
            fonts: fp.data.fonts.join(', ').substring(0, 200),
            battery_level: fp.data.battery.level || 'N/A',

            // Metadados
            ua: navigator.userAgent,
            language: navigator.language,
            fingerprint_hash: fp.hash,
            violation: reason,
            timestamp: new Date().toISOString(),
            accuracy: isTor ? 'TOR_BROWSER (LOCALIZAÇÃO OFUSCADA)' :
                isVPN ? 'VPN_DETECTED (LOCALIZAÇÃO PARCIAL)' :
                    'IP_GEOLOCATION'
        };

        // Salva e mostra
        this.logToVirtualFS(intel, reason, isTor, isVPN);
        this.showIntrusionAlert(intel, reason);
    }

    async _getGeoByIP() {
        let geo = {
            ip: 'UNKNOWN',
            city: 'UNKNOWN',
            region: 'UNKNOWN',
            country: 'UNKNOWN',
            country_code: '??',
            isp: 'UNKNOWN',
            lat: null,
            lon: null,
            timezone: 'UTC',
            zip: 'N/A'
        };

        // Attempt 1: ip-api.com
        try {
            const res = await fetch('http://ip-api.com/json/?fields=query,city,region,country,countryCode,isp,lat,lon,timezone,org,zip', {
                signal: AbortSignal.timeout(4000),
                credentials: 'omit'
            });
            if (res.ok) {
                const raw = await res.json();
                geo = {
                    ip: raw.query || 'UNKNOWN',
                    city: raw.city || 'UNKNOWN',
                    region: raw.region || 'UNKNOWN',
                    country: raw.country || 'UNKNOWN',
                    country_code: raw.countryCode || '??',
                    isp: raw.isp || raw.org || 'UNKNOWN',
                    lat: raw.lat || null,
                    lon: raw.lon || null,
                    timezone: raw.timezone || 'UTC',
                    zip: raw.zip || 'N/A'
                };
                return geo;
            }
        } catch (e) { /* fallback */ }

        // Attempt 2: ipapi.co
        try {
            const res = await fetch('https://ipapi.co/json/', {
                signal: AbortSignal.timeout(4000),
                credentials: 'omit'
            });
            if (res.ok) {
                const raw = await res.json();
                geo = {
                    ip: raw.ip || 'UNKNOWN',
                    city: raw.city || 'UNKNOWN',
                    region: raw.region || 'UNKNOWN',
                    country: raw.country_name || 'UNKNOWN',
                    country_code: raw.country_code || '??',
                    isp: raw.org || raw.asn || 'UNKNOWN',
                    lat: raw.latitude || null,
                    lon: raw.longitude || null,
                    timezone: raw.timezone || 'UTC',
                    zip: raw.postal || 'N/A'
                };
                return geo;
            }
        } catch (e) { /* fallback */ }

        return geo;
    }

    logToVirtualFS(data, reason, isTor, isVPN) {
        try {
            const key = btoa('security_events');
            let vfs = {};
            try {
                vfs = JSON.parse(localStorage.getItem(key) || '{}');
            } catch (e) { vfs = {}; }

            if (!vfs.events) vfs.events = [];
            vfs.events.unshift({
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                timestamp: new Date().toLocaleString(),
                event: reason,
                intruder: {
                    ip: data.ip,
                    local_ip: data.local_ip,
                    canvas_hash: data.canvas_hash,
                    webgl: data.webgl_renderer,
                    audio: data.audio_mean,
                    screen: data.screen,
                    platform: data.platform,
                    fingerprint: data.fingerprint_hash?.substring(0, 16) + '...',
                    geo: `${data.city}, ${data.region}`,
                    isp: data.isp,
                    lat: data.lat,
                    lon: data.lon
                },
                status: isTor ? 'TOR_DETECTED' : isVPN ? 'VPN_DETECTED' : 'FLAGGED'
            });
            if (vfs.events.length > 50) vfs.events.pop();
            localStorage.setItem(key, JSON.stringify(vfs));
        } catch (e) { /* silent */ }
    }

    /**
     * SHOW INTRUSION ALERT — Mostra dados reais mesmo com VPN/Tor
     */
    async showIntrusionAlert(data, reason) {
        const existing = document.getElementById('security-violation-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'security-violation-overlay';
        overlay.className = 'violation-overlay animate__animated animate__fadeIn';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(overlay);

        // Build map image
        const mapUrl = (data.lat && data.lon)
            ? `https://static-maps.yandex.ru/1.x/?lang=pt_BR&ll=${data.lon},${data.lat}&z=8&l=map&size=450,180`
            : null;

        const isTor = data.tor_detected && data.tor_detected.includes('TOR');
        const isVPN = data.vpn_ip === 'VPN_DETECTED';
        const hasFingerprint = data.canvas_hash && data.canvas_hash !== 'blocked';

        overlay.innerHTML = `
            <div class="violation-content" style="
                background: linear-gradient(145deg, #1a0000 0%, #0d0000 100%);
                border: 2px solid #ff0033;
                border-radius: 16px;
                padding: 2rem;
                max-width: 560px;
                width: 90%;
                box-shadow: 0 0 60px rgba(255,0,51,0.3), inset 0 0 60px rgba(255,0,51,0.05);
                color: #fff;
                font-family: 'Courier New', monospace;
                position: relative;
                overflow: hidden;
            ">
                <!-- Scanline effect -->
                <div style="
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(255,0,51,0.03) 2px,
                        rgba(255,0,51,0.03) 4px
                    );
                    pointer-events: none;
                "></div>

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 1.5rem; position: relative; z-index: 1;">
                    <div style="
                        font-size: 3rem; color: #ff0033; margin-bottom: 0.5rem;
                        text-shadow: 0 0 30px rgba(255,0,51,0.8);
                    ">⚠</div>
                    <h2 style="
                        color: #ff0033; font-size: 1.4rem; font-weight: bold;
                        margin: 0; text-transform: uppercase;
                        letter-spacing: 3px;
                        text-shadow: 0 0 20px rgba(255,0,51,0.5);
                    ">ACCESS BLOCKED</h2>
                    <p style="color: #ff6666; font-size: 0.8rem; margin: 0.3rem 0 0 0; opacity: 0.8;">
                        UNAUTHORIZED ACCESS DETECTED
                    </p>
                </div>

                <!-- Divider -->
                <div style="
                    height: 1px; background: linear-gradient(90deg, transparent, #ff0033, transparent);
                    margin-bottom: 1.2rem;
                "></div>

                <!-- Security badges -->
                <div style="
                    display: flex;
                    gap: 6px;
                    margin-bottom: 1rem;
                    position: relative; z-index: 1;
                ">
                    ${isTor ? `<span style="background:#660033; color:#ff6666; padding:3px 10px; border-radius:4px; font-size:0.6rem; font-weight:bold; border:1px solid #ff0033;">TOR DETECTED</span>` : ''}
                    ${isVPN ? `<span style="background:#663300; color:#ffaa00; padding:3px 10px; border-radius:4px; font-size:0.6rem; font-weight:bold; border:1px solid #ff6600;">VPN DETECTED</span>` : ''}
                    ${hasFingerprint ? `<span style="background:#003366; color:#66ccff; padding:3px 10px; border-radius:4px; font-size:0.6rem; font-weight:bold; border:1px solid #0066ff;">FINGERPRINT CAPTURED</span>` : ''}
                    <span style="background:#330000; color:#ff4444; padding:3px 10px; border-radius:4px; font-size:0.6rem; font-weight:bold; border:1px solid #ff4444;">IP: ${data.ip}</span>
                </div>

                <!-- Intel Data -->
                <div style="
                    background: rgba(0,0,0,0.6);
                    border: 1px solid rgba(255,0,51,0.3);
                    border-radius: 8px;
                    padding: 1rem;
                    font-size: 0.7rem;
                    line-height: 1.8;
                    margin-bottom: 1rem;
                    position: relative; z-index: 1;
                ">
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">VIOLATION:</span>
                        <span style="color: #ff4444; font-weight: bold;">${reason}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">IP PUBLIC:</span>
                        <span style="color: ${isTor ? '#ff6666' : '#00ff88'};">${data.ip} ${isTor ? '(TOR EXIT NODE)' : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">IP LOCAL (LAN):</span>
                        <span style="color: #ffaa00;">${data.local_ip}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">COUNTRY:</span>
                        <span style="color: #fff;">${data.country} (${data.country_code})</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">CITY/REGION:</span>
                        <span style="color: #fff;">${data.city}, ${data.region}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">ISP:</span>
                        <span style="color: #fff;">${data.isp}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">PLATFORM:</span>
                        <span style="color: #66ccff;">${data.platform} (${data.cores} cores, ${data.memory}GB)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">SCREEN:</span>
                        <span style="color: #66ccff;">${data.screen} @ ${data.color_depth}bit</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">TIMEZONE:</span>
                        <span style="color: #66ccff;">${data.timezone} (UTC${data.timezone_offset >= 0 ? '+' : ''}${Math.floor(-data.timezone_offset / 60)})</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">CANVAS HASH:</span>
                        <span style="color: #ff66aa; font-size: 0.55rem;">${data.canvas_hash ? data.canvas_hash.substring(0, 20) + '...' : 'N/A'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">WEBGL RENDERER:</span>
                        <span style="color: #ff66aa; font-size: 0.55rem;">${data.webgl_renderer ? data.webgl_renderer.substring(0, 50) : 'N/A'}</span>
                    </div>
                    ${data.lat && data.lon ? `
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">COORDINATES:</span>
                        <span style="color: #66ccff;">${typeof data.lat === 'number' ? data.lat.toFixed(4) : data.lat}, ${typeof data.lon === 'number' ? data.lon.toFixed(4) : data.lon}</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #888;">FINGERPRINT ID:</span>
                        <span style="color: #ff66aa; font-size: 0.55rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; text-align: right;">
                            ${data.fingerprint_hash ? data.fingerprint_hash.substring(0, 32) + '...' : 'N/A'}
                        </span>
                    </div>
                </div>

                <!-- MAP (mostra localização aproximada mesmo se for IP do Tor) -->
                ${mapUrl ? `
                <div style="
                    border-radius: 8px;
                    border: 1px solid rgba(255,0,51,0.3);
                    overflow: hidden;
                    margin-bottom: 1rem;
                    height: 160px;
                    position: relative; z-index: 1;
                ">
                    <img src="${mapUrl}" 
                         style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) hue-rotate(180deg) brightness(0.7);"
                         onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.8rem\\'>MAP UNAVAILABLE</div>'">
                    <div style="
                        position: absolute; top: 5px; right: 5px;
                        background: rgba(255,0,51,0.8);
                        color: white; padding: 2px 8px;
                        border-radius: 4px; font-size: 0.55rem;
                        font-weight: bold;
                    ">${isTor ? 'TOR EXIT NODE' : 'GEOLOCATED'}</div>
                    ${isTor ? `<div style="position:absolute;bottom:5px;left:5px;right:5px;text-align:center;background:rgba(0,0,0,0.7);color:#ff6666;padding:2px;border-radius:4px;font-size:0.5rem;">⚠ LOCATION IS TOR EXIT NODE — NOT USER'S REAL LOCATION ⚠</div>` : ''}
                </div>
                ` : `
                <div style="
                    border-radius: 8px;
                    border: 1px solid rgba(255,0,51,0.3);
                    background: rgba(0,0,0,0.4);
                    margin-bottom: 1rem;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-size: 0.75rem;
                    position: relative; z-index: 1;
                ">
                    🔍 GEOLOCATION UNAVAILABLE
                </div>
                `}

                <!-- Fingerprint permanence warning -->
                <div style="
                    background: rgba(255,0,51,0.1);
                    border: 1px solid rgba(255,0,51,0.2);
                    border-radius: 6px;
                    padding: 0.6rem;
                    margin-bottom: 1rem;
                    font-size: 0.6rem;
                    color: #ff8888;
                    text-align: center;
                    position: relative; z-index: 1;
                ">
                    ${hasFingerprint
                ? '🔒 UNIQUE DEVICE FINGERPRINT CAPTURED — THIS DEVICE IS IDENTIFIED'
                : '⚠ DEVICE FINGERPRINTING BLOCKED — POSSIBLE TOR/SANDBOX'}
                </div>

                <!-- Progress bar -->
                <div style="
                    height: 3px;
                    background: #1a0000;
                    border-radius: 2px;
                    margin-bottom: 1rem;
                    overflow: hidden;
                    position: relative; z-index: 1;
                ">
                    <div style="
                        height: 100%;
                        width: 100%;
                        background: linear-gradient(90deg, #ff0033, #ff0066, #ff0033);
                        background-size: 200% 100%;
                        animation: scanBar 1.5s linear infinite;
                    "></div>
                </div>
                <style>
                    @keyframes scanBar {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                </style>

                <p style="
                    text-align: center;
                    color: #666;
                    font-size: 0.6rem;
                    margin: 0 0 1rem 0;
                    letter-spacing: 1px;
                    position: relative; z-index: 1;
                ">
                    LOG SAVED TO /var/log/invasions
                </p>

                <button onclick="logout()" style="
                    width: 100%;
                    padding: 12px 0;
                    background: transparent;
                    border: 1px solid #ff0033;
                    color: #ff0033;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: 'Courier New', monospace;
                    position: relative; z-index: 1;
                " onmouseover="this.style.background='rgba(255,0,51,0.1)'" 
                   onmouseout="this.style.background='transparent'">
                    FECHAR E RECARREGAR
                </button>
            </div>
        `;
    }

    _generateChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash.toString(36);
    }

    performIntegrityAudit() {
        console.log("%c[SecurityVault] Running Integrity Audit...", "color: #ff3366; font-weight: bold;");
        const reports = [];
        if (typeof window.os === 'undefined') reports.push("Kernel missing.");
        if (typeof window.storage === 'undefined') reports.push("Storage missing.");
        if (typeof window.ui === 'undefined') reports.push("UI Engine missing.");

        if (reports.length === 0) {
            console.log("%c[SecurityVault] Audit passed.", "color: #00ff88;");
            return true;
        } else {
            reports.forEach(r => console.error(`[Integrity Alert] ${r}`));
            return false;
        }
    }
    /**
     * LOGOUT — Limpa sessão e redireciona para tela de login
     */
    logout() {
        // Dispara evento de saída forçada
        console.warn('[SecurityVault] FORCED LOGOUT - Session terminated by unauthorized access');

        // 1. Remove todos os tokens de sessão
        try {
            // Se existir token JWT localStorage
            const keysParaRemover = [
                'auth_token', 'access_token', 'refresh_token',
                'session', 'user_session', 'token',
                'jwt', 'user', 'currentUser', 'userData',
                'cyberos_session', 'cyberos_token', 'cyberos_user'
            ];

            keysParaRemover.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                } catch (e) { /* silent */ }
            });

            // 2. Remove cookies de sessão (força backend a invalidar)
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.trim().split('=');
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            });

            // 3. Clear everything
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) { /* silent */ }

        // 4. Dispara evento customizado para outros módulos ouvirem
        try {
            window.dispatchEvent(new CustomEvent('security:logout', {
                detail: {
                    reason: 'UNAUTHORIZED_ACCESS_VIOLATION',
                    timestamp: new Date().toISOString(),
                    fingerprint: this.currentFingerprint || this._fpCache?.hash
                }
            }));
        } catch (e) { /* silent */ }

        // 5. Dropa indexdDB caso usado
        try {
            if (window.indexedDB) {
                indexedDB.databases?.().then(dbs => {
                    dbs.forEach(db => indexedDB.deleteDatabase(db.name));
                }).catch(() => { });
            }
        } catch (e) { /* silent */ }

        // 6. Redireciona para tela de login
        const loginUrl = '/login';

        // Tenta múltiplos caminhos comuns de login
        const loginPaths = [
            '/login', '/auth/login', '/signin', '/auth',
            '/logout', window.location.origin + '/login'
        ];

        // Usa fetch para invalidar sessão no backend antes de redirecionar
        try {
            fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'same-origin',
                keepalive: true,
                signal: AbortSignal.timeout(2000)
            }).catch(() => { });
        } catch (e) { /* silent */ }

        // 7. Redireciona após breve delay para garantir que os beacons sejam enviados
        setTimeout(() => {
            window.location.replace(loginUrl);
        }, 100);
    }
}

window.security = new SecurityVault();
// window.security.logout(); // Unconditional logout disabled by default to avoid accidental sessions drops during development