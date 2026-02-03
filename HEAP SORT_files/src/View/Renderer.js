export default class Renderer {
    constructor(containerId, sortedListId) {
        this.container = document.getElementById(containerId);
        this.sortedList = document.getElementById(sortedListId);
        this.width = this.container.clientWidth;
    }

    render(heap, selectedIndices = []) {
        // We don't clear innerHTML anymore for nodes to preserve transitions
        // But we do need to manage edges and nodes.
        // Simplest approach for edges: Clear them and redraw (they are behind nodes).
        // For nodes: Update positions if exist, create if new, remove if gone.
        
        this.calculatePositions(heap.nodes);
        
        // Remove old edges
        const oldEdges = this.container.querySelectorAll('.edge');
        oldEdges.forEach(e => e.remove());

        // Draw edges
        heap.nodes.forEach((node, index) => {
            const leftIdx = heap.left(index);
            const rightIdx = heap.right(index);
            
            if (leftIdx < heap.nodes.length) this.drawEdge(node, heap.nodes[leftIdx]);
            if (rightIdx < heap.nodes.length) this.drawEdge(node, heap.nodes[rightIdx]);
        });

        // Manage Nodes
        const existingNodes = Array.from(this.container.querySelectorAll('.node'));
        const activeIds = new Set(heap.nodes.map(n => n.id));
        
        // Remove nodes that are no longer in the heap
        existingNodes.forEach(el => {
            if (!activeIds.has(parseInt(el.dataset.id))) {
                el.remove();
            }
        });

        // Update or Create nodes
        heap.nodes.forEach((node, index) => {
            let el = this.container.querySelector(`.node[data-id="${node.id}"]`);
            
            if (!el) {
                el = document.createElement('div');
                el.className = 'node';
                el.dataset.id = node.id;
                el.textContent = node.value;
                this.container.appendChild(el);
                // Initial position (maybe start from parent? or just appear)
                // For now, just set it.
            }
            
            // Update classes
            el.className = 'node'; // Reset
            if (selectedIndices.includes(index)) el.classList.add('selected');
            if (index === 0 && heap.isRootValid()) el.classList.add('highlight');

            // Update position
            el.style.left = `${node.x - 20}px`;
            el.style.top = `${node.y - 20}px`;
            el.dataset.index = index; // Update current index for click handling
        });

        this.renderSorted(heap);
    }

    calculatePositions(nodes) {
        if (nodes.length === 0) return;
        
        const levels = Math.floor(Math.log2(nodes.length)) + 1;
        const verticalSpacing = 55;
        
        nodes.forEach((node, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const levelCapacity = Math.pow(2, level);
            const indexInLevel = index - levelCapacity + 1;
            
            const sliceWidth = this.width / (levelCapacity + 1);
            node.x = sliceWidth * (indexInLevel + 1);
            node.y = level * verticalSpacing + 50;
        });
    }

    drawEdge(parent, child) {
        const edge = document.createElement('div');
        edge.className = 'edge';
        const dx = child.x - parent.x;
        const dy = child.y - parent.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        edge.style.width = `${length}px`;
        edge.style.left = `${parent.x}px`;
        edge.style.top = `${parent.y}px`;
        edge.style.transform = `rotate(${angle}deg)`;
        this.container.appendChild(edge);
    }

    renderSorted(heap) {
        // Simple redraw for sorted list is fine
        this.sortedList.innerHTML = '';
        heap.sorted.forEach(node => {
            const el = document.createElement('div');
            el.className = 'sorted-item';
            el.textContent = node.value;
            this.sortedList.appendChild(el);
        });
    }
}
