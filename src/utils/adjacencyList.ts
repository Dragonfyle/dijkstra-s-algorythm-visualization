import { squareStatusMap } from "../components/Board.utils";

function stringifyVector([row, col]: number[]) {
  return `row${row}col${col}`;
}

function parseVector(string) {
  const matches = string.match(/\d+/g);
  const shape = matches.map(Number);

  return shape;
}

function checkNeighbors(boardMatrix: number[][], [row, col]: [number, number]) {
  const unitVectors = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
  };

  const addedVectors = {
    left: [row + unitVectors.left[0], col + unitVectors.left[1]],
    right: [row + unitVectors.right[0], col + unitVectors.right[1]],
    up: [row + unitVectors.up[0], col + unitVectors.up[1]],
    down: [row + unitVectors.down[0], col + unitVectors.down[1]],
  };

  const neighbors = new Map<string, number>();

  for (const vector in addedVectors) {
    const [row, col] = addedVectors[vector] as [number, number];

    if (!isVectorWithinBounds([row, col])) {
      continue;
    }

    if (boardMatrix[row][col] === squareStatusMap.off) {
      continue;
    } else {
      neighbors.set(
        stringifyVector([row, col]),
        Math.floor(Math.random() * 10) + 1
      );
    }
  }

  return neighbors;
}

function isVectorWithinBounds(vector: number[]) {
  return vector.every((coord) => coord >= 0 && coord <= 29);
}

function getAdjacencyList(boardMatrix: number[][]) {
  const gridAdjacencyList = new Map<string, Map<[number, number], number>>();

  boardMatrix.map((row, rowIdx) =>
    row.map((_, colIdx) =>
      gridAdjacencyList.set(
        `row${rowIdx}col${colIdx}`,
        checkNeighbors(boardMatrix, [rowIdx, colIdx])
      )
    )
  );

  return gridAdjacencyList;
}

export { getAdjacencyList };
