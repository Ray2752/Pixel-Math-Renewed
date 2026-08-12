export function isImageArtifact(url) {
  return /\.(png|jpg|jpeg|webp|gif)$/i.test(url);
}

export function formatDimensions(dimensions) {
  if (!dimensions) {
    return "-";
  }
  return `${dimensions.width} x ${dimensions.height}`;
}

// El backend reduce todo a 800px como máximo; reducir antes de subir ahorra
// ancho de banda y el decodificado de imágenes grandes en el servidor.
const MAX_UPLOAD_DIM = 800;

export async function downscaleForUpload(file, maxDim = MAX_UPLOAD_DIM) {
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    if (Math.max(width, height) <= maxDim) {
      bitmap.close?.();
      return file;
    }

    const scale = maxDim / Math.max(width, height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const type = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.92));
    if (!blob) return file;
    return new File([blob], file.name, { type });
  } catch {
    // Si el navegador no puede decodificarla, el backend la redimensiona igual
    return file;
  }
}

export function readImageDimensions(file) {
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

export async function copyJsonToClipboard(value) {
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
