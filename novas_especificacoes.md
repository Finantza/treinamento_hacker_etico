# Especificações Técnicas - CyberOS Platinum v5.2 (2024-2025)

Esta documentação detalha as novas funcionalidades, módulos de inteligência artificial e aprimoramentos de arquitetura implementados para modernizar a plataforma de treinamento CyberOS.

---

## 🤖 1. Assistente ONYX (Ex-Gemma AI)
A inteligência artificial do sistema foi renomeada para **ONYX** (Electronic Cybernetic Heuristic Observer) e recebeu atualizações críticas de performance e segurança.

*   **Identidade Hacker Própria:** Nome e diálogos reformulados para evitar problemas de direitos autorais e aumentar a imersão.
*   **Deep System Scan:** Nova funcionalidade de varredura profunda que analisa logs de invasão e integridade do Kernel em tempo real.
*   **Análise de Perfil Técnico:** Monitoramento de 3 trilhas de competência (RECON, LOGIC, EXPLOIT).
*   **Sistema de Aconselhamento Contextual:**
    *   **Dashboard:** Recomendações proativas baseadas em fraquezas detectadas.
    *   **Pentest Helper:** Função "Consultar ONYX" para análise técnica de vetores de ataque.
*   **Transparência Sináptica:** Logs de otimização heurística visíveis ao usuário.

## 🛡️ 2. Módulo de Defesa SOC & Hardening (Silent Mode)
O motor de segurança foi blindado contra inspeção externa e monitoramento não autorizado.

*   **Rastreamento Silencioso de Invasão:** Tentativas de acesso via console ou inspeção de código são registradas de forma invisível em um sistema de arquivos virtual (`/var/log/invasions`) armazenado no `localStorage`.
*   **Integração SOC em Tempo Real:** O painel SOC agora é reativo, atualizando métricas de MTTD (Mean Time to Detect), nível de ameaça e ataques bloqueados via eventos globais.
*   **Novos Vetores de Ataque 2025:**
    *   **AI Prompt Injection:** Ataques contra motores LLM.
    *   **Deepfake Vishing:** Engenharia social via clonagem de voz.
    *   **K8s RBAC Bypass:** Exploração de clusters Kubernetes.
    *   **Quishing:** Phishing via QR Codes maliciosos.

## 🏗️ 3. Arquitetura Premium & UI/UX
A interface foi elevada ao nível "Platinum" com efeitos visuais de alta fidelidade.

*   **Ultra-Glassmorphism:** Implementação de desfoque profundo (20px), saturação aumentada (180%) e bordas de neon adaptativas.
*   **Área de Trabalho Limpa:** Ícones removidos do desktop para garantir foco total. Todos os recursos centralizados no **Menu Start** (Perfil, SOC, Arena, Toolkit, Glossário).
*   **Kernel Hardening:** Proteção rigorosa contra `user-select` e `drag-and-drop` não autorizado, garantindo que o conteúdo do treinamento não seja copiado facilmente.
*   **Error Resilience:** Implementação de `try-catch` em todos os módulos críticos de renderização, garantindo que o sistema recupere de falhas de dados sem interrupção para o usuário.

## 🧬 4. EvoGen Engine (Motor de Evolução)
O motor generativo garante desafios únicos e adaptativos.

*   **Algoritmo Genético:** Crossover entre templates de vulnerabilidades para criar desafios híbridos.
*   **Rede Neural Local:** Ajuste autônomo de dificuldade baseado no desempenho real do jogador (WinRate).

---

> [!IMPORTANT]
> Para acessar os logs de segurança e ver quem tentou invadir seu sistema, use o módulo **LOGS DE INVASÃO** no Menu Start.
