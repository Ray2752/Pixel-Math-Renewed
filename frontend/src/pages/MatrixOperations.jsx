import { useState } from "react";
import { runImageOperation, getResultBundleDownloadUrl } from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import { formatDimensions, isImageArtifact } from "../utils/artifacts";

export default function MatrixOperations() {
  const [operation, setOperation] = useState("transpose");
  const [pixelSize, setPixelSize] = useState(10);
  const [colorLevels, setColorLevels] = useState(64);
  const [scalar, setScalar] = useState(null);

  const { file, dimensions, error: uploadError, handleFileChange } = useImageUpload();
  const { result, error, jobStatus, run, setError } = useJobSubmit();

  const needsSquare = operation === "rotate" || operation === "determinant";
  const isNonSquare = dimensions && dimensions.width !== dimensions.height;

  async function handleSubmit(event) {
    event.preventDefault();
    setScalar(null);

    if (!file) {
      setError("Select an image file first.");
      return;
    }

    await run(runImageOperation({ operation, file, pixelSize, colorLevels }), {
      onComplete: (completed) => {
        if (operation === "determinant" && completed.result?.scalar_result != null) {
          setScalar(completed.result.scalar_result);
        }
      },
    });
  }

  return (
    <div>
      <div className="page-header">
        <h1>Matrix Operations</h1>
        <p>
          Execute linear algebraic transformations on image data. Select an operation and upload
          a source image for processing.
        </p>
      </div>

      <section className="panel">
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Operation
            <select value={operation} onChange={(event) => setOperation(event.target.value)}>
              <option value="transpose">Transpose</option>
              <option value="rotate">Rotate</option>
              <option value="determinant">Determinant</option>
            </select>
          </label>

          <label>
            Image
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          <p className="meta-text">Selected image size: {formatDimensions(dimensions)}</p>
          {needsSquare && isNonSquare && (
            <p className="warn-text">
              Image is not square — it will be auto-cropped to{" "}
              {Math.min(dimensions.width, dimensions.height)}×
              {Math.min(dimensions.width, dimensions.height)} before processing.
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

          <button type="submit">Execute Computation</button>
        </form>

        {uploadError && <p className="error">{uploadError}</p>}
        {error && <p className="error">{error}</p>}
        {jobStatus && <p className="job-status">{jobStatus}</p>}

        {result && (
          <div className="result-wrap">
            <div className="result">
              <p>Job: {result.job_id}</p>
              {scalar != null && (
                <p>
                  <strong>det(A) = {scalar.toFixed(4)}</strong>
                </p>
              )}
              <p>
                <a href={getResultBundleDownloadUrl(result.job_id)} target="_blank" rel="noreferrer">
                  Download ZIP bundle
                </a>
              </p>

              <ArtifactDownloads jobId={result.job_id} artifacts={result.artifacts} />

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
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
