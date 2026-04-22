// i18n v4.0 - Corrected CyberOS Translation System
const translations = {
    pt: {
        game_mission: "OPERAÇÃO ATIVA",
        game_analyze: "🔍 ANALISAR CÓDIGO",
        game_success: "✅ SISTEMA COMPROMETIDO!",
        game_failure: "🚫 BLOQUEADO PELO IDS!",
        game_next: "➡️ PRÓXIMO ALVO",
        game_retry: "🔄 NOVO PAYLOAD",
        soc_title: "CENTRO SOC - DEFESA ATIVA",
        arena_title: "BOT WAR ARENA - DUELO IA",
        skills_title: "PERFIL TÉCNICO COGNITIVO",
        reputation_status: "Status de Reputação",
        level: "Nível", xp: "XP", coins: "Moedas", reputation: "Reputação",
        mission_select: "SELECIONE SEU ALVO OPERACIONAL",
        logout: "ENCERRAR SESSÃO",
        vuln_sqli: "SQL Injection",
        vuln_xss: "XSS",
        vuln_rce: "RCE",
        vuln_idor: "IDOR",
        vuln_ssrf: "SSRF",
        vuln_csrf: "CSRF",
        vuln_xxe: "XXE",
        vuln_lfi: "LFI → RCE",
        vuln_buffer: "Buffer Overflow",
        vuln_deserial: "Desserialização",
        terminal_prompt: "pentest@ethicalhacker:~$",
        proc_category: "Categoria OWASP",
        proc_difficulty: "Dificuldade",
        proc_cve: "Referência CVE"
    },
    en: {
        game_mission: "ACTIVE OPERATION",
        game_analyze: "🔍 ANALYZE VULN CODE",
        game_success: "✅ SYSTEM PWNED!",
        game_failure: "🚫 IDS/IPS BLOCK!",
        game_next: "➡️ NEXT VECTOR",
        game_retry: "🔄 NEW PAYLOAD",
        soc_title: "SOC CENTER - ACTIVE DEFENSE",
        arena_title: "BOT WAR ARENA - AI DUEL",
        skills_title: "COGNITIVE TECHNICAL PROFILE",
        reputation_status: "Reputation Status",
        level: "Level", xp: "XP", coins: "Cyber Coins", reputation: "Reputation",
        mission_select: "SELECT OPERATIONAL TARGET",
        logout: "DISCONNECT SESSION",
        vuln_sqli: "SQL Injection",
        vuln_xss: "XSS",
        vuln_rce: "RCE",
        vuln_idor: "IDOR",
        vuln_ssrf: "SSRF",
        vuln_csrf: "CSRF",
        vuln_xxe: "XXE",
        vuln_lfi: "LFI → RCE",
        vuln_buffer: "Buffer Overflow",
        vuln_deserial: "Unsafe Deserialization",
        terminal_prompt: "pentest@ethicalhacker:~$",
        proc_category: "OWASP Category",
        proc_difficulty: "Difficulty",
        proc_cve: "CVE Reference"
    },
    es: {
        game_mission: "OPERACIÓN ACTIVA",
        game_analyze: "🔍 ANALIZA CÓDIGO",
        game_success: "✅ ¡SISTEMA PWNED!",
        game_failure: "🚫 ¡IDS BLOQUEÓ!",
        game_next: "➡️ SIGUIENTE VECTOR",
        game_retry: "🔄 NUEVO PAYLOAD",
        soc_title: "CENTRO SOC - DEFENSA ACTIVA",
        arena_title: "BOT WAR ARENA - DUELO IA",
        skills_title: "PERFIL TÉCNICO COGNITIVO",
        reputation_status: "Estado de Reputación",
        level: "Nivel", xp: "XP", coins: "Cyber Coins", reputation: "Reputación",
        mission_select: "SELECCIONE OBJETIVO OPERATIVO",
        logout: "DESCONECTAR SESIÓN",
        vuln_sqli: "SQL Injection",
        vuln_xss: "XSS",
        vuln_rce: "RCE",
        vuln_idor: "IDOR",
        vuln_ssrf: "SSRF",
        vuln_csrf: "CSRF",
        vuln_xxe: "XXE",
        vuln_lfi: "LFI → RCE",
        vuln_buffer: "Buffer Overflow",
        vuln_deserial: "Deserialización",
        terminal_prompt: "pentest@ethicalhacker:~$",
        proc_category: "Categoría OWASP",
        proc_difficulty: "Dificultad",
        proc_cve: "Referencia CVE"
    }
};

let currentLang = localStorage.getItem('lang') || 'pt';

function t(key) {
    if (!translations[currentLang]) currentLang = 'pt';
    return translations[currentLang][key] || key;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        location.reload();
    }
}

window.i18n = { t, setLanguage, currentLang };
window.t = t;