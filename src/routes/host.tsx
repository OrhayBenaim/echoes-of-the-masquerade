import Lobby from "~/components/Lobby/Lobby.component";
import { setStore, store } from "~/store/host";
import { Host } from "~/utils/host";

export default function HostScreen() {
  const host = new Host(store);

  host.onUpdate = (gameState) => {
    setStore(gameState);
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
      {store.state === "waiting" && (
        <button
          onClick={() => {
            host.StartGame();
          }}
        >
          Start game
        </button>
      )}
      {store.currentTurn === host.id && (
        <button
          onClick={() => {
            host.PlayAction({
              action: "listen",
            });
          }}
        >
          Take action
        </button>
      )}
      <h2>Players</h2>

      <Lobby players={store.players} playerId={host.id} />
    </main>
  );
}
