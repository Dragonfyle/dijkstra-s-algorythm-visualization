import { useCallback, useEffect, useRef, useState } from "react";
import { AdjacencyList } from "../types/board.types";
import Konva from "konva";
import {
  SQUARE_STATUS_MAP,
  getBackgroundColor,
} from "../components/Board.utils";
import { binaryHeap } from "./binaryHeap";

interface UseDijkstrasProps {
  graph: AdjacencyList;
  start: number;
  end: number;
  LayerRef: React.RefObject<Konva.Layer>;
}

const MIN_DELAY = 5;
const DELAY_MULTIPLIER = 1;

export default function useDijkstras({
  graph,
  start,
  end,
  LayerRef,
}: UseDijkstrasProps) {
  const path = useRef<number[]>([]);
  // const shortestPath = useRef<(number | undefined)[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // const reconstructShortestPath = useCallback(function reconstructShortestPath(
  // distances: Map<number, number>,
  // startRectNumber
  // ) {
  // const rectNumbers = [...distances.keys()];
  // const shortestPath = [];
  //
  // while (rectNumbers) {
  // shortestPath.push(rectNumbers.pop());
  // }
  // return shortestPath;
  // },
  // []);

  const colorRect = useCallback(
    function colorRect(rectNumber: number) {
      if (!LayerRef.current || !LayerRef.current.children.length) return;

      const [rect] = LayerRef.current.find(`#${rectNumber}`);
      rect.setAttr(
        "fill",
        getBackgroundColor({ status: SQUARE_STATUS_MAP.visited })
      );
    },
    [LayerRef]
  );

  const runVisualization = useCallback(
    async function runVisualization() {
      const calculatedPath = path.current;

      for (let i = 0, j = calculatedPath.length - 1; i <= j; i++) {
        setTimeout(() => {
          colorRect(calculatedPath[i]);

          if (i === j) {
            setIsRunning(false);
          }
        }, Math.max(MIN_DELAY, DELAY_MULTIPLIER * i * 50));
      }
    },
    [colorRect]
  );

  const keyboardListener = useCallback(
    (e: KeyboardEvent) => {
      const supportedKeys = {
        SPACE: " ",
      };
      const isKeySupported = Object.values(supportedKeys).includes(e.key);

      if (!isKeySupported || e.repeat || isRunning) return;

      e.preventDefault();
      setIsRunning(true);

      async function dijkstras(
        graph: AdjacencyList,
        start: number,
        end: number
      ) {
        const distances = new Map();
        const priorityQueue = binaryHeap();
        const visited = new Set();
        const newPath = [];

        priorityQueue.insert({ nodeNumber: start, distance: 0 });

        while (priorityQueue.length) {
          const currentClosestNode = priorityQueue.poll();
          const closestNodeDistance = currentClosestNode.distance;

          if (!currentClosestNode || closestNodeDistance === Infinity) break;

          visited.add(currentClosestNode.nodeNumber);
          newPath.push(currentClosestNode.nodeNumber);

          if (currentClosestNode.nodeNumber === end) {
            break;
          }

          const edges = graph.get(currentClosestNode.nodeNumber)?.entries();
          if (!edges) continue;

          for (const [nodeNumber, edgeWeight] of edges) {
            if (visited.has(nodeNumber)) continue;

            const newDistance = currentClosestNode.distance + edgeWeight;
            const nodeObject = priorityQueue.getNode(nodeNumber);

            if (!nodeObject) {
              priorityQueue.insert({
                nodeNumber: nodeNumber,
                distance: newDistance,
              });
            } else if (newDistance < distances.get(nodeNumber)) {
              nodeObject.distance = newDistance;
            }
          }
        }
        path.current = newPath;
      }
      console.time("dijkstras");
      dijkstras(graph, start, end);
      console.timeEnd("dijkstras");
      runVisualization();
    },
    [graph, start, end, isRunning, runVisualization]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyboardListener);

    return () => {
      window.removeEventListener("keydown", keyboardListener);
    };
  }, [keyboardListener]);

  return isRunning;
}
