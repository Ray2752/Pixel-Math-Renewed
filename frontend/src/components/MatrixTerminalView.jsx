import { useState } from "react";
import { useSettings } from "../context/SettingsContext";

// Más allá de este tamaño el <pre> con toda la matriz vuelve pesada la página;
// se recorta la vista, pero el botón Copiar siempre copia la matriz completa.
const MAX_ROWS = 60;
const MAX_COLS = 60;

function toArrayText(rows) {
  return `[\n${rows.map((row) => `  [${row.join(", ")}]`).join(",\n")}\n]`;
}

export default function MatrixTerminalView({ rows, shape }) {
  const { t } = useSettings();
  const [copied, setCopied] = useState(false);

  if (!rows || rows.length === 0) return <p className="meta-text">{t("shared.emptyMatrix")}</p>;

  const isTruncated = rows.length > MAX_ROWS || (rows[0]?.length || 0) > MAX_COLS;
  const visibleRows = isTruncated
    ? rows.slice(0, MAX_ROWS).map((row) => row.slice(0, MAX_COLS))
    : rows;

  const header = t("shared.matrixDataHeader", shape ? `${shape[0]}x${shape[1]}` : "");
  const text = `${header}\n${toArrayText(visibleRows)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(toArrayText(rows));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — ignore
    }
  }

  return (
    <div className="matrix-terminal">
      <div className="matrix-terminal-header">
        <span className="matrix-terminal-badge">
          {shape ? `[${shape[0]}x${shape[1]}]` : "[—]"} Int
        </span>
        <button type="button" className="btn-view-matrix" onClick={handleCopy}>
          {copied ? t("shared.copied") : t("shared.copy")}
        </button>
      </div>
      {isTruncated && (
        <p className="meta-text" style={{ padding: "0.5rem 1rem 0" }}>
          {t("shared.matrixTruncated", visibleRows.length, visibleRows[0].length)}
        </p>
      )}
      <pre>{text}</pre>
    </div>
  );
}
