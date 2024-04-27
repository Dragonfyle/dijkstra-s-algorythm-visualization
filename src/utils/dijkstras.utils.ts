import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import {
  SQUARE_STATUS_MAP,
  getBackgroundColor,
} from "../components/Board.utils";
import { CONFIGURATION } from "../config/initialConfig";
import {
  ParentArray,
  RectNumber,
  RunVisualization,
} from "../types/algorythm.types";
import { AdjacencyList, SquareStatus } from "../types/board.types";

interface UseDijkstrasProps {
  graph: AdjacencyList;
  start: number;
  end: number;
  LayerRef: React.RefObject<Konva.Layer>;
}

function colorRect(rectNumber: number, color: SquareStatus, LayerRef: Layer) {
  if (!LayerRef || !LayerRef.children.length) return;

  const rect = LayerRef.findOne(`#${rectNumber}`);
  if (!rect) return;

  rect.setAttr("fill", getBackgroundColor({ status: color }));
}

async function colorVisited(
  visitedList: number[],
  layerRef: Layer,
  onDone: () => void
) {
  const NUM_VISITED_NODES = visitedList.length - 1;
  const WITHOUT_START_IDX = 1;
  const WITHOUT_END_IDX = NUM_VISITED_NODES - 1;

  return new Promise((res) => {
    for (let i = WITHOUT_START_IDX, j = WITHOUT_END_IDX; i <= j; i++) {
      setTimeout(() => {
        colorRect(visitedList[i], SQUARE_STATUS_MAP.visited, layerRef);

        if (i === j) {
          res("done");
          onDone();
        }
      }, Math.max(CONFIGURATION.MIN_DELAY, CONFIGURATION.TIMEOUT_DELAY * i * CONFIGURATION.DELAY_MULTIPLIER));
    }
  });
}

function visualizeShortestPath(
  end: RectNumber,
  start: RectNumber,
  parentArray: ParentArray,
  layerRef: Layer
) {
  const shortestPath = [];

  let current: RectNumber = end;

  while (true) {
    const next = parentArray.get(current);
    if (next === undefined)
      throw new Error("encountered undefined in parentArray");
    if (next === start) break;

    shortestPath.push(next);
    current = next;
  }

  shortestPath.map((nodeNumber) => {
    colorRect(nodeNumber, SQUARE_STATUS_MAP.path, layerRef);
  });
}

async function runVisualization({
  orderedVisitedNodes,
  end,
  start,
  parentArray,
  layerRef,
  onDone,
}: RunVisualization) {
  if (!parentArray || !layerRef) return;
  const allExceptStartEnd = layerRef.children.slice(1, -1);
  const visitedColor = getBackgroundColor({
    status: SQUARE_STATUS_MAP.visited,
  });
  const pathColor = getBackgroundColor({ status: SQUARE_STATUS_MAP.path });

  allExceptStartEnd.forEach((child) => {
    const rectColor = child.getAttr("fill");

    if (rectColor === visitedColor || rectColor === pathColor) {
      child.setAttr(
        "fill",
        getBackgroundColor({ status: SQUARE_STATUS_MAP.neutral })
      );
    }
  });

  await colorVisited(orderedVisitedNodes, layerRef, onDone);
  visualizeShortestPath(end, start, parentArray, layerRef);
}

export { runVisualization, colorRect };

export type { UseDijkstrasProps };
