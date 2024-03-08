import { Vector } from "../types/board.types";

const GRID_SIDE_LENGTH = 50;

const DEFAULT_START_POS = [0, 0] as Vector;
const DEFAULT_END_POS = [GRID_SIDE_LENGTH - 1, GRID_SIDE_LENGTH - 1] as Vector;

export { DEFAULT_END_POS, DEFAULT_START_POS, GRID_SIDE_LENGTH };
