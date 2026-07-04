import { useEffect, useState } from "react";
import {
  downloadMatrixAsJson,
  getMatrixData,
  getResultBundleDownloadUrl,
  processFilters,
} from "../api/client";
import { useImageUpload } from "../hooks/useImageUpload";
import { useJobSubmit } from "../hooks/useJobSubmit";
import RangeField from "../components/RangeField";
import ArtifactDownloads from "../components/ArtifactDownloads";
import MatrixTerminalView from "../components/MatrixTerminalView";
import PalettePreview from "../components/PalettePreview";
import { formatDimensions } from "../utils/artifacts";

export default function ImageFilters() {
  const [pixelSize, setPixelSize] = useState(10);
  const [colorLevels, setColorLevels] = useState(64);
  const [terminalMatrix, setTerminalMatrix] = useState(null);

  const { file, dimensions, error: uploadError, handleFileChange, reset: resetUpload } =
    useImageUpload();
  const { result, error, jobStatus, run, reset: resetJob } = useJobSubmit();

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
      resetJob();
      return;
    }
    await run(processFilters({ file, pixelSize, colorLevels }));
  }

  function handleReset() {
    resetUpload();
    resetJob();
    setPixelSize(10);
    setColorLevels(64);
  }

  async function handleExportJson() {
    if (!result) return;
    const data = await getMatrixData(result.job_id, "numeric_matrix_xlsx");
    downloadMatrixAsJson(data, `${result.job_id}_matrix.json`);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Pixelation Pipeline</h1>
        <p>
          Configure source parameters to generate discrete numeric approximations of an image
          through color quantization and downsampling.
        </p>
      </div>

      <section className="panel">
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Image
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          <p className="meta-text">Selected image size: {formatDimensions(dimensions)}</p>

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

          <button type="submit">Execute Pipeline</button>
        </form>

        {uploadError && <p className="error">{uploadError}</p>}
        {error && <p className="error">{error}</p>}
        {jobStatus && <p className="job-status">{jobStatus}</p>}

        {result && (
          <div className="result-wrap">
            <div className="result">
              <p>Job: {result.job_id}</p>

              <h3 className="result-subtitle">Pipeline Stages</h3>
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
                    <figcaption>Palette</figcaption>
                    <PalettePreview jobId={result.job_id} artifactKey="color_map_xlsx" />
                  </div>
                )}
              </div>

              {terminalMatrix && (
                <>
                  <h3 className="result-subtitle">Data Output Array</h3>
                  <MatrixTerminalView rows={terminalMatrix.rows} shape={terminalMatrix.shape} />
                </>
              )}

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
                {result.artifacts.pixel_art && (
                  <a href={result.artifacts.pixel_art} download>
                    <button type="button" className="btn-secondary">
                      Export PNG
                    </button>
                  </a>
                )}
                <button type="button" className="btn-secondary" onClick={handleExportJson}>
                  Export JSON Array
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  Reset Pipeline
                </button>
                <a href={getResultBundleDownloadUrl(result.job_id)} target="_blank" rel="noreferrer">
                  Download ZIP bundle
                </a>
              </div>

              <h3 className="result-subtitle">All Artifacts</h3>
              <ArtifactDownloads jobId={result.job_id} artifacts={result.artifacts} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
