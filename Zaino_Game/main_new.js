



let N_items = 0; // contatore item
// Classe dati dell'oggetto
class ItemData {
    constructor(weight, value) {
        this.weight = weight;
        this.value = value;
        this.id = ++N_items;
    }

    getRatio() {
        return this.value / this.weight;
    }
}

// Classe visuale + stato dell’oggetto
class Item {
    constructor(itemDati, rowIndex, container) {
        this.row = rowIndex;
        this.itemData = itemDati;     
        this.itemElement = this.createElement(container);
        this.inBackpack = false;
    }

    createElement(container) {
        const { value, weight, id } = this.itemData;

        let itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.dataset.value = value;
        itemElement.dataset.weight = weight;
        itemElement.dataset.itemId = id;

        itemElement.style.gridColumn = `1 / span ${weight}`;
        itemElement.style.gridRow = `${this.row + 1}`;
        itemElement.style.display = "grid";
        itemElement.style.gridTemplateColumns = `repeat(${weight}, 1fr)`;
        itemElement.style.gap = "2px";
        itemElement.style.position = "relative";

        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        itemElement.style.backgroundColor = `rgb(${r}, ${g}, 250)`;
        itemElement.dataset.originalColor = itemElement.style.backgroundColor;

        for (let i = 0; i < weight; i++) {
            const cell = document.createElement("div");
            cell.classList.add("item-cell");
            cell.dataset.itemId = id;
            cell.dataset.weight = weight;
            cell.dataset.value = value;

            if (i < value) {
                const coin = document.createElement("div");
                coin.classList.add("coin");
                cell.appendChild(coin);
            }
            itemElement.appendChild(cell);
        }

        container.appendChild(itemElement);
        return itemElement;
    }
}


// Lista di items alternativa
/*
const itemsDati = [
    new ItemData(8, 5),
    new ItemData(5, 3),
    new ItemData(10, 5),
    new ItemData(3, 2),
    new ItemData(7, 4)
];
*/

// Classe Zaino
class Backpack {
    constructor(container, maxWeight) {
        this.container = container;
        this.grid = [];
        this.maxWeight = maxWeight;
        this.currentValue = 0;
        this.currentWeight = 0;
    }

    createGrid() {
        this.container.innerHTML = "";
        this.grid = [];
        for (let i = 0; i < this.maxWeight; i++) {
            const cell = document.createElement("div");
            cell.classList.add("backpack-cell");
            this.container.appendChild(cell);
            this.grid.push(cell);
        }
    }

    clear() {
        this.container.innerHTML = "";
        this.grid = [];
        this.currentValue = 0;
        this.currentWeight = 0;
    }

    createItemPart(itemId, weight, value, originalColor, userContainer) {
        const part = document.createElement("div");
        part.classList.add("item-cell");
        part.dataset.itemId = itemId;
        part.dataset.weight = weight;
        part.dataset.value = value;
        part.style.backgroundColor = originalColor;

        if (value > 0) {
            const coin = document.createElement("div");
            coin.classList.add("coin");
            part.appendChild(coin);
        }

        part.addEventListener("click", () => {
            selectById(itemId, userContainer, this.container); 
        });

        return part;
    }

    insertItem(item, itemContainer) {
        const cells = [...this.container.querySelectorAll(".backpack-cell")];
        const weight = item.itemData.weight;
        const value = item.itemData.value;
        const itemId = item.itemData.id;
        const originalColor = item.itemElement.dataset.originalColor;

        if (this.currentWeight + weight > this.maxWeight) {
            console.warn("Zaino pieno");
            return false;
        }

        let placed = 0;
        let targetCells = [];

        for (let i = 0; i < cells.length && placed < weight; i++) {
            if (cells[i].children.length === 0) {
                targetCells.push(cells[i]);
                placed++;
            }
        }

        if (placed < weight) {
            console.warn("Non c’è spazio sufficiente nello zaino.");
            return false;
        }

        for (let i = 0; i < weight; i++) {
            const part = this.createItemPart(itemId, weight, value - i, originalColor, itemContainer);
            targetCells[i].appendChild(part);
        }

        itemContainer.removeChild(item.itemElement);
        this.currentValue += value;
        this.currentWeight += weight;
        item.inBackpack = true;
        deselectItem(item.itemElement); 
        selectedItem = null;
        return true;
    }

    removeItem(item, itemContainer) {
        const itemId = item.itemData.id;

        const allCells = Array.from(this.container.querySelectorAll(".backpack-cell"));
        const remainingParts = [];

        for (let cell of allCells) {
            const part = cell.firstChild;
            if (part && part.dataset.itemId !== String(itemId)) {
                remainingParts.push(part);
            }
        }

        allCells.forEach(cell => cell.innerHTML = "");
        remainingParts.forEach((part, i) => {
            allCells[i].appendChild(part);
        });

        item.itemElement.style.position = "static";
        itemContainer.appendChild(item.itemElement);

        this.currentValue -= item.itemData.value;
        this.currentWeight -= item.itemData.weight;
        item.inBackpack = false;
    }
}


class Player {
    constructor(name, container, backpackContainer, valueDisplay, weightDisplay, messaggio1) {
        this.name = name;
        this.container = container;                   // contenitore dei suoi item
        this.backpack = backpackContainer;   
        this.valueDisplay = valueDisplay;             
        this.weightDisplay = weightDisplay;           
        this.items = [];                              
        this.finished = false;
        this.messaggio1 = messaggio1;
    }

    updateDisplay() {
        this.valueDisplay.textContent = this.backpack.currentValue;
        this.weightDisplay.textContent = this.backpack.currentWeight;
    }

    findItemById(itemId) {
        return this.items.find(item => item.itemData.id.toString() === itemId.toString());
    }

    handleInsert(gameActive) {
        if (!gameActive || !selectedItem) return;

        this.messaggio1.textContent = " ";

        if (!this.container.contains(selectedItem)) return;

        const weight = parseInt(selectedItem.dataset.weight, 10);
        const itemId = selectedItem.dataset.itemId;
        const newWeight = this.backpack.currentWeight + weight;

        if (newWeight > this.backpack.maxWeight) {
            this.messaggio1.textContent = "Il Peso massimo verrà superato!";
            return;
        }

        const item = this.findItemById(itemId);
        if (!item) {
            console.warn("Item non trovato");
            return;
        }

        const inserted = this.backpack.insertItem(item, this.container);
        if (inserted) {
            this.updateDisplay();
            deselectItem(selectedItem); 
            selectedItem = null;
        }
    }

    handleRemove(gameActive) {
        if (!gameActive || !selectedItem) return;

        this.messaggio1.textContent = " ";

        const itemId = selectedItem.dataset.itemId;
        if (!itemId) return;

        const item = this.findItemById(itemId);
        if (!item || !item.inBackpack) {
            console.warn(`Elemento non trovato o non nello zaino per itemId: ${itemId}`);
            return;
        }

        this.backpack.removeItem(item, this.container);
        this.updateDisplay();
        selectedItem = null;
    }

    reset() {
        this.items = [];
        this.valueDisplay.textContent = "0";
        this.weightDisplay.textContent = "0";
        this.backpack.clear();
        this.finished = false;
    }
}

let selectedAlgorithm = "greedy";

class Algorithm {
    constructor(name, container, backpack, valueDisplay, weightDisplay) {
        this.name = name;
        this.container = container;       // contenitore visivo
        this.backpack = backpack;        
        this.valueDisplay = valueDisplay; 
        this.weightDisplay = weightDisplay; 
        this.items = [];                  // array di Item
        this.sortedItems = [];           // per greedy
        this.finished = false;
    }

    updateDisplay() {
        this.valueDisplay.textContent = this.backpack.currentValue;
        this.weightDisplay.textContent = this.backpack.currentWeight;
    }

    loadItems(items) {
        this.items = [...items];
        this.sortedItems = [...items].sort((a, b) => b.itemData.getRatio() - a.itemData.getRatio());
    }

    setName(name) {
        this.name = name;
    }

    executeGreedy() {
        if (!this.sortedItems.length) return false;

        const bestItem = this.sortedItems[0];
        const { itemData } = bestItem;
        const { value, weight } = itemData;

        const canAdd = this.backpack.currentWeight + weight <= this.backpack.maxWeight;
        if (canAdd) {
            const inserted = this.backpack.insertItem(bestItem, this.container);
            if (inserted) {
                this.updateDisplay();
                this.sortedItems.shift();
                return true;
            }
        }
        return false;
    }

    reset() {
        this.items = [];
        this.sortedItems = [];
        this.valueDisplay.textContent = "0";
        this.weightDisplay.textContent = "0";
        this.backpack.clear();
        this.finished = false;
    }
}



class GameController {
    constructor() {
        this.messaggio1 = document.getElementById("message1");
        this.algoContainer = document.getElementById("algo-items");
        this.userContainer = document.getElementById("user-items");
        this.algoBackpack = new Backpack(document.getElementById("algo-backpack"), maxWeight);
        this.userBackpack = new Backpack(document.getElementById("user-backpack"), maxWeight);
        this.userValueDisplay = document.getElementById("user-value"); 
        this.userWeightDisplay = document.getElementById("user-weight");
        this.algoValueDisplay = document.getElementById("algo-value");
        this.algoWeightDisplay = document.getElementById("algo-weight");
        this.resultsContainer = document.getElementById("game-results");

        this.player = new Player("Utente", this.userContainer, this.userBackpack, this.userValueDisplay, this.userWeightDisplay, this.messaggio1);
        this.algorithm = new Algorithm(selectedAlgorithm, this.algoContainer, this.algoBackpack, this.algoValueDisplay, this.algoWeightDisplay, this.messaggio1);

        this.selectedItem = null;
        this.gameActive = false;
    }

    startGame() {
        if (this.gameActive) return;
        this.gameActive = true;

        algorithmSelect.disabled = true;
        toggleButtons(true);

        this.selectedItem = null;

        this.messaggio1.textContent = "La Partita è iniziata!";
        this.resultsContainer.innerHTML = "";

        this.player.reset();
        this.algorithm.reset();
        this.algoContainer.innerHTML = "";
        this.userContainer.innerHTML = "";

        this.player.backpack.createGrid();
        this.algorithm.backpack.createGrid();

        const itemsDati = this.generateItemsDati(); // oppure usare la lista alternativa che si trova all'inizio
        this.player.items = [];
        this.algorithm.items = [];

        itemsDati.forEach((itemData, index) => {
            const algoItem = new Item(itemData, index, this.algoContainer);
            const userItem = new Item(itemData, index, this.userContainer);

            this.algorithm.items.push(algoItem);
            this.player.items.push(userItem);
        });

        this.algorithm.loadItems(this.algorithm.items);
    }

    generateItemsDati() {
        const numItems = 5;
        const items = [];

        for (let i = 0; i < numItems; i++) {
            const weight = Math.floor(Math.random() * 10) + 1; 
            const value = Math.floor(Math.random() * weight) + 1; 
            const itemData = new ItemData(weight, value);
            items.push(itemData);
        }

        return items;
    }

    endGame() {
        if (!this.gameActive) return;
        this.gameActive = false;
        algorithmSelect.disabled = false;
        this.displayEndgameResults();
    }

    displayEndgameResults() {
        let message = "";
        this.messaggio1.textContent = "La Partita è finita!";

        const userValue = this.player.backpack.currentValue;
        const algoValue = this.algorithm.backpack.currentValue;
        const userWeight = this.player.backpack.currentWeight;
        const algoWeight = this.algorithm.backpack.currentWeight;

        if (userValue > algoValue) {
            message = "Complimenti! Hai vinto la partita con un valore maggiore!";
        } else if (userValue < algoValue) {
            message = "L'algoritmo ha vinto! Ritenta per migliorare la tua strategia.";
        } else {
            if (userWeight < algoWeight) {
                message = "Stesso valore, ma hai usato meno peso. Hai vinto!";
            } else if (userWeight > algoWeight) {
                message = "Stesso valore, ma l'algoritmo ha usato meno peso. Ha vinto!";
            } else {
                message = "Pareggio perfetto!";
            }
        }

        this.resultsContainer.innerHTML = `<h3>${message}</h3>`;
        this.resultsContainer.style.display = "block";
    }

    autoAlgoInsert() {
        let success = false;

        if (this.algorithm.name === "greedy") {
            success = this.algorithm.executeGreedy();
        } else if (this.algorithm.name === "dp") {
            success = this.algorithm.executeDP();
        }

        if (success) {
            setTimeout(() => this.autoAlgoInsert(), 1000);
        } else {
            this.endGame();
        }
    }

    endTurns() {
        if (!this.gameActive) return;
        this.player.finished = true;

        toggleButtons(false);  
        this.autoAlgoInsert();
    }

    algoMove() {
        if (!this.gameActive || this.player.finished) return;

        toggleButtons(false);
        let success = false;

        if (this.algorithm.name === "greedy") {
            success = this.algorithm.executeGreedy();
        } else if (this.algorithm.name === "dp") {
            success = this.algorithm.executeDP();
        }

        if (!success) {
            this.messaggio1.textContent = "L'algoritmo ha finito di inserire!";
            this.algorithm.finished = true;
        }

        toggleButtons(true);
    }

    setAlgorithm(name) {
        this.algorithm.setName(name);
    }

}



// Selezione e deselezione
function selectItem(element) {
    if (!element) return; 
    if (!element.dataset.originalColor) {
        element.dataset.originalColor = element.style.backgroundColor;
    }
    element.style.backgroundColor = "lightgreen";
    element.classList.add("selected");
}

function deselectItem(element) {
    if (!element) return; 
    if (element.dataset.originalColor) {
        element.style.backgroundColor = element.dataset.originalColor;
    }
    element.classList.remove("selected");
}

function deselectAll(userContainer, backpackContainer) {
    const allItems = userContainer.querySelectorAll(".item.selected");
    const allCells = backpackContainer.querySelectorAll(".item-cell.selected");
    [...allItems, ...allCells].forEach(deselectItem);
    selectedItem = null;
}

function selectById(itemId, userContainer, backpackContainer) {
    deselectAll(userContainer, backpackContainer);
    const itemData = controller.player.findItemById(itemId); 

    if (!itemData) {
        console.warn(`Elemento ${itemId} non trovato`);
        return;
    }

    const itemElement = itemData.element;
    if (userContainer.contains(itemElement)) {
        selectItem(itemElement);
        selectedItem = itemElement;
    } else {
        const cells = backpackContainer.querySelectorAll(`.item-cell[data-item-id="${itemId}"]`);
        if (cells.length > 0) {
            cells.forEach(selectItem);
            selectedItem = cells[0];
        }
    }
}

// Bottone inserimento/rimozione
function toggleButtons(enabled) {
    insertBtn.disabled = !enabled;
    removeBtn.disabled = !enabled;
}

// **************** Variabili globali **********************
let maxWeight = 20;
let controller = new GameController();
let selectedItem = null; 

let insertBtn, removeBtn, algorithmSelect;

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-game");
    const endButton = document.getElementById("endGame");
    const endWork = document.getElementById("end-work");
    insertBtn = document.getElementById("insert-item");
    removeBtn = document.getElementById("remove-item");
    algorithmSelect = document.getElementById("algorithmSelect");

    startButton.addEventListener("click", () => controller.startGame());
    endButton.addEventListener("click", () => controller.endGame());
    endWork.addEventListener("click", () => controller.endTurns());

    insertBtn.addEventListener("click", () => {
        controller.player.handleInsert(controller.gameActive);
        if (!controller.player.finished && !controller.algorithm.finished) {
            setTimeout(() => controller.algoMove(), 1000);
        }
    });

    removeBtn.addEventListener("click", () => {
        controller.player.handleRemove(controller.gameActive);
        if (!controller.player.finished && !controller.algorithm.finished) {
            setTimeout(() => controller.algoMove(), 1000);
        }
    });

    algorithmSelect.addEventListener("change", () => {
        const selectedValue = algorithmSelect.value;
        controller.setAlgorithm(selectedValue);  
    });

    // Click su un item nel contenitore utente
    controller.userContainer.addEventListener("click", (e) => {
        const target = e.target.closest(".item");
        if (!target || !controller.gameActive) return;

        const itemId = target.dataset.itemId;
        if (selectedItem?.dataset.itemId === itemId) {
            deselectAll(controller.userContainer, controller.userBackpack.container);
        } else {
            deselectAll(controller.userContainer, controller.userBackpack.container);
            selectItem(target);
            selectedItem = target;
        }
    });

    // Click su un item nello zaino utente
    controller.userBackpack.container.addEventListener("click", (e) => {
        const target = e.target.closest(".item-cell");
        if (!target || !controller.gameActive) return;

        const itemId = target.dataset.itemId;
        const itemData = controller.player.findItemById(itemId);
        if (!itemData) {
            console.warn(`Elemento con itemId ${itemId} non trovato`);
            return;
        }

        const cells = controller.userBackpack.container.querySelectorAll(`.item-cell[data-item-id="${itemId}"]`);
        const isAlreadySelected = [...cells].every(cell => cell.classList.contains("selected"));

        if (isAlreadySelected) {
            return;
        }

        deselectAll(controller.userContainer, controller.userBackpack.container);
        cells.forEach(selectItem);
        selectedItem = cells[0];
    });
});
