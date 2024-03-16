const _CONFIGURATION = Object.freeze({
  KONVA: Object.freeze({
    STAGE: Object.freeze({
      WIDTH: 650,
      HEIGHT: 650,
    }),
    SQUARE: Object.freeze({
      SPACING_COEF: 1.1,
    }),
  }),
  GRID_SIDE_LENGTH: 40,
  STATUS_COLORS: Object.freeze({
    0: "#999",
    1: "seagreen",
    2: "red",
    3: "#555",
    4: "#66b",
    5: "blue",
  }),
});

const CONFIGURATION = new Proxy(_CONFIGURATION, {
  set: () => {
    throw new Error("configuration is readonly, do not mutate");
  },
});

const _defaults = Object.freeze({
  SIDE_LENGTH: CONFIGURATION.KONVA.STAGE.WIDTH / CONFIGURATION.GRID_SIDE_LENGTH,
  startPos: 0,
  endPos: _CONFIGURATION.GRID_SIDE_LENGTH ** 2 - 1,
  endNode: `row${_CONFIGURATION.GRID_SIDE_LENGTH - 1}col${
    _CONFIGURATION.GRID_SIDE_LENGTH - 1
  }`,
});

const defaults = new Proxy(_defaults, {
  set: () => {
    throw new Error("defaults is readonly, do not mutate");
  },
});

export { CONFIGURATION, defaults };
