# Especificações Técnicas - CyberOS v5.2 (2024-2025)

Esta documentação detalha as novas funcionalidades, módulos de inteligência artificial e aprimoramentos de arquitetura implementados para modernizar a plataforma de treinamento.

---

## 🤖 1. Módulo Gemma AI Assistant (v2.0)
A IA nativa evoluiu de um otimizador passivo para um assistente cognitivo interativo.

*   **Análise de Perfil Técnico:** Monitoramento em tempo real de 3 trilhas de competência:
    *   **RECON:** SSRF, IDOR, LFI/RFI, Network Scanning.
    *   **LOGIC:** SQLi, XSS, Auth Bypass, CSRF, API Security.
    *   **EXPLOIT:** RCE, Buffer Overflow, Deserialization, Cloud Security.
*   **Sistema de Aconselhamento Contextual:**
    *   **Dashboard:** Recomendações baseadas em fraquezas detectadas.
    *   **Cyber Academy:** Sugestão de trilhas de especialização.
    *   **Pentest Helper:** Botão "Consultar Gemma" que fornece análise técnica do vetor de ataque e dicas de exploração.
*   **Transparência Sináptica:** Logs de otimização visíveis que explicam como a IA está ajustando os pesos do sistema para o usuário.

## 🛡️ 2. Módulo de Defesa SOC & Resposta a Incidentes
O motor de simulação foi atualizado para reconhecer ameaças de última geração.

*   **Novos Vetores de Ataque 2024-2025:**
    *   **AI Prompt Injection:** Ataques contra LLMs integrados.
    *   **Deepfake Vishing:** Engenharia social avançada por voz/vídeo.
    *   **K8s RBAC Bypass:** Exploração de permissões em clusters Kubernetes.
    *   **Dependency Confusion:** Ataques em cadeia de suprimentos (Supply Chain).
    *   **Quishing (QR Code Phishing):** Vetores de phishing via QR Codes maliciosos.
*   **Log de Nível Crítico:** Interface visual com alertas vermelhos pulsantes para ameaças de alto impacto.
*   **Mitigação Dinâmica:** Novas contramedidas automatizadas e manuais (ex: Isolamento de Pods K8s, Reset de Tokens AI).

## 🔍 3. Glossário Modernizado (Metadata-Driven)
O motor de renderização do glossário foi reconstruído para suportar grandes volumes de dados com alta performance.

*   **Filtragem Dinâmica:** Filtros por Categoria, Impacto (Low, Medium, High, Critical) e Dificuldade.
*   **Busca em Tempo Real:** Indexação de técnicas de ataque e defesa para busca instantânea.
*   **Metadados MITRE ATT&CK:** Todas as técnicas agora incluem IDs MITRE, complexidade e impacto tático.
*   **UI Reativa:** Badges coloridos e layout adaptativo para melhor legibilidade técnica.

## 🧬 4. EvoGen Engine (Motor de Evolução Genética)
Um motor generativo que garante que o treinamento nunca se torne repetitivo.

*   **Algoritmo Genético:** Realiza "Crossover" entre templates de vulnerabilidades para criar desafios híbridos inéditos.
*   **Ajuste de Dificuldade Adaptativo:** A rede neural local (SimpleNeuralNet) analisa o WinRate do jogador e escala a dificuldade (Iniciante → Lógica → Massiva) de forma autônoma.
*   **Mutação Procedural:** Variação de nomes de variáveis, nomes de empresas e payloads para evitar a memorização de padrões.

## 🏗️ 5. Arquitetura & UI/UX
Refatoração completa para padrões profissionais de desenvolvimento web.

*   **Desacoplamento de CSS:** 100% dos estilos internos e inline foram migrados para `css/style.css`, eliminando avisos de linter e melhorando a performance de carregamento.
*   **Sistema de Notificações Gemma:** Alertas integrados ao SO que informam quando a IA realiza uma otimização de performance no ambiente.
*   **Interface Premium:** Uso de glassmorphism avançado, animações de transição suaves e layout responsivo para mobile/desktop.

---

> [!TIP]
> Use o novo ícone **GEMMA AI** no desktop para acessar seu relatório de auditoria e ver seu perfil cognitivo atualizado.
