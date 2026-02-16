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
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            if (instructionsModal) {
                instructionsModal.classList.add('hidden');
            }
            // Optional: Start the game logic here if it wasn't already running in background
            // For now, the game is initialized but waiting for user input, so just closing modal is enough.
        });
    }

    // Modal close button (Victory/Info)
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('modal-overlay').classList.add('hidden');
    });

    const game = new GamePresenter();
});
