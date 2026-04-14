import { useEffect, useState } from "react";
import {
  getHealth,
  getResultBundleDownloadUrl,
  processFilters,
  runOperation,
  sumImagesComposition,
  waitForJobCompletion,
} from "./api/client";

const DEFAULT_A = "[[1,2],[3,4]]";
const DEFAULT_B = "[[10,20],[30,40]]";

function parseMatrix(value, label) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || !Array.isArray(parsed[0])) {
      throw new Error();
    }
    return parsed;
  } catch {
    throw new Error(`${label} must be valid JSON matrix, for example [[1,2],[3,4]]`);
  }
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
  const [operation, setOperation] = useState("sum");
  const [matrixA, setMatrixA] = useState(DEFAULT_A);
  const [matrixB, setMatrixB] = useState(DEFAULT_B);
  const [opResult, setOpResult] = useState(null);
  const [opError, setOpError] = useState("");

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
  const [sumImageResult, setSumImageResult] = useState(null);
  const [sumImageError, setSumImageError] = useState("");
  const [sumJobStatus, setSumJobStatus] = useState("");
  const [sumCopyStatus, setSumCopyStatus] = useState("");
  const [opCopyStatus, setOpCopyStatus] = useState("");

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

  async function handleOperationSubmit(event) {
    event.preventDefault();
    setOpError("");
    setOpResult(null);
    setOpCopyStatus("");

    try {
      const parsedA = parseMatrix(matrixA, "Matrix A");
      const parsedB = operation === "sum" ? parseMatrix(matrixB, "Matrix B") : null;
      const result = await runOperation({
        operation,
        matrixA: parsedA,
        matrixB: parsedB,
      });
      setOpResult(result);
    } catch (error) {
      setOpError(error.message);
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
        pixelSize,
        colorLevels,
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
        <form onSubmit={handleOperationSubmit} className="form-grid">
          <label>
            Operation
            <select
              value={operation}
              onChange={(event) => setOperation(event.target.value)}
            >
              <option value="sum">Sum</option>
              <option value="transpose">Transpose</option>
              <option value="rotate">Rotate</option>
              <option value="determinant">Determinant</option>
            </select>
          </label>

          <label>
            Matrix A (JSON)
            <textarea
              rows={4}
              value={matrixA}
              onChange={(event) => setMatrixA(event.target.value)}
            />
          </label>

          {operation === "sum" && (
            <label>
              Matrix B (JSON)
              <textarea
                rows={4}
                value={matrixB}
                onChange={(event) => setMatrixB(event.target.value)}
              />
            </label>
          )}

          <button type="submit">Run Operation</button>
        </form>

        {opError && <p className="error">{opError}</p>}
        {opResult && (
          <div className="result-wrap">
            <button
              type="button"
              onClick={() => handleCopyResult(opResult, setOpCopyStatus, "Operation result")}
            >
              Copy JSON result
            </button>
            {opCopyStatus && <p className="copy-status">{opCopyStatus}</p>}
            <pre className="result">{JSON.stringify(opResult, null, 2)}</pre>
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
              <ul>
                {Object.entries(filterResult.artifacts).map(([key, value]) => (
                  <li key={key}>
                    <a href={value} target="_blank" rel="noreferrer">
                      {key}
                    </a>
                  </li>
                ))}
              </ul>

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
                <a
                  href={getResultBundleDownloadUrl(sumImageResult.job_id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download ZIP bundle
                </a>
              </p>

              <ul>
                {Object.entries(sumImageResult.artifacts).map(([key, value]) => (
                  <li key={key}>
                    <a href={value} target="_blank" rel="noreferrer">
                      {key}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="preview-grid">
                {Object.entries(sumImageResult.artifacts)
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
    </main>
  );
}

export default App;
