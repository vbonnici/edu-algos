export default class Computer {
    constructor(heap) {
        this.heap = heap;
    }

    makeMove() {
        // Strategy:
        // 1. If root is valid extremum, extract it.
        // 2. Else, perform one step of heapify (sift down or sift up fix).
        // To make it competitive but "step-by-step", we look for the first violation.
        
        if (this.heap.nodes.length === 0) return 'done';

        // Priority 1: Extract if ready
        if (this.heap.isRootValid()) {
            this.heap.extractRoot();
            return 'extract';
        }

        // Priority 2: Improve Competition - Move the global extremum to the root
        // Strategy: Find the global target (Min or Max depending on strategy) and move it towards the root 
        // by swapping with its parent. This guarantees competition by prioritizing the "best" node.

        let bestIndex = 0;
        let bestValue = this.heap.nodes[0].value;
        const isMin = this.heap.type === 'min';

        for (let i = 1; i < this.heap.nodes.length; i++) {
            const val = this.heap.nodes[i].value;
            if (isMin) {
                if (val < bestValue) {
                    bestValue = val;
                    bestIndex = i;
                }
            } else {
                if (val > bestValue) {
                    bestValue = val;
                    bestIndex = i;
                }
            }
        }

        // If the best node is not at the root, move it up
        if (bestIndex > 0) {
            // We swap the best node with its parent to bubble it up
            const parentIndex = this.heap.parent(bestIndex);
            
            // Note: In a standard heap, a child violating heap property can always swap with parent.
            // Since this is the global extremum, it is guaranteed to be "better" than its parent 
            // (unless parent is already the same value, in which case swap is harmless or we skip).
            // But strict inequality check in loop ensures we find *a* best.
            // Let's just swap.
            this.heap.swap(bestIndex, parentIndex);
            return 'swap';
        }

        return 'wait';
    }
}
