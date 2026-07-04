import { useEffect, useState } from "react";
import { getMatrixData } from "../api/client";
import { useSettings } from "../context/SettingsContext";

function centerSlice(rows, height = 2, width = 3) {
  if (!rows?.length) return [];
  const rowStart = Math.max(0, Math.floor((rows.length - height) / 2));
  const colStart = Math.max(0, Math.floor(((rows[0]?.length || 0) - width) / 2));
  return rows.slice(rowStart, rowStart + height).map((row) => row.slice(colStart, colStart + width));
}

function MiniMatrix({ cells, weight, tone }) {
  return (
    <div className={`mini-matrix mini-matrix-${tone}`}>
      {cells.map((row, i) => (
        <div key={i} className="mini-matrix-row">
          {row.map((value, j) => (
            <div key={j} className="mini-matrix-cell">
              <span>{value}</span>
              {weight && <small>{weight}</small>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MatrixInspector({ jobId, alpha, beta }) {
  const { t } = useSettings();
  const [slices, setSlices] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getMatrixData(jobId, "landscape_matrix_xlsx"),
      getMatrixData(jobId, "character_matrix_xlsx"),
      getMatrixData(jobId, "sum_matrix_xlsx"),
    ])
      .then(([landscape, character, sum]) => {
        if (cancelled) return;
        setSlices({
          a: centerSlice(landscape.rows),
          b: centerSlice(character.rows),
          c: centerSlice(sum.rows),
        });
      })
      .catch(() => {
        if (!cancelled) setSlices(null);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (!slices) return null;

  return (
    <div>
      <h3 className="result-subtitle">{t("composition.matrixInspector")}</h3>
      <div className="matrix-inspector">
        <MiniMatrix cells={slices.a} weight={`×${alpha}`} tone="a" />
        <span className="matrix-inspector-op">+</span>
        <MiniMatrix cells={slices.b} weight={`×${beta}`} tone="b" />
        <span className="matrix-inspector-op">=</span>
        <MiniMatrix cells={slices.c} tone="c" />
      </div>
    </div>
  );
}
