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
  GRID_SIDE_LENGTH: 50,
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
  startPos: 0,
  endPos: _CONFIGURATION.GRID_SIDE_LENGTH ** 2 - 1,
  endNode: `row${_CONFIGURATION.GRID_SIDE_LENGTH - 1}col${
    _CONFIGURATION.GRID_SIDE_LENGTH - 1
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
