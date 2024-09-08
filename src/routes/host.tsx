import Lobby from "~/components/Lobby/Lobby.component";
import { setStore, store } from "~/store/host";
import { Host } from "~/utils/host";

export default function HostScreen() {
  const host = new Host(store);

  host.onUpdate = (gameState) => {
    setStore("players", gameState.players);
  };

  return (
    <main>
      <h1>Hosting at: {host.id}</h1>
      <button
        onClick={() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.reload();
        }}
      >
        Close
      </button>
      <h2>Players</h2>
      <Lobby players={store.players} playerId={host.id} />
    </main>
  );
}
