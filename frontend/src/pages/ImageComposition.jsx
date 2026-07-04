import { useState } from "react";
import { getResultBundleDownloadUrl, sumImagesComposition } from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import { useSettings } from "../context/SettingsContext";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import MatrixInspector from "../components/MatrixInspector";
import UploadZone from "../components/UploadZone";

export default function ImageComposition() {
  const { settings, t } = useSettings();
  const [pixelSize, setPixelSize] = useState(settings.pixelSize);
  const [colorLevels, setColorLevels] = useState(settings.colorLevels);
  const [alpha, setAlpha] = useState(settings.alpha);
  const [beta, setBeta] = useState(settings.beta);

  const landscape = useImageUpload();
  const character = useImageUpload();
  const { result, error, jobStatus, isLoading, isSlow, run, setError } = useJobSubmit();

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
            <button type="submit" disabled={hasDimensionMismatch || isLoading}>
              {isLoading && <span className="spinner" />}
              {t("composition.computeSum")}
            </button>
          </div>
        </section>
      </form>

      {hasDimensionMismatch && <p className="warn-text">{t("composition.dimensionMismatch")}</p>}
      {landscape.error && <p className="error">{landscape.error}</p>}
      {character.error && <p className="error">{character.error}</p>}
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

      {result && (
        <section className="panel">
          <p>Job: {result.job_id}</p>
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
                    <img src={result.artifacts[key]} alt={key} />
                    <figcaption>{key}</figcaption>
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
                  <img src={result.artifacts[key]} alt={key} />
                  <figcaption>{key}</figcaption>
                </figure>
              ) : null
            )}
          </div>
          <ArtifactDownloads
            jobId={result.job_id}
            artifacts={result.artifacts}
            keys={["sum_final_image", "sum_matrix_xlsx"]}
          />

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
