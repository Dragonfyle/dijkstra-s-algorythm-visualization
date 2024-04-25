import Konva from "konva";
import { AdjacencyList, SquareStatus } from "../types/board.types";
import { Layer } from "konva/lib/Layer";
import {
  SQUARE_STATUS_MAP,
  getBackgroundColor,
} from "../components/Board.utils";
import { CONFIGURATION } from "../config/initialConfig";
import { ParentArray, RectNumber } from "../types/algorythm.types";

interface UseDijkstrasProps {
  graph: AdjacencyList;
  start: number;
  end: number;
  LayerRef: React.RefObject<Konva.Layer>;
}

interface RunVisualization {
  visitedList: RectNumber[];
  end: RectNumber;
  start: RectNumber;
  parentArray: ParentArray;
  layerRef: Layer;
  onDone: () => void;
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
  return new Promise((res) => {
    for (let i = 0, j = visitedList.length - 1; i <= j; i++) {
      setTimeout(() => {
        colorRect(visitedList[i], SQUARE_STATUS_MAP.visited, layerRef);

        if (i === j) {
          res("done");
          onDone;
        }
      }, Math.max(CONFIGURATION.MIN_DELAY, CONFIGURATION.TIMEOUT_DELAY * i * CONFIGURATION.DELAY_MULTIPLIER));
    }
  });
}

function visualizeShortestPath(
  end: RectNumber,
  start: RectNumber,
  parentArray: ParentArray
) {
  const shortestPath = [];

  let current: RectNumber = end;

  while (current !== start) {
    const next = parentArray[current];
    shortestPath.push(next);
    current = next;
  }

  shortestPath.map((nodeNumber) => {
    colorRect(nodeNumber, SQUARE_STATUS_MAP.path, layerRef);
  });
}

async function runVisualization({
  visitedList,
  end,
  start,
  parentArray,
  layerRef,
  onDone,
}: RunVisualization) {
  await colorVisited(visitedList, layerRef, onDone);
  visualizeShortestPath(end, start, parentArray);
}

export { runVisualization };

export type { UseDijkstrasProps };
