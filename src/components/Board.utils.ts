import { GRID_SIDE_LENGTH } from "../config/initialConfig";
import { Coord, Matrix, Row, SquareStatus } from "../types/board.types";

const SQUARE_STATUS_MAP = {
  neutral: 0,
  start: 1,
  end: 2,
  off: 3,
  visited: 4,
  path: 5,
};

function makeMatrixFromArray(array: Row, rowLength: Coord) {
  return array.reduce(
    (acc, el, idx) => {
      if (idx % rowLength === 0 && idx) {
        acc.currentRow += 1;
      }

      if (!acc.matrix[acc.currentRow]) {
        acc.matrix[acc.currentRow] = [];
      }

      acc.matrix[acc.currentRow].unshift(el);

      return acc;
    },
    { currentRow: 0, matrix: [] as Matrix }
  ).matrix;
}
const initialArray = Array(GRID_SIDE_LENGTH ** 2).fill(0);

const initialMatrix = makeMatrixFromArray(initialArray, GRID_SIDE_LENGTH);

function getBackgroundColor({ $status }: { $status: SquareStatus }) {
  switch ($status) {
    case 0:
      return "gray";
    case 1:
      return "seagreen";
    case 2:
      return "red";
  }
}

export { SQUARE_STATUS_MAP, initialMatrix, getBackgroundColor };
