import { useState } from "react";
import { getMatrixCsvUrl, getMatrixData } from "../api/client";
import { isImageArtifact } from "../utils/artifacts";
import MatrixTable from "./MatrixTable";

export default function ArtifactDownloads({
  jobId,
  artifacts,
  keys,
  MatrixViewComponent = MatrixTable,
}) {
  const [matrixView, setMatrixView] = useState(null);

  const entries = (keys || Object.keys(artifacts)).filter((key) => artifacts[key]);

  async function handleToggleMatrix(key) {
    if (matrixView?.key === key) {
      setMatrixView(null);
      return;
    }
    try {
      const data = await getMatrixData(jobId, key);
      setMatrixView({ key, rows: data.rows, shape: data.shape });
    } catch {
      setMatrixView({ key, rows: null, shape: null });
    }
  }

  return (
    <div>
      <div className="artifact-downloads">
        {entries.map((key) => (
          <span key={key} className="artifact-item">
            <a
              href={artifacts[key]}
              target="_blank"
              rel="noreferrer"
              download={key.endsWith("_xlsx") || isImageArtifact(artifacts[key])}
            >
              ↓ {key}
            </a>
            {key.endsWith("_xlsx") && (
              <>
                <button
                  type="button"
                  className="btn-view-matrix"
                  onClick={() => handleToggleMatrix(key)}
                >
                  {matrixView?.key === key ? "Hide" : "View"}
                </button>
                <a href={getMatrixCsvUrl(jobId, key)} download>
                  CSV
                </a>
              </>
            )}
          </span>
        ))}
      </div>
      {matrixView && (
        <div className="matrix-viewer">
          {matrixView.rows ? (
            <MatrixViewComponent rows={matrixView.rows} shape={matrixView.shape} />
          ) : (
            <p className="error">Could not load matrix.</p>
          )}
        </div>
      )}
    </div>
  );
}
