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
  const orderedVisitedNodes = useRef<number[]>([]);
  const parentList = useRef<Map<number, number>>();
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
        const previous = new Map();

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

            if (nodeObject === undefined) {
              priorityQueue.insert({
                nodeNumber: nodeNumber,
                distance: newDistance,
              });
              previous.set(nodeNumber, currentClosestNode.nodeNumber);
            } else if (newDistance < distances.get(nodeNumber)) {
              nodeObject.distance = newDistance;
              previous.set(nodeNumber, currentClosestNode.nodeNumber);
            }
          }
        }
        orderedVisitedNodes.current = newPath;
        parentList.current = previous;
      }

      dijkstras(graph, start, end);

      if (LayerRef.current) {
        runVisualization({
          layerRef: LayerRef.current,
          end,
          start,
          orderedVisitedNodes: orderedVisitedNodes.current,
          parentArray: parentList.current,
          onDone: () => setIsRunning(false),
        });
      }
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
