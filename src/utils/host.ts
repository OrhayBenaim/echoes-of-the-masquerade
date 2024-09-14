import { DataConnection, Peer } from "peerjs";
import { randomPlayer, randomRoomId } from "~/utils/random";
import {
  GameActionsMessage,
  GameState,
  JoinEvent,
  Message,
} from "~/models/game";
import { InitialState } from "~/store/game";

interface HandleClientMessage {
  peer: string;
  message: Message;
}

let UpdateCycle: NodeJS.Timeout | undefined = undefined;
export class Host {
  peer: Peer;
  id: string;
  connections = new Map<string, DataConnection>();

  gameState = InitialState;

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
        this.UpdateClients();
      });
      conn.on("data", (message) => {
        this.HandleMessage({
          peer: conn.peer,
          message: message as Message,
        });
      });
    });
  }

  StartGame = () => {
    this.gameState.state = "started";
    this.gameState.currentTurn = Object.keys(this.gameState.players)[0];
    this.PushUpdate();
  };

  PlayAction = (action: GameActionsMessage, id?: string) => {
    const playerId = id || this.id;
    if (this.gameState.currentTurn && this.gameState.currentTurn === playerId) {
      this.gameState.history.push({
        id: playerId,
        name: this.gameState.players[playerId].name,
        ...action,
      });

      const currentPlayerIndex = Object.keys(this.gameState.players).indexOf(
        this.gameState.currentTurn
      );
      const nextPlayerIndex = currentPlayerIndex + 1;
      if (nextPlayerIndex > Object.keys(this.gameState.players).length) {
        this.gameState.currentTurn = null;
        this.gameState.state = "ended";
      } else {
        this.gameState.currentTurn = Object.keys(this.gameState.players)[
          nextPlayerIndex
        ];
      }
      this.PushUpdate();
    }
  };

  HandleJoin(id: string, event: JoinEvent) {
    if (!this.gameState.players[id]) {
      this.gameState.players[id] = event.payload;
    }
    this.PushUpdate();
  }

  HandleMessage({ peer, message }: HandleClientMessage) {
    if (message.action === "join") {
      this.HandleJoin(peer, message);
    }
    if (message.action === "listen") {
      this.PlayAction(message, peer);
    }
  }

  UpdateClients() {
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

  PushUpdate() {
    if (UpdateCycle) {
      clearTimeout(UpdateCycle);
    }
    UpdateCycle = setTimeout(() => {
      this.onUpdate(this.gameState);
      this.UpdateClients();
    }, 100);
  }
}
