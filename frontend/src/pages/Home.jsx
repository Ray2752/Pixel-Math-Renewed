import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth } from "../api/client";

export default function Home() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    getHealth()
      .then((data) => setStatus(`API ${data.status} (${data.environment}) v${data.version}`))
      .catch(() => setStatus("Backend unavailable. Start FastAPI on port 8000."));
  }, []);

  return (
    <div>
      <section className="panel">
        {import.meta.env.DEV && <div className="status">{status}</div>}
        <div className="page-header" style={{ marginTop: import.meta.env.DEV ? "1rem" : 0 }}>
          <h1>
            Visualizing Linear Algebra <span style={{ color: "var(--color-primary-light)" }}>Through Pixels</span>
          </h1>
          <p>
            An interactive laboratory for understanding image processing algorithms. Explore how
            matrices manipulate pixel data in real-time.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <Link to="/matrix-operations">
            <button type="button">Get Started</button>
          </Link>
          <Link to="/documentation">
            <button type="button" className="btn-secondary">
              Read Documentation
            </button>
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>The Pixel-to-Matrix Concept</h2>
        <p style={{ lineHeight: 1.7, marginTop: "1rem" }}>
          Every digital image is fundamentally a grid of numerical values. In a grayscale image,
          each pixel represents a luminance intensity ranging from 0 (black) to 255 (white).
        </p>
        <p style={{ lineHeight: 1.7 }}>
          By treating this grid as a mathematical matrix, we can apply linear algebra operations
          — like transposition, rotation, or determinant calculation — to alter the image
          fundamentally, then reconstruct it back into a picture.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/matrix-operations">Try Matrix Operations →</Link>
        </div>
      </section>

      <section className="panel">
        <h2>Explore the tools</h2>
        <div className="preview-grid" style={{ marginTop: "1rem" }}>
          <Link to="/matrix-operations" style={{ textDecoration: "none" }}>
            <div className="preview-card">
              <figcaption style={{ color: "var(--color-heading)", fontSize: "1rem" }}>
                Matrix Operations
              </figcaption>
              <p className="meta-text" style={{ marginTop: "0.4rem" }}>
                Transpose, rotate, or compute the determinant of an image's pixel matrix.
              </p>
            </div>
          </Link>
          <Link to="/image-filters" style={{ textDecoration: "none" }}>
            <div className="preview-card">
              <figcaption style={{ color: "var(--color-heading)", fontSize: "1rem" }}>
                Image Filters
              </figcaption>
              <p className="meta-text" style={{ marginTop: "0.4rem" }}>
                Simplify colors and pixelate an image to see its numeric matrix.
              </p>
            </div>
          </Link>
          <Link to="/image-composition" style={{ textDecoration: "none" }}>
            <div className="preview-card">
              <figcaption style={{ color: "var(--color-heading)", fontSize: "1rem" }}>
                Image Composition
              </figcaption>
              <p className="meta-text" style={{ marginTop: "0.4rem" }}>
                Combine two images with weighted matrix addition, C = αA + βB.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
