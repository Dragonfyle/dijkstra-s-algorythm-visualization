interface HeapElement {
  nodeNumber: number;
  distance: number;
}

function binaryHeap() {
  const tree: HeapElement[] = [];
  const idxMap: number[] = [];

  const ROOT_IDX = 0;

  function swap(idx1: number, idx2: number) {
    const temp1 = tree[idx1];
    const temp2 = tree[idx2];

    tree[idx1] = tree[idx2];
    tree[idx2] = temp1;
    idxMap[temp1.nodeNumber] = idx2;
    idxMap[temp2.nodeNumber] = idx1;
  }

  function getParentIdx(elementIdx: number) {
    const parentIdx = Math.floor((elementIdx - 1) / 2);

    return parentIdx;
  }

  function getChildIdx(elementIdx: number, which: "left" | "right") {
    const childIdx = which === "left" ? elementIdx * 2 + 1 : elementIdx * 2 + 2;

    return childIdx;
  }

  function isWithinBounds(treeIdx: number) {
    return treeIdx >= ROOT_IDX && treeIdx <= tree.length - 1;
  }

  function isLess({ less, than }: { less: number; than: number }) {
    return tree[less].distance < tree[than].distance;
  }

  function bubbleUp(treeIdx: number) {
    while (treeIdx >= ROOT_IDX) {
      const parentIdx = getParentIdx(treeIdx);
      if (!isWithinBounds(parentIdx)) break;

      if (tree[treeIdx].distance < tree[parentIdx].distance) {
        swap(treeIdx, parentIdx);
        treeIdx = parentIdx;
      } else {
        break;
      }
    }
  }

  function bubbleDown(treeIdx: number) {
    while (treeIdx <= tree.length - 1) {
      const leftChildIdx = getChildIdx(treeIdx, "left");
      const rightChildIdx = getChildIdx(treeIdx, "right");
      let smallerChildIdx = leftChildIdx;

      if (!isWithinBounds(leftChildIdx)) break;

      if (
        isWithinBounds(rightChildIdx) &&
        isLess({ less: rightChildIdx, than: leftChildIdx })
      ) {
        smallerChildIdx = rightChildIdx;
      }

      if (tree[treeIdx].distance > tree[smallerChildIdx].distance) {
        swap(smallerChildIdx, treeIdx);
        treeIdx = smallerChildIdx;
      } else {
        break;
      }
    }
  }

  return {
    get tree() {
      return tree;
    },

    get length() {
      return tree.length;
    },

    insert(nodeObject: HeapElement) {
      tree.push(nodeObject);
      idxMap[nodeObject.nodeNumber] = tree.length - 1;
      bubbleUp(tree.length - 1);
    },

    poll() {
      const rootElement = tree[ROOT_IDX];
      swap(ROOT_IDX, tree.length - 1);

      idxMap[rootElement.nodeNumber] = -1;
      tree.pop();
      bubbleDown(ROOT_IDX);

      return rootElement;
    },

    getNode(nodeNumber: HeapElement["nodeNumber"]) {
      return tree[idxMap[nodeNumber]];
    },
  };
}

export { binaryHeap };
