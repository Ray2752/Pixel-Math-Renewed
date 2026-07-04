import { useState } from "react";
import { readImageDimensions } from "../utils/artifacts";

export function useImageUpload() {
  const [file, setFile] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(selected) {
    setFile(selected);
    setDimensions(null);
    setError("");

    if (!selected) return;

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
