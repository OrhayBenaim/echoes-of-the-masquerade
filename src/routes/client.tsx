import { createSignal } from "solid-js";
import Lobby from "~/components/Lobby/Lobby.component";
import { setStore, store } from "~/store/client";
import { Client } from "~/utils/client";

export default function HostScreen() {
  const client = new Client();

  const [room, setRoom] = createSignal(client.room_id);

  client.onUpdate = (gameState) => {
    setStore(gameState);
  };

  return (
    <main>
      <h1>Joining room: {room()}</h1>
      <input
        type="text"
        placeholder="Enter room ID"
        value={room()}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          setRoom(target.value);
        }}
      />

      <button
        onClick={() => {
          client.Connect(room());
        }}
      >
        Connect
      </button>

      <button
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
      >
        Disconnect
      </button>

      {store.currentTurn === client.id && (
        <button
          onClick={() => {
            client.PlayAction({
              action: "listen",
            });
          }}
        >
          Take action
        </button>
      )}

      <h2>Players</h2>
      <Lobby players={store.players} playerId={client.id} />
    </main>
  );
}
