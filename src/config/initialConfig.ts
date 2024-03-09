import { Vector } from "../types/board.types";

const _CONFIGURATION = Object.freeze({
  KONVA: Object.freeze({
    STAGE: Object.freeze({
      WIDTH: 650,
      HEIGHT: 650,
    }),
    SQUARE: Object.freeze({
      SIDE_LENGTH: 11,
      SPACING_COEF: 1.3,
    }),
  }),
  NUM_SQUARES: 50,
  START_NODE: "row0col0",
  STATUS_COLORS: Object.freeze({
    0: "#999",
    1: "seagreen",
    2: "red",
    3: "#555",
    4: "#66b",
    5: "blue",
  }),
});

const _defaults = Object.freeze({
  StartPos: [0, 0] as Vector,
  EndPos: [
    _CONFIGURATION.NUM_SQUARES - 1,
    _CONFIGURATION.NUM_SQUARES - 1,
  ] as Vector,
  endNode: `row${_CONFIGURATION.NUM_SQUARES - 1}col${
    _CONFIGURATION.NUM_SQUARES - 1
  }`,
});

const CONFIGURATION = new Proxy(_CONFIGURATION, {
  set: () => {
    throw new Error("configuration is readonly, do not mutate");
  },
});

const defaults = new Proxy(_defaults, {
  set: () => {
    throw new Error("defaults is readonly, do not mutate");
  },
});

export { CONFIGURATION, defaults };
