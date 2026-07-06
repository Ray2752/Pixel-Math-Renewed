import { useState } from "react";
import { useSettings } from "../context/SettingsContext";

export default function MatrixTerminalView({ rows, shape }) {
  const { t } = useSettings();
  const [copied, setCopied] = useState(false);

  if (!rows || rows.length === 0) return <p className="meta-text">{t("shared.emptyMatrix")}</p>;

  const body = `[\n${rows.map((row) => `  [${row.join(", ")}]`).join(",\n")}\n]`;
  const text = `# Pixel matrix data [${shape ? `${shape[0]}x${shape[1]}` : ""}]\n${body}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(body);
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
      <pre>{text}</pre>
    </div>
  );
}
