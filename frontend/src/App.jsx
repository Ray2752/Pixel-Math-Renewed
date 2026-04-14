import { useEffect, useState } from "react";
import { getHealth, processFilters, runOperation } from "./api/client";

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

function App() {
  const [status, setStatus] = useState("Checking backend...");
  const [operation, setOperation] = useState("sum");
  const [matrixA, setMatrixA] = useState(DEFAULT_A);
  const [matrixB, setMatrixB] = useState(DEFAULT_B);
  const [opResult, setOpResult] = useState(null);
  const [opError, setOpError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [pixelSize, setPixelSize] = useState(10);
  const [colorLevels, setColorLevels] = useState(64);
  const [filterResult, setFilterResult] = useState(null);
  const [filterError, setFilterError] = useState("");

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

    if (!imageFile) {
      setFilterError("Select an image file first.");
      return;
    }

    try {
      const result = await processFilters({ file: imageFile, pixelSize, colorLevels });
      setFilterResult(result);
    } catch (error) {
      setFilterError(error.message);
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
          <pre className="result">{JSON.stringify(opResult, null, 2)}</pre>
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
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            />
          </label>

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
        {filterResult && (
          <div className="result">
            <p>Job: {filterResult.job_id}</p>
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
        )}
      </section>
    </main>
  );
}

export default App;
