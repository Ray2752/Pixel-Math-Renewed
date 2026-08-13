import {
  downloadMatrixAsJson,
  getMatrixData,
  getResultBundleDownloadUrl,
  sumImagesComposition,
} from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import { usePersistedState } from "../hooks/usePersistedState";
import { useSettings } from "../context/SettingsContext";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import MatrixInspector from "../components/MatrixInspector";
import UploadZone from "../components/UploadZone";
import { isPixelatedArtifact, labelForArtifact } from "../utils/artifacts";

export default function ImageComposition() {
  const { settings, t } = useSettings();
  const [pixelSize, setPixelSize] = usePersistedState(
    "pixelmath:composition:pixelSize",
    settings.pixelSize
  );
  const [colorLevels, setColorLevels] = usePersistedState(
    "pixelmath:composition:colorLevels",
    settings.colorLevels
  );
  const [alpha, setAlpha] = usePersistedState("pixelmath:composition:alpha", settings.alpha);
  const [beta, setBeta] = usePersistedState("pixelmath:composition:beta", settings.beta);

  const landscape = useImageUpload();
  const character = useImageUpload();
  const { result, error, jobStatus, isLoading, isSlow, run, reset: resetJob, setError } =
    useJobSubmit("pixelmath:lastJob:composition");

  function handleReset() {
    landscape.reset();
    character.reset();
    resetJob();
    setPixelSize(settings.pixelSize);
    setColorLevels(settings.colorLevels);
    setAlpha(settings.alpha);
    setBeta(settings.beta);
  }

  const hasDimensionMismatch =
    landscape.dimensions &&
    character.dimensions &&
    (landscape.dimensions.width !== character.dimensions.width ||
      landscape.dimensions.height !== character.dimensions.height);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!landscape.file || !character.file) {
      setError(t("composition.selectBoth"));
      return;
    }
    if (hasDimensionMismatch) {
      setError(t("composition.sameDimensions"));
      return;
    }

    await run(
      sumImagesComposition({
        landscapeFile: landscape.file,
        characterFile: character.file,
        pixelSize,
        colorLevels,
        alpha,
        beta,
      })
    );
  }

  const usedAlpha = result?.result?.alpha ?? alpha;
  const usedBeta = result?.result?.beta ?? beta;

  async function handleExportArray() {
    if (!result) return;
    try {
      const data = await getMatrixData(result.job_id, "sum_matrix_xlsx");
      downloadMatrixAsJson(data, `${result.job_id}_sum_matrix.json`);
    } catch {
      setError(t("shared.couldNotLoadMatrix"));
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          {t("composition.title")}{" "}
          <span style={{ color: "var(--color-primary-light)" }}>
            {t("composition.titleSuffix")}
          </span>
        </h1>
        <p>{t("composition.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="composition-inputs">
        <section className="panel">
          <h3 className="result-subtitle" style={{ marginTop: 0 }}>
            {t("composition.landscape")}
          </h3>
          <UploadZone
            label={t("composition.baseImage")}
            file={landscape.file}
            dimensions={landscape.dimensions}
            onFile={landscape.handleFile}
          />
        </section>

        <section className="panel">
          <h3 className="result-subtitle" style={{ marginTop: 0 }}>
            {t("composition.character")}
          </h3>
          <UploadZone
            label={t("composition.overlayImage")}
            file={character.file}
            dimensions={character.dimensions}
            onFile={character.handleFile}
          />
        </section>

        <section className="panel">
          <h3 className="result-subtitle" style={{ marginTop: 0 }}>
            {t("composition.settingsTitle")}
          </h3>
          <div className="form-grid">
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
            <RangeField
              label={t("composition.weightAlpha")}
              value={alpha}
              min={0}
              max={1}
              step={0.05}
              onChange={setAlpha}
            />
            <RangeField
              label={t("composition.weightBeta")}
              value={beta}
              min={0}
              max={1}
              step={0.05}
              onChange={setBeta}
            />
            <p className="meta-text">
              C = {alpha.toFixed(2)}·A + {beta.toFixed(2)}·B
            </p>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button type="submit" disabled={hasDimensionMismatch || isLoading}>
                {isLoading && <span className="spinner" />}
                {t("composition.computeSum")}
              </button>
              <button type="button" className="btn-secondary" onClick={handleReset}>
                {t("shared.reset")}
              </button>
            </div>
          </div>
        </section>
      </form>

      {hasDimensionMismatch && (
        <p className="warn-text" role="alert">{t("composition.dimensionMismatch")}</p>
      )}
      {landscape.error && <p className="error" role="alert">{landscape.error}</p>}
      {character.error && <p className="error" role="alert">{character.error}</p>}
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

      {!result && !isLoading && (
        <div className="empty-state">
          <span className="upload-zone-icon">⧉</span>
          <p>{t("composition.emptyTitle")}</p>
          <p className="meta-text">{t("composition.emptyHint")}</p>
        </div>
      )}

      {result && (
        <section className="panel">
          <p>
            {t("shared.jobLabel")}: {result.job_id}
          </p>
          <p className="meta-text">
            C = {Number(usedAlpha).toFixed(2)}·A + {Number(usedBeta).toFixed(2)}·B
          </p>
          <p>
            <a href={getResultBundleDownloadUrl(result.job_id)} target="_blank" rel="noreferrer">
              {t("shared.downloadZip")}
            </a>
          </p>

          <h3 className="result-subtitle">{t("composition.individualMatrices")}</h3>
          <div className="preview-grid">
            {["landscape_pixel", "landscape_numeric_preview", "character_pixel", "character_numeric_preview"].map(
              (key) =>
                result.artifacts[key] ? (
                  <figure key={key} className="preview-card">
                    <img
                      src={result.artifacts[key]}
                      alt={labelForArtifact(key, t)}
                      className={isPixelatedArtifact(key) ? "pixelated" : undefined}
                    />
                    <figcaption>{labelForArtifact(key, t)}</figcaption>
                  </figure>
                ) : null
            )}
          </div>
          <ArtifactDownloads
            jobId={result.job_id}
            artifacts={result.artifacts}
            keys={[
              "landscape_source",
              "landscape_pixel",
              "landscape_matrix_xlsx",
              "character_source",
              "character_pixel",
              "character_matrix_xlsx",
            ]}
          />

          <h3 className="result-subtitle">{t("composition.finalComposition")}</h3>
          <div className="preview-grid">
            {["sum_final_image", "sum_numeric_preview"].map((key) =>
              result.artifacts[key] ? (
                <figure key={key} className="preview-card">
                  <img
                    src={result.artifacts[key]}
                    alt={labelForArtifact(key, t)}
                    className={isPixelatedArtifact(key) ? "pixelated" : undefined}
                  />
                  <figcaption>{labelForArtifact(key, t)}</figcaption>
                </figure>
              ) : null
            )}
          </div>
          <ArtifactDownloads
            jobId={result.job_id}
            artifacts={result.artifacts}
            keys={["sum_final_image", "sum_matrix_xlsx"]}
          />

          <div style={{ marginTop: "0.75rem" }}>
            <button type="button" className="btn-secondary" onClick={handleExportArray}>
              {"<>"} {t("composition.exportArray")}
            </button>
          </div>

          <MatrixInspector
            jobId={result.job_id}
            alpha={Number(usedAlpha)}
            beta={Number(usedBeta)}
          />
        </section>
      )}
    </div>
  );
}
