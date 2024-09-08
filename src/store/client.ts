import { createStore } from "solid-js/store";
import { GameState } from "~/models/game";

export const [store, setStore] = createStore<GameState>({
  players: {},
  history: [],
});
