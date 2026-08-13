import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth } from "../api/client";
import { useSettings } from "../context/SettingsContext";

const MINI_GRID = [
  ["#1a1a1a", "#4d4d4d", "#808080"],
  ["#333333", "#666666", "#999999"],
  ["#262626", "#595959", "#8c8c8c"],
];

const MINI_MATRIX = [
  [26, 77, 128],
  [51, 102, 153],
  [38, 89, 140],
];

function PixelToMatrixDiagram() {
  return (
    <div className="concept-diagram">
      <div className="concept-pixel-grid">
        {MINI_GRID.map((row, i) =>
          row.map((color, j) => (
            <div
              key={`${i}-${j}`}
              className={i === 1 && j === 1 ? "concept-pixel highlight" : "concept-pixel"}
              style={{ backgroundColor: color }}
            />
          ))
        )}
      </div>
      <span className="concept-arrow">→</span>
      <div className="concept-matrix">
        {MINI_MATRIX.map((row, i) =>
          row.map((value, j) => (
            <div
              key={`${i}-${j}`}
              className={i === 1 && j === 1 ? "concept-cell highlight" : "concept-cell"}
            >
              {value}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useSettings();
  const [apiState, setApiState] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function check(attempt = 0) {
      try {
        await getHealth();
        if (!cancelled) setApiState("online");
      } catch {
        if (cancelled) return;
        setApiState(attempt < 2 ? "checking" : "offline");
        timer = setTimeout(() => check(attempt + 1), 10000);
      }
    }

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const pillLabel =
    apiState === "online"
      ? t("home.systemOnline")
      : apiState === "offline"
        ? t("home.systemOffline")
        : t("home.connecting");

  return (
    <div>
      <section className="panel hero-panel">
        <span className={`status-pill status-pill-${apiState}`}>
          <span className="status-pill-dot" />
          {pillLabel}
        </span>
        <div className="page-header" style={{ marginTop: "1.5rem" }}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          <h2>{t("home.conceptTitle")}</h2>
          <span className="module-chip">MODULE_01</span>
        </div>
        <div className="concept-grid">
          <div>
            <p style={{ lineHeight: 1.7, marginTop: "1rem" }}>{t("home.conceptP1")}</p>
            <p style={{ lineHeight: 1.7 }}>{t("home.conceptP2")}</p>
          </div>
          <PixelToMatrixDiagram />
        </div>
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
