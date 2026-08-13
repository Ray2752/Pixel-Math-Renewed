import { getMatrixCsvUrl, getResultBundleDownloadUrl, runImageOperation } from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import { usePersistedState } from "../hooks/usePersistedState";
import { useSettings } from "../context/SettingsContext";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import UploadZone from "../components/UploadZone";
import { isImageArtifact, isPixelatedArtifact, labelForArtifact } from "../utils/artifacts";

export default function MatrixOperations() {
  const { settings, t } = useSettings();
  const [operation, setOperation] = usePersistedState("pixelmath:matrixOps:operation", "transpose");
  const [pixelSize, setPixelSize] = usePersistedState(
    "pixelmath:matrixOps:pixelSize",
    settings.pixelSize
  );
  const [colorLevels, setColorLevels] = usePersistedState(
    "pixelmath:matrixOps:colorLevels",
    settings.colorLevels
  );

  const { file, dimensions, error: uploadError, handleFile, reset: resetUpload } =
    useImageUpload();
  const { result, error, jobStatus, isLoading, isSlow, run, reset: resetJob, setError } =
    useJobSubmit("pixelmath:lastJob:matrixOps");

  // Derivados del resultado (sobreviven a un refresh vía restauración del job)
  const scalar = result?.result?.scalar_result ?? null;
  const warnings = result?.result?.warnings ?? [];

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

    if (!file) {
      setError(t("shared.selectImageFirst"));
      return;
    }

    await run(runImageOperation({ operation, file, pixelSize, colorLevels }));
  }

  function handleReset() {
    resetUpload();
    resetJob();
    setOperation("transpose");
    setPixelSize(settings.pixelSize);
    setColorLevels(settings.colorLevels);
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

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button type="submit" disabled={isLoading}>
                {isLoading && <span className="spinner" />}
                {t("matrixOps.execute")}
              </button>
              <button type="button" className="btn-secondary" onClick={handleReset}>
                {t("shared.reset")}
              </button>
            </div>
          </form>

          {uploadError && <p className="error" role="alert">{uploadError}</p>}
          {error && <p className="error" role="alert">{error}</p>}
          {isLoading ? (
            <div className="loading-box" role="status">
              <span className="spinner" />
              <span>
                {t("shared.processing")}
                {isSlow && <span className="loading-hint"> {t("shared.coldStartHint")}</span>}
              </span>
            </div>
          ) : (
            jobStatus && <p className="job-status" role="status">{jobStatus}</p>
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
                <p style={{ margin: 0 }}>
                  {t("shared.jobLabel")}: {result.job_id}
                </p>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <a
                    className="btn btn-secondary"
                    href={getResultBundleDownloadUrl(result.job_id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ⤓ .ZIP
                  </a>
                  <a
                    className="btn btn-secondary"
                    href={getMatrixCsvUrl(result.job_id, "numeric_matrix_xlsx")}
                    download
                  >
                    ⤓ .CSV
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
                  <p key={warning} className="warn-text" role="status">
                    {translateWarning(warning)}
                  </p>
                ))}

              <div className="preview-grid">
                {Object.entries(result.artifacts)
                  .filter(([, value]) => isImageArtifact(value))
                  .map(([key, value]) => (
                    <figure key={key} className="preview-card">
                      <img
                        src={value}
                        alt={labelForArtifact(key, t)}
                        className={isPixelatedArtifact(key) ? "pixelated" : undefined}
                      />
                      <figcaption>{labelForArtifact(key, t)}</figcaption>
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
