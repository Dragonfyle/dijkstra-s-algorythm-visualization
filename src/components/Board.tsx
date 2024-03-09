import React, { useEffect, useState } from "react";
import { initialMatrix, SQUARE_STATUS_MAP } from "./Board.utils";
import { DEFAULT_END_POS, DEFAULT_START_POS } from "../config/initialConfig";
import { getAdjacencyList, stringifyVector } from "../utils/adjacencyList";
import { Matrix, OnOff, StartEnd, Vector } from "../types/board.types";
import * as P from "./Board.parts";
import useDijkstras from "../utils/dijkstras";

export default function Board() {
  const [matrix, setMatrix] = useState<Matrix>(initialMatrix);
  const [start, setStart] = useState<Vector>(DEFAULT_START_POS);
  const [end, setEnd] = useState<Vector>(DEFAULT_END_POS);
  const [adjacencyList, setAdjacencyList] = useState(getAdjacencyList(matrix));
  const [version, setVersion] = useState(0);

  useDijkstras({
    // matrix,
    graph: adjacencyList,
    start: stringifyVector(start),
    // end: EN5D_NODE,
    updateMatrix: setMatrix,
    version,
  });

  function setStartEndPos([row, col]: Vector, method: StartEnd) {
    const reverseRefMap = {
      start: end,
      end: start,
    };

    const [currRow, currCol] = reverseRefMap[method];

    if (row === currRow && col === currCol) {
      return;
    }
    updateMatrixStartEnd([row, col], method);
  }

  function updateMatrixStartEnd(array: Vector, method: StartEnd) {
    const refMap = {
      start: start,
      end: end,
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
    method === "end" ? setEnd([row, col]) : setStart([row, col]);
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
      setVersion(Math.random());
    }
  }

  function handleLeftClick(e: React.MouseEvent, [rowIdx, colIdx]: Vector) {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey) {
      setSquaresOnOff([rowIdx, colIdx], "off");
      setVersion(Math.random());
    } else if (e.shiftKey) {
      setSquaresOnOff([rowIdx, colIdx], "on");
      setVersion(Math.random());
    } else {
      setStartEndPos([rowIdx, colIdx], "start");
      setVersion(Math.random());
    }
  }

  function handleRightClick(e: React.MouseEvent, [rowIdx, colIdx]: Vector) {
    e.preventDefault();
    e.stopPropagation();

    setStartEndPos([rowIdx, colIdx], "end");
    setVersion(Math.random());
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

      setAdjacencyList(getAdjacencyList(previous));

      return previous;
    });
    setVersion(Math.random());
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
