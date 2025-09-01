/**
 * Game State Manager untuk MIND LAB: Echoes of Thought
 * Menangani penyimpanan, pemuatan, dan manajemen status game
 */

class GameStateManager {
    constructor() {
        // State default
        this.currentLevel = 'level-1';
        this.completedLevels = [];
        this.playerProfile = {
            logicIQ: 50,
            creativityIQ: 50,
            empathyIQ: 50,
            metacognitionIQ: 50,
            resilienceIQ: 50,
            playStyle: 'balanced' // balanced, analytical, emotional, creative
        };
        this.choices = {}; // Menyimpan semua pilihan pemain di setiap level
        this.timestamps = {
            firstPlay: new Date().toISOString(),
            lastPlay: new Date().toISOString()
        };
        
        // Event listeners untuk update UI
        this.onStateChange = null;
    }

    /**
     * Menyimpan state game ke localStorage
     */
    saveGame() {
        try {
            const gameData = {
                version: '1.0',
                currentLevel: this.currentLevel,
                completedLevels: this.completedLevels,
                playerProfile: this.playerProfile,
                choices: this.choices,
                timestamps: {
                    firstPlay: this.timestamps.firstPlay,
                    lastPlay: new Date().toISOString()
                }
            };
            
            localStorage.setItem('mindLab_saveData', JSON.stringify(gameData));
            console.log('Game progress saved!');
            
            // Panggil callback jika ada
            if (this.onStateChange && typeof this.onStateChange === 'function') {
                this.onStateChange('save', gameData);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    /**
     * Memuat state game dari localStorage
     */
    loadGame() {
        try {
            const savedData = localStorage.getItem('mindLab_saveData');
            if (savedData) {
                const gameData = JSON.parse(savedData);
                
                // Validasi data yang dimuat
                if (gameData.version === '1.0') {
                    this.currentLevel = gameData.currentLevel || 'level-1';
                    this.completedLevels = gameData.completedLevels || [];
                    this.playerProfile = gameData.playerProfile || {
                        logicIQ: 50,
                        creativityIQ: 50,
                        empathyIQ: 50,
                        metacognitionIQ: 50,
                        resilienceIQ: 50,
                        playStyle: 'balanced'
                    };
                    this.choices = gameData.choices || {};
                    this.timestamps = gameData.timestamps || {
                        firstPlay: new Date().toISOString(),
                        lastPlay: new Date().toISOString()
                    };
                    
                    console.log('Game progress loaded!');
                    
                    // Panggil callback jika ada
                    if (this.onStateChange && typeof this.onStateChange === 'function') {
                        this.onStateChange('load', gameData);
                    }
                    
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error loading game:', error);
            return false;
        }
    }

    /**
     * Reset game ke state awal
     */
    resetGame() {
        this.currentLevel = 'level-1';
        this.completedLevels = [];
        this.playerProfile = {
            logicIQ: 50,
            creativityIQ: 50,
            empathyIQ: 50,
            metacognitionIQ: 50,
            resilienceIQ: 50,
            playStyle: 'balanced'
        };
        this.choices = {};
        this.timestamps = {
            firstPlay: new Date().toISOString(),
            lastPlay: new Date().toISOString()
        };
        
        localStorage.removeItem('mindLab_saveData');
        console.log('Game reset to initial state!');
        
        // Panggil callback jika ada
        if (this.onStateChange && typeof this.onStateChange === 'function') {
            this.onStateChange('reset');
        }
    }

    /**
     * Update skor IQ pemain berdasarkan kategori
     * @param {string} category - Kategori IQ (logicIQ, creativityIQ, etc)
     * @param {number} points - Poin yang akan ditambahkan (bisa negatif)
     */
    updateIQScore(category, points) {
        if (this.playerProfile.hasOwnProperty(category)) {
            // Batasi nilai antara 0-100
            this.playerProfile[category] = Math.max(0, Math.min(100, this.playerProfile[category] + points));
            
            // Update playStyle berdasarkan dominasi IQ
            this.updatePlayStyle();
            
            this.saveGame();
            return true;
        }
        return false;
    }

    /**
     * Update gaya bermain berdasarkan profil IQ
     */
    updatePlayStyle() {
        const { logicIQ, creativityIQ, empathyIQ } = this.playerProfile;
        
        if (logicIQ > creativityIQ && logicIQ > empathyIQ) {
            this.playerProfile.playStyle = 'analytical';
        } else if (creativityIQ > logicIQ && creativityIQ > empathyIQ) {
            this.playerProfile.playStyle = 'creative';
        } else if (empathyIQ > logicIQ && empathyIQ > creativityIQ) {
            this.playerProfile.playStyle = 'emotional';
        } else {
            this.playerProfile.playStyle = 'balanced';
        }
    }

    /**
     * Mencatat pilihan pemain di level tertentu
     * @param {string} levelId - ID level
     * @param {string} choiceId - ID pilihan
     * @param {any} choiceData - Data pilihan
     */
    recordChoice(levelId, choiceId, choiceData) {
        if (!this.choices[levelId]) {
            this.choices[levelId] = {};
        }
        this.choices[levelId][choiceId] = choiceData;
        this.saveGame();
    }

    /**
     * Mendapatkan pilihan yang pernah dibuat di level tertentu
     * @param {string} levelId - ID level
     * @param {string} choiceId - ID pilihan (opsional)
     */
    getChoice(levelId, choiceId = null) {
        if (!this.choices[levelId]) return null;
        if (choiceId) return this.choices[levelId][choiceId] || null;
        return this.choices[levelId];
    }

    /**
     * Menandai level selesai dan beralih ke level berikutnya
     * @param {string} levelId - ID level yang diselesaikan
     */
    completeLevel(levelId) {
        if (!this.completedLevels.includes(levelId)) {
            this.completedLevels.push(levelId);
            this.currentLevel = this.getNextLevel(levelId);
            this.saveGame();
        }
    }

    /**
     * Menentukan level selanjutnya berdasarkan level saat ini
     * @param {string} currentLevelId - ID level saat ini
     */
    getNextLevel(currentLevelId) {
        const levelOrder = ['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6', 'level-7'];
        const currentIndex = levelOrder.indexOf(currentLevelId);
        
        if (currentIndex === -1 || currentIndex >= levelOrder.length - 1) {
            return 'end'; // Kembali ke akhir game atau menu
        }
        
        return levelOrder[currentIndex + 1];
    }

    /**
     * Mendapatkan progres game dalam persentase
     */
    getProgressPercentage() {
        const totalLevels = 7; // 7 level utama
        return Math.round((this.completedLevels.length / totalLevels) * 100);
    }

    /**
     * Mengekspor data game (untuk backup atau analisis)
     */
    exportData() {
        return {
            version: '1.0',
            currentLevel: this.currentLevel,
            completedLevels: this.completedLevels,
            playerProfile: this.playerProfile,
            choices: this.choices,
            timestamps: this.timestamps,
            progress: this.getProgressPercentage() + '%'
        };
    }
}

// Buat instance global yang bisa diakses di mana saja
window.gameState = new GameStateManager();

// Auto-load game state saat script dimuat
document.addEventListener('DOMContentLoaded', function() {
    window.gameState.loadGame();
});
