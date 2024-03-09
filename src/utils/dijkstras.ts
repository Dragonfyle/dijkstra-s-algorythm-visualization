import { SetStateAction, useCallback, useEffect } from "react";
import { AdjacencyList, Matrix, StringifiedVector } from "../types/board.types";
import { parseVector } from "./adjacencyList";
import { SQUARE_STATUS_MAP } from "../components/Board.utils";

interface UseDijkstrasProps {
  //   matrix: Matrix;
  graph: AdjacencyList;
  start: StringifiedVector;
  //   end: StringifiedVector;
  updateMatrix: React.Dispatch<SetStateAction<Matrix>>;
  version: number;
}

function delay(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export default function useDijkstras({
  //   matrix,
  graph,
  start,
  //   end,
  updateMatrix,
  version,
}: UseDijkstrasProps) {
  const keyboardListener = useCallback(
    (e: KeyboardEvent) => {
      const supportedKeys = {
        SPACE: " ",
      };
      const isKeySupported = Object.values(supportedKeys).includes(e.key);
      isKeySupported && e.preventDefault();

      async function dijkstras(
        graph: AdjacencyList,
        start: StringifiedVector

        // end: StringifiedVector
      ) {
        const distances = new Map();
        const visited = new Set();

        const nodes = Array.from(graph.keys()) as StringifiedVector[];

        nodes.forEach((node) => distances.set(node, Infinity));

        distances.set(start, 0);

        while (nodes.length) {
          nodes.sort((a, b) => distances.get(a) - distances.get(b));
          const closestNode = nodes.shift();
          const colsestNodeDistance = distances.get(closestNode);

          if (!closestNode || colsestNodeDistance === Infinity) break;

          visited.add(closestNode);

          const connections = graph.get(closestNode);
          if (!connections) break;

          for (const neighbor of connections.keys()) {
            if (visited.has(neighbor)) continue;

            const newDistance =
              distances.get(closestNode) +
              connections?.get(neighbor as StringifiedVector);

            if (newDistance < distances.get(neighbor)) {
              distances.set(neighbor, newDistance);
            }
            updateMatrix((prev) => {
              const previous = JSON.parse(JSON.stringify(prev));
              const [row, col] = parseVector(neighbor);

              previous[row][col] = SQUARE_STATUS_MAP.visited;

              return previous;
            });

            await delay(1);
          }
        }
      }

      function handleRunDijkstras() {
        return dijkstras(graph, start);
      }

      isKeySupported && handleRunDijkstras();
    },
    [graph, start, updateMatrix, version]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyboardListener);
    window.addEventListener("keyup", keyboardListener);

    return () => {
      window.removeEventListener("keydown", keyboardListener);
      window.removeEventListener("keyup", keyboardListener);
    };
  }, [keyboardListener]);
}
