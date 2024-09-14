import { faker } from "@faker-js/faker";
import { DataConnection, Peer } from "peerjs";
import { GameActionsMessage, GameState, Message } from "~/models/game";
import { randomPlayer } from "./random";
import { InitialState } from "~/store/game";

export class Client {
  peer: Peer;
  connection: DataConnection | null = null;
  id: string = "";
  room_id: string = "";
  gameState: GameState = InitialState;
  onUpdate = (gameState: GameState) => {};

  constructor() {
    const sessionId = sessionStorage.getItem("session_id");
    this.room_id = sessionStorage.getItem("room_id") || "";
    this.peer = sessionId ? new Peer(sessionId) : new Peer();
    this.peer.on("open", (id) => {
      this.id = id;
      sessionStorage.setItem("session_id", id);
      if (this.room_id) {
        this.Connect(this.room_id);
      }
    });
  }

  PlayAction(action: GameActionsMessage) {
    this.SendMessage(action);
  }

  Connect(room_id: string) {
    if (!this.id) return;
    this.connection = this.peer.connect(room_id);
    sessionStorage.setItem("room_id", room_id);

    this.connection.on("data", (message) =>
      this.HandleMessage(message as Message)
    );

    this.connection.on("open", () => {
      this.SendMessage({
        action: "join",
        payload: randomPlayer(),
      });
    });
  }

  HandleMessage(message: Message) {
    if (message.action === "tick") {
      this.gameState = message.payload;
    }
    this.onUpdate(this.gameState);
  }

  SendMessage(message: Message) {
    if (!this.connection) return;
    this.connection.send(message);
  }
}
