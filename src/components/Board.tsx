import React, { useEffect, useMemo, useRef, useState } from "react";
import { initialMatrix, squareStatusMap } from "./Board.utils";
import * as P from "./Board.parts";
import { DEFAULT_END_POS, DEFAULT_START_POS } from "../config/initialConfig";
import { getAdjacencyList } from "../utils/adjacencyList";

export default function Board() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const start = useRef<number[]>(DEFAULT_START_POS);
  const end = useRef<number[]>(DEFAULT_END_POS);

  const adjacencyList = useMemo(() => getAdjacencyList(matrix), []);
  console.log(adjacencyList);

  function setStartEndPos(row: number, col: number, method: "start" | "end") {
    const reverseRefMap = {
      start: end.current,
      end: start.current,
    };

    const [currRow, currCol] = reverseRefMap[method];

    if (row === currRow && col === currCol) {
      return;
    }
    updateMatrixStartEnd([row, col], method);
  }

  function toggleSquare(rowIdx: number, colIdx: number) {
    updateMatrixBlockStatus([rowIdx, colIdx]);
  }

  function updateMatrixStartEnd(array: number[], method: "end" | "start") {
    const refMap = {
      start: start.current,
      end: end.current,
    };
    const status = squareStatusMap[method];
    const [row, col] = array;
    const [prevRow, prevCol] = refMap[method];

    setMatrix((prev) => {
      const previous = JSON.parse(JSON.stringify(prev));
      previous[prevRow][prevCol] = 0;
      previous[row][col] = status;

      return previous;
    });
    method === "end"
      ? (end.current = [row, col])
      : (start.current = [row, col]);
  }

  function handleLeftClick(
    e: React.MouseEvent,
    rowIdx: number,
    colIdx: number
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey) {
      toggleSquare(rowIdx, colIdx);
    } else {
      setStartEndPos(rowIdx, colIdx, "start");
    }
  }

  function handleRightClick(
    e: React.MouseEvent,
    rowIdx: number,
    colIdx: number
  ) {
    e.preventDefault();
    e.stopPropagation();

    setStartEndPos(rowIdx, colIdx, "end");
  }

  function updateMatrixBlockStatus(array: number[]) {
    const [row, col] = array;

    setMatrix((prev) => {
      const previous = JSON.parse(JSON.stringify(prev));
      previous[row][col] =
        previous[row][col] === squareStatusMap.off
          ? squareStatusMap.neutral
          : squareStatusMap.off;

      return previous;
    });
  }

  function renderGrid(renderableMatrix: number[][]) {
    return renderableMatrix.map((row, rowIdx) =>
      row
        .map((element, colIdx) => (
          <P.Square
            key={`${rowIdx}${colIdx}`}
            status={element}
            onClick={(e) => handleLeftClick(e, rowIdx, colIdx)}
            onContextMenu={(e) => handleRightClick(e, rowIdx, colIdx)}
          />
        ))
        .flat()
    );
  }

  useEffect(() => {
    updateMatrixStartEnd(DEFAULT_START_POS, "start");
    updateMatrixStartEnd(DEFAULT_END_POS, "end");
  }, []);

  return (
    <P.BoardWrapper>
      <P.GridWrapper>{...renderGrid(matrix)}</P.GridWrapper>
    </P.BoardWrapper>
  );
}
