import { useState } from "react";
import { downscaleForUpload, readImageDimensions } from "../utils/artifacts";
import { useSettings } from "../context/SettingsContext";

const MAX_UPLOAD_MB = 10;

export function useImageUpload() {
  const { t } = useSettings();
  const [file, setFile] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(selected) {
    setDimensions(null);
    setError("");

    if (!selected) {
      setFile(null);
      return;
    }

    if (!selected.type.startsWith("image/")) {
      setFile(null);
      setError(t("upload.invalidType"));
      return;
    }

    if (selected.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setFile(null);
      setError(t("upload.tooLarge", MAX_UPLOAD_MB));
      return;
    }

    try {
      const prepared = await downscaleForUpload(selected);
      setFile(prepared);
      const nextDimensions = await readImageDimensions(prepared);
      setDimensions(nextDimensions);
    } catch (err) {
      setFile(selected);
      setError(err.message);
    }
  }

  function handleFileChange(event) {
    return handleFile(event.target.files?.[0] || null);
  }

  function reset() {
    setFile(null);
    setDimensions(null);
    setError("");
  }

  return { file, dimensions, error, handleFile, handleFileChange, reset, setError };
}
