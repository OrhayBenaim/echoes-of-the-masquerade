import { createStore } from "solid-js/store";
import { GameState } from "~/models/game";
import { InitialState } from "./game";

export const [store, setStore] = createStore<GameState>(InitialState);
