import { useEffect, useState } from "react";
import {
  downloadMatrixAsJson,
  getMatrixData,
  getResultBundleDownloadUrl,
  processFilters,
} from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import { useSettings } from "../context/SettingsContext";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import MatrixTerminalView from "../components/MatrixTerminalView";
import PalettePreview from "../components/PalettePreview";
import UploadZone from "../components/UploadZone";

export default function ImageFilters() {
  const { settings, t } = useSettings();
  const [pixelSize, setPixelSize] = useState(settings.pixelSize);
  const [colorLevels, setColorLevels] = useState(settings.colorLevels);
  const [terminalMatrix, setTerminalMatrix] = useState(null);

  const { file, dimensions, error: uploadError, handleFile, reset: resetUpload } =
    useImageUpload();
  const { result, error, jobStatus, isLoading, isSlow, run, reset: resetJob, setError } =
    useJobSubmit();

  useEffect(() => {
    if (!result) {
      setTerminalMatrix(null);
      return;
    }
    getMatrixData(result.job_id, "numeric_matrix_xlsx")
      .then((data) => setTerminalMatrix(data))
      .catch(() => setTerminalMatrix(null));
  }, [result]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError(t("shared.selectImageFirst"));
      return;
    }
    await run(processFilters({ file, pixelSize, colorLevels }));
  }

  function handleReset() {
    resetUpload();
    resetJob();
    setPixelSize(settings.pixelSize);
    setColorLevels(settings.colorLevels);
  }

  async function handleExportJson() {
    if (!result) return;
    const data = await getMatrixData(result.job_id, "numeric_matrix_xlsx");
    downloadMatrixAsJson(data, `${result.job_id}_matrix.json`);
  }

  return (
    <div>
      <div className="page-header">
        <h1>{t("filters.title")}</h1>
        <p>{t("filters.subtitle")}</p>
      </div>

      <div className="workspace-grid">
        <section className="panel">
          <h3 className="result-subtitle" style={{ marginTop: 0 }}>
            {t("filters.paramsTitle")}
          </h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <UploadZone
              label={t("filters.loadImage")}
              file={file}
              dimensions={dimensions}
              onFile={handleFile}
            />

            <RangeField
              label={t("shared.pixelSize")}
              value={pixelSize}
              min={1}
              max={64}
              onChange={setPixelSize}
            />
            <RangeField
              label={t("shared.colorLevels")}
              value={colorLevels}
              min={2}
              max={256}
              onChange={setColorLevels}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading && <span className="spinner" />}
              {t("filters.execute")}
            </button>
          </form>

          {uploadError && <p className="error">{uploadError}</p>}
          {error && <p className="error">{error}</p>}
          {isLoading ? (
            <div className="loading-box">
              <span className="spinner" />
              <span>
                {t("shared.processing")}
                {isSlow && <span className="loading-hint"> {t("shared.coldStartHint")}</span>}
              </span>
            </div>
          ) : (
            jobStatus && <p className="job-status">{jobStatus}</p>
          )}
        </section>

        <div>
          {result ? (
            <section className="panel">
              <p>Job: {result.job_id}</p>

              <h3 className="result-subtitle">{t("filters.stages")}</h3>
              <div className="preview-grid">
                {["source", "simplified", "pixel_art"].map((key) =>
                  result.artifacts[key] ? (
                    <figure key={key} className="preview-card">
                      <img src={result.artifacts[key]} alt={key} />
                      <figcaption>{key}</figcaption>
                    </figure>
                  ) : null
                )}
                {result.artifacts.color_map_xlsx && (
                  <div className="preview-card">
                    <figcaption>{t("filters.palette")}</figcaption>
                    <PalettePreview jobId={result.job_id} artifactKey="color_map_xlsx" />
                  </div>
                )}
              </div>

              {terminalMatrix && (
                <>
                  <h3 className="result-subtitle">{t("filters.dataArray")}</h3>
                  <MatrixTerminalView rows={terminalMatrix.rows} shape={terminalMatrix.shape} />
                </>
              )}

              <div
                style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}
              >
                {result.artifacts.pixel_art && (
                  <a href={result.artifacts.pixel_art} download>
                    <button type="button" className="btn-secondary">
                      {t("filters.exportPng")}
                    </button>
                  </a>
                )}
                <button type="button" className="btn-secondary" onClick={handleExportJson}>
                  {t("filters.exportJson")}
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  {t("filters.reset")}
                </button>
                <a
                  href={getResultBundleDownloadUrl(result.job_id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("shared.downloadZip")}
                </a>
              </div>

              <h3 className="result-subtitle">{t("filters.allArtifacts")}</h3>
              <ArtifactDownloads jobId={result.job_id} artifacts={result.artifacts} />
            </section>
          ) : (
            <div className="empty-state">
              <span className="upload-zone-icon">⌗</span>
              <p>{t("filters.emptyTitle")}</p>
              <p className="meta-text">{t("filters.emptyHint")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
