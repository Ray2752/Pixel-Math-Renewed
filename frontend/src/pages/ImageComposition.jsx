import { useState } from "react";
import { getResultBundleDownloadUrl, sumImagesComposition } from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import { formatDimensions } from "../utils/artifacts";

export default function ImageComposition() {
  const [pixelSize, setPixelSize] = useState(10);
  const [colorLevels, setColorLevels] = useState(64);
  const [alpha, setAlpha] = useState(0.7);
  const [beta, setBeta] = useState(0.3);

  const landscape = useImageUpload();
  const character = useImageUpload();
  const { result, error, jobStatus, run, setError } = useJobSubmit();

  const hasDimensionMismatch =
    landscape.dimensions &&
    character.dimensions &&
    (landscape.dimensions.width !== character.dimensions.width ||
      landscape.dimensions.height !== character.dimensions.height);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!landscape.file || !character.file) {
      setError("Select both landscape and character images.");
      return;
    }
    if (hasDimensionMismatch) {
      setError("Images must have exactly the same dimensions.");
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
          Image Composition <span style={{ color: "var(--color-primary-light)" }}>_SUM</span>
        </h1>
        <p>
          Combine two image matrices through weighted element-wise addition. Adjust the blend
          weights to control how much each source contributes.
        </p>
      </div>

      <section className="panel">
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Landscape image [A]
            <input type="file" accept="image/*" onChange={landscape.handleFileChange} />
          </label>
          <p className="meta-text">Landscape size: {formatDimensions(landscape.dimensions)}</p>

          <label>
            Character image [B]
            <input type="file" accept="image/*" onChange={character.handleFileChange} />
          </label>
          <p className="meta-text">Character size: {formatDimensions(character.dimensions)}</p>

          {hasDimensionMismatch && (
            <p className="warn-text">
              Dimension mismatch detected. Select files with the same width and height.
            </p>
          )}

          <RangeField
            label="Pixel Size"
            value={pixelSize}
            min={1}
            max={64}
            onChange={setPixelSize}
          />
          <RangeField
            label="Color Levels"
            value={colorLevels}
            min={2}
            max={256}
            onChange={setColorLevels}
          />
          <RangeField
            label="Weight α [Landscape]"
            value={alpha}
            min={0}
            max={1}
            step={0.05}
            onChange={setAlpha}
          />
          <RangeField
            label="Weight β [Character]"
            value={beta}
            min={0}
            max={1}
            step={0.05}
            onChange={setBeta}
          />
          <p className="meta-text">
            C = {alpha.toFixed(2)}·A + {beta.toFixed(2)}·B
          </p>

          <button type="submit" disabled={hasDimensionMismatch}>
            Compute Sum
          </button>
        </form>

        {landscape.error && <p className="error">{landscape.error}</p>}
        {character.error && <p className="error">{character.error}</p>}
        {error && <p className="error">{error}</p>}
        {jobStatus && <p className="job-status">{jobStatus}</p>}

        {result && (
          <div className="result-wrap">
            <div className="result">
              <p>Job: {result.job_id}</p>
              <p className="meta-text">
                C = {Number(usedAlpha).toFixed(2)}·A + {Number(usedBeta).toFixed(2)}·B
              </p>
              <p>
                <a href={getResultBundleDownloadUrl(result.job_id)} target="_blank" rel="noreferrer">
                  Download ZIP bundle
                </a>
              </p>

              <h3 className="result-subtitle">Individual Matrices</h3>
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

              <h3 className="result-subtitle">Final Composition</h3>
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
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
