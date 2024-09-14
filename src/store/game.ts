import { GameState } from "~/models/game";

export const InitialState: GameState = {
  players: {},
  history: [],
  state: "waiting",
  currentTurn: null,
};
