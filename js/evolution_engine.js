// EvoGenEngine - Generative & Evolutionary AI for CyberOS
// 100% Offline, Local-first Machine Learning

class SimpleNeuralNet {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.weightsIH = this.createMatrix(hiddenNodes, inputNodes);
        this.weightsHO = this.createMatrix(outputNodes, hiddenNodes);
    }
    createMatrix(rows, cols) {
        let matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = Math.random() * 2 - 1; // -1 to 1
            }
        }
        return matrix;
    }
    sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
    predict(inputArray) {
        let hiddenInputs = [];
        for (let i = 0; i < this.hiddenNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) sum += inputArray[j] * this.weightsIH[i][j];
            hiddenInputs[i] = this.sigmoid(sum);
        }
        let outputs = [];
        for (let i = 0; i < this.outputNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) sum += hiddenInputs[j] * this.weightsHO[i][j];
            outputs[i] = this.sigmoid(sum);
        }
        return outputs;
    }
    train(inputArray, targetArray, lr = 0.1) {
        // A simple perceptron learning approximation for runtime tweaking
        let prediction = this.predict(inputArray);
        for (let i = 0; i < this.outputNodes; i++) {
            let error = targetArray[i] - prediction[i];
            for (let j = 0; j < this.hiddenNodes; j++) {
                this.weightsHO[i][j] += lr * error * prediction[i] * (1 - prediction[i]);
            }
        }
    }
}

class EvoGenEngine {
    constructor() {
        this.neuralNet = new SimpleNeuralNet(3, 5, 2); // Input: [WinRate, AvgTime, CategoryDifficulty], Output: [NeedsMutation, NeedsHarder]
        this.playerProfile = { wins: 0, losses: 0, categoryStats: {} };
        this.loadProfile();
        console.log('[EvoGenEngine] Inicializado. IA Generativa operando localmente.');
    }

    loadProfile() {
        try {
            const data = localStorage.getItem('evogen_profile');
            if (data) this.playerProfile = JSON.parse(data);
        } catch(e) {}
    }

    saveProfile() {
        localStorage.setItem('evogen_profile', JSON.stringify(this.playerProfile));
    }

    // Chamado pelo offline.js toda vez que o jogador resolve ou erra uma missão
    observe(category, success, timeSpent) {
        this.playerProfile.wins += success ? 1 : 0;
        this.playerProfile.losses += success ? 0 : 1;
        
        if (!this.playerProfile.categoryStats[category]) {
            this.playerProfile.categoryStats[category] = { wins: 0, losses: 0 };
        }
        this.playerProfile.categoryStats[category].wins += success ? 1 : 0;
        this.playerProfile.categoryStats[category].losses += success ? 0 : 1;
        
        this.saveProfile();
        this.evolveSystem(category);
    }

    evolveSystem(category) {
        if (!window.aiGenerator) return;
        
        const stats = this.playerProfile.categoryStats[category] || {wins: 0, losses: 0};
        const total = stats.wins + stats.losses;
        if (total < 3) return; // Precisa de mais dados para evoluir

        const winRate = stats.wins / total;
        
        // Predição Neural
        const prediction = this.neuralNet.predict([winRate, 0.5, 0.5]);
        const shouldMutate = prediction[0] > 0.6; // Alta chance de mutar desafios
        const increaseDifficulty = prediction[1] > 0.5;

        // Se o jogador está ganhando muito (WinRate alto), a IA aumenta o peso dessa categoria
        // para que ela caia mais frequentemente, e gera novas mutações (Crossover).
        if (winRate > 0.7 && window.aiGenerator.categories[category]) {
            window.aiGenerator.categories[category].weight += 2; // Força mais missões desse tipo
            console.log(`[EvoGenEngine] Evolução ativada: Categoria ${category} está fácil demais. Aumentando peso.`);
            
            // Geração Genética (Crossover de vulnerabilidades)
            this.generateCrossoverChallenge(category);
        }
        
        // Treinamento passivo
        this.neuralNet.train([winRate, 0.5, 0.5], [winRate > 0.7 ? 1 : 0, winRate > 0.8 ? 1 : 0]);
    }

    // Algoritmo Genético: Combina duas templates existentes para criar um desafio híbrido
    generateCrossoverChallenge(category) {
        const templates = window.aiGenerator.templates[category];
        if (!templates || templates.length < 2) return;

        // Pick two parents
        const parentA = templates[Math.floor(Math.random() * templates.length)];
        const parentB = templates[Math.floor(Math.random() * templates.length)];

        // Crossover
        const child = {
            id: `evo-${category}-${Date.now()}`,
            description: `[EVO-GEN] ${parentA.description.split('.')[0]}. Além disso, ${parentB.description.split('.')[0]}.`,
            vulnerableCode: parentA.vulnerableCode ? parentA.vulnerableCode + "\n// EvoGen Injection\n" + parentB.vulnerableCode : undefined,
            solution: parentA.solution, // Mantemos a solução principal
            exploitType: `hybrid_${parentA.exploitType}_${parentB.exploitType}`
        };

        // Adiciona a nova mutação no banco do aiGenerator
        window.aiGenerator.templates[category].push(child);
        console.log(`[EvoGenEngine] Novo desafio gerado proceduralmente via Algoritmo Genético: ${child.id}`);
        if(window.os) window.os.showNotification(`EvoGen: Sistema evoluiu a categoria ${category.toUpperCase()}`, 'warning');
    }
}

// Inicia o motor global
window.evogen = new EvoGenEngine();
