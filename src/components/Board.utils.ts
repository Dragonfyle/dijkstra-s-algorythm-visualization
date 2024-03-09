import { CONFIGURATION } from "../config/initialConfig";
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
const initialArray = Array(CONFIGURATION.NUM_SQUARES ** 2).fill(0);

const initialMatrix = makeMatrixFromArray(
  initialArray,
  CONFIGURATION.NUM_SQUARES
);

function getBackgroundColor({ status }: { status: SquareStatus }) {
  switch (status) {
    case 0:
      return CONFIGURATION.STATUS_COLORS[0];
    case 1:
      return CONFIGURATION.STATUS_COLORS[1];
    case 2:
      return CONFIGURATION.STATUS_COLORS[2];
    case 3:
      return CONFIGURATION.STATUS_COLORS[3];
    case 4:
      return CONFIGURATION.STATUS_COLORS[4];
    case 5:
      return CONFIGURATION.STATUS_COLORS[5];
  }
}

export { SQUARE_STATUS_MAP, initialMatrix, getBackgroundColor };
