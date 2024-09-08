import { Player } from "~/models/game";
import "./Lobby.style.css";
interface Props {
  players: Record<string, Player>;
  playerId: string;
}
export default function Lobby(props: Props) {
  return (
    <section class="lobby">
      {Object.entries(props.players).map(([id, player]) => (
        <div
          class="lobby__item"
          style={{
            "font-weight": id === props.playerId ? "bold" : "normal",
          }}
        >
          <img class="lobby__image" src={player.image} alt={player.name} />

          {player.name}
        </div>
      ))}
    </section>
  );
}
