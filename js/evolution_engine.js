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
        if (!window.procAI) return;
        
        const stats = this.playerProfile.categoryStats[category] || {wins: 0, losses: 0};
        const total = stats.wins + stats.losses;
        if (total < 3) return; 

        const winRate = stats.wins / total;
        
        const prediction = this.neuralNet.predict([winRate, 0.5, 0.5]);
        const shouldMutate = prediction[0] > 0.6; 
        const increaseDifficulty = prediction[1] > 0.5;

        if (winRate > 0.7 && window.procAI.categories[category]) {
            const currentWeight = window.procAI.categories[category].weight;
            window.procAI.categories[category].weight = Math.min(currentWeight + 2, 50); 
            console.log(`[EvoGenEngine] Evolução: Categoria ${category} fácil demais. Peso: ${window.procAI.categories[category].weight}`);
            this.generateCrossoverChallenge(category);
        }
        
        this.neuralNet.train([winRate, 0.5, 0.5], [winRate > 0.7 ? 1 : 0, winRate > 0.8 ? 1 : 0]);
    }

    generateCrossoverChallenge(category) {
        const templates = window.procAI.templates[category];
        if (!templates || templates.length < 2) return;

        const parentA = templates[Math.floor(Math.random() * templates.length)];
        const parentB = templates[Math.floor(Math.random() * templates.length)];

        const child = {
            id: `evo-${category}-${Date.now()}`,
            description: `[EVO-GEN] ${parentA.description.split('.')[0]}. Além disso, ${parentB.description.split('.')[0]}.`,
            vulnerableCode: parentA.vulnerableCode ? parentA.vulnerableCode + "\n// EvoGen Injection\n" + parentB.vulnerableCode : undefined,
            solution: parentA.solution,
            exploitType: `hybrid_${parentA.exploitType}_${parentB.exploitType}`
        };

        window.procAI.templates[category].push(child);
        console.log(`[EvoGenEngine] Novo desafio gerado via Algoritmo Genético: ${child.id}`);
        if(window.os) window.os.showNotification(`EvoGen: Sistema evoluiu a categoria ${category.toUpperCase()}`, 'warning');
    }
}

window.evogen = new EvoGenEngine();
