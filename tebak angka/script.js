// =========================================================
// 1. STATE & DOM ELEMENTS
// =========================================================

let secretNumber = 0;
let attempts = 0;
let isGameOver = false;

// Ambil highscore dari Local Storage, default ke 0
let highscore = parseInt(localStorage.getItem('guessNumberHighscore')) || 0;

// DOM Elements
const $guessInput = document.getElementById('guess-input');
const $guessButton = document.getElementById('guess-button');
const $hintMessage = document.getElementById('hint-message');
const $attemptCount = document.getElementById('attempt-count');
const $highScore = document.getElementById('high-score');
const $restartButton = document.getElementById('restart-button');
const $guessHistory = document.getElementById('guess-history');

// =========================================================
// 2. CORE GAME FUNCTIONS
// =========================================================

/**
 * Memulai atau mereset permainan.
 */
function initGame() {
    // 1. Reset State
    isGameOver = false;
    attempts = 0;
    
    // 2. Generate Angka Misterius (1 sampai 100)
    secretNumber = Math.floor(Math.random() * 100) + 1;
    
    // 3. Reset Tampilan
    $guessHistory.innerHTML = '';
    $guessInput.value = '';
    $hintMessage.textContent = 'Komputer sudah memilih angka baru. Tebak sekarang!';
    $hintMessage.className = 'hint'; // Reset kelas CSS
    $guessInput.disabled = false;
    $guessButton.disabled = false;
    $restartButton.classList.add('hidden');
    
    // 4. Update Scoreboard
    $attemptCount.textContent = attempts;
    $highScore.textContent = highscore === 0 ? '-' : highscore; 

    // console.log("Angka Rahasia: " + secretNumber); // Hapus ini di versi final!
}

/**
 * Logika utama saat pemain menekan tombol 'TEBAK!'.
 */
function checkGuess() {
    if (isGameOver) return;

    const guess = parseInt($guessInput.value);

    // 1. Validasi Input
    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('Tolong masukkan angka yang valid antara 1 hingga 100.');
        $guessInput.value = '';
        return;
    }
    
    attempts++;

    // 2. Tampilkan Riwayat Tebakan
    const listItem = document.createElement('li');
    listItem.textContent = `Anda menebak: ${guess}`;
    $guessHistory.prepend(listItem); // Tambahkan di bagian atas riwayat

    // 3. Bandingkan Tebakan dengan Angka Misterius
    if (guess === secretNumber) {
        // --- MENANG! ---
        $hintMessage.textContent = `🎉 SELAMAT! Anda berhasil menebak angka ${secretNumber} dalam ${attempts} percobaan!`;
        $hintMessage.className = 'hint win';
        
        endGame(true);
        updateHighscore(attempts);

    } else if (guess < secretNumber) {
        // --- Terlalu Kecil ---
        $hintMessage.textContent = `⬆️ Terlalu KECIL! Coba naikkan tebakan Anda.`;
        $hintMessage.className = 'hint low';

    } else {
        // --- Terlalu Besar ---
        $hintMessage.textContent = `⬇️ Terlalu BESAR! Coba turunkan tebakan Anda.`;
        $hintMessage.className = 'hint high';
    }

    // 4. Update Tampilan
    $attemptCount.textContent = attempts;
    $guessInput.value = '';
    $guessInput.focus();
}

/**
 * Mengakhiri permainan dan mengunci input.
 * @param {boolean} win - Apakah pemain menang atau tidak.
 */
function endGame(win) {
    isGameOver = true;
    $guessInput.disabled = true;
    $guessButton.disabled = true;
    $restartButton.classList.remove('hidden');
}

/**
 * Memperbarui highscore jika percobaan saat ini lebih sedikit.
 * @param {number} finalAttempts - Jumlah percobaan yang dibutuhkan.
 */
function updateHighscore(finalAttempts) {
    if (highscore === 0 || finalAttempts < highscore) {
        highscore = finalAttempts;
        localStorage.setItem('guessNumberHighscore', highscore);
        $highScore.textContent = highscore;
    }
}

// =========================================================
// 3. EVENT LISTENERS & INITIALIZATION
// =========================================================

// Event listener untuk tombol 'TEBAK!'
$guessButton.addEventListener('click', checkGuess);

// Event listener untuk tombol 'Enter' pada input
$guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

// Event listener untuk tombol 'MULAI BARU'
$restartButton.addEventListener('click', initGame);

// Panggil fungsi inisialisasi saat halaman dimuat
initGame();