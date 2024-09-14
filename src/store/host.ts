import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { GameState } from "~/models/game";
import { InitialState } from "./game";

export const [store, setStore] = makePersisted(
  createStore<GameState>(InitialState),
  {
    name: "gameState",
    storage: sessionStorage,
  }
);
