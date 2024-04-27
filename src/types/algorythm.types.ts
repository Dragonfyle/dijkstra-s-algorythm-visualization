import { Layer } from "konva/lib/Layer";

type RectNumber = number;

type ParentArray = Map<number, number>;

interface RunVisualization {
  orderedVisitedNodes: RectNumber[];
  end: RectNumber;
  start: RectNumber;
  parentArray: ParentArray | undefined;
  layerRef: Layer | undefined;
  onDone: () => void;
}

export type { RectNumber, ParentArray, RunVisualization };
