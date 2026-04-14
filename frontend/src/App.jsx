import { useEffect, useState } from "react";
import { getHealth } from "./api/client";

function App() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    getHealth()
      .then((data) => {
        setStatus(`API ${data.status} (${data.environment}) v${data.version}`);
      })
      .catch(() => {
        setStatus("Backend unavailable. Start FastAPI on port 8000.");
      });
  }, []);

  return (
    <main className="container">
      <h1>Pixel-Math Web</h1>
      <p>Migration Sprint 1 scaffold is ready.</p>
      <div className="status">{status}</div>
    </main>
  );
}

export default App;
