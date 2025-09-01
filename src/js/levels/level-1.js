// Level 1: The Silent Cortex
document.addEventListener('DOMContentLoaded', function() {
    // Konfigurasi level
    const levelId = 'level-1';
    const correctSequence = ['sound-B', 'sound-D', 'sound-A', 'sound-C'];
    let playerSequence = [];
    let isPlayingExample = false;

    // Elemen DOM
    const nodes = document.querySelectorAll('.node');
    const sequenceOutput = document.getElementById('sequence-output');
    const playSequenceBtn = document.getElementById('play-sequence');
    const checkSolutionBtn = document.getElementById('check-solution');
    const resetSequenceBtn = document.getElementById('reset-sequence');
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackMessage = document.getElementById('feedback-message');
    const continueBtn = document.getElementById('continue-btn');

    // Inisialisasi level
    function initLevel() {
        // Load progres sebelumnya jika ada
        const savedProgress = window.gameState.getChoice(levelId, 'sequenceProgress');
        if (savedProgress) {
            playerSequence = savedProgress;
            updateSequenceDisplay();
        }
        
        // Setup event listeners
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Klik pada node suara
        nodes.forEach(node => {
            node.addEventListener('click', function() {
                if (isPlayingExample) return;
                
                const sound = this.dataset.sound;
                playSound(sound);
                addToSequence(sound);
                this.classList.add('active');
                
                setTimeout(() => {
                    this.classList.remove('active');
                }, 300);
            });
        });

        // Tombol putar urutan contoh
        playSequenceBtn.addEventListener('click', playExampleSequence);

        // Tombol periksa solusi
        checkSolutionBtn.addEventListener('click', checkSolution);

        // Tombol reset
        resetSequenceBtn.addEventListener('click', resetSequence);

        // Tombol lanjutkan
        continueBtn.addEventListener('click', proceedToNext);
    }

    // Memainkan contoh urutan
    function playExampleSequence() {
        if (isPlayingExample) return;
        
        isPlayingExample = true;
        disableControls(true);
        
        // Memainkan urutan dengan delay
        correctSequence.forEach((sound, index) => {
            setTimeout(() => {
                const node = document.querySelector(`[data-sound="${sound}"]`);
                playSound(sound);
                node.classList.add('active');
                
                setTimeout(() => {
                    node.classList.remove('active');
                }, 500);
                
                // Di akhir urutan
                if (index === correctSequence.length - 1) {
                    setTimeout(() => {
                        isPlayingExample = false;
                        disableControls(false);
                    }, 1000);
                }
            }, index * 800);
        });
    }

    // Menambahkan suara ke urutan pemain
    function addToSequence(sound) {
        playerSequence.push(sound);
        updateSequenceDisplay();
        window.gameState.recordChoice(levelId, 'sequenceProgress', playerSequence);
        
        // Enable tombol periksa jika urutan sudah lengkap
        if (playerSequence.length === correctSequence.length) {
            checkSolutionBtn.disabled = false;
        }
    }

    // Memperbarui tampilan urutan
    function updateSequenceDisplay() {
        sequenceOutput.innerHTML = '';
        
        playerSequence.forEach(sound => {
            const span = document.createElement('span');
            span.className = 'sequence-item';
            span.textContent = sound.replace('sound-', 'S');
            sequenceOutput.appendChild(span);
        });
    }

    // Memeriksa solusi
    function checkSolution() {
        const isCorrect = arraysEqual(playerSequence, correctSequence);
        
        if (isCorrect) {
            // Berhasil
            feedbackMessage.textContent = "Sukses! Anda berhasil mengidentifikasi pola suara yang tersembunyi. Pikiran mulai terbuka dan terhubung kembali.";
            window.gameState.updateIQScore('logicIQ', 15);
            window.gameState.updateIQScore('resilienceIQ', 10);
            window.gameState.completeLevel(levelId);
        } else {
            // Gagal
            feedbackMessage.textContent = "Pola belum tepat. Dengarkan lagi urutan contoh dan coba identifikasi pola yang benar.";
            window.gameState.updateIQScore('resilienceIQ', 5); // Hadiah ketekunan
        }
        
        // Tampilkan feedback
        feedbackModal.classList.remove('hidden');
    }

    // Reset urutan
    function resetSequence() {
        playerSequence = [];
        updateSequenceDisplay();
        checkSolutionBtn.disabled = true;
        window.gameState.recordChoice(levelId, 'sequenceProgress', playerSequence);
    }

    // Melanjutkan ke berikutnya
    function proceedToNext() {
        feedbackModal.classList.add('hidden');
        
        if (arraysEqual(playerSequence, correctSequence)) {
            // Jika berhasil, arahkan ke level berikutnya
            const nextLevel = window.gameState.getNextLevel(levelId);
            window.router.navigate('/' + nextLevel);
        }
    }

    // Memainkan efek suara (simulasi)
    function playSound(sound) {
        // Ini akan diganti dengan Web Audio API atau library suara
        console.log("Memainkan suara:", sound);
        // Untuk simulasi, kita akan menggunakan frekuensi berbeda
        const frequencies = {
            'sound-A': 440,
            'sound-B': 523.25,
            'sound-C': 659.25,
            'sound-D': 783.99
        };
        
        // Simulasi sederhana dengan Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequencies[sound], audioContext.currentTime);
            oscillator.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log("Browser tidak mendukung Web Audio API");
        }
    }

    // Menonaktifkan/mengaktifkan kontrol
    function disableControls(disabled) {
        nodes.forEach(node => {
            node.style.pointerEvents = disabled ? 'none' : 'auto';
            node.style.opacity = disabled ? 0.5 : 1;
        });
        
        playSequenceBtn.disabled = disabled;
    }

    // Membandingkan dua array
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Inisialisasi level
    initLevel();
});
