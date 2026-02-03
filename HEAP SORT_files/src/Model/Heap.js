import Node from './Node.js';

export default class Heap {
    constructor(type = 'min') {
        this.type = type; // 'min' or 'max'
        this.nodes = [];
        this.sorted = [];
    }

    parent(i) { return Math.floor((i - 1) / 2); }
    left(i) { return 2 * i + 1; }
    right(i) { return 2 * i + 2; }

    // Compare: returns true if a should be above b (e.g. a < b for min heap)
    shouldSwap(a, b) {
        if (this.type === 'min') return a > b;
        return a < b;
    }

    swap(i, j) {
        [this.nodes[i], this.nodes[j]] = [this.nodes[j], this.nodes[i]];
    }

    initRandom(count = 15) {
        this.nodes = [];
        this.sorted = [];
        const used = new Set();
        while (this.nodes.length < count) {
            const val = Math.floor(Math.random() * 99) + 1;
            if (!used.has(val)) {
                used.add(val);
                this.nodes.push(new Node(val, this.nodes.length));
            }
        }
    }
    
    setNodes(values) {
        this.nodes = values.map((v, i) => new Node(v, i));
        this.sorted = [];
    }
    
    getValues() {
        return this.nodes.map(n => n.value);
    }

    // Check if the root is the valid extremum of the current nodes
    isRootValid() {
        if (this.nodes.length === 0) return false;
        const rootVal = this.nodes[0].value;
        for (let i = 1; i < this.nodes.length; i++) {
            if (this.type === 'min' && this.nodes[i].value < rootVal) return false;
            if (this.type === 'max' && this.nodes[i].value > rootVal) return false;
        }
        return true;
    }

    extractRoot() {
        if (this.nodes.length === 0) return null;
        const root = this.nodes[0];
        
        if (this.nodes.length === 1) {
            this.nodes.pop();
        } else {
            this.nodes[0] = this.nodes.pop();
        }
        
        this.sorted.push(root);
        return root;
    }
}
