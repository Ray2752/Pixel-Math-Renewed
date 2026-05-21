import { useEffect, useState } from "react";
import {
  getHealth,
  getMatrixData,
  getResultBundleDownloadUrl,
  processFilters,
  runImageOperation,
  sumImagesComposition,
  waitForJobCompletion,
} from "./api/client";

function MatrixTable({ rows }) {
  if (!rows || rows.length === 0) return <p className="meta-text">Empty matrix.</p>;
  return (
    <div className="matrix-table-wrap">
      <table className="matrix-table">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function isImageArtifact(url) {
  return /\.(png|jpg|jpeg|webp|gif)$/i.test(url);
}

function formatDimensions(dimensions) {
  if (!dimensions) {
    return "-";
  }
  return `${dimensions.width} x ${dimensions.height}`;
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions"));
    };
    image.src = objectUrl;
  });
}

async function copyJsonToClipboard(value) {
  const text = JSON.stringify(value, null, 2);

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function App() {
  const [status, setStatus] = useState("Checking backend...");

  const [imgOp, setImgOp] = useState("transpose");
  const [imgOpFile, setImgOpFile] = useState(null);
  const [imgOpDimensions, setImgOpDimensions] = useState(null);
  const [imgOpPixelSize, setImgOpPixelSize] = useState(10);
  const [imgOpColorLevels, setImgOpColorLevels] = useState(64);
  const [imgOpResult, setImgOpResult] = useState(null);
  const [imgOpScalar, setImgOpScalar] = useState(null);
  const [imgOpError, setImgOpError] = useState("");
  const [imgOpJobStatus, setImgOpJobStatus] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [pixelSize, setPixelSize] = useState(10);
  const [colorLevels, setColorLevels] = useState(64);
  const [filterResult, setFilterResult] = useState(null);
  const [filterError, setFilterError] = useState("");
  const [filterJobStatus, setFilterJobStatus] = useState("");
  const [filterCopyStatus, setFilterCopyStatus] = useState("");

  const [landscapeFile, setLandscapeFile] = useState(null);
  const [landscapeDimensions, setLandscapeDimensions] = useState(null);
  const [characterFile, setCharacterFile] = useState(null);
  const [characterDimensions, setCharacterDimensions] = useState(null);
  const [sumPixelSize, setSumPixelSize] = useState(10);
  const [sumColorLevels, setSumColorLevels] = useState(64);
  const [sumImageResult, setSumImageResult] = useState(null);
  const [sumImageError, setSumImageError] = useState("");
  const [sumJobStatus, setSumJobStatus] = useState("");
  const [sumCopyStatus, setSumCopyStatus] = useState("");

  const [imgOpMatrixView, setImgOpMatrixView] = useState(null);
  const [filterMatrixView, setFilterMatrixView] = useState(null);
  const [sumMatrixView, setSumMatrixView] = useState(null);

  const hasCompositionDimensionMismatch =
    landscapeDimensions &&
    characterDimensions &&
    (landscapeDimensions.width !== characterDimensions.width ||
      landscapeDimensions.height !== characterDimensions.height);

  useEffect(() => {
    getHealth()
      .then((data) => {
        setStatus(`API ${data.status} (${data.environment}) v${data.version}`);
      })
      .catch(() => {
        setStatus("Backend unavailable. Start FastAPI on port 8000.");
      });
  }, []);

  async function handleImgOpSubmit(event) {
    event.preventDefault();
    setImgOpError("");
    setImgOpResult(null);
    setImgOpScalar(null);
    setImgOpJobStatus("");

    if (!imgOpFile) {
      setImgOpError("Select an image file first.");
      return;
    }

    try {
      const kickoff = await runImageOperation({
        operation: imgOp,
        file: imgOpFile,
        pixelSize: imgOpPixelSize,
        colorLevels: imgOpColorLevels,
      });
      setImgOpJobStatus(`Job ${kickoff.job_id} running...`);
      const completed = await waitForJobCompletion(kickoff.job_id);
      setImgOpResult(completed);
      if (imgOp === "determinant" && completed.result?.scalar_result != null) {
        setImgOpScalar(completed.result.scalar_result);
      }
      setImgOpJobStatus(`Job ${kickoff.job_id} completed.`);
    } catch (error) {
      setImgOpError(error.message);
    }
  }

  async function handleImgOpFileChange(event) {
    const file = event.target.files?.[0] || null;
    setImgOpFile(file);
    setImgOpDimensions(null);
    setImgOpError("");

    if (!file) return;

    try {
      const dimensions = await readImageDimensions(file);
      setImgOpDimensions(dimensions);
    } catch (error) {
      setImgOpError(error.message);
    }
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    setFilterError("");
    setFilterResult(null);
    setFilterJobStatus("");
    setFilterCopyStatus("");

    if (!imageFile) {
      setFilterError("Select an image file first.");
      return;
    }

    try {
      const kickoff = await processFilters({ file: imageFile, pixelSize, colorLevels });
      setFilterJobStatus(`Job ${kickoff.job_id} running...`);

      const completed = await waitForJobCompletion(kickoff.job_id);
      setFilterResult(completed);
      setFilterJobStatus(`Job ${kickoff.job_id} completed.`);
    } catch (error) {
      setFilterError(error.message);
    }
  }

  async function handleSumImagesSubmit(event) {
    event.preventDefault();
    setSumImageError("");
    setSumImageResult(null);
    setSumJobStatus("");
    setSumCopyStatus("");

    if (!landscapeFile || !characterFile) {
      setSumImageError("Select both landscape and character images.");
      return;
    }

    if (hasCompositionDimensionMismatch) {
      setSumImageError("Images must have exactly the same dimensions.");
      return;
    }

    try {
      const kickoff = await sumImagesComposition({
        landscapeFile,
        characterFile,
        pixelSize: sumPixelSize,
        colorLevels: sumColorLevels,
      });
      setSumJobStatus(`Job ${kickoff.job_id} running...`);

      const completed = await waitForJobCompletion(kickoff.job_id);
      setSumImageResult(completed);
      setSumJobStatus(`Job ${kickoff.job_id} completed.`);
    } catch (error) {
      setSumImageError(error.message);
    }
  }

  async function handleSingleImageChange(event) {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImageDimensions(null);
    setFilterError("");

    if (!file) {
      return;
    }

    try {
      const dimensions = await readImageDimensions(file);
      setImageDimensions(dimensions);
    } catch (error) {
      setFilterError(error.message);
    }
  }

  async function handleLandscapeChange(event) {
    const file = event.target.files?.[0] || null;
    setLandscapeFile(file);
    setLandscapeDimensions(null);
    setSumImageError("");

    if (!file) {
      return;
    }

    try {
      const dimensions = await readImageDimensions(file);
      setLandscapeDimensions(dimensions);
    } catch (error) {
      setSumImageError(error.message);
    }
  }

  async function handleCharacterChange(event) {
    const file = event.target.files?.[0] || null;
    setCharacterFile(file);
    setCharacterDimensions(null);
    setSumImageError("");

    if (!file) {
      return;
    }

    try {
      const dimensions = await readImageDimensions(file);
      setCharacterDimensions(dimensions);
    } catch (error) {
      setSumImageError(error.message);
    }
  }

  async function handleViewMatrix(jobId, artifactKey, setMatrixView, currentView) {
    if (currentView?.key === artifactKey) {
      setMatrixView(null);
      return;
    }
    try {
      const data = await getMatrixData(jobId, artifactKey);
      setMatrixView({ key: artifactKey, rows: data.rows, shape: data.shape });
    } catch {
      setMatrixView({ key: artifactKey, rows: null, shape: null });
    }
  }

  async function handleCopyResult(result, setStatus, label) {
    try {
      await copyJsonToClipboard(result);
      setStatus(`${label} copied to clipboard.`);
    } catch {
      setStatus("Could not copy result to clipboard.");
    }
  }

  return (
    <main className="container">
      <h1>Pixel-Math Web MVP</h1>
      <p>Backend operations and filters are now connected.</p>
      <div className="status">{status}</div>

      <section className="panel">
        <h2>Matrix Operations</h2>
        <form onSubmit={handleImgOpSubmit} className="form-grid">
          <label>
            Operation
            <select
              value={imgOp}
              onChange={(event) => setImgOp(event.target.value)}
            >
              <option value="transpose">Transpose</option>
              <option value="rotate">Rotate</option>
              <option value="determinant">Determinant</option>
            </select>
          </label>

          <label>
            Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImgOpFileChange}
            />
          </label>

          <p className="meta-text">Selected image size: {formatDimensions(imgOpDimensions)}</p>
          {(imgOp === "rotate" || imgOp === "determinant") && imgOpDimensions &&
            imgOpDimensions.width !== imgOpDimensions.height && (
            <p className="warn-text">
              Image is not square — it will be auto-cropped to {Math.min(imgOpDimensions.width, imgOpDimensions.height)}×{Math.min(imgOpDimensions.width, imgOpDimensions.height)} before processing.
            </p>
          )}

          <label>
            Pixel size
            <input
              type="number"
              min={1}
              max={64}
              value={imgOpPixelSize}
              onChange={(event) => setImgOpPixelSize(Number(event.target.value))}
            />
          </label>

          <label>
            Color levels
            <input
              type="number"
              min={2}
              max={256}
              value={imgOpColorLevels}
              onChange={(event) => setImgOpColorLevels(Number(event.target.value))}
            />
          </label>

          <button type="submit">Process Image</button>
        </form>

        {imgOpError && <p className="error">{imgOpError}</p>}
        {imgOpJobStatus && <p className="job-status">{imgOpJobStatus}</p>}
        {imgOpResult && (
          <div className="result-wrap">
            <div className="result">
              <p>Job: {imgOpResult.job_id}</p>
              {imgOpScalar != null && (
                <p><strong>Determinant value: {imgOpScalar.toFixed(4)}</strong></p>
              )}
              <p>
                <a href={getResultBundleDownloadUrl(imgOpResult.job_id)} target="_blank" rel="noreferrer">
                  Download ZIP bundle
                </a>
              </p>

              <div className="artifact-downloads">
                {Object.entries(imgOpResult.artifacts).map(([key, value]) => (
                  <span key={key} className="artifact-item">
                    <a href={value} target="_blank" rel="noreferrer" download={key.endsWith("_xlsx") || isImageArtifact(value)}>
                      ↓ {key}
                    </a>
                    {key.endsWith("_xlsx") && (
                      <button
                        type="button"
                        className="btn-view-matrix"
                        onClick={() => handleViewMatrix(imgOpResult.job_id, key, setImgOpMatrixView, imgOpMatrixView)}
                      >
                        {imgOpMatrixView?.key === key ? "Hide" : "View"}
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {imgOpMatrixView && (
                <div className="matrix-viewer">
                  <p className="meta-text">Matrix: {imgOpMatrixView.key} — {imgOpMatrixView.shape?.[0]}×{imgOpMatrixView.shape?.[1]}</p>
                  {imgOpMatrixView.rows ? <MatrixTable rows={imgOpMatrixView.rows} /> : <p className="error">Could not load matrix.</p>}
                </div>
              )}

              <div className="preview-grid">
                {Object.entries(imgOpResult.artifacts)
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

      <section className="panel">
        <h2>Image Filters</h2>
        <form onSubmit={handleFilterSubmit} className="form-grid">
          <label>
            Image
            <input
              type="file"
              accept="image/*"
              onChange={handleSingleImageChange}
            />
          </label>

          <p className="meta-text">Selected image size: {formatDimensions(imageDimensions)}</p>

          <label>
            Pixel size
            <input
              type="number"
              min={1}
              max={64}
              value={pixelSize}
              onChange={(event) => setPixelSize(Number(event.target.value))}
            />
          </label>

          <label>
            Color levels
            <input
              type="number"
              min={2}
              max={256}
              value={colorLevels}
              onChange={(event) => setColorLevels(Number(event.target.value))}
            />
          </label>

          <button type="submit">Process Image</button>
        </form>

        {filterError && <p className="error">{filterError}</p>}
        {filterJobStatus && <p className="job-status">{filterJobStatus}</p>}
        {filterResult && (
          <div className="result-wrap">
            <button
              type="button"
              onClick={() => handleCopyResult(filterResult, setFilterCopyStatus, "Filter result")}
            >
              Copy JSON result
            </button>
            {filterCopyStatus && <p className="copy-status">{filterCopyStatus}</p>}

            <div className="result">
              <p>Job: {filterResult.job_id}</p>
              <p>
                <a
                  href={getResultBundleDownloadUrl(filterResult.job_id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download ZIP bundle
                </a>
              </p>
              <div className="artifact-downloads">
                {Object.entries(filterResult.artifacts).map(([key, value]) => (
                  <span key={key} className="artifact-item">
                    <a href={value} target="_blank" rel="noreferrer" download={key.endsWith("_xlsx") || isImageArtifact(value)}>
                      ↓ {key}
                    </a>
                    {key.endsWith("_xlsx") && (
                      <button
                        type="button"
                        className="btn-view-matrix"
                        onClick={() => handleViewMatrix(filterResult.job_id, key, setFilterMatrixView, filterMatrixView)}
                      >
                        {filterMatrixView?.key === key ? "Hide" : "View"}
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {filterMatrixView && (
                <div className="matrix-viewer">
                  <p className="meta-text">Matrix: {filterMatrixView.key} — {filterMatrixView.shape?.[0]}×{filterMatrixView.shape?.[1]}</p>
                  {filterMatrixView.rows ? <MatrixTable rows={filterMatrixView.rows} /> : <p className="error">Could not load matrix.</p>}
                </div>
              )}

              <div className="preview-grid">
                {Object.entries(filterResult.artifacts)
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

      <section className="panel">
        <h2>Image Composition (Landscape + Character)</h2>
        <form onSubmit={handleSumImagesSubmit} className="form-grid">
          <label>
            Landscape image
            <input
              type="file"
              accept="image/*"
              onChange={handleLandscapeChange}
            />
          </label>

          <label>
            Character image
            <input
              type="file"
              accept="image/*"
              onChange={handleCharacterChange}
            />
          </label>

          <p className="meta-text">Landscape size: {formatDimensions(landscapeDimensions)}</p>
          <p className="meta-text">Character size: {formatDimensions(characterDimensions)}</p>
          {hasCompositionDimensionMismatch && (
            <p className="warn-text">
              Dimension mismatch detected. Select files with the same width and height.
            </p>
          )}

          <label>
            Pixel size
            <input
              type="number"
              min={1}
              max={64}
              value={sumPixelSize}
              onChange={(event) => setSumPixelSize(Number(event.target.value))}
            />
          </label>

          <label>
            Color levels
            <input
              type="number"
              min={2}
              max={256}
              value={sumColorLevels}
              onChange={(event) => setSumColorLevels(Number(event.target.value))}
            />
          </label>

          <button type="submit" disabled={hasCompositionDimensionMismatch}>
            Compose and Sum Images
          </button>
        </form>

        {sumImageError && <p className="error">{sumImageError}</p>}
        {sumJobStatus && <p className="job-status">{sumJobStatus}</p>}

        {sumImageResult && (
          <div className="result-wrap">
            <button
              type="button"
              onClick={() => handleCopyResult(sumImageResult, setSumCopyStatus, "Composition result")}
            >
              Copy JSON result
            </button>
            {sumCopyStatus && <p className="copy-status">{sumCopyStatus}</p>}

            <div className="result">
              <p>Job: {sumImageResult.job_id}</p>
              <p>
                <a href={getResultBundleDownloadUrl(sumImageResult.job_id)} target="_blank" rel="noreferrer">
                  Download ZIP bundle
                </a>
              </p>

              <h3 className="result-subtitle">Individual Matrices</h3>
              <div className="preview-grid">
                {["landscape_pixel", "landscape_numeric_preview", "character_pixel", "character_numeric_preview"].map((key) =>
                  sumImageResult.artifacts[key] ? (
                    <figure key={key} className="preview-card">
                      <img src={sumImageResult.artifacts[key]} alt={key} />
                      <figcaption>{key}</figcaption>
                    </figure>
                  ) : null
                )}
              </div>
              <div className="artifact-downloads">
                {["landscape_source", "landscape_pixel", "landscape_matrix_xlsx", "character_source", "character_pixel", "character_matrix_xlsx"].map((key) =>
                  sumImageResult.artifacts[key] ? (
                    <span key={key} className="artifact-item">
                      <a href={sumImageResult.artifacts[key]} target="_blank" rel="noreferrer" download>
                        ↓ {key}
                      </a>
                      {key.endsWith("_xlsx") && (
                        <button
                          type="button"
                          className="btn-view-matrix"
                          onClick={() => handleViewMatrix(sumImageResult.job_id, key, setSumMatrixView, sumMatrixView)}
                        >
                          {sumMatrixView?.key === key ? "Hide" : "View"}
                        </button>
                      )}
                    </span>
                  ) : null
                )}
              </div>
              {sumMatrixView && ["landscape_matrix_xlsx", "character_matrix_xlsx"].includes(sumMatrixView.key) && (
                <div className="matrix-viewer">
                  <p className="meta-text">Matrix: {sumMatrixView.key} — {sumMatrixView.shape?.[0]}×{sumMatrixView.shape?.[1]}</p>
                  {sumMatrixView.rows ? <MatrixTable rows={sumMatrixView.rows} /> : <p className="error">Could not load matrix.</p>}
                </div>
              )}

              <h3 className="result-subtitle">Final Composition</h3>
              <div className="preview-grid">
                {["sum_final_image", "sum_numeric_preview"].map((key) =>
                  sumImageResult.artifacts[key] ? (
                    <figure key={key} className="preview-card">
                      <img src={sumImageResult.artifacts[key]} alt={key} />
                      <figcaption>{key}</figcaption>
                    </figure>
                  ) : null
                )}
              </div>
              <div className="artifact-downloads">
                {["sum_final_image", "sum_matrix_xlsx"].map((key) =>
                  sumImageResult.artifacts[key] ? (
                    <span key={key} className="artifact-item">
                      <a href={sumImageResult.artifacts[key]} target="_blank" rel="noreferrer" download>
                        ↓ {key}
                      </a>
                      {key.endsWith("_xlsx") && (
                        <button
                          type="button"
                          className="btn-view-matrix"
                          onClick={() => handleViewMatrix(sumImageResult.job_id, key, setSumMatrixView, sumMatrixView)}
                        >
                          {sumMatrixView?.key === key ? "Hide" : "View"}
                        </button>
                      )}
                    </span>
                  ) : null
                )}
              </div>
              {sumMatrixView?.key === "sum_matrix_xlsx" && (
                <div className="matrix-viewer">
                  <p className="meta-text">Matrix: {sumMatrixView.key} — {sumMatrixView.shape?.[0]}×{sumMatrixView.shape?.[1]}</p>
                  {sumMatrixView.rows ? <MatrixTable rows={sumMatrixView.rows} /> : <p className="error">Could not load matrix.</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
