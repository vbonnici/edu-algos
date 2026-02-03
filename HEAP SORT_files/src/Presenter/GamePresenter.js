import Heap from '../Model/Heap.js';
import ComputerAI from '../Model/ComputerAI.js';
import Renderer from '../View/Renderer.js';

export default class GamePresenter {
    constructor() {
        this.playerHeap = new Heap();
        this.computerHeap = new Heap();
        this.ai = new ComputerAI(this.computerHeap);
        
        this.playerRenderer = new Renderer('player-heap-container', 'player-sorted-list');
        this.computerRenderer = new Renderer('computer-heap-container', 'computer-sorted-list');
        
        this.playerMoves = 0;
        this.computerMoves = 0;
        this.isPlaying = false;
        this.selectedIndices = [];
        this.isComputerTurn = false;
        
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('modal-close-btn').addEventListener('click', () => {
            document.getElementById('modal-overlay').classList.add('hidden');
            this.reset();
        });
        
        document.getElementById('player-heap-container').addEventListener('click', (e) => {
            if (!this.isPlaying || this.isComputerTurn) return;
            
            if (e.target.classList.contains('node')) {
                const index = parseInt(e.target.dataset.index);
                this.handlePlayerClick(index);
            }
        });
    }

    start() {
        const type = document.getElementById('heap-type').value;
        this.playerHeap = new Heap(type);
        this.computerHeap = new Heap(type);
        
        this.playerHeap.initRandom(15);
        this.computerHeap.setNodes(this.playerHeap.getValues());
        this.ai = new ComputerAI(this.computerHeap);
        
        this.isPlaying = true;
        this.playerMoves = 0;
        this.computerMoves = 0;
        this.selectedIndices = [];
        this.isComputerTurn = false;
        
        this.updateUI();
        
        document.getElementById('start-btn').disabled = true;
        document.getElementById('reset-btn').disabled = false;
        document.getElementById('heap-type').disabled = true;
        document.getElementById('game-status').textContent = "Your Turn!";
        
        this.checkAutoExtraction();
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('reset-btn').disabled = true;
        document.getElementById('heap-type').disabled = false;
        document.getElementById('player-heap-container').innerHTML = '';
        document.getElementById('computer-heap-container').innerHTML = '';
        document.getElementById('player-sorted-list').innerHTML = '';
        document.getElementById('computer-sorted-list').innerHTML = '';
        document.getElementById('player-moves').textContent = '0';
        document.getElementById('computer-moves').textContent = '0';
        document.getElementById('game-status').textContent = "Select settings and start!";
    }

    checkAutoExtraction() {
        if (!this.isPlaying || this.isComputerTurn) return;

        if (this.playerHeap.isRootValid()) {
            // Disable interaction during auto-move
            this.isComputerTurn = true; 
            
            setTimeout(() => {
                this.playerHeap.extractRoot();
                this.playerMoves++;
                this.updateUI();
                this.checkWinCondition();
                
                if (this.isPlaying) {
                    // Pass to computer
                    document.getElementById('game-status').textContent = "Computer's Turn...";
                    setTimeout(() => this.computerTurn(), 800);
                }
            }, 800); // Delay to let user see the green root
        }
    }

    handlePlayerClick(index) {
        // Selection logic
        const existingIdx = this.selectedIndices.indexOf(index);
        
        if (existingIdx !== -1) {
            // Deselect
            this.selectedIndices.splice(existingIdx, 1);
        } else {
            if (this.selectedIndices.length < 2) {
                this.selectedIndices.push(index);
            }
        }
        
        this.updateUI();
        
        if (this.selectedIndices.length === 2) {
            const idx1 = this.selectedIndices[0];
            const idx2 = this.selectedIndices[1];
            
            // Validation Logic: Only Parent-Child allowed
            const isParentChild = (this.playerHeap.parent(idx1) === idx2) || 
                                  (this.playerHeap.parent(idx2) === idx1);
            
            if (isParentChild) {
                // Standard Heapify Swap
                setTimeout(() => {
                    this.playerHeap.swap(idx1, idx2);
                    this.playerMoves++;
                    this.selectedIndices = [];
                    this.updateUI();
                    
                    // Check if this swap made the root valid
                    if (this.playerHeap.isRootValid()) {
                        this.checkAutoExtraction();
                    } else {
                        this.endTurn();
                    }
                }, 300);
            } else {
                alert("Invalid Move! You can only swap a node with its parent.");
                this.selectedIndices = [];
                this.updateUI();
            }
        }
    }
    
    endTurn() {
        this.updateUI();
        this.checkWinCondition();
        if (this.isPlaying) {
            this.isComputerTurn = true;
            document.getElementById('game-status').textContent = "Computer's Turn...";
            setTimeout(() => this.computerTurn(), 800);
        }
    }
    
    computerTurn() {
        if (!this.isPlaying) return;
        
        // 1. Check if we can extract immediately (e.g. from start of turn)
        if (this.computerHeap.isRootValid()) {
             setTimeout(() => this.executeComputerExtraction(), 800);
             return;
        }
        
        // 2. Otherwise, make a move (Swap)
        // Note: ai.makeMove checks isRootValid too, but we handled it above.
        // So this will proceed to find a swap.
        const action = this.ai.makeMove();
        if (action !== 'wait' && action !== 'done') {
            this.computerMoves++;
        }
        
        this.updateUI();
        
        // 3. Check if this swap made the root valid (Chained Move)
        if (this.computerHeap.isRootValid()) {
             setTimeout(() => this.executeComputerExtraction(), 800);
        } else {
             // End turn
             this.checkWinCondition();
             if (this.isPlaying) {
                 this.isComputerTurn = false;
                 document.getElementById('game-status').textContent = "Your Turn!";
                 this.checkAutoExtraction();
             }
        }
    }
    
    executeComputerExtraction() {
        if (!this.isPlaying) return;
        
        this.computerHeap.extractRoot();
        this.computerMoves++;
        this.updateUI();
        this.checkWinCondition();
        
        if (this.isPlaying) {
             this.isComputerTurn = false;
             document.getElementById('game-status').textContent = "Your Turn!";
             this.checkAutoExtraction();
        }
    }

    checkWinCondition() {
        const playerDone = this.playerHeap.nodes.length === 0;
        const computerDone = this.computerHeap.nodes.length === 0;
        
        if (playerDone || computerDone) {
            this.isPlaying = false;
            let msg = '';
            let title = '';
            
            if (playerDone && !computerDone) {
                title = "You Win!";
                msg = `You finished first! (${this.playerMoves} moves)`;
            } else if (computerDone && !playerDone) {
                title = "Computer Wins!";
                msg = `Computer finished first! (${this.computerMoves} moves)`;
            } else {
                // Tie (both finished same turn)
                if (this.playerMoves < this.computerMoves) {
                    title = "You Win!";
                    msg = `You finished with fewer moves! (${this.playerMoves} vs ${this.computerMoves})`;
                } else if (this.computerMoves < this.playerMoves) {
                    title = "Computer Wins!";
                    msg = `Computer finished with fewer moves! (${this.computerMoves} vs ${this.playerMoves})`;
                } else {
                    title = "It's a Tie!";
                    msg = `Both finished with ${this.playerMoves} moves!`;
                }
            }
            this.showModal(title, msg);
        }
    }

    showModal(title, message) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('modal-overlay').classList.remove('hidden');
        
        if (title.includes("You Win")) {
            this.triggerVictory();
        }
    }
    
    triggerVictory() {
        // Simple confetti effect using CSS/JS
        const count = 100;
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    updateUI() {
        this.playerRenderer.render(this.playerHeap, this.selectedIndices);
        this.computerRenderer.render(this.computerHeap);
        document.getElementById('player-moves').textContent = this.playerMoves;
        document.getElementById('computer-moves').textContent = this.computerMoves;
    }
}
