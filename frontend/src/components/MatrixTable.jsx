import { useSettings } from "../context/SettingsContext";

export default function MatrixTable({ rows, shape }) {
  const { t } = useSettings();

  if (!rows || rows.length === 0) return <p className="meta-text">{t("shared.emptyMatrix")}</p>;
  return (
    <div>
      {shape && <p className="meta-text">{t("shared.showingMatrix", shape[0], shape[1])}</p>}
      <div className="matrix-table-wrap">
        <table className="matrix-table">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
