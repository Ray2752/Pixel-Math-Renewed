const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Health request failed");
  }
  return response.json();
}

function operationUrl(operation) {
  switch (operation) {
    case "sum":
      return `${API_BASE_URL}/api/v1/operations/sum`;
    case "transpose":
      return `${API_BASE_URL}/api/v1/operations/transpose`;
    case "rotate":
      return `${API_BASE_URL}/api/v1/operations/rotate`;
    case "determinant":
      return `${API_BASE_URL}/api/v1/operations/determinant`;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

export async function runOperation({ operation, matrixA, matrixB }) {
  const response = await fetch(operationUrl(operation), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operation,
      matrix_a: matrixA,
      matrix_b: matrixB,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Operation failed");
  }

  return data;
}

export async function processFilters({ file, pixelSize, colorLevels }) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("pixel_size", String(pixelSize));
  formData.append("color_levels", String(colorLevels));

  const response = await fetch(`${API_BASE_URL}/api/v1/filters/process`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Filter processing failed");
  }

  return {
    ...data,
    artifacts: Object.fromEntries(
      Object.entries(data.artifacts || {}).map(([key, value]) => [
        key,
        value.startsWith("http") ? value : `${API_BASE_URL}${value}`,
      ])
    ),
  };
}
