import { SQUARE_STATUS_MAP } from "../components/Board.utils";
import { CONFIGURATION } from "../config/initialConfig";
import {
  AdjacencyList,
  Matrix,
  StringifiedVector,
  Vector,
} from "../types/board.types";

function stringifyVector([row, col]: Vector) {
  const stringifiedVector: StringifiedVector = `row${row}col${col}`;

  return stringifiedVector;
}

function parseVector(string: StringifiedVector) {
  const matches = string.match(/\d+/g);
  if (!matches) {
    throw new Error("incorrect String format. Should be: 'row##col##'");
  }
  const shape = matches.map(Number);

  return shape;
}

function getNeighbors(boardMatrix: Matrix, [row, col]: Vector) {
  const unitVectors = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
  };

  const addedVectors = {
    left: [row + unitVectors.left[0], col + unitVectors.left[1]] as Vector,
    right: [row + unitVectors.right[0], col + unitVectors.right[1]] as Vector,
    up: [row + unitVectors.up[0], col + unitVectors.up[1]] as Vector,
    down: [row + unitVectors.down[0], col + unitVectors.down[1]] as Vector,
  };

  const neighbors = new Map<StringifiedVector, number>();

  for (const vector in addedVectors) {
    const [row, col] = addedVectors[vector as keyof typeof addedVectors];

    if (!isVectorWithinBounds([row, col])) {
      continue;
    }

    if (boardMatrix[row][col] === SQUARE_STATUS_MAP.off) {
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

function isVectorWithinBounds(vector: Vector) {
  return vector.every(
    (coord) => coord >= 0 && coord <= CONFIGURATION.NUM_SQUARES - 1
  );
}

function getAdjacencyList(boardMatrix: Matrix) {
  const gridAdjacencyList: AdjacencyList = new Map();

  boardMatrix.map((row, rowIdx) =>
    row.map((_, colIdx) =>
      gridAdjacencyList.set(
        stringifyVector([rowIdx, colIdx] as Vector),
        getNeighbors(boardMatrix, [rowIdx, colIdx] as Vector)
      )
    )
  );

  return gridAdjacencyList;
}

export { getAdjacencyList, parseVector, stringifyVector };
