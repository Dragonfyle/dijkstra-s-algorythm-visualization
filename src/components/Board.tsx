import React, { useEffect, useRef, useState } from "react";
import { initialMatrix, SQUARE_STATUS_MAP } from "./Board.utils";
import { DEFAULT_END_POS, DEFAULT_START_POS } from "../config/initialConfig";
import { getAdjacencyList } from "../utils/adjacencyList";
import { Matrix, OnOff, StartEnd, Vector } from "../types/board.types";
import * as P from "./Board.parts";

export default function Board() {
  const [matrix, setMatrix] = useState<Matrix>(initialMatrix);
  const start = useRef<Vector>(DEFAULT_START_POS);
  const end = useRef<Vector>(DEFAULT_END_POS);
  const adjacencyList = useRef(getAdjacencyList(matrix));

  function setStartEndPos([row, col]: Vector, method: StartEnd) {
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

  function updateMatrixStartEnd(array: Vector, method: StartEnd) {
    const refMap = {
      start: start.current,
      end: end.current,
    };
    const status = SQUARE_STATUS_MAP[method];
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

  function handleMouseOver(e: React.MouseEvent, [rowIdx, colIdx]: Vector) {
    e.preventDefault();
    e.stopPropagation();

    if (e.buttons === 1) {
      if (e.ctrlKey) {
        setSquaresOnOff([rowIdx, colIdx], "off");
      } else if (e.shiftKey) {
        setSquaresOnOff([rowIdx, colIdx], "on");
      }
    }
  }

  function handleLeftClick(e: React.MouseEvent, [rowIdx, colIdx]: Vector) {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey) {
      setSquaresOnOff([rowIdx, colIdx], "off");
    } else if (e.shiftKey) {
      setSquaresOnOff([rowIdx, colIdx], "on");
    } else {
      setStartEndPos([rowIdx, colIdx], "start");
    }
  }

  function handleRightClick(e: React.MouseEvent, [rowIdx, colIdx]: Vector) {
    e.preventDefault();
    e.stopPropagation();

    setStartEndPos([rowIdx, colIdx], "end");
  }

  function setSquaresOnOff(array: Vector, method: OnOff) {
    const [row, col] = array;

    setMatrix((prev) => {
      if (prev[row][col] !== 3 && prev[row][col] !== 0) {
        return prev;
      }
      const previous = JSON.parse(JSON.stringify(prev));

      previous[row][col] = previous[row][col] =
        method === "off" ? SQUARE_STATUS_MAP.off : SQUARE_STATUS_MAP.neutral;

      adjacencyList.current = getAdjacencyList(previous);

      return previous;
    });
  }

  function renderGrid(renderableMatrix: Matrix) {
    return renderableMatrix.map((row, rowIdx) =>
      row
        .map((element, colIdx) => (
          <P.Square
            key={`${rowIdx}${colIdx}`}
            $status={element}
            onClick={(e) => handleLeftClick(e, [rowIdx, colIdx] as Vector)}
            onMouseOver={(e) => handleMouseOver(e, [rowIdx, colIdx] as Vector)}
            onContextMenu={(e) =>
              handleRightClick(e, [rowIdx, colIdx] as Vector)
            }
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
