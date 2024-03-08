import styled from "styled-components";
import { getBackgroundColor } from "./Board.utils";
import { GRID_SIDE_LENGTH } from "../config/initialConfig";
import { SquareStatus } from "../types/board.types";

export const BoardWrapper = styled.main`
  display: flex;
  user-select: none;
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_SIDE_LENGTH}, 1fr);
  grid-template-rows: repeat(${GRID_SIDE_LENGTH}, 1fr);
  height: 800px;
  width: 800px;
  gap: 0.8px;
`;

export const Square = styled.div<{ $status: SquareStatus }>`
  background-color: ${getBackgroundColor};
  height: 100%;
  width: 100%;
`;
