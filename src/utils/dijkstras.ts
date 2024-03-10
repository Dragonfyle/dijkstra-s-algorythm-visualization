import { useCallback, useEffect, useRef, useState } from "react";
import { AdjacencyList } from "../types/board.types";
import Konva from "konva";
import {
  SQUARE_STATUS_MAP,
  getBackgroundColor,
} from "../components/Board.utils";

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
  const shortestPath = useRef<(number | undefined)[]>([]);
  const [isRunning, setIsRunning] = useState(false);

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

  const reconstructShortestPath = useCallback(function reconstructShortestPath(
    distances: Map<number, number>,
    startRectNumber
  ) {
    const rectNumbers = [...distances.keys()];
    const shortestPath = [];

    while (rectNumbers) {
      shortestPath.push(rectNumbers.pop());
    }
    return shortestPath;
  },
  []);

  const runVisualization = useCallback(
    async function runVisualization() {
      const calculatedPath = path.current;

      for (let i = 0, j = calculatedPath.length - 1; i <= j; i++) {
        setTimeout(() => {
          colorRect(calculatedPath[i]);
          if (i === j) {
            setIsRunning(false);
          }
        }, Math.max(MIN_DELAY, DELAY_MULTIPLIER * i));
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

      if (!isKeySupported || isRunning) return;

      e.preventDefault();
      setIsRunning(true);

      async function dijkstras(
        graph: AdjacencyList,
        start: number,
        end: number
      ) {
        const distances = new Map();
        const visited = new Map();
        const newPath = [];
        let previousClosest = start;

        const nodes = [...graph.keys()];

        nodes.forEach((node) => distances.set(node, Infinity));
        distances.set(start, 0);

        while (nodes.length) {
          nodes.sort((a, b) => distances.get(a) - distances.get(b));
          const currentClosestNode = nodes.shift();
          const colsestNodeDistance = distances.get(currentClosestNode);

          if (!currentClosestNode || colsestNodeDistance === Infinity) break;

          visited.set(currentClosestNode, { previousClosest: previousClosest });
          newPath.push(currentClosestNode);

          if (currentClosestNode === end) {
            break;
          }

          const edges = graph.get(currentClosestNode);
          if (!edges) continue;
          const neighborNodes = edges.entries();

          for (const [nodeNumber, edgeWeight] of neighborNodes) {
            if (visited.has(nodeNumber)) continue;

            const newDistance = distances.get(currentClosestNode) + edgeWeight;

            if (newDistance < distances.get(nodeNumber)) {
              distances.set(nodeNumber, newDistance);
            }
          }
          previousClosest = currentClosestNode;
        }
        path.current = newPath;
        console.log(visited);
        // shortestPath.current = reconstructShortestPath(distances);
      }

      dijkstras(graph, start, end);
      runVisualization();
    },
    [graph, start, end, isRunning, runVisualization, reconstructShortestPath]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyboardListener);
    window.addEventListener("keyup", keyboardListener);

    return () => {
      window.removeEventListener("keydown", keyboardListener);
      window.removeEventListener("keyup", keyboardListener);
    };
  }, [keyboardListener]);

  return isRunning;
}
