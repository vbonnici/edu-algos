export default class ComputerAI {
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

        // Priority 2: Fix Heap Property
        // We scan from the last non-leaf node up to root to find a violation (standard build-heap approach)
        // Or we scan from root down? 
        // Let's try to fix the "worst" violation or just the first one we find to simulate a move.
        // A human would likely spot a local violation.
        
        // Let's look for a violation: Parent vs Child
        for (let i = Math.floor(this.heap.nodes.length / 2) - 1; i >= 0; i--) {
            let largest = i;
            const l = this.heap.left(i);
            const r = this.heap.right(i);
            
            // Check left
            if (l < this.heap.nodes.length) {
                if (this.heap.shouldSwap(this.heap.nodes[i].value, this.heap.nodes[l].value)) {
                     // Violation found!
                     // But wait, we need to find the *correct* child to swap with
                     // If min-heap, we want smallest child. If max-heap, largest child.
                }
            }
            
            // Let's find the target child to swap with
            let target = i;
            if (l < this.heap.nodes.length) {
                if (this.heap.shouldSwap(this.heap.nodes[target].value, this.heap.nodes[l].value)) {
                    target = l;
                }
            }
            
            if (r < this.heap.nodes.length) {
                if (this.heap.shouldSwap(this.heap.nodes[target].value, this.heap.nodes[r].value)) {
                    target = r;
                }
            }
            
            if (target !== i) {
                this.heap.swap(i, target);
                return 'swap';
            }
        }
        
        // If no violations found but root wasn't valid? Impossible if logic is correct.
        // But just in case, swap random to shake things up? No, that's bad AI.
        // If we are here, it means the heap IS valid, so we should have extracted.
        // The isRootValid check is O(N), but heap property check is local.
        // If heap property holds for all nodes, root MUST be valid.
        
        return 'wait';
    }
}
