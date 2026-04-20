# Python Detective - Versão 100% Offline

## Como Usar

1. Abra o arquivo `index.html` diretamente no seu navegador (Chrome/Firefox recomendado).
2. Clique em "INICIAR AGORA".
3. **Se não houver perfis cadastrados**: Aparecerá um botão "Cadastrar Novo Perfil" para criar o primeiro perfil.
4. **Se houver perfis**: Digite seu nome de usuário e senha (opcional) para entrar diretamente, ou clique em "Ver Perfis Existentes" para selecionar da lista.
5. Para cadastrar um novo perfil adicional, use "Ver Perfis Existentes" e depois "Cadastrar Novo Perfil".
6. Veja seu dashboard com métricas detalhadas.
7. Jogue encontrando bugs no código Python!

## Funcionalidades Offline

- ✅ Sistema de cadastro/login com perfis múltiplos
- ✅ Métricas completas: XP, nível, moedas, sequência, tempo médio
- ✅ Estatísticas detalhadas (bugs corretos/errados, melhor sequência)
- ✅ Sistema de conquistas (first_10, streak_5, level_5)
- ✅ Geração de bugs locais
- ✅ Persistência via localStorage
- ✅ Interface responsiva e animada
- ✅ Traduções multi-idioma

## Métricas Acompanhadas

- **XP Total**: Pontuação acumulada
- **Nível**: Calculado como floor(XP / 100) + 1
- **Moedas**: Ganhos por acertos (XP / 10)
- **Sequência Atual**: Acertos consecutivos
- **Melhor Sequência**: Record pessoal
- **Bugs Totais**: Corretos e errados
- **Tempo Médio**: Média de resposta por pergunta
- **Performance por Categoria**: Acerto por tipo de bug
- **Conquistas**: Desbloqueadas por marcos

## Usuário de Teste

Para facilitar os testes, a aplicação cria automaticamente um usuário de teste quando não há nenhum perfil cadastrado:

- **Nome de usuário**: `teste`
- **Senha**: `offline` (ou deixe vazio)
- **Dados de exemplo**:
  - XP: 250 (Nível 3)
  - Sequência atual: 3
  - Melhor sequência: 5
  - Bugs encontrados: 19 (15 corretos, 4 errados)
  - Tempo médio: 12.5 segundos
  - Conquistas: `first_10`, `streak_5`
  - Performance: Lógica (8/10), Sintaxe (7/9)

Use este usuário para testar todas as funcionalidades sem precisar criar um perfil do zero.

**Para desenvolvimento**: Abra o console do navegador (F12) e execute `resetTestData()` para limpar todos os dados e recarregar a página com o usuário teste recriado.

## Arquivos do Projeto

### Essenciais (mantidos):
- `index.html` - Página principal e ponto de entrada
- `manifest.json` - Configuração PWA
- `sw.js` - Service Worker para cache offline
- `icon.png` - Ícone da aplicação
- `css/style.css` - Estilos Bootstrap customizados
- `data/questions.js` - Dados das questões de bugs
- `js/offline.js` - Lógica principal offline (login, dashboard, jogo, correções, store)
- `js/i18n.js` - Internacionalização (PT/EN/ES)
- `js/ai_generator.js` - Motor de geração procedural de bugs
- `README.md` - Esta documentação

### Removidos (não necessários para versão offline):
- Arquivos do servidor original (`server.py`, `database.py`, etc.)
- Templates HTML não utilizados (`dashboard.html`, `login.html`, etc.)
- Scripts não utilizados (`auth.js`, `ranking.js`, etc.)
- Dependências Python (`requirements.txt`, `__pycache__`)
- Arquivos de execução (`run_web.bat`)

## 🎨 Layout e Design

### Interface Moderna
- **Design Cyberpunk**: Tema escuro com gradientes neon e efeitos de brilho
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **SPA (Single Page Application)**: Navegação fluida sem recarregar a página
- **Modais Elegantes**: Login, cadastro e seleção usam modais Bootstrap customizados
- **Animações**: Transições suaves e efeitos visuais

### Paleta de Cores
- **Fundo**: Gradiente escuro com toques de roxo e azul
- **Texto**: Branco e cinzas com destaques em ciano (#00f2ff)
- **Cards**: Fundo escuro com bordas coloridas
- **Botões**: Gradientes com efeitos hover

### Componentes
- **Dashboard**: Cards com estatísticas, conquistas e navegação
- **Jogo**: Interface limpa com código destacado e botões de resposta
- **Modais**: Formulários elegantes para login e cadastro
- **Typography**: Fontes modernas (Inter, Orbitron, Fira Code)

## 🛠️ Tecnologias

- **Pyodide**: Python executando no navegador
- **Bootstrap 5**: Framework CSS responsivo
- **Service Worker**: Cache offline para PWA
- **localStorage**: Persistência de dados do usuário
- **CSS Custom Properties**: Tema cyberpunk customizável
- **Fontes Google**: Inter, Orbitron e Fira Code