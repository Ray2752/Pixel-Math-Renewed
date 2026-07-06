import { useEffect, useState } from "react";
import { getMatrixCsvUrl, getMatrixData } from "../api/client";
import { useSettings } from "../context/SettingsContext";
import { isImageArtifact } from "../utils/artifacts";
import MatrixTable from "./MatrixTable";
import MatrixTerminalView from "./MatrixTerminalView";

export default function ArtifactDownloads({
  jobId,
  artifacts,
  keys,
  MatrixViewComponent,
  autoViewKey,
}) {
  const { settings, t } = useSettings();
  const [matrixView, setMatrixView] = useState(null);
  const [loadingKey, setLoadingKey] = useState(null);

  useEffect(() => {
    setMatrixView(null);
    if (!autoViewKey || !artifacts?.[autoViewKey]) return;

    let cancelled = false;
    setLoadingKey(autoViewKey);
    getMatrixData(jobId, autoViewKey)
      .then((data) => {
        if (!cancelled) setMatrixView({ key: autoViewKey, rows: data.rows, shape: data.shape });
      })
      .catch(() => {
        if (!cancelled) setMatrixView(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingKey(null);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const ViewComponent =
    MatrixViewComponent ??
    (settings.matrixView === "terminal" ? MatrixTerminalView : MatrixTable);

  const entries = (keys || Object.keys(artifacts)).filter((key) => artifacts[key]);

  async function handleToggleMatrix(key) {
    if (matrixView?.key === key) {
      setMatrixView(null);
      return;
    }
    setLoadingKey(key);
    try {
      const data = await getMatrixData(jobId, key);
      setMatrixView({ key, rows: data.rows, shape: data.shape });
    } catch {
      setMatrixView({ key, rows: null, shape: null });
    } finally {
      setLoadingKey(null);
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
                  disabled={loadingKey === key}
                  onClick={() => handleToggleMatrix(key)}
                >
                  {loadingKey === key ? (
                    <span className="spinner" />
                  ) : matrixView?.key === key ? (
                    t("shared.hide")
                  ) : (
                    t("shared.view")
                  )}
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
            <ViewComponent rows={matrixView.rows} shape={matrixView.shape} />
          ) : (
            <p className="error">{t("shared.couldNotLoadMatrix")}</p>
          )}
        </div>
      )}
    </div>
  );
}
