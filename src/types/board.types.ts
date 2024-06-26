import { CONFIGURATION } from "../config/initialConfig";

type StartEnd = "start" | "end";

type OnOff = "on" | "off";

type Direction = "left" | "right" | "up" | "down";

type NumericRange<
  START extends number,
  END extends number,
  ARR extends unknown[] = [],
  ACC extends number = never
> = ARR["length"] extends END
  ? ACC | START | END
  : NumericRange<
      START,
      END,
      [...ARR, 1],
      ARR[START] extends undefined ? ACC : ACC | ARR["length"]
    >;

type Coord = NumericRange<0, typeof CONFIGURATION.GRID_SIDE_LENGTH, []>;

type Vector = [Coord, Coord];

type SquareStatus = 0 | 1 | 2 | 3 | 4 | 5;

type Row = SquareStatus[];

type Matrix = Row[];

type StringifiedVector = `row${number}col${number}`;

type AdjacencyList = Map<number, Map<number, number>>;

export type {
  StartEnd,
  OnOff,
  Vector,
  Row,
  Matrix,
  StringifiedVector,
  SquareStatus,
  Coord,
  AdjacencyList,
  Direction,
};
