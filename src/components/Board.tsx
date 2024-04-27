import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Layer, Rect, Stage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import {
  createNewRectMap,
  getBackgroundColor,
  getSquareConfig,
  SQUARE_STATUS_MAP,
} from "./Board.utils";
import { CONFIGURATION as CONF, defaults } from "../config/initialConfig";
import { getAdjacencyList } from "../utils/adjacencyList";
import { OnOff, SquareStatus, StartEnd } from "../types/board.types";
import useDijkstras from "../utils/dijkstras";
import { colorRect } from "../utils/dijkstras.utils";
import * as P from "./Board.parts";

export default function Board() {
  const [rectMap, setRectMap] = useState(createNewRectMap);
  const start = useRef<number>(defaults.startPos);
  const end = useRef<number>(defaults.endPos);
  const adjacencyList = useRef(getAdjacencyList(rectMap));
  const LayerRef = useRef<Konva.Layer>(null);
  const isRunning = useDijkstras({
    graph: adjacencyList.current,
    start: start.current,
    end: end.current,
    LayerRef: LayerRef,
  });
  useEffect(() => {
    setStartEndPos(start.current, "start");
    setStartEndPos(end.current, "end");
  }, []);

  function setStartEndPos(rectNumber: number, method: StartEnd) {
    function updateMatrixStartEnd(rectNumber: number, method: StartEnd) {
      const stateMap = {
        start: start.current,
        end: end.current,
      };
      const status = SQUARE_STATUS_MAP[method];
      const prevRectNumber = stateMap[method];

      setRectMap((prev) => {
        const newRectMap = new Map(prev);
        newRectMap.set(prevRectNumber, 0);
        newRectMap.set(rectNumber, status);
        return newRectMap;
      });

      method === "end"
        ? (end.current = rectNumber)
        : (start.current = rectNumber);
    }

    const reverseRefMap = {
      start: end.current,
      end: start.current,
    };

    //when trying to set start, this will be the end and vice versa
    const otherEndRectNumber = reverseRefMap[method];

    if (rectNumber === otherEndRectNumber) {
      return;
    }

    updateMatrixStartEnd(rectNumber, method);
  }

  function handleLeftClick(
    e: KonvaEventObject<MouseEvent>,
    rectNumber: number
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
        setSquaresOnOff(rectNumber, "off");
      } else if (e.evt.shiftKey) {
        setSquaresOnOff(rectNumber, "on");
      } else {
        setStartEndPos(rectNumber, "start");
      }
    } else if (e.evt[buttonProperty] === 2) {
      setStartEndPos(rectNumber, "end");
    }
  }

  function handleRightClick(e: KonvaEventObject<MouseEvent>) {
    e.evt.preventDefault();
    e.evt.stopPropagation();
  }

  function setSquaresOnOff(rectNumber: number, method: OnOff) {
    const requestedStatus =
      method === "off" ? SQUARE_STATUS_MAP.off : SQUARE_STATUS_MAP.neutral;

    setRectMap((prev) => {
      const previousStatus = rectMap.get(rectNumber);

      if (previousStatus !== 3 && previousStatus !== 0) {
        return prev;
      }

      const newRectMap = new Map(prev);

      newRectMap.set(rectNumber, requestedStatus);

      adjacencyList.current = getAdjacencyList(newRectMap);

      return newRectMap;
    });
  }

  const squareConfig = getSquareConfig();

  function renderGrid(rectMap: Map<number, SquareStatus>) {
    const grid: JSX.Element[] = [];

    rectMap.forEach((status, idx) => {
      const color = getBackgroundColor({ status });

      grid.push(
        <Rect
          id={`${idx}`}
          fill={color}
          width={squareConfig.sideLength}
          height={squareConfig.sideLength}
          x={squareConfig.posX * (idx % CONF.GRID_SIDE_LENGTH)}
          y={squareConfig.posY * Math.floor(idx / CONF.GRID_SIDE_LENGTH)}
          key={`${idx}`}
          onMouseMove={(e) => handleLeftClick(e, idx)}
          onClick={(e) => handleLeftClick(e, idx)}
          onContextMenu={(e) => handleRightClick(e)}
        />
      );
    });

    return grid;
  }

  function handleClear() {
    function resetRectMap() {
      const newRectMap = createNewRectMap();
      setRectMap(newRectMap);
      adjacencyList.current = getAdjacencyList(newRectMap);
      setStartEndPos(start.current, "start");
      setStartEndPos(end.current, "end");
    }

    if (!LayerRef.current) return;

    resetRectMap();
    LayerRef.current.children.forEach((child) =>
      child.setAttr(
        "fill",
        getBackgroundColor({ status: SQUARE_STATUS_MAP.neutral })
      )
    );

    colorRect(start.current, SQUARE_STATUS_MAP.start, LayerRef.current);
    colorRect(end.current, SQUARE_STATUS_MAP.end, LayerRef.current);
  }

  return (
    <P.BoardWrapper>
      <Stage
        height={CONF.KONVA.STAGE.HEIGHT}
        width={CONF.KONVA.STAGE.WIDTH}
        onContextMenu={(e) => handleRightClick(e)}
      >
        <Layer ref={LayerRef}>{...renderGrid(rectMap)}</Layer>
      </Stage>
      <P.StyledButton disabled={isRunning} onClick={handleClear}>
        Clear
      </P.StyledButton>
    </P.BoardWrapper>
  );
}
