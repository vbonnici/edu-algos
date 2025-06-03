

let messaggio1 = document.getElementById("message1"); // Area per messaggi di stato
let algoContainer = document.getElementById("algo-items"); // Contenitore per gli oggetti dell'algoritmo
let userContainer = document.getElementById("user-items"); // Contenitore per gli oggetti dell'utente
let algobackpack = document.getElementById("algo-backpack"); // Contenitore dello zaino dell'algoritmo
let userbackpack = document.getElementById("user-backpack"); // Contenitore dello zaino dell'utente

let userValue  = document.getElementById("user-value")  ;
let userWeight = document.getElementById("user-weight") ;
let algoValue  = document.getElementById("algo-value")  ;
let algoWeight = document.getElementById("algo-weight") ;
let maxWeight  = document.getElementById("max-weight")  ;
let resultsContainer = document.getElementById("game-results");

let N_items = 0 ; //contatore item
// funzione per incrementare id
function makeId () {
    N_items += 1;
    return N_items;
}

// Classe per rappresentare un oggetto "Item" (valore e peso)
class Item {
    constructor(value, weight) {
        this.value = value;
        this.weight = weight;
        this.id = makeId ()
    }
}

// Lista di oggetti iniziali
const items = [
    new Item(5, 10),
    new Item(5, 8),
    new Item(3, 5),
    new Item(2, 3),
    new Item(4, 7)
];

let algoItems = []; 
let algoItemsSorted = [];
let userItems = []; 

let selectedAlgorithm = "greedy"; // default
let selectedItem = null; // Oggetto selezionato dal giocatore
let gameActive = false; // per verificare lo stato della partita
let userHasFinished = false; // per sapere se l’utente ha già terminato il suo turno
let algoHasFinished = false;// per sapere se l’algoritmo ha già terminato il suo turno

function createItem(itemDati, container, existingItems, rowIndex) {
    const { value, weight, id } = itemDati;

    // Crea il div item
    let item = document.createElement("div");
    item.classList.add("item");
    item.dataset.value = value;
    item.dataset.weight = weight;
    item.dataset.itemId = id;

    // Posiziona l'item in base alla riga e alla larghezza in celle
    item.style.gridColumn = `1 / span ${weight}`;
    item.style.gridRow = `${rowIndex + 1}`; 
    item.style.display = "grid";
    item.style.gridTemplateColumns = `repeat(${weight}, 1fr)`;
    item.style.gap = "2px";
    item.style.position = "relative";

    // Colore dinamico in base a weight + value (limitato a 255)
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    item.style.backgroundColor = `rgb(${r}, ${g}, 250)`;
    item.dataset.originalColor = item.style.backgroundColor;

    // Aggiunge i coin (fino al valore specificato)
    for (let i = 0; i < weight; i++) {
        const cell = document.createElement("div");
        cell.classList.add("item-cell");
        cell.dataset.itemId = item.dataset.itemId;
        cell.dataset.weight = item.dataset.weight;
        cell.dataset.value = item.dataset.value;

        if (i < value) {
            const coin = document.createElement("div");
            coin.classList.add("coin");
            cell.appendChild(coin);
        }
        item.appendChild(cell);
    }

    container.appendChild(item);

    let itemData = {
        row: rowIndex,
        item: itemDati,     
        element: item,
        inBackpack: false
    };
    existingItems.push(itemData);

}



// funzione per creare zaino in grid di 20 celle
function createBackpackGrid(backpackElement) {
    for (let i = 0; i < 20; i++) {
        const cell = document.createElement('div');
        cell.classList.add('backpack-cell');
        backpackElement.appendChild(cell);
    }
}


// Funzione per avviare la partita e generare gli oggetti nel gioco
function startGame () {

    if (gameActive) return; 
    gameActive = true;

    algorithmSelect.disabled = true;

    toggleButtons(true);

    userHasFinished = false;
    algoHasFinished = false;

    messaggio1.textContent = "La Partita ha iniziato!";
    resultsContainer.innerHTML = " ";
    algoContainer.innerHTML = "";
    userContainer.innerHTML = "";
    algobackpack.innerHTML = "";
    userbackpack.innerHTML = "";

    createBackpackGrid(algobackpack);
    createBackpackGrid(userbackpack);

    algoValue.textContent = "0";
    algoWeight.textContent = "0";
    userValue.textContent = "0";
    userWeight.textContent = "0";

    algoItems = [];
    userItems = [];   

    // Crea oggetti per algoritmo e utente
    items.forEach((item, index) => {
        createItem(item, algoContainer, algoItems, index);
        createItem(item, userContainer, userItems, index);
    });

    // Crea una copia ordinata di algoItems in base a value/weight decrescente
    algoItemsSorted = [...algoItems].sort((a, b) => {
        let ratioA = a.item.value / a.item.weight;
        let ratioB = b.item.value / b.item.weight;
        return ratioB - ratioA;
    });
}


function getValue(Variable) {
    return parseInt(Variable.textContent) ;
}


function updateData(container, value, adding) { 
    let currentValue = getValue(container); 
    container.textContent = adding ? currentValue + value : currentValue - value;
}

function toggleButtons(enabled) {
    insertBtn.disabled = !enabled;
    removeBtn.disabled = !enabled;
}

function findItemDataById(itemId, itemsArray) {
    return itemsArray.find(itemData => itemData.item.id.toString() === itemId.toString());
}

// Funzione per selezionare un item o cella
function selectItem(element) {
    if (!element.dataset.originalColor) {
        element.dataset.originalColor = element.style.backgroundColor;
    }
    element.style.backgroundColor = "lightgreen";
    element.classList.add("selected");
}

// Funzione per deselezionare un item o cella
function deselectItem(element) {
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
    const itemData = findItemDataById(itemId, userItems);
 
    if (!itemData) {
        console.warn(`Elemento ${itemId} non trovato in userItems`);
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



function createItemPart(itemId, weight, value, originalColor) {
    const part = document.createElement("div");
    part.classList.add("item-cell");
    part.dataset.itemId = itemId;
    part.dataset.weight = weight;
    part.dataset.value = value;
    part.dataset.originalColor = originalColor;
    part.style.backgroundColor = originalColor;

    if (value > 0) {
        const coin = document.createElement("div");
        coin.classList.add("coin");
        part.appendChild(coin);
    }

    part.addEventListener("click", () => {
        selectById(itemId, userContainer, userbackpack);
    });

    return part;
}


// Funzione per determinare il vincitore e mostrare il risultato
function displayEndgameResults() {
    let message = "";
    messaggio1.textContent = "La Partita è finita!";

    if (getValue(userValue)  > getValue(algoValue)) {
        message = "Complimenti! Hai vinto la partita con un valore maggiore!";
    } else if (getValue(userValue) < getValue(algoValue)) {
        message = "L'algoritmo ha vinto! Ritenta per migliorare la tua strategia.";
    } else {
        if (getValue(userWeight) < getValue(algoWeight)) {
            message = "Stesso valore, ma hai usato meno peso. Hai vinto!";
        } else if (getValue(userWeight) > getValue(algoWeight)) {
            message = "Stesso valore, ma l'algoritmo ha usato meno peso. Ha vinto!.";   
        }else{
            message = "Pareggio uguale!";
        }
    }
    
    resultsContainer.innerHTML = `  <h3>${message}</h3>  `;
    resultsContainer.style.display = "block";
}

// Termina la partita manualmente
function endGame() {
    if (!gameActive) return;
    gameActive = false;
    algorithmSelect.disabled = false;
    displayEndgameResults();
 
}


// L'algoritmo continua da solo finché può inserire item
function autoAlgoInsert() {
    let success = false;
    if (selectedAlgorithm === "greedy") {
        success = execute_Greedy_Algorithm();
    } else if (selectedAlgorithm === "dp") {
        success = execute_DP_Algorithm();
    }

    if (success) {
        setTimeout(autoAlgoInsert, 1000); 
    } else {
        endGame(); 
    }
}


function endTurns() {
    if (!gameActive) return;
    userHasFinished = true;
    // Disabilita i pulsanti utente
    toggleButtons(false);
    autoAlgoInsert();
}


function insertItemIntoBackpack(itemData, backpackContainer, itemContainer) {
    const cells = [...backpackContainer.querySelectorAll(".backpack-cell")];
    const weight = parseInt(itemData.element.dataset.weight);
    const value = parseInt(itemData.element.dataset.value);
    const itemId = itemData.element.dataset.itemId;
    const originalColor = itemData.element.dataset.originalColor;

    let placed = 0;
    let targetCells = [];

    for (let i = 0; i < cells.length && placed < weight; i++) {
        if (cells[i].children.length === 0) {
            targetCells.push(cells[i]);
            placed++;
        }
    }

    if (placed < weight) {
        console.warn("Non c'è spazio sufficiente nello zaino per questo oggetto.");
        return;
    }

    for (let i = 0; i < weight; i++) {
        const part = createItemPart(itemId, weight, value - i, originalColor);
        targetCells[i].appendChild(part);
    }

    const itemElement = itemData.element;
    if (itemContainer.contains(itemElement)) {
        itemContainer.removeChild(itemElement);
    }

    itemData.inBackpack = true;
    deselectItem(itemElement);
    selectedItem = null;
}


function removeItemFromBackpack(itemData, backpackContainer, itemContainer) {
    const itemId = itemData.element.dataset.itemId;

    const allCells = Array.from(backpackContainer.querySelectorAll(".backpack-cell"));
    
    // Estrai le parti rimaste (tranne quelle dell'item rimosso)
    const remainingParts = [];
    for (let cell of allCells) {
        const part = cell.firstChild;
        if (part && part.dataset.itemId !== itemId) {
            remainingParts.push(part);
        }
    }

    allCells.forEach(cell => cell.innerHTML = "");

    remainingParts.forEach((part, i) => {
        allCells[i].appendChild(part);
    });

    deselectAll(userContainer, backpackContainer);

    itemData.element.style.position = "static";
    itemContainer.appendChild(itemData.element);

    itemData.inBackpack = false;
    selectedItem = null;
}



// Funzione per eseguire la logica dell'algoritmo di greedy su un unico item
function execute_Greedy_Algorithm() {
    if (!algoItemsSorted.length) return false;

    let bestItemData = algoItemsSorted[0];  // prende il primo nella lista ordinata

    const { item, element } = bestItemData;
    const value = item.value;
    const weight = item.weight;

    // Verifica se c'è spazio nello zaino
    let canAdd = getValue(algoWeight) + weight <= getValue(maxWeight);

    if (canAdd) {
      
        insertItemIntoBackpack(bestItemData, algobackpack, algoContainer); 

        element.style.position = "static"; 

        updateData(algoValue, value, true);
        updateData(algoWeight, weight, true);

        algoItemsSorted.shift();   
      
        return true;
    }
    return false;
}

// Funzione per eseguire la logica dell'algoritmo di programmazione dinamica su un unico item
function execute_DP_Algorithm() {
    if (!algoItems.length) return false;

    const capacity = getValue(maxWeight) - getValue(algoWeight);

    if (capacity <= 0) {
        return false;
    }

    // Costruisco la tabella DP
    const n = algoItems.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const { value, weight } = algoItems[i - 1].item;
        for (let w = 0; w <= capacity; w++) {
            if (weight <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Trova quale oggetto è stato scelto per ottenere il miglior valore
    let w = capacity;
    let chosenIndex = -1;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            chosenIndex = i - 1;
            break;
        }
    }

    if (chosenIndex === -1) {
        return false; // Nessun oggetto può essere inserito
    }

    // Inserisco l'oggetto selezionato
    const bestItemData = algoItems[chosenIndex];
    const { item, element } = bestItemData;
    const value = item.value;
    const weight = item.weight;

    //algobackpack.appendChild(element);
    insertItemIntoBackpack(bestItemData, algobackpack, algoContainer);

    element.style.position = "static";

    updateData(algoValue, value, true);
    updateData(algoWeight, weight, true);

    // Rimuovo l'oggetto 
    algoItems = algoItems.filter(i => i.item.id !== item.id);

    return true;
}


// Mossa dell'algoritmo
function algoMove() {
    if (!gameActive || userHasFinished) return;

    toggleButtons(false);
    
    let success = false;

    if (selectedAlgorithm === "greedy") {
        success = execute_Greedy_Algorithm();
    } else if (selectedAlgorithm === "dp") {
        success = execute_DP_Algorithm();
    }
    
    if (!success) {
        messaggio1.textContent = "L'algoritmo ha finito di ordinare!";
        algoHasFinished = true;
    }

    toggleButtons(true);
}


function handleInsert () {
    if (!gameActive || !selectedItem) return;

    messaggio1.textContent = " "; 


    if (!userContainer.contains(selectedItem) || userbackpack.contains(selectedItem)) return;


    const value= parseInt(selectedItem.dataset.value, 10);
    const weight= parseInt(selectedItem.dataset.weight, 10);
    const itemId = selectedItem.dataset.itemId;

    let newWeight = getValue(userWeight) + weight;

    if ( newWeight > getValue(maxWeight) ) {
        messaggio1.textContent = "Il Peso massimo verrà superato!";
        return;

    } else {
        let itemData = findItemDataById(itemId, userItems);
  
        insertItemIntoBackpack(itemData, userbackpack, userContainer);
        
        updateData(userValue, value, true);
        updateData(userWeight, weight, true);

        const prevSelected = selectedItem;
        selectedItem = null;

        if (prevSelected && prevSelected.isConnected) {
            deselectItem(prevSelected);
        }

        if (!userHasFinished && !algoHasFinished) {
            setTimeout(algoMove, 1000);  
        }
     
    }
}

function handleRemove() {
    if (!gameActive || !selectedItem) return;

    messaggio1.textContent = " ";

    const itemId = selectedItem.dataset.itemId;
    if (!itemId) return;

    const itemData = findItemDataById(itemId, userItems);
    if (!itemData || !itemData.inBackpack) {
        console.warn(`Elemento non trovato o non nello zaino per itemId: ${itemId}`);
        return;
    }

    const value = parseInt(itemData.item.value, 10);
    const weight = parseInt(itemData.item.weight, 10);

    removeItemFromBackpack(itemData, userbackpack, userContainer);

    updateData(userValue, value, false);
    updateData(userWeight, weight, false);

    selectedItem = null;

    if (!userHasFinished && !algoHasFinished) {
        setTimeout(algoMove, 1000); 
    }
     
}



let insertBtn, removeBtn, algorithmSelect ;

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-game");
    const endButton = document.getElementById("endGame");
    const endWork = document.getElementById("end-work");
     insertBtn = document.getElementById("insert-item");
     removeBtn = document.getElementById("remove-item");
     algorithmSelect = document.getElementById("algorithmSelect");

    startButton.addEventListener("click", startGame);
    endButton.addEventListener("click", endGame);
    endWork.addEventListener("click", endTurns);

    insertBtn.addEventListener("click", () => handleInsert());
    removeBtn.addEventListener("click", () => handleRemove());

    algorithmSelect.addEventListener("change", () => {
        selectedAlgorithm = algorithmSelect.value;
    });

    // Click su un item nel contenitore utente
    userContainer.addEventListener("click", (e) => {
        const target = e.target.closest(".item");
        if (!target || !gameActive) return;

        const itemId = target.dataset.itemId;

        if (selectedItem?.dataset.itemId === itemId) {
            deselectAll(userContainer, userbackpack);
        } else {
            deselectAll(userContainer, userbackpack);
            selectItem(target);
            selectedItem = target;
        }
    });
   // Click su un item nello zaino utente
    userbackpack.addEventListener("click", (e) => {
        const target = e.target.closest(".item-cell");
        if (!target || !gameActive) return;

        const itemId = target.dataset.itemId;
        const itemData = findItemDataById(itemId, userItems);

        if (!itemData) {
            console.warn(`Elemento con itemId ${itemId} non trovato in userItems`);
            return;
        }

        const cells = userbackpack.querySelectorAll(`.item-cell[data-item-id="${itemId}"]`);
        const isAlreadySelected = [...cells].every(cell => cell.classList.contains("selected"));

        console.log("Are all cells already selected?", isAlreadySelected);

        if (isAlreadySelected) {
            return;
        }

        deselectAll(userContainer, userbackpack);
        cells.forEach(selectItem);
        selectedItem = cells[0];        
    });

});
    