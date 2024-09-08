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
      type: Actions;
      target: string;
    }
  | {
      id: string;
      name: string;
      type: "listen";
    }
  | {
      id: string;
      name: string;
      type: "sleep";
    };

export interface GameState {
  players: Record<string, Player>;
  history: PlayerAction[];
}

type GameActionsMessage =
  | {
      action: Actions;
      payload: string;
    }
  | {
      action: "listen";
    }
  | {
      action: "sleep";
    };

type EventMessage =
  | {
      action: "join";
      payload: {
        name: string;
        image: string;
      };
    }
  | {
      action: "tick";
      payload: GameState;
    };

export type Message = GameActionsMessage | EventMessage;
