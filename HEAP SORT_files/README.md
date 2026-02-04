# Sviluppo di applicazioni web per la didattica dell'informatica. HTML,CSS,Javascript

**Progetto: Heap Sort Challenge**

Questo progetto è un'applicazione web interattiva per l'apprendimento dell'algoritmo Heap Sort, dove un utente sfida il computer a ordinare una heap.

## Il Team

| Studente | Matricola | Ruolo Principale |
| :--- | :--- | :--- |
| Nna Minkousse Kenneth James | 366361 | Sviluppatore Frontend & Logica |

## Quick Start

### 1. Clonare o scaricare il repository
Assicurati di avere i file del progetto sul tuo computer locale.

### 2. Struttura dei File
Il progetto è organizzato come segue:
- `HEAP SORT.html`: File principale da aprire nel browser.
- `src/`: Contiene tutto il codice sorgente.
  - `src/Model/`: Logica di business (algoritmo, dati).
  - `src/View/`: Gestione dell'interfaccia grafica.
  - `src/Presenter/`: Gestione della logica di gioco.
  - `src/style.css`: Stili dell'applicazione.
  - `src/main.js`: Script di avvio.

### 3. Avviare l'applicazione
Poiché il progetto utilizza moduli ES6 (`type="module"`), è consigliabile utilizzare un server locale per evitare errori di CORS (Cross-Origin Resource Sharing), anche se alcuni browser moderni potrebbero permettere l'esecuzione locale diretta.

**Opzione A: Server Python (Consigliata)**
1. Apri il terminale nella cartella `HEAP SORT_files`.
2. Esegui: `python3 -m http.server`
3. Apri il browser all'indirizzo: `http://localhost:8000/HEAP SORT.html`

**Opzione B: Apertura diretta**
1. Fai doppio clic su `HEAP SORT.html`.
2. *Nota: Se non funziona, usa l'opzione A o un'estensione come "Live Server" per VS Code.*

## Indice Documentazione di Progetto

### 1. Processo di Sviluppo
- **Metodologia**: Sviluppo iterativo con refactoring verso architettura MVP (Model-View-Presenter).
- **Struttura**: Il codice è modulare per separare la logica (Model), la visualizzazione (View) e il controllo (Presenter).

### 2. Analisi dei Requisiti
- **Requisiti non Funzionali**:
  - **Usabilità**: Interfaccia intuitiva e reattiva con feedback visivi immediati (es. animazioni di spostamento nodi).
  - **Performance**: L'applicazione deve girare fluidamente nel browser senza lag durante le animazioni.
  - **Portabilità**: Il codice deve essere compatibile con i principali browser moderni (Chrome, Firefox, Safari).
  - **Manutenibilità**: Codice modulare (MVP) per facilitare estensioni future.

- **Requisiti Funzionali**:
  - **RF01 - Selezione Modalità**: Il sistema deve permettere all'utente di scegliere tra Min-Heap e Max-Heap.
  - **RF02 - Generazione Heap**: All'inizio del gioco, il sistema deve generare un array casuale di numeri interi e visualizzarlo come albero binario.
  - **RF03 - Interazione Utente**: L'utente deve poter selezionare due nodi (padre e figlio) per scambiarli. Il sistema deve validare la mossa.
  - **RF04 - Logica CPU**: La CPU deve essere in grado di risolvere l'heap autonomamente applicando l'algoritmo corretto.
  - **RF05 - Condizione di Vittoria**: Il sistema deve rilevare quando l'array è completamente ordinato e dichiarare il vincitore.

### 3. Architettura del Sistema
- **Pattern MVP**:
  - **Model**: `Heap.js`, `Node.js`, `ComputerAI.js`
  - **View**: `Renderer.js`
  - **Presenter**: `GamePresenter.js`

### 4. Use Cases

- **UC01 - Selezione Tipo Heap**: L'utente seleziona "Min Heap" o "Max Heap" dal menu a tendina.
- **UC02 - Inizio Partita**: L'utente clicca "Start Game" per generare una nuova heap casuale e iniziare la sfida.
- **UC03 - Swap Nodi**: L'utente clicca su due nodi (un padre e un figlio) per scambiarne la posizione e correggere la heap.
- **UC04 - Estrazione Radice**: Quando la radice è l'estremo valido (min o max), l'utente (o il sistema automaticamente) estrae la radice e la sposta nella lista ordinata.
- **UC05 - Reset Gioco**: L'utente clicca "Reset" per interrompere la partita corrente e pulire l'area di gioco.
- **UC06 - Vittoria/Sconfitta**: Il sistema confronta il numero di mosse dell'utente con quelle del computer e dichiara il vincitore.

