export type Actions = "uncover" | "sleep" | "listen" | "assassinate" | "watch";

export type Role = "spy" | "guest" | "assassin" | "watcher";

export const ActionsByRole: Record<Role, Actions[]> = {
  spy: ["uncover", "sleep"],
  guest: ["sleep", "listen"],
  assassin: ["assassinate", "sleep"],
  watcher: ["watch", "sleep"],
};

export interface Player {
  name: string;
  role?: Role;
  image?: string;
  room?: number;
}

type PlayerAction =
  | {
      id: string;
      name: string;
      action: Actions;
      target: string;
    }
  | {
      id: string;
      name: string;
      action: "listen";
    }
  | {
      id: string;
      name: string;
      action: "sleep";
    };

export interface GameState {
  players: Record<string, Player>;
  history: PlayerAction[];
  state: "waiting" | "started" | "ended";
  currentTurn: string | null;
}

export type GameActionsMessage =
  | {
      action: Actions;
      target: string;
    }
  | {
      action: "listen";
    }
  | {
      action: "sleep";
    };

export type JoinEvent = {
  action: "join";
  payload: {
    name: string;
    image: string;
  };
};
export type EventMessage =
  | JoinEvent
  | {
      action: "tick";
      payload: GameState;
    };

export type Message = GameActionsMessage | EventMessage;
