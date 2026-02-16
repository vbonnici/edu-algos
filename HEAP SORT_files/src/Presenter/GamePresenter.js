import Heap from '../Model/Heap.js';
import MinHeapStrategy from '../Model/MinHeapStrategy.js';
import MaxHeapStrategy from '../Model/MaxHeapStrategy.js';
import Computer from '../Model/Computer.js';
import Renderer from '../View/Renderer.js';

export default class GamePresenter {
    constructor() {
        this.playerHeap = new Heap(new MinHeapStrategy());
        this.computerHeap = new Heap(new MinHeapStrategy());
        this.ai = new Computer(this.computerHeap);
        
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
        const strategy = type === 'max' ? new MaxHeapStrategy() : new MinHeapStrategy();
        
        // Read depth and calculate node count
        let depth = parseInt(document.getElementById('tree-depth').value);
        if (isNaN(depth) || depth < 1) depth = 1;
        if (depth > 4) depth = 4;
        
        // User definition: Depth 1 = 3 nodes, Depth 2 = 7 nodes, etc.
        // Formula: 2^(depth + 1) - 1
        const nodeCount = Math.pow(2, depth + 1) - 1;

        this.playerHeap = new Heap(strategy);
        this.computerHeap = new Heap(strategy);
        
        this.playerHeap.initRandom(nodeCount);
        this.computerHeap.setNodes(this.playerHeap.getValues());
        this.ai = new Computer(this.computerHeap);
        
        this.isPlaying = true;
        this.playerMoves = 0;
        this.computerMoves = 0;
        this.selectedIndices = [];
        this.isComputerTurn = false;
        
        this.updateUI();
        
        document.getElementById('start-btn').disabled = true;
        document.getElementById('reset-btn').disabled = false;
        document.getElementById('heap-type').disabled = true;
        document.getElementById('tree-depth').disabled = true; // Disable depth input
        document.getElementById('game-status').textContent = "Tocca a te!";
        
        this.checkAutoExtraction();
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('reset-btn').disabled = true;
        document.getElementById('heap-type').disabled = false;
        document.getElementById('tree-depth').disabled = false; // Enable depth input
        document.getElementById('player-heap-container').innerHTML = '';
        document.getElementById('computer-heap-container').innerHTML = '';
        document.getElementById('player-sorted-list').innerHTML = '';
        document.getElementById('computer-sorted-list').innerHTML = '';
        document.getElementById('player-moves').textContent = '0';
        document.getElementById('computer-moves').textContent = '0';
        document.getElementById('game-status').textContent = "Seleziona le impostazioni e inizia!";
    }

    checkAutoExtraction() {
        if (!this.isPlaying || this.isComputerTurn) return;

        if (this.playerHeap.isRootValid()) {
            // Disable interaction during auto-move
            this.isComputerTurn = true; 
            this.updateActiveTurnVisuals(); // Immediate visual feedback
            
            setTimeout(() => {
                this.playerHeap.extractRoot();
                this.playerMoves++;
                this.updateUI();
                this.checkWinCondition();
                
                if (this.isPlaying) {
                    // Pass to computer
                    document.getElementById('game-status').textContent = "Turno del Computer...";
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
                alert("Mossa non valida! Puoi scambiare un nodo solo con suo padre.");
                this.selectedIndices = [];
                this.updateUI();
            }
        }
    }
    
    endTurn() {
        this.checkWinCondition();
        if (this.isPlaying) {
            this.isComputerTurn = true;
            this.updateActiveTurnVisuals(); // Update visuals immediately after state change
            document.getElementById('game-status').textContent = "Turno del Computer...";
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
                 document.getElementById('game-status').textContent = "Tocca a te!";
                 this.updateActiveTurnVisuals();
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
             document.getElementById('game-status').textContent = "Tocca a te!";
             this.updateActiveTurnVisuals();
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
                title = "Hai Vinto!";
                msg = `Hai finito prima! (${this.playerMoves} mosse)`;
            } else if (computerDone && !playerDone) {
                title = "Ha Vinto il Computer!";
                msg = `Il Computer ha finito prima! (${this.computerMoves} mosse)`;
            } else {
                // Tie (both finished same turn)
                if (this.playerMoves < this.computerMoves) {
                    title = "Hai Vinto!";
                    msg = `Hai finito con meno mosse! (${this.playerMoves} vs ${this.computerMoves})`;
                } else if (this.computerMoves < this.playerMoves) {
                    title = "Ha Vinto il Computer!";
                    msg = `Il Computer ha finito con meno mosse! (${this.computerMoves} vs ${this.playerMoves})`;
                } else {
                    title = "Pareggio!";
                    msg = `Entrambi hanno finito con ${this.playerMoves} mosse!`;
                }
            }
            this.showModal(title, msg);
        }
    }

    showModal(title, message) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('modal-overlay').classList.remove('hidden');
        
        if (title.includes("Hai Vinto")) {
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
        this.updateActiveTurnVisuals();
    }

    updateActiveTurnVisuals() {
        const playerZone = document.querySelector('.player-zone');
        const computerZone = document.querySelector('.computer-zone');
        
        if (this.isPlaying) {
            if (this.isComputerTurn) {
                computerZone.classList.add('active-turn');
                playerZone.classList.remove('active-turn');
            } else {
                playerZone.classList.add('active-turn');
                computerZone.classList.remove('active-turn');
            }
        } else {
            // Reset if not playing
            playerZone.classList.remove('active-turn');
            computerZone.classList.remove('active-turn');
        }
    }
}
