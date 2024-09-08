import { DataConnection, Peer } from "peerjs";
import { randomPlayer, randomRoomId } from "~/utils/random";
import { GameState, Message } from "~/models/game";

interface HandleClientMessage {
  peer: string;
  message: Message;
}

export class Host {
  peer: Peer;
  id: string;
  connections = new Map<string, DataConnection>();
  gameState: GameState = {
    players: {},
    history: [],
  };

  onUpdate = (gameState: GameState) => {};
  constructor(gameState: GameState) {
    const id = sessionStorage.getItem("host_id") || randomRoomId();
    sessionStorage.setItem("host_id", id);
    this.gameState = JSON.parse(JSON.stringify(gameState));
    this.peer = new Peer(id);
    this.id = id;
    if (!this.gameState.players[this.id]) {
      this.gameState.players[this.id] = randomPlayer();
    }

    this.peer.on("connection", (conn) => {
      this.connections.set(conn.peer, conn);

      conn.on("open", () => {
        this.Tick();
      });
      conn.on("data", (message) => {
        this.HandleMessage({
          peer: conn.peer,
          message: message as Message,
        });
      });
    });
  }

  HandleMessage({ peer, message }: HandleClientMessage) {
    if (message.action === "join") {
      if (!this.gameState.players[peer]) {
        this.gameState.players[peer] = message.payload;
      }
    }

    this.onUpdate(this.gameState);
    this.Tick();
  }

  Tick() {
    this.connections.forEach((conn) => {
      conn.send({
        action: "tick",
        payload: this.gameState,
      });
    });
  }

  SendMessage(id: string, message: Message) {
    const connection = this.connections.get(id);
    if (!connection) return;
    connection.send(message);
  }
}
