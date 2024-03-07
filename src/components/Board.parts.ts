import styled from "styled-components";
import { getBackgroundColor } from "./Board.utils";

export const BoardWrapper = styled.main`
  display: flex;
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 1fr);
  grid-template-rows: repeat(30, 1fr);
  height: 800px;
  width: 800px;
  gap: 0.8px;
`;

export const Square = styled.div<{ status: number }>`
  background-color: ${getBackgroundColor};
  height: 100%;
  width: 100%;
`;
