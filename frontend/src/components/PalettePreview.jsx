import { useEffect, useState } from "react";
import { getPalette } from "../api/client";

export default function PalettePreview({ jobId, artifactKey }) {
  const [swatches, setSwatches] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId || !artifactKey) return;
    let cancelled = false;

    getPalette(jobId, artifactKey)
      .then((data) => {
        if (!cancelled) setSwatches(data.swatches);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId, artifactKey]);

  if (error) return <p className="error">{error}</p>;
  if (!swatches) return <p className="meta-text">Loading palette…</p>;
  if (swatches.length === 0) return <p className="meta-text">No colors found.</p>;

  return (
    <div className="palette-strip">
      {swatches.map((swatch) => (
        <div
          key={swatch.number}
          className="palette-swatch"
          title={`#${swatch.number}: rgba(${swatch.rgba.join(", ")})`}
          style={{
            backgroundColor: `rgba(${swatch.rgba.join(", ")})`,
          }}
        />
      ))}
    </div>
  );
}
