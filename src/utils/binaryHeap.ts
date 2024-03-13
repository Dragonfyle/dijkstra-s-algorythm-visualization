interface HeapElement {
  rectNumber: number;
  distance: number;
}

function binaryHeap() {
  const tree: HeapElement[] = [];
  const ROOT = 0;

  return {
    insert(element: HeapElement) {
      tree.push(element);
      this.bubbleUp();
    },

    get tree() {
      return tree;
    },

    poll() {
      const rootElement = tree[ROOT];
      const lastIdx = tree.length - 1;
      const lastElement = tree[lastIdx];

      tree[ROOT] = lastElement;
      tree.splice(-1);
      this.bubbleDown();

      return rootElement;
    },

    getElement(rectNumber: HeapElement["rectNumber"]) {
      return tree.find((element) => element.rectNumber === rectNumber);
    },

    getParentIdx(elementIdx: number) {
      const parentIdx = Math.floor((elementIdx - 1) / 2);

      return parentIdx;
    },

    getChildIdx(elementIdx: number, which: "left" | "right") {
      const childIdx =
        which === "left" ? elementIdx * 2 + 1 : elementIdx * 2 + 2;

      return childIdx;
    },

    bubbleUp() {
      let idx = tree.length - 1;
      const element = tree[idx];

      while (idx > 0) {
        const parentIdx = this.getParentIdx(idx);
        const parent = tree[parentIdx];

        if (element.distance < parent.distance) {
          tree[parentIdx] = element;
          tree[idx] = parent;
          idx = parentIdx;
        } else {
          break;
        }
      }
    },

    bubbleDown() {
      let idx = ROOT;
      const element = tree[idx];
      const treeLength = tree.length;

      while (idx < treeLength) {
        const leftChildIdx = this.getChildIdx(idx, "left");
        const rightChildIdx = this.getChildIdx(idx, "right");
        const leftChild = tree[leftChildIdx];
        const rightChild = tree[rightChildIdx];

        let smallerChildIdx;

        if (!leftChild && !rightChild) {
          break;
        } else if (!leftChild && rightChild) {
          smallerChildIdx = rightChildIdx;
        } else if (!rightChild && leftChild) {
          smallerChildIdx = leftChildIdx;
        } else {
          smallerChildIdx =
            leftChild.distance < rightChild.distance
              ? leftChildIdx
              : rightChildIdx;
        }

        const smallerChild = tree[smallerChildIdx];

        if (element.distance > smallerChild.distance) {
          tree[smallerChildIdx] = element;
          tree[idx] = smallerChild;
          idx = smallerChildIdx;
        } else {
          break;
        }
      }
    },

    get length() {
      return tree.length;
    },
  };
}

export { binaryHeap };
