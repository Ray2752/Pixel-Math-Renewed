import { useEffect, useState } from "react";
import { getPalette } from "../api/client";
import { useSettings } from "../context/SettingsContext";

const MAX_SWATCHES = 192;

export default function PalettePreview({ jobId, artifactKey }) {
  const { t } = useSettings();
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
  if (!swatches)
    return (
      <p className="meta-text">
        <span className="spinner" /> {t("shared.loading")}
      </p>
    );
  if (swatches.length === 0) return <p className="meta-text">—</p>;

  const visible = swatches.slice(0, MAX_SWATCHES);
  const hiddenCount = swatches.length - visible.length;

  return (
    <div className="palette-strip">
      {visible.map((swatch) => (
        <div
          key={swatch.number}
          className="palette-swatch"
          title={`#${swatch.number}: rgba(${swatch.rgba.join(", ")})`}
          style={{
            backgroundColor: `rgba(${swatch.rgba.join(", ")})`,
          }}
        />
      ))}
      {hiddenCount > 0 && (
        <span className="meta-text">{t("filters.paletteMore", hiddenCount)}</span>
      )}
    </div>
  );
}
