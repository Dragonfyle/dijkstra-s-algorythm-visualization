const squareStatusMap = {
  neutral: 0,
  start: 1,
  end: 2,
  off: 3,
  visited: 4,
  path: 5,
};

function makeMatrixFromArray(array: number[], rowLength: number) {
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
    { currentRow: 0, matrix: [] as number[][] }
  ).matrix;
}
const initialArray = Array(900).fill(0);

const initialMatrix = makeMatrixFromArray(initialArray, 30);

function getBackgroundColor({ status }: { status: number }) {
  switch (status) {
    case 0:
      return "gray";
    case 1:
      return "seagreen";
    case 2:
      return "red";
  }
}

export { squareStatusMap, initialMatrix, getBackgroundColor };
