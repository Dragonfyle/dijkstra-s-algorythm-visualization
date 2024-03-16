import { SQUARE_STATUS_MAP } from "../components/Board.utils";
import { CONFIGURATION } from "../config/initialConfig";
import {
  AdjacencyList,
  Direction,
  SquareStatus,
  StringifiedVector,
  Vector,
} from "../types/board.types";

function stringifyVector([row, col]: Vector) {
  const stringifiedVector: StringifiedVector = `row${row}col${col}`;

  return stringifiedVector;
}

function getNeighborNumber(rectNumber: number, direction: Direction) {
  switch (direction) {
    case "left":
      return rectNumber % CONFIGURATION.GRID_SIDE_LENGTH === 0
        ? null
        : rectNumber - 1;
    case "right":
      return (rectNumber + 1) % CONFIGURATION.GRID_SIDE_LENGTH === 0
        ? null
        : rectNumber + 1;
    case "up":
      return rectNumber < CONFIGURATION.GRID_SIDE_LENGTH
        ? null
        : rectNumber - CONFIGURATION.GRID_SIDE_LENGTH;
    case "down":
      return rectNumber + 1 >
        CONFIGURATION.GRID_SIDE_LENGTH ** 2 - CONFIGURATION.GRID_SIDE_LENGTH
        ? null
        : rectNumber + CONFIGURATION.GRID_SIDE_LENGTH;
  }
}

function getNeighbors(rectMap: Map<number, SquareStatus>, rectNumber: number) {
  const neghboringRects = {
    left: getNeighborNumber(rectNumber, "left"),
    right: getNeighborNumber(rectNumber, "right"),
    up: getNeighborNumber(rectNumber, "up"),
    down: getNeighborNumber(rectNumber, "down"),
  };

  const neighbors = new Map<number, number>();

  for (const direction in neghboringRects) {
    const neighborRectNumber = neghboringRects[direction as Direction];

    if (
      !neighborRectNumber ||
      rectMap.get(neighborRectNumber) === SQUARE_STATUS_MAP.off
    ) {
      continue;
    } else {
      neighbors.set(neighborRectNumber, Math.floor(Math.random() * 10) + 1);
      // neighbors.set(neighborRectNumber, 1);
    }
  }

  return neighbors;
}

function getAdjacencyList(rectMap: Map<number, SquareStatus>) {
  const gridAdjacencyList: AdjacencyList = new Map();

  rectMap.forEach((_, idx) => {
    gridAdjacencyList.set(idx, getNeighbors(rectMap, idx));
  });

  return gridAdjacencyList;
}

export { getAdjacencyList, stringifyVector };
