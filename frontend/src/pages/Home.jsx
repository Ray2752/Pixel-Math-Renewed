import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth } from "../api/client";
import { useSettings } from "../context/SettingsContext";

export default function Home() {
  const { t } = useSettings();
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    getHealth()
      .then((data) => setStatus(`API ${data.status} (${data.environment}) v${data.version}`))
      .catch(() => setStatus("Backend unavailable. Start FastAPI on port 8000."));
  }, []);

  return (
    <div>
      <section className="panel">
        {import.meta.env.DEV && <div className="status">{status}</div>}
        <div className="page-header" style={{ marginTop: import.meta.env.DEV ? "1rem" : 0 }}>
          <h1>
            {t("home.heroTitle")}{" "}
            <span style={{ color: "var(--color-primary-light)" }}>{t("home.heroTitleAccent")}</span>
          </h1>
          <p>{t("home.heroBody")}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <Link to="/matrix-operations">
            <button type="button">{t("home.getStarted")}</button>
          </Link>
          <Link to="/documentation">
            <button type="button" className="btn-secondary">
              {t("home.readDocs")}
            </button>
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>{t("home.conceptTitle")}</h2>
        <p style={{ lineHeight: 1.7, marginTop: "1rem" }}>{t("home.conceptP1")}</p>
        <p style={{ lineHeight: 1.7 }}>{t("home.conceptP2")}</p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/matrix-operations">{t("home.tryMatrixOps")}</Link>
        </div>
      </section>

      <section className="panel">
        <h2>{t("home.exploreTools")}</h2>
        <div className="preview-grid" style={{ marginTop: "1rem" }}>
          <Link to="/matrix-operations" style={{ textDecoration: "none" }}>
            <div className="preview-card">
              <figcaption style={{ color: "var(--color-heading)", fontSize: "1rem" }}>
                {t("nav.matrixOps")}
              </figcaption>
              <p className="meta-text" style={{ marginTop: "0.4rem" }}>
                {t("home.matrixOpsDesc")}
              </p>
            </div>
          </Link>
          <Link to="/image-filters" style={{ textDecoration: "none" }}>
            <div className="preview-card">
              <figcaption style={{ color: "var(--color-heading)", fontSize: "1rem" }}>
                {t("nav.imageFilters")}
              </figcaption>
              <p className="meta-text" style={{ marginTop: "0.4rem" }}>
                {t("home.filtersDesc")}
              </p>
            </div>
          </Link>
          <Link to="/image-composition" style={{ textDecoration: "none" }}>
            <div className="preview-card">
              <figcaption style={{ color: "var(--color-heading)", fontSize: "1rem" }}>
                {t("nav.imageComposition")}
              </figcaption>
              <p className="meta-text" style={{ marginTop: "0.4rem" }}>
                {t("home.compositionDesc")}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
