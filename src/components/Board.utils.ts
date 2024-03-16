import { CONFIGURATION as CONF, defaults } from "../config/initialConfig";
import { SquareStatus } from "../types/board.types";

const SQUARE_STATUS_MAP = {
  neutral: 0,
  start: 1,
  end: 2,
  off: 3,
  visited: 4,
  path: 5,
} as const;

function delay(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const initialRectMap = new Map<number, SquareStatus>();

(function populateMap() {
  for (let i = 0; i < CONF.GRID_SIDE_LENGTH ** 2; i++) {
    initialRectMap.set(i, 0);
  }

  initialRectMap.set(defaults.startPos, SQUARE_STATUS_MAP.start);
  initialRectMap.set(defaults.endPos, SQUARE_STATUS_MAP.end);
})();

function getBackgroundColor({ status }: { status: SquareStatus }) {
  switch (status) {
    case 0:
      return CONF.STATUS_COLORS[0];
    case 1:
      return CONF.STATUS_COLORS[1];
    case 2:
      return CONF.STATUS_COLORS[2];
    case 3:
      return CONF.STATUS_COLORS[3];
    case 4:
      return CONF.STATUS_COLORS[4];
    case 5:
      return CONF.STATUS_COLORS[5];
  }
}

function getSquareConfig() {
  return {
    sideLength:
      CONF.KONVA.STAGE.WIDTH /
      (CONF.GRID_SIDE_LENGTH * CONF.KONVA.SQUARE.SPACING_COEF),
    posX: defaults.SIDE_LENGTH,
    posY: defaults.SIDE_LENGTH,
  };
}

export {
  SQUARE_STATUS_MAP,
  initialRectMap,
  getBackgroundColor,
  delay,
  getSquareConfig,
};
