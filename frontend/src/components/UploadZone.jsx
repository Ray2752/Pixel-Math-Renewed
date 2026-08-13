import { useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { formatDimensions } from "../utils/artifacts";

export default function UploadZone({ label, file, dimensions, onFile }) {
  const { t } = useSettings();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragOver(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  }

  return (
    <div className="upload-field">
      <span className="upload-label">{label}</span>
      <div
        className={dragOver ? "upload-zone drag-over" : "upload-zone"}
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) onFile(selected);
            event.target.value = "";
          }}
        />
        <div className="upload-zone-icon">⇪</div>
        {file ? (
          <>
            <p className="upload-zone-text">{file.name}</p>
            <span className="upload-zone-badge">
              {t("upload.currentInput")} [{formatDimensions(dimensions)}]
            </span>
          </>
        ) : (
          <>
            <p className="upload-zone-text">{t("upload.dragDrop")}</p>
            <p className="upload-zone-hint">{t("upload.hint")}</p>
          </>
        )}
      </div>
    </div>
  );
}
