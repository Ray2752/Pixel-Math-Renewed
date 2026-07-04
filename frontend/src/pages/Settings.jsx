import { useEffect, useState } from "react";
import { getHealth } from "../api/client";

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setError("Backend unavailable. Start the FastAPI server."));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>System information for the Pixel-Math API backend.</p>
      </div>

      <section className="panel">
        <h2>API Status</h2>
        {error && <p className="error">{error}</p>}
        {health && (
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
            <p className="meta-text">Status: {health.status}</p>
            <p className="meta-text">Environment: {health.environment}</p>
            <p className="meta-text">Version: {health.version}</p>
          </div>
        )}
        <p className="meta-text" style={{ marginTop: "1.5rem" }}>
          There are no user-configurable settings yet.
        </p>
      </section>
    </div>
  );
}
