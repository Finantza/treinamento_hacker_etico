// i18n v3.0 - Enhanced Cyberpunk Multi-Language System w/ Pentest Resources
// Full Authorization Activated - All Pentest Terminology & Procedural Integration

const translations = {
    pt: {
        // CORE UI
        title: "ETHICAL HACKER PREMIUM",
        hero_title: "TORNE-SE UM <span class='highlight'>PENTESTER DE ELITE</span>",
        hero_desc: "Domine OWASP Top 10, CVEs reais e ataques avançados. Offline-first com ProceduralAI.",
        btn_start: "🚀 INICIAR OPERAÇÃO",
        btn_features: "🔍 VER ARSENAL COMPLETO",
        login_title: "TERMINAL DE AUTENTICAÇÃO",
        btn_access: "🔓 ACESSAR REDE CRÍTICA",
        
        // PLAYER DASHBOARD
        level: "Nível", xp: "XP", coins: "Cyber Coins", reputation: "Reputação",
        mission_select: "SELECIONE SEU ALVO OPERACIONAL",
        logout: "DESCONECTAR SESSION",
        
        // TUTORIAL SYSTEM
        tut_welcome: "🕵️‍♂️ Agente, bem-vindo ao C2!",
        tut_welcome_desc: "Sua missão: Explorar vulnerabilidades reais (SQLi, XSS, RCE, Buffer Overflow) antes dos adversários.",
        tut_how: "🎯 Metodologia de Ataque",
        tut_how_desc: "1. Análise estática → 2. Identificação de vetores → 3. Exploit crafting → 4. Post-exploit.",
        tut_rules: "⚔️ Regras de Engajamento",
        tut_rules_desc: "Acerto 1º try: <strong>+25 REP</strong> | Erro: <strong>-10 REP + Alarme IDS</strong>",
        
        // CHALLENGE SYSTEM (ProceduralAI Integration)
        challenge_level: "Desafio ProceduralAI",
        btn_level_1: "🟢 Reconhecimento (Nmap, Gobuster)",
        btn_level_2: "🧠 Exploração (SQLi, XSS, IDOR)",
        btn_level_3: "🔥 Pós-Exploit (Reverse Shells)",
        btn_level_ai: "🤖 ProceduralAI Massiva (CVE Chains)",
        btn_level_pro: "⌨️ Buffer Overflow & Assembly",
        btn_level_multi: "🌐 Red Team vs Blue Team",
        
        // TERMINAL & SANDBOX
        sandbox_title: "SANDBOX DE EXPLOIT",
        sandbox_desc: "Teste payloads reais: Reverse shells, webshells, privilege escalation. 100% sandboxed.",
        btn_run: "▶️ EXECUTAR PAYLOAD",
        btn_clear: "🗑️ LIMPAR BUFFER",
        result: "OUTPUT CRÍTICO",
        terminal_prompt: "pentest@ethicalhacker:~$",
        
        // SHOP & ECONOMY (Dark Web)
        shop_title: "DARK WEB MARKETPLACE",
        shop_btn: "🌑 DARK WEB",
        store_balance: "Saldo BTC",
        store_decoder: "BRUTEFORCE v4.2",
        store_decoder_desc: "Hashcat + JohnTheRipper bundle. GPU acceleration ready.",
        store_bypass: "TOR + I2P Chain",
        store_bypass_desc: "5-hop onion routing + perfect forward secrecy.",
        store_price: "PREÇO", store_buy: "AQUIRIR", store_stock: "DISPONÍVEL",
        store_acquired: "ATIVO", store_insufficient: "FUNDOS INSUFICIENTES",
        
        // PENTEST TERMINOLOGY (Full OWASP Coverage)
        vuln_sqli: "SQL Injection (UNION/Tautology/Blind)",
        vuln_xss: "Cross-Site Scripting (Reflected/Stored/DOM)",
        vuln_rce: "Remote Code Execution (Command/Deserialization)",
        vuln_idor: "Insecure Direct Object Reference",
        vuln_ssrf: "Server-Side Request Forgery",
        vuln_csrf: "Cross-Site Request Forgery",
        vuln_xxe: "XML External Entity",
        vuln_lfi: "Local File Inclusion → RCE",
        vuln_buffer: "Buffer Overflow (Stack/Heap/Format String)",
        vuln_deserial: "Unsafe Deserialization (PHP/Java)",
        
        // AI FEEDBACK (ProceduralAI Enhanced)
        ai_feedback_excellent: "🎉 PERFEITO! Bypass IDS/IPS/WAF. Reverse shell estabelecido. +50 REP 🥷",
        ai_feedback_good: "✅ Vetor sólido! Privilege escalation parcial. +25 REP 🎯",
        ai_feedback_learning: "⚠️ Vetor detectado. Refine obfuscation e timing. +5 REP 📡",
        ai_feedback_fail: "💥 IDS bloqueou. Fingerprint capturado. -15 REP 🚨",
        
        // GAME STATES
        game_mission: "OPERAÇÃO ATIVA",
        game_analyze: "🔍 ANALISE O CÓDIGO VULNERÁVEL",
        game_success: "✅ SISTEMA COMPROMETIDO!",
        game_failure: "🚫 BLOQUEADO POR IDS/IPS!",
        game_next: "➡️ PRÓXIMO VETOR",
        game_retry: "🔄 NOVO PAYLOAD",
        
        // DASHBOARD METRICS
        dash_security_level: "COMANDO CIBERNÉTICO GLOBAL",
        dash_reputation: "REP Cyber",
        dash_bugs_found: "Vulnerabilidades Reportadas",
        dash_failures: "Detectados por IDS",
        dash_best_streak: "Maior Sequência Stealth",
        dash_accuracy: "Precisão de Exploits",
        
        // HINTS & TOOLS
        btn_hint: "🧠 MITRE ATT&CK Framework",
        hint_applied: "INTEL CARREGADA",
        btn_skip: "VPN Chain Bypass",
        skip_active: "TUNNEL ATIVO",
        
        // ProceduralAI Specific
        proc_ai_title: "ProceduralAI v3.0",
        proc_ai_desc: "Geração procedural de 150+ desafios offline. Anti-repetição ativa.",
        proc_category: "Categoria OWASP",
        proc_difficulty: "Dificuldade Adaptativa",
        proc_cve: "CVE Referência",
        proc_payload: "Payload Sugerido",
        
        // BADGES & ACHIEVEMENTS
        badge_sqli_master: "SQLi Master (50+ exploits)",
        badge_xss_king: "XSS Kingdom (100+ DOM bypass)",
        badge_rce_god: "RCE God (25 reverse shells)",
        badge_stealth: "Ghost Mode (100% stealth rate)"
    },
    
    en: {
        title: "ETHICAL HACKER PREMIUM",
        hero_title: "BECOME AN <span class='highlight'>ELITE PENTESTER</span>",
        hero_desc: "Master OWASP Top 10, real CVEs, advanced attacks. Offline-first w/ ProceduralAI.",
        btn_start: "🚀 START OPERATION",
        btn_features: "🔍 VIEW FULL ARSENAL",
        login_title: "AUTH TERMINAL",
        btn_access: "🔓 ACCESS CRITICAL NET",
        
        level: "Level", xp: "XP", coins: "Cyber Coins", reputation: "Reputation",
        mission_select: "SELECT OPERATIONAL TARGET",
        logout: "DISCONNECT SESSION",
        
        tut_welcome: "🕵️‍♂️ Agent, welcome to C2!",
        tut_welcome_desc: "Mission: Exploit real vulns (SQLi, XSS, RCE, Buffer Overflow) before adversaries.",
        tut_how: "🎯 Attack Methodology",
        tut_how_desc: "1. Static analysis → 2. Vector ID → 3. Exploit crafting → 4. Post-exploit.",
        tut_rules: "⚔️ Rules of Engagement",
        tut_rules_desc: "1st try hit: <strong>+25 REP</strong> | Miss: <strong>-10 REP + IDS Alarm</strong>",
        
        challenge_level: "ProceduralAI Challenge",
        btn_level_1: "🟢 Recon (Nmap, Gobuster)",
        btn_level_2: "🧠 Exploitation (SQLi, XSS, IDOR)",
        btn_level_3: "🔥 Post-Exploitation (Rev Shells)",
        btn_level_ai: "🤖 ProceduralAI Advanced (CVE Chains)",
        btn_level_pro: "⌨️ Buffer Overflow & ASM",
        btn_level_multi: "🌐 Red vs Blue",
        
        sandbox_title: "EXPLOIT SANDBOX",
        sandbox_desc: "Test real payloads: Rev shells, webshells, priv esc. 100% sandboxed.",
        btn_run: "▶️ RUN PAYLOAD",
        btn_clear: "🗑️ CLEAR BUFFER",
        result: "CRITICAL OUTPUT",
        terminal_prompt: "pentest@ethicalhacker:~$",
        
        shop_title: "DARK WEB MARKETPLACE",
        shop_btn: "🌑 DARK WEB",
        store_balance: "BTC Balance",
        store_decoder: "BRUTEFORCE v4.2",
        store_decoder_desc: "Hashcat + John bundle. GPU ready.",
        store_bypass: "TOR + I2P Chain",
        store_bypass_desc: "5-hop onion + PFS.",
        store_price: "PRICE", store_buy: "ACQUIRE", store_stock: "AVAILABLE",
        store_acquired: "ACTIVE", store_insufficient: "INSUFFICIENT FUNDS",
        
        vuln_sqli: "SQL Injection (UNION/Tautology/Blind)",
        vuln_xss: "XSS (Reflected/Stored/DOM)",
        vuln_rce: "RCE (Command/Deserial)",
        vuln_idor: "IDOR",
        vuln_ssrf: "SSRF",
        vuln_csrf: "CSRF",
        vuln_xxe: "XXE",
        vuln_lfi: "LFI → RCE",
        vuln_buffer: "Buffer Overflow (Stack/Heap)",
        vuln_deserial: "Unsafe Deserialization",
        
        ai_feedback_excellent: "🎉 PERFECT! Bypassed IDS/IPS/WAF. Revshell active. +50 REP 🥷",
        ai_feedback_good: "✅ Solid vector! Partial priv esc. +25 REP 🎯",
        ai_feedback_learning: "⚠️ Vector detected. Refine obfuscation. +5 REP 📡",
        ai_feedback_fail: "💥 IDS blocked. Fingerprint captured. -15 REP 🚨",
        
        game_mission: "ACTIVE OPERATION",
        game_analyze: "🔍 ANALYZE VULN CODE",
        game_success: "✅ SYSTEM PWNED!",
        game_failure: "🚫 IDS/IPS BLOCK!",
        game_next: "➡️ NEXT VECTOR",
        game_retry: "🔄 NEW PAYLOAD",
        
        dash_security_level: "CYBER COMMAND GLOBAL",
        dash_reputation: "Cyber REP",
        dash_bugs_found: "Vulns Reported",
        dash_failures: "IDS Detections",
        dash_best_streak: "Stealth Streak",
        dash_accuracy: "Exploit Accuracy",
        
        btn_hint: "🧠 MITRE ATT&CK",
        hint_applied: "INTEL LOADED",
        btn_skip: "VPN Bypass",
        skip_active: "TUNNEL UP",
        
        proc_ai_title: "ProceduralAI v3.0",
        proc_ai_desc: "150+ procedural challenges offline. Anti-repeat enabled.",
        proc_category: "OWASP Category",
        proc_difficulty: "Adaptive Difficulty",
        proc_cve: "CVE Reference",
        proc_payload: "Suggested Payload",
        
        badge_sqli_master: "SQLi Master (50+)",
        badge_xss_king: "XSS King (100+ DOM)",
        badge_rce_god: "RCE God (25 shells)",
        badge_stealth: "Ghost Mode (100% stealth)"
    },
    
    es: {
        title: "ETHICAL HACKER PREMIUM",
        hero_title: "CONVIÉRTETE EN <span class='highlight'>PENTESTER ÉLITE</span>",
        hero_desc: "Domina OWASP Top 10, CVEs reales, ataques avanzados. Offline con ProceduralAI.",
        btn_start: "🚀 INICIAR OPERACIÓN",
        btn_features: "🔍 VER ARSENAL COMPLETO",
        login_title: "TERMINAL AUTENTICACIÓN",
        btn_access: "🔓 ACCEDER RED CRÍTICA",
        
        level: "Nivel", xp: "XP", coins: "Cyber Coins", reputation: "Reputación",
        mission_select: "SELECCIONA OBJETIVO OPERATIVO",
        logout: "DESCONECTAR SESIÓN",
        
        tut_welcome: "🕵️‍♂️ ¡Agente, bienvenido al C2!",
        tut_welcome_desc: "Misión: Explotar vulnerabilidades reales antes que los adversarios.",
        tut_how: "🎯 Metodología",
        tut_how_desc: "1. Análisis estático → 2. ID vectores → 3. Crafting → 4. Post-exploit.",
        tut_rules: "⚔️ Reglas",
        tut_rules_desc: "1er intento: <strong>+25 REP</strong> | Error: <strong>-10 REP + Alarma</strong>",
        
        challenge_level: "Desafío ProceduralAI",
        btn_level_1: "🟢 Recon (Nmap, Gobuster)",
        btn_level_2: "🧠 Explotación (SQLi, XSS)",
        btn_level_3: "🔥 Post-Explotación",
        btn_level_ai: "🤖 ProceduralAI Avanzado",
        btn_level_pro: "⌨️ Buffer Overflow",
        btn_level_multi: "🌐 Red vs Blue",
        
        sandbox_title: "SANDBOX EXPLOIT",
        sandbox_desc: "Prueba payloads reales: Shells inversos, webshells, escalada.",
        btn_run: "▶️ EJECUTAR",
        btn_clear: "🗑️ LIMPIAR",
        result: "OUTPUT CRÍTICO",
        terminal_prompt: "pentest@ethicalhacker:~$",
        
        shop_title: "DARK WEB MARKET",
        shop_btn: "🌑 DARK WEB",
        store_balance: "Saldo BTC",
        store_decoder: "BRUTEFORCE v4.2",
        store_decoder_desc: "Hashcat + John. GPU ready.",
        store_bypass: "TOR + I2P",
        store_bypass_desc: "5 saltos onion + PFS.",
        store_price: "PRECIO", store_buy: "ADQUIRIR", store_stock: "DISPONIBLE",
        
        vuln_sqli: "SQL Injection",
        vuln_xss: "XSS",
        vuln_rce: "RCE",
        vuln_idor: "IDOR",
        vuln_ssrf: "SSRF",
        vuln_csrf: "CSRF",
        vuln_xxe: "XXE",
        vuln_lfi: "LFI→RCE",
        vuln_buffer: "Buffer Overflow",
        vuln_deserial: "Deserialización",
        
        ai_feedback_excellent: "🎉 ¡PERFECTO! IDS/IPS/WAF bypass. +50 REP 🥷",
        ai_feedback_good: "✅ Vector sólido! +25 REP 🎯",
        ai_feedback_learning: "⚠️ Detectado. Refina ofuscación. 📡",
        ai_feedback_fail: "💥 IDS bloqueó. -15 REP 🚨",
        
        game_mission: "OPERACIÓN ACTIVA",
        game_analyze: "🔍 ANALIZA CÓDIGO",
        game_success: "✅ ¡SISTEMA PWNED!",
        game_failure: "🚫 ¡IDS BLOQUEÓ!",
        game_next: "➡️ SIGUIENTE VECTOR",
        game_retry: "🔄 NUEVO PAYLOAD",
        
        dash_security_level: "COMANDO CIBERNÉTICO",
        dash_reputation: "REP Cyber",
        dash_bugs_found: "Vulns Reportadas",
        dash_failures: "Detecciones IDS",
        dash_best_streak: "Racha Stealth",
        dash_accuracy: "Precisión Exploits",
        
        btn_hint: "🧠 MITRE ATT&CK",
        hint_applied: "INTEL CARGADA",
        btn_skip: "VPN Bypass",
        skip_active: "TÚNEL ACTIVO",
        
        proc_ai_title: "ProceduralAI v3.0",
        proc_ai_desc: "150+ desafíos procedurales offline.",
        proc_category: "Categoría OWASP",
        proc_difficulty: "Dificultad Adaptativa",
        proc_cve: "Referencia CVE",
        proc_payload: "Payload Sugerido",
        
        badge_sqli_master: "SQLi Master",
        badge_xss_king: "XSS King",
        badge_rce_god: "RCE God",
        badge_stealth: "Ghost Mode"
    }
};

let currentLang = localStorage.getItem('lang') || 'pt';
let procAI = window.procAI || null; // ProceduralAI integration

// ENHANCED TRANSLATION SYSTEM w/ Pentest Context
function t(key, params = {}) {
    let translation = translations[currentLang][key] || key;
    
    // Dynamic pentest payload insertion
    if (params.challenge) {
        translation = translation.replace('{category}', t(`vuln_${params.challenge.category}`));
        translation = translation.replace('{cve}', params.challenge.cveReference || 'N/A');
        translation = translation.replace('{payload}', params.challenge.payloadHint?.slice(0, 30) + '...');
    }
    
    return translation;
}

// FULL DYNAMIC APPLICATION
function applyTranslations() {
    document.documentElement.lang = currentLang;
    
    // Enhanced selector for all i18n elements
    document.querySelectorAll('[data-i18n], [data-i18n-title], [data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18n || el.dataset.i18nTitle || el.dataset.i18nPlaceholder;
        if (el.dataset.i18n) el.innerHTML = t(key);
        if (el.dataset.i18nTitle) el.title = t(key);
        if (el.dataset.i18nPlaceholder) el.placeholder = t(key);
    });
    
    // Real-time ProceduralAI challenge translation
    if (procAI) {
        updateChallengeDisplay();
    }
    
    // Update terminal prompt
    const terminals = document.querySelectorAll('.terminal-prompt');
    terminals.forEach(term => {
        term.textContent = t('terminal_prompt');
    });
}

function updateChallengeDisplay() {
    const challengeEl = document.getElementById('currentChallenge');
    if (challengeEl && procAI) {
        const challenge = procAI.lastChallenge;
        if (challenge) {
            challengeEl.innerHTML = `
                <div class="challenge-header">
                    ${t('proc_category')}: ${t(`vuln_${challenge.category}`)} 
                    | ${t('proc_difficulty')}: ${challenge.difficulty}
                    | ${t('proc_cve')}: ${challenge.cveReference}
                </div>
                <code>${challenge.description}</code>
            `;
        }
    }
}

// LANGUAGE SWITCHER w/ Animation
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Cyberpunk transition effect
    document.body.classList.add('lang-transition');
    setTimeout(() => {
        applyTranslations();
        document.body.classList.remove('lang-transition');
    }, 300);
}

// AUTO-GENERATED DYNAMIC PHRASES (Pentest Context)
const dynamicPhrases = {
    pt: [
        'ProceduralAI: Gerando SQLi UNION SELECT...',
        'Reverse shell listening em 10.0.0.1:4444',
        'Buffer overflow: ROP chain construída',
        'XSS DOM bypass via location.hash',
        'CVE-2021-44228 payload carregado'
    ],
    en: [
        'ProceduralAI: Generating SQLi UNION SELECT...',
        'Rev shell listening 10.0.0.1:4444',
        'Buffer overflow: ROP chain ready',
        'XSS DOM bypass via location.hash',
        'CVE-2021-44228 payload loaded'
    ],
    es: [
        'ProceduralAI: Generando SQLi UNION...',
        'Rev shell escuchando 10.0.0.1:4444',
        'Buffer overflow: ROP chain listo',
        'XSS DOM bypass location.hash',
        'CVE-2021-44228 payload cargado'
    ]
};

// ENHANCED INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    
    // Language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    
    // Dynamic cyberpunk phrases rotation
    let phraseIndex = 0;
    const phraseTargets = document.querySelectorAll('[data-dynamic-phrase]');
    setInterval(() => {
        const phrases = dynamicPhrases[currentLang];
        phraseIndex = (phraseIndex + 1) % phrases.length;
        
        phraseTargets.forEach((el, i) => {
            el.textContent = phrases[(phraseIndex + i) % phrases.length];
        });
    }, 3500);
    
    // ProceduralAI real-time sync
    if (window.procAI) {
        window.procAI.onChallengeGenerated = (challenge) => {
            window.procAI.lastChallenge = challenge;
            updateChallengeDisplay();
        };
    }
    
    // PWA Language Persistence
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.active.postMessage({
                type: 'LANG_UPDATE',
                lang: currentLang
            });
        });
    }
});

// GLOBAL EXPORTS for HTML/CSS integration
window.i18n = { t, setLanguage, currentLang, translations };
window.applyTranslations = applyTranslations;

// CSS Lang Transition (add to your stylesheet)
const style = document.createElement('style');
style.textContent = `
    .lang-transition * {
        animation: glitch 0.3s ease-in-out;
    }
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
`;
document.head.appendChild(style);