import { useSettings } from "../context/SettingsContext";

// Más allá de este tamaño la tabla mete decenas de miles de celdas al DOM;
// se recorta la vista y el CSV queda como fuente de la matriz completa.
const MAX_ROWS = 60;
const MAX_COLS = 60;

export default function MatrixTable({ rows, shape }) {
  const { t } = useSettings();

  if (!rows || rows.length === 0) return <p className="meta-text">{t("shared.emptyMatrix")}</p>;

  const isTruncated = rows.length > MAX_ROWS || (rows[0]?.length || 0) > MAX_COLS;
  const visibleRows = isTruncated
    ? rows.slice(0, MAX_ROWS).map((row) => row.slice(0, MAX_COLS))
    : rows;

  return (
    <div>
      {shape && <p className="meta-text">{t("shared.showingMatrix", shape[0], shape[1])}</p>}
      {isTruncated && (
        <p className="meta-text">
          {t("shared.matrixTruncated", visibleRows.length, visibleRows[0].length)}
        </p>
      )}
      <div className="matrix-table-wrap">
        <table className="matrix-table">
          <tbody>
            {visibleRows.map((row, i) => (
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
