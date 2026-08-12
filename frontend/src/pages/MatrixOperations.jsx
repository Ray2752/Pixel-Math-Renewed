import { useState } from "react";
import { getMatrixCsvUrl, getResultBundleDownloadUrl, runImageOperation } from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import { useSettings } from "../context/SettingsContext";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import UploadZone from "../components/UploadZone";
import { isImageArtifact } from "../utils/artifacts";

export default function MatrixOperations() {
  const { settings, t } = useSettings();
  const [operation, setOperation] = useState("transpose");
  const [pixelSize, setPixelSize] = useState(settings.pixelSize);
  const [colorLevels, setColorLevels] = useState(settings.colorLevels);
  const [scalar, setScalar] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const { file, dimensions, error: uploadError, handleFile } = useImageUpload();
  const { result, error, jobStatus, isLoading, isSlow, run, setError } = useJobSubmit();

  const needsSquare = operation === "rotate" || operation === "determinant";
  const isNonSquare = dimensions && dimensions.width !== dimensions.height;

  // El backend reescala a máx 800px antes de recortar al cuadrado; reflejar
  // el tamaño real del recorte, no el de la imagen original.
  const MAX_PROCESS_DIM = 800;
  function effectiveCropSide() {
    const { width, height } = dimensions;
    const maxSide = Math.max(width, height);
    const scale = maxSide > MAX_PROCESS_DIM ? MAX_PROCESS_DIM / maxSide : 1;
    return Math.floor(Math.min(width, height) * scale);
  }

  function translateWarning(warning) {
    if (warning.includes("still singular")) return t("matrixOps.warnStillSingular");
    if (warning.includes("adjusted to avoid")) return t("matrixOps.warnAdjusted");
    const overflow = warning.match(/overflows double precision \(\|det\| is about (10\^-?\d+)\)/);
    if (overflow) return t("matrixOps.warnDetOverflow", overflow[1]);
    return warning;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setScalar(null);
    setWarnings([]);

    if (!file) {
      setError(t("shared.selectImageFirst"));
      return;
    }

    await run(runImageOperation({ operation, file, pixelSize, colorLevels }), {
      onComplete: (completed) => {
        if (operation === "determinant" && completed.result?.scalar_result != null) {
          setScalar(completed.result.scalar_result);
        }
        setWarnings(completed.result?.warnings ?? []);
      },
    });
  }

  return (
    <div>
      <div className="page-header">
        <h1>{t("matrixOps.title")}</h1>
        <p>{t("matrixOps.subtitle")}</p>
      </div>

      <div className="workspace-grid">
        <section className="panel">
          <h3 className="result-subtitle" style={{ marginTop: 0 }}>
            {t("matrixOps.configTitle")}
          </h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              {t("matrixOps.operation")}
              <select value={operation} onChange={(event) => setOperation(event.target.value)}>
                <option value="transpose">{t("matrixOps.transpose")}</option>
                <option value="rotate">{t("matrixOps.rotate")}</option>
                <option value="determinant">{t("matrixOps.determinant")}</option>
              </select>
            </label>

            <UploadZone
              label={t("matrixOps.sourceImage")}
              file={file}
              dimensions={dimensions}
              onFile={handleFile}
            />

            {needsSquare && isNonSquare && (
              <p className="warn-text">
                {t("matrixOps.nonSquareWarn", effectiveCropSide())}
              </p>
            )}

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
              {t("matrixOps.execute")}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.6rem",
                }}
              >
                <p style={{ margin: 0 }}>Job: {result.job_id}</p>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <a href={getResultBundleDownloadUrl(result.job_id)} target="_blank" rel="noreferrer">
                    <button type="button" className="btn-secondary">
                      ⤓ .ZIP
                    </button>
                  </a>
                  <a href={getMatrixCsvUrl(result.job_id, "numeric_matrix_xlsx")} download>
                    <button type="button" className="btn-secondary">
                      ⤓ .CSV
                    </button>
                  </a>
                </div>
              </div>
              {scalar != null && (
                <div className="scalar-result">
                  <span className="scalar-result-label">{t("matrixOps.scalarLabel")}</span>
                  <span className="scalar-result-value">det(A) = {scalar.toFixed(4)}</span>
                  <span className="meta-text">
                    {Math.abs(scalar) > 1e-9 ? t("matrixOps.nonSingular") : t("matrixOps.singular")}
                  </span>
                </div>
              )}
              {warnings.length > 0 &&
                warnings.map((warning) => (
                  <p key={warning} className="warn-text">
                    {translateWarning(warning)}
                  </p>
                ))}

              <div className="preview-grid">
                {Object.entries(result.artifacts)
                  .filter(([, value]) => isImageArtifact(value))
                  .map(([key, value]) => (
                    <figure key={key} className="preview-card">
                      <img src={value} alt={key} />
                      <figcaption>{key}</figcaption>
                    </figure>
                  ))}
              </div>

              <h3 className="result-subtitle">{t("matrixOps.dataPreview")}</h3>
              <ArtifactDownloads
                jobId={result.job_id}
                artifacts={result.artifacts}
                autoViewKey="numeric_matrix_xlsx"
              />
            </section>
          ) : (
            <div className="empty-state">
              <span className="upload-zone-icon">⌗</span>
              <p>{t("matrixOps.emptyTitle")}</p>
              <p className="meta-text">{t("matrixOps.emptyHint")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
