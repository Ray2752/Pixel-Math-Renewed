import { useState } from "react";
import { readImageDimensions } from "../utils/artifacts";
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

    setFile(selected);
    try {
      const nextDimensions = await readImageDimensions(selected);
      setDimensions(nextDimensions);
    } catch (err) {
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
