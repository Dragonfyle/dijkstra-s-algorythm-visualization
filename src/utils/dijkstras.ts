import { useCallback, useEffect, useRef, useState } from "react";
import { AdjacencyList } from "../types/board.types";
import { binaryHeap } from "./binaryHeap";
import { UseDijkstrasProps, runVisualization } from "./dijkstras.utils";

export default function useDijkstras({
  graph,
  start,
  end,
  LayerRef,
}: UseDijkstrasProps) {
  const path = useRef<number[]>([]);
  const parentList = useRef({});
  const [isRunning, setIsRunning] = useState(false);

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
        const previous = {};

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
              previous[nodeNumber] = currentClosestNode.nodeNumber;
            } else if (newDistance < distances.get(nodeNumber)) {
              nodeObject.distance = newDistance;
              previous[nodeNumber] = currentClosestNode.nodeNumber;
            }
          }
        }
        path.current = newPath;
        parentList.current = previous;
      }
      console.time("dijkstras");
      dijkstras(graph, start, end);
      console.timeEnd("dijkstras");
      runVisualization({
        layerRef: LayerRef.current,
        end,
        start,
        path,
        parentArray: parentList,
        onDone: () => setIsRunning(false),
      });
    },
    [graph, start, end, isRunning, LayerRef]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyboardListener);

    return () => {
      window.removeEventListener("keydown", keyboardListener);
    };
  }, [keyboardListener]);

  return isRunning;
}
