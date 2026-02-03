# Introduzione

L'informatica è una disciplina che, negli ultimi decenni, ha assunto un ruolo centrale e imprescindibile nella formazione degli studenti di ogni ordine e grado. Non si tratta più soltanto di apprendere l'utilizzo strumentale del calcolatore, ma di acquisire una nuova forma mentis, un modo di pensare strutturato e analitico volto alla risoluzione di problemi complessi: il **pensiero computazionale**. In questo scenario educativo in rapida evoluzione, l'apprendimento degli algoritmi fondamentali e delle strutture dati rappresenta un passaggio cruciale per comprendere le logiche profonde con cui le macchine elaborano, organizzano e trasformano le informazioni.

Tuttavia, lo studio di concetti astratti come gli algoritmi di ordinamento può risultare ostico per molti studenti se affrontato esclusivamente sui libri di testo. La mancanza di un riscontro visivo immediato e l'astrazione logica richiesta possono creare una barriera all'apprendimento. È qui che si inserisce il presente progetto, nato con l'obiettivo di colmare questo divario tra teoria e pratica attraverso l'uso delle moderne tecnologie web.

Questo progetto di tirocinio si propone di progettare e sviluppare un'applicazione web interattiva dedicata all'apprendimento dell'algoritmo **Heap Sort**. Sfruttando le potenzialità di HTML, CSS e JavaScript, e adottando un approccio basato sulla *gamification*, l'applicazione trasforma lo studio di una struttura dati complessa (lo Heap) in una sfida coinvolgente. L'utente non è più un osservatore passivo, ma diventa protagonista attivo del processo di ordinamento, sfidando un'intelligenza artificiale (CPU) in una gara di velocità e logica.

L'obiettivo didattico primario è rendere tangibili e manipolabili concetti che altrimenti rimarrebbero astratti, come la struttura ad albero binario, la verifica della proprietà di heap e le operazioni di scambio (swap) e riordinamento. Attraverso l'esperienza diretta, l'errore e la competizione ludica, lo studente può interiorizzare i meccanismi dell'algoritmo in modo naturale e duraturo.

Nel seguito di questo documento verranno dettagliati i principi teorici che hanno guidato la progettazione, l'analisi dei requisiti tecnici e didattici, le scelte architetturali (come l'adozione del pattern Model-View-Presenter) e le fasi di implementazione che hanno portato alla realizzazione del prodotto finale.

---

# 1. Orientamento al Pensiero Computazionale

## 1.1 Cos'è il pensiero computazionale
Il pensiero computazionale è un processo mentale che consente di formulare problemi e le loro soluzioni in modo che possano essere rappresentati come sequenze di istruzioni eseguibili da un agente che elabora informazioni (come un computer). Non è limitato alla programmazione, ma è una competenza trasversale che include:
*   **Astrazione**: Semplificare la realtà per concentrarsi sugli aspetti essenziali.
*   **Decomposizione**: Suddividere un problema complesso in parti più piccole e gestibili.
*   **Riconoscimento di pattern**: Identificare somiglianze e regolarità nei dati.
*   **Algoritmica**: Definire una serie di passi precisi per raggiungere un obiettivo.

## 1.2 Perché insegnarlo: obiettivi educativi e formativi
L'introduzione del pensiero computazionale nelle scuole risponde alla necessità di formare cittadini consapevoli in una società digitale. Gli obiettivi principali includono:
*   Sviluppare la capacità di **analisi logica** e **problem solving**.
*   Promuovere la **creatività** nel trovare soluzioni innovative.
*   Incoraggiare la **perseveranza** e la capacità di gestire l'errore (debugging) come parte del processo di apprendimento.
*   Fornire gli strumenti per passare da consumatori passivi a **creatori attivi** di tecnologia.

## 1.3 Metodologie didattiche per l'orientamento
Per insegnare efficacemente questi concetti, è necessario adottare metodologie attive che coinvolgano direttamente gli studenti.

### 1.3.1 Programmazione visuale e attività unplugged
La programmazione visuale (a blocchi) riduce il carico cognitivo legato alla sintassi del codice, permettendo di concentrarsi sulla logica. Le attività *unplugged* (senza computer) utilizzano giochi, carte o movimenti fisici per introdurre concetti informatici in modo analogico, rendendoli accessibili anche senza infrastrutture costose.

### 1.3.2 Learning-by-doing e problem solving
L'approccio "imparare facendo" è fondamentale. Invece di memorizzare definizioni, gli studenti affrontano problemi reali e costruiscono la loro conoscenza attraverso la sperimentazione pratica. L'errore diventa un'opportunità di apprendimento e non un fallimento.

### 1.3.3 Gamification e ambienti interattivi
La *gamification* applica meccaniche di gioco (punti, livelli, sfide) a contesti non ludici per aumentare la motivazione. Gli ambienti interattivi offrono feedback immediato, permettendo allo studente di vedere subito l'effetto delle proprie azioni, rinforzando il ciclo di apprendimento.

### 1.3.4 Game-based learning
A differenza della gamification, il *Game-Based Learning* utilizza veri e propri giochi come veicolo principale per l'apprendimento. Il gioco diventa il "libro di testo" interattivo, dove il contenuto didattico è intrinseco alle meccaniche di gioco stesse.

## 1.4 L'algoritmo Heap Sort come strumento didattico

### 1.4.1 Fondamenti teorici
L'Heap Sort è un algoritmo di ordinamento basato su confronto che utilizza una struttura dati chiamata **Heap** (o mucchio). Un Heap è un albero binario quasi completo che soddisfa la *proprietà di heap*: in un *max-heap*, ogni nodo padre è maggiore o uguale ai suoi figli; in un *min-heap*, è minore o uguale.
L'algoritmo si divide in due fasi:
1.  **Costruzione dello Heap (Heapify)**: I dati vengono organizzati nella struttura ad albero.
2.  **Estrazione e Ordinamento**: La radice (il massimo o minimo) viene rimossa e spostata nella lista ordinata. La struttura viene poi riorganizzata per ripristinare la proprietà di heap, ripetendo il processo finché l'albero non è vuoto.

### 1.4.2 Valore educativo dell'ordinamento a heap
L'Heap Sort si presta eccellentemente alla didattica per diversi motivi:
*   **Visualizzazione**: La struttura ad albero semplifica la comprensione delle relazioni gerarchiche tra i dati rispetto alla sola visualizzazione lineare di un array.
*   **Complessità**: Introduce concetti di efficienza algoritmica ($O(n \log n)$) in modo intuitivo, mostrando come una struttura dati intelligente possa velocizzare le operazioni rispetto a metodi più semplici ma lenti (come il Bubble Sort).
*   **Pensiero Ricorsivo**: La procedura di *heapify* (ripristino dell'ordine) è un classico esempio di logica ricorsiva o iterativa applicata a sotto-alberi.
