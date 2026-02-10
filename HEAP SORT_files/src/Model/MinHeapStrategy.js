export default class MinHeapStrategy {
    constructor() {
        this.type = 'min';
    }

    shouldSwap(parentValue, childValue) {
        return parentValue > childValue;
    }

    // Returns true if the parent-child relationship is correct (parent <= child)
    isValid(parentValue, childValue) {
        return parentValue <= childValue;
    }
}
