import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { GameState } from "~/models/game";

export const [store, setStore] = makePersisted(
  createStore<GameState>({ players: {}, history: [] }),
  {
    name: "gameState",
    storage: sessionStorage,
  }
);
