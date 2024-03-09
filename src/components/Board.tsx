import React, { useEffect, useState } from "react";
import {
  getBackgroundColor,
  initialMatrix,
  SQUARE_STATUS_MAP,
} from "./Board.utils";
import { CONFIGURATION as CONF, defaults } from "../config/initialConfig";
import { getAdjacencyList, stringifyVector } from "../utils/adjacencyList";
import { Matrix, OnOff, StartEnd, Vector } from "../types/board.types";
import * as P from "./Board.parts";
import useDijkstras from "../utils/dijkstras";
import { Layer, Rect, Stage } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

export default function Board() {
  const [matrix, setMatrix] = useState<Matrix>(initialMatrix);
  const [start, setStart] = useState<Vector>(defaults.StartPos);
  const [end, setEnd] = useState<Vector>(defaults.EndPos);
  const [adjacencyList, setAdjacencyList] = useState(getAdjacencyList(matrix));
  const [version, setVersion] = useState(0);
  const [zoom, setZoom] = useState(1);

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
    const stateMap = {
      start: start,
      end: end,
    };
    const status = SQUARE_STATUS_MAP[method];
    const [row, col] = array;
    const [prevRow, prevCol] = stateMap[method];

    setMatrix((prev) => {
      const previous = JSON.parse(JSON.stringify(prev));
      previous[prevRow][prevCol] = 0;
      previous[row][col] = status;

      return previous;
    });
    method === "end" ? setEnd([row, col]) : setStart([row, col]);
  }

  function handleLeftClick(
    e: KonvaEventObject<MouseEvent>,
    [rowIdx, colIdx]: Vector
  ) {
    e.evt.preventDefault();
    e.evt.stopPropagation();

    let buttonProperty: "button" | "buttons" | undefined;
    let primaryBtnId: 0 | 1 | undefined;

    switch (e.type) {
      case "click":
        buttonProperty = "button";
        primaryBtnId = 0;
        break;
      case "mousemove":
        buttonProperty = "buttons";
        primaryBtnId = 1;
        break;
    }
    if (!buttonProperty || primaryBtnId === undefined) return;

    if (e.evt[buttonProperty] === primaryBtnId) {
      if (e.evt.ctrlKey) {
        setSquaresOnOff([rowIdx, colIdx], "off");
        setVersion(Math.random());
      } else if (e.evt.shiftKey) {
        setSquaresOnOff([rowIdx, colIdx], "on");
        setVersion(Math.random());
      } else {
        setStartEndPos([rowIdx, colIdx], "start");
        setVersion(Math.random());
      }
    } else if (e.evt[buttonProperty] === 2) {
      setStartEndPos([rowIdx, colIdx], "end");
      setVersion(Math.random());
    }
  }

  function handleRightClick(e: KonvaEventObject<MouseEvent>) {
    e.evt.preventDefault();
    e.evt.stopPropagation();
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

  const squareConfig = {
    sideLength:
      (CONF.KONVA.STAGE.WIDTH /
        (CONF.NUM_SQUARES * CONF.KONVA.SQUARE.SPACING_COEF)) *
      zoom,
    posX: CONF.KONVA.SQUARE.SIDE_LENGTH * zoom,
    posY: CONF.KONVA.SQUARE.SIDE_LENGTH * zoom,
  };

  function renderGrid(renderableMatrix: Matrix) {
    return renderableMatrix.map((row, rowIdx) =>
      row
        .map((element, colIdx) => (
          <Rect
            fill={getBackgroundColor({ status: element })}
            width={squareConfig.sideLength}
            height={squareConfig.sideLength}
            x={squareConfig.posX * colIdx}
            y={squareConfig.posY * rowIdx}
            // key={`${rowIdx}${colIdx}${element}`}
            onMouseMove={(e) => handleLeftClick(e, [rowIdx, colIdx] as Vector)}
            onClick={(e) => handleLeftClick(e, [rowIdx, colIdx] as Vector)}
            // onMouseOver={(e) => handleMouseOver(e, [rowIdx, colIdx] as Vector)}
            onContextMenu={(e) => handleRightClick(e)}
          />
        ))
        .flat()
    );
  }

  function handleWheel(e: KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();
    if (e.evt.deltaY > 0) {
      setZoom((prev) => Math.max(1, prev - 0.3));
    } else {
      setZoom((prev) => Math.min(10, prev + 0.3));
    }
  }

  useEffect(() => {
    updateMatrixStartEnd(defaults.StartPos, "start");
    updateMatrixStartEnd(defaults.EndPos, "end");
  }, []);

  return (
    <P.BoardWrapper>
      <Stage
        height={CONF.KONVA.STAGE.HEIGHT}
        width={CONF.KONVA.STAGE.WIDTH}
        onWheel={(e) => handleWheel(e)}
        onContextMenu={(e) => handleRightClick(e)}
      >
        <Layer>{...renderGrid(matrix)}</Layer>
      </Stage>
    </P.BoardWrapper>
  );
}
