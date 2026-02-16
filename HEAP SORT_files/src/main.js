import GamePresenter from './Presenter/GamePresenter.js';

window.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const instructionsModal = document.getElementById('instructions-modal');
    const startGameBtn = document.getElementById('start-game-btn');

    // Show instructions on load
    if (instructionsModal) {
        instructionsModal.classList.remove('hidden');
    }

    // Info Button to reopen instructions
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            if (instructionsModal) {
                instructionsModal.classList.remove('hidden');
            }
        });
    }

    // Handle Start Game from Modal
    // Navigation Elements
    const step1 = document.getElementById('instruction-step-1');
    const step2 = document.getElementById('instruction-step-2');
    const nextBtn = document.getElementById('next-step-btn');
    const prevBtn = document.getElementById('prev-step-btn');

    // Navigation Logic
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }

    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            if (instructionsModal) {
                instructionsModal.classList.add('hidden');
                // Reset to step 1 for next time
                setTimeout(() => {
                    step1.classList.remove('hidden');
                    step2.classList.add('hidden');
                }, 300);
            }
        });
    }

    // Modal close button (Victory/Info)
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('modal-overlay').classList.add('hidden');
    });

    // Home Button Logic
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    const game = new GamePresenter();
});
