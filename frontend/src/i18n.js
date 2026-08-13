export const translations = {
  en: {
    // Sidebar / nav
    "nav.matrixOps": "Matrix Operations",
    "nav.imageFilters": "Image Filters",
    "nav.imageComposition": "Image Composition",
    "nav.settings": "Settings",
    "nav.documentation": "Documentation",

    // Shared
    "shared.pixelSize": "Pixel Size",
    "shared.colorLevels": "Color Levels",
    "shared.downloadZip": "Download ZIP bundle",
    "shared.view": "View",
    "shared.hide": "Hide",
    "shared.emptyMatrix": "Empty matrix.",
    "shared.showingMatrix": (rows, cols) => `Showing ${rows}×${cols} matrix`,
    "shared.couldNotLoadMatrix": "Could not load matrix.",
    "shared.jobRunning": (id) => `Job ${id} running...`,
    "shared.jobCompleted": (id) => `Job ${id} completed.`,
    "shared.jobRestored": (id) => `Previous job ${id} restored.`,
    "shared.selectImageFirst": "Select an image file first.",
    "shared.processing": "Processing…",
    "shared.coldStartHint":
      "The server may be waking up from sleep — this can take up to a minute.",
    "shared.requestTimeout":
      "The server took too long to respond. It may be waking up — try again in a moment.",
    "shared.loading": "Loading…",
    "shared.copy": "Copy",
    "shared.copied": "Copied!",
    "shared.jobLabel": "Job",
    "shared.reset": "Reset",
    "shared.matrixDataHeader": (shape) => `# Pixel matrix data [${shape}]`,
    "shared.matrixTruncated": (rows, cols) =>
      `Showing the first ${rows}×${cols} cells — download the CSV for the full matrix.`,

    // API errors (translated from backend detail strings)
    "apiError.serverError": (code) => `Server error (${code}). Try again in a moment.`,
    "apiError.pixelSizeExceedsImage": (px, side) =>
      `Pixel size (${px}) can't exceed the image's smallest side (${side}px). Lower the pixel size.`,
    "apiError.fileTooLarge": (mb) => `The image exceeds the ${mb} MB limit.`,
    "apiError.weightsZero": "Weights α and β can't both be zero.",
    "apiError.notAnImage": "The file must be an image.",
    "apiError.dimensionsMismatch": "Both images must have the same dimensions.",
    "apiError.jobNotFound": "The job no longer exists on the server (results are kept for 24 hours).",
    "apiError.jobTimeout": "The job didn't finish in the expected time. Try again.",
    "apiError.invalidParams": "One of the parameters is out of range.",
    "apiError.unprocessableImage": "The image couldn't be processed. Try a different file.",
    "apiError.operationFailed": (detail) => `The operation failed: ${detail}`,

    // Artifact display names
    "artifact.source": "Source image",
    "artifact.simplified": "Simplified colors",
    "artifact.pixel_art": "Pixel art",
    "artifact.numeric_matrix_xlsx": "Numeric matrix (XLSX)",
    "artifact.color_map_xlsx": "Color map (XLSX)",
    "artifact.numeric_matrix_preview": "Numeric matrix preview",
    "artifact.result_image": "Result image",
    "artifact.result_numeric_preview": "Result numeric preview",
    "artifact.bundle_zip": "ZIP bundle",
    "artifact.landscape_source": "Landscape source",
    "artifact.landscape_pixel": "Landscape pixel art",
    "artifact.landscape_matrix_xlsx": "Landscape matrix (XLSX)",
    "artifact.landscape_numeric_preview": "Landscape numeric preview",
    "artifact.character_source": "Character source",
    "artifact.character_pixel": "Character pixel art",
    "artifact.character_matrix_xlsx": "Character matrix (XLSX)",
    "artifact.character_numeric_preview": "Character numeric preview",
    "artifact.sum_matrix_xlsx": "Sum matrix (XLSX)",
    "artifact.sum_numeric_preview": "Sum numeric preview",
    "artifact.sum_final_image": "Final composition",

    // Upload zone
    "upload.dragDrop": "Drag & drop an image",
    "upload.hint": "PNG, JPG or WebP (max 10MB) — or click to browse",
    "upload.currentInput": "Current input:",
    "upload.invalidType": "The selected file is not an image.",
    "upload.tooLarge": (mb) => `The image exceeds the ${mb} MB limit.`,

    // Home
    "home.heroTitle": "Visualizing Linear Algebra",
    "home.heroTitleAccent": "Through Pixels",
    "home.heroBody":
      "An interactive laboratory for understanding image processing algorithms. Explore how matrices manipulate pixel data in real-time.",
    "home.getStarted": "Initialize Workspace",
    "home.readDocs": "Read Documentation",
    "home.systemOnline": "System Online",
    "home.systemOffline": "System Offline",
    "home.connecting": "Connecting…",
    "home.conceptTitle": "The Pixel-to-Matrix Concept",
    "home.conceptP1":
      "Every digital image is fundamentally a grid of numerical values. In a grayscale image, each pixel represents a luminance intensity ranging from 0 (black) to 255 (white).",
    "home.conceptP2":
      "By treating this grid as a mathematical matrix, we can apply linear algebra operations — like transposition, rotation, or determinant calculation — to alter the image fundamentally, then reconstruct it back into a picture.",
    "home.tryMatrixOps": "Try Matrix Operations →",
    "home.exploreTools": "Explore the tools",
    "home.matrixOpsDesc": "Transpose, rotate, or compute the determinant of an image's pixel matrix.",
    "home.filtersDesc": "Simplify colors and pixelate an image to see its numeric matrix.",
    "home.compositionDesc": "Combine two images with weighted matrix addition, C = αA + βB.",

    // Matrix Operations
    "matrixOps.title": "Matrix Operations",
    "matrixOps.subtitle":
      "Execute linear algebraic transformations on image data. Select an operation and upload a source image for processing.",
    "matrixOps.configTitle": "Operation Config",
    "matrixOps.operation": "Operation",
    "matrixOps.transpose": "Transpose",
    "matrixOps.rotate": "Rotate",
    "matrixOps.determinant": "Determinant",
    "matrixOps.sourceImage": "Source image",
    "matrixOps.nonSquareWarn": (size) =>
      `Image is not square — it will be auto-cropped to ${size}×${size} before processing.`,
    "matrixOps.execute": "Execute Computation",
    "matrixOps.emptyTitle": "Upload an image to see matrix results",
    "matrixOps.emptyHint": "Awaiting dataset input…",
    "matrixOps.scalarLabel": "Scalar Determinant Result",
    "matrixOps.nonSingular": "Non-singular matrix confirmed.",
    "matrixOps.singular": "Singular matrix (det = 0).",
    "matrixOps.warnStillSingular":
      "The matrix had repeated rows/columns; the adjustment could not remove the linear dependence, so it is still singular (det = 0).",
    "matrixOps.warnAdjusted":
      "The matrix had repeated rows/columns and was adjusted to avoid a zero determinant.",
    "matrixOps.warnDetOverflow": (magnitude) =>
      `The determinant magnitude is about ${magnitude}, beyond what double precision can represent — the exact scalar cannot be displayed.`,
    "matrixOps.dataPreview": "Matrix Data Preview",

    // Image Filters
    "filters.title": "Pixelation Pipeline",
    "filters.subtitle":
      "Configure source parameters to generate discrete numeric approximations of an image through color quantization and downsampling.",
    "filters.paramsTitle": "Parameters",
    "filters.loadImage": "Load source image",
    "filters.execute": "Execute Pipeline",
    "filters.stages": "Pipeline Stages",
    "filters.palette": "Palette",
    "filters.paletteMore": (count) => `+${count} more colors`,
    "filters.dataArray": "Data Output Array",
    "filters.exportPng": "Export PNG",
    "filters.exportJson": "Export JSON Array",
    "filters.reset": "Reset Pipeline",
    "filters.allArtifacts": "All Artifacts",
    "filters.emptyTitle": "Run the pipeline to see its stages",
    "filters.emptyHint": "Awaiting dataset input…",

    // Image Composition
    "composition.title": "Image Composition",
    "composition.titleSuffix": "_SUM",
    "composition.subtitle":
      "Combine two image matrices through weighted element-wise addition. Adjust the blend weights to control how much each source contributes.",
    "composition.landscape": "Landscape [A]",
    "composition.character": "Character [B]",
    "composition.baseImage": "Base image",
    "composition.overlayImage": "Overlay image",
    "composition.settingsTitle": "Composition Settings",
    "composition.weightAlpha": "Weight α [Landscape]",
    "composition.weightBeta": "Weight β [Character]",
    "composition.computeSum": "Compute Sum",
    "composition.individualMatrices": "Individual Matrices",
    "composition.finalComposition": "Final Composition",
    "composition.matrixInspector": "Matrix Inspector [Center Crop]",
    "composition.exportArray": "Export Array",
    "composition.dimensionMismatch":
      "Dimension mismatch detected. Select files with the same width and height.",
    "composition.selectBoth": "Select both landscape and character images.",
    "composition.sameDimensions": "Images must have exactly the same dimensions.",
    "composition.emptyTitle": "Upload two images to see their composition",
    "composition.emptyHint": "Awaiting dataset input…",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Preferences for Pixel-Math.",
    "settings.language": "Language",
    "settings.defaultParams": "Default Parameters",
    "settings.defaultParamsHint":
      "New sessions of the three tools start with these values.",
    "settings.matrixViewer": "Matrix Viewer Style",
    "settings.matrixViewerTable": "Table",
    "settings.matrixViewerTerminal": "Terminal",
    "settings.restore": "Restore defaults",

    // Documentation
    "docs.title": "Documentation",
    "docs.subtitle": "How Pixel-Math turns an image into a matrix, and back again.",
    "docs.matrixOpsBody":
      "Upload an image and choose Transpose, Rotate, or Determinant. The image is first simplified and pixelated into a numeric color matrix, the operation is applied to that matrix, and the result is rendered back into an image. Rotate and Determinant require a square matrix — non-square images are automatically cropped to their largest square region before processing.",
    "docs.filtersBody":
      "Runs just the simplification and pixelation pipeline on an image, without any matrix operation, so you can inspect the intermediate steps and the resulting numeric matrix.",
    "docs.compositionBody":
      "Combines a landscape image [A] and a character image [B] through a weighted element-wise sum of their pixel matrices: C = αA + βB. Both images must share the same dimensions. Adjusting the weights changes how strongly each source contributes to the final composed image.",
    "docs.source": "Source",
    "docs.sourceLink": "View the source code on GitHub",

    // Not found
    "notFound.title": "Page not found",
    "notFound.body": "This address doesn't match any module.",
    "notFound.back": "Go to Home",
  },

  es: {
    // Sidebar / nav
    "nav.matrixOps": "Operaciones Matriciales",
    "nav.imageFilters": "Filtros de Imagen",
    "nav.imageComposition": "Composición de Imagen",
    "nav.settings": "Configuración",
    "nav.documentation": "Documentación",

    // Shared
    "shared.pixelSize": "Tamaño de Píxel",
    "shared.colorLevels": "Niveles de Color",
    "shared.downloadZip": "Descargar paquete ZIP",
    "shared.view": "Ver",
    "shared.hide": "Ocultar",
    "shared.emptyMatrix": "Matriz vacía.",
    "shared.showingMatrix": (rows, cols) => `Mostrando matriz de ${rows}×${cols}`,
    "shared.couldNotLoadMatrix": "No se pudo cargar la matriz.",
    "shared.jobRunning": (id) => `Trabajo ${id} en ejecución...`,
    "shared.jobCompleted": (id) => `Trabajo ${id} completado.`,
    "shared.jobRestored": (id) => `Trabajo anterior ${id} restaurado.`,
    "shared.selectImageFirst": "Selecciona primero un archivo de imagen.",
    "shared.processing": "Procesando…",
    "shared.coldStartHint":
      "El servidor puede estar despertando — esto puede tardar hasta un minuto.",
    "shared.requestTimeout":
      "El servidor tardó demasiado en responder. Puede estar despertando — inténtalo de nuevo en un momento.",
    "shared.loading": "Cargando…",
    "shared.jobLabel": "Trabajo",
    "shared.reset": "Reiniciar",
    "shared.matrixDataHeader": (shape) => `# Datos de la matriz de píxeles [${shape}]`,
    "shared.matrixTruncated": (rows, cols) =>
      `Mostrando las primeras ${rows}×${cols} celdas — descarga el CSV para ver la matriz completa.`,

    // Errores del API (traducidos desde los mensajes del backend)
    "apiError.serverError": (code) => `Error del servidor (${code}). Inténtalo de nuevo en un momento.`,
    "apiError.pixelSizeExceedsImage": (px, side) =>
      `El tamaño de píxel (${px}) no puede superar el lado menor de la imagen (${side}px). Baja el tamaño de píxel.`,
    "apiError.fileTooLarge": (mb) => `La imagen supera el límite de ${mb} MB.`,
    "apiError.weightsZero": "Los pesos α y β no pueden ser ambos cero.",
    "apiError.notAnImage": "El archivo debe ser una imagen.",
    "apiError.dimensionsMismatch": "Ambas imágenes deben tener las mismas dimensiones.",
    "apiError.jobNotFound": "El trabajo ya no existe en el servidor (los resultados se conservan 24 horas).",
    "apiError.jobTimeout": "El trabajo no terminó en el tiempo esperado. Inténtalo de nuevo.",
    "apiError.invalidParams": "Uno de los parámetros está fuera de rango.",
    "apiError.unprocessableImage": "No se pudo procesar la imagen. Prueba con otro archivo.",
    "apiError.operationFailed": (detail) => `La operación falló: ${detail}`,

    // Nombres de artefactos
    "artifact.source": "Imagen fuente",
    "artifact.simplified": "Colores simplificados",
    "artifact.pixel_art": "Pixel art",
    "artifact.numeric_matrix_xlsx": "Matriz numérica (XLSX)",
    "artifact.color_map_xlsx": "Mapa de color (XLSX)",
    "artifact.numeric_matrix_preview": "Vista previa de la matriz",
    "artifact.result_image": "Imagen resultado",
    "artifact.result_numeric_preview": "Vista numérica del resultado",
    "artifact.bundle_zip": "Paquete ZIP",
    "artifact.landscape_source": "Paisaje original",
    "artifact.landscape_pixel": "Paisaje pixelado",
    "artifact.landscape_matrix_xlsx": "Matriz del paisaje (XLSX)",
    "artifact.landscape_numeric_preview": "Vista numérica del paisaje",
    "artifact.character_source": "Personaje original",
    "artifact.character_pixel": "Personaje pixelado",
    "artifact.character_matrix_xlsx": "Matriz del personaje (XLSX)",
    "artifact.character_numeric_preview": "Vista numérica del personaje",
    "artifact.sum_matrix_xlsx": "Matriz suma (XLSX)",
    "artifact.sum_numeric_preview": "Vista numérica de la suma",
    "artifact.sum_final_image": "Composición final",
    "shared.copy": "Copiar",
    "shared.copied": "¡Copiado!",

    // Upload zone
    "upload.dragDrop": "Arrastra y suelta una imagen",
    "upload.hint": "PNG, JPG o WebP (máx 10MB) — o haz clic para elegir",
    "upload.currentInput": "Entrada actual:",
    "upload.invalidType": "El archivo seleccionado no es una imagen.",
    "upload.tooLarge": (mb) => `La imagen supera el límite de ${mb} MB.`,

    // Home
    "home.heroTitle": "Visualizando Álgebra Lineal",
    "home.heroTitleAccent": "A Través de Píxeles",
    "home.heroBody":
      "Un laboratorio interactivo para comprender algoritmos de procesamiento de imágenes. Explora cómo las matrices manipulan datos de píxeles en tiempo real.",
    "home.getStarted": "Inicializar Espacio",
    "home.readDocs": "Leer Documentación",
    "home.systemOnline": "Sistema en Línea",
    "home.systemOffline": "Sistema Fuera de Línea",
    "home.connecting": "Conectando…",
    "home.conceptTitle": "El Concepto Píxel-a-Matriz",
    "home.conceptP1":
      "Toda imagen digital es fundamentalmente una cuadrícula de valores numéricos. En una imagen en escala de grises, cada píxel representa una intensidad de luminancia que va de 0 (negro) a 255 (blanco).",
    "home.conceptP2":
      "Al tratar esta cuadrícula como una matriz matemática, podemos aplicar operaciones de álgebra lineal — como transposición, rotación o el cálculo del determinante — para alterar la imagen fundamentalmente y luego reconstruirla como imagen.",
    "home.tryMatrixOps": "Probar Operaciones Matriciales →",
    "home.exploreTools": "Explora las herramientas",
    "home.matrixOpsDesc": "Transpone, rota o calcula el determinante de la matriz de píxeles de una imagen.",
    "home.filtersDesc": "Simplifica colores y pixela una imagen para ver su matriz numérica.",
    "home.compositionDesc": "Combina dos imágenes con suma matricial ponderada, C = αA + βB.",

    // Matrix Operations
    "matrixOps.title": "Operaciones Matriciales",
    "matrixOps.subtitle":
      "Ejecuta transformaciones algebraicas lineales sobre datos de imagen. Selecciona una operación y sube una imagen fuente para procesarla.",
    "matrixOps.configTitle": "Configuración de Operación",
    "matrixOps.operation": "Operación",
    "matrixOps.transpose": "Transpuesta",
    "matrixOps.rotate": "Rotación",
    "matrixOps.determinant": "Determinante",
    "matrixOps.sourceImage": "Imagen fuente",
    "matrixOps.nonSquareWarn": (size) =>
      `La imagen no es cuadrada — se recortará automáticamente a ${size}×${size} antes de procesarla.`,
    "matrixOps.execute": "Ejecutar Cómputo",
    "matrixOps.emptyTitle": "Sube una imagen para ver los resultados",
    "matrixOps.emptyHint": "Esperando datos de entrada…",
    "matrixOps.scalarLabel": "Resultado Escalar del Determinante",
    "matrixOps.nonSingular": "Matriz no singular confirmada.",
    "matrixOps.singular": "Matriz singular (det = 0).",
    "matrixOps.warnStillSingular":
      "La matriz tenía filas/columnas repetidas; el ajuste no pudo eliminar la dependencia lineal, así que sigue siendo singular (det = 0).",
    "matrixOps.warnAdjusted":
      "La matriz tenía filas/columnas repetidas y fue ajustada para evitar un determinante cero.",
    "matrixOps.warnDetOverflow": (magnitude) =>
      `La magnitud del determinante es de aproximadamente ${magnitude}, más de lo que la doble precisión puede representar — el escalar exacto no puede mostrarse.`,
    "matrixOps.dataPreview": "Vista Previa de la Matriz",

    // Image Filters
    "filters.title": "Pipeline de Pixelación",
    "filters.subtitle":
      "Configura los parámetros de origen para generar aproximaciones numéricas discretas de una imagen mediante cuantización de color y submuestreo.",
    "filters.paramsTitle": "Parámetros",
    "filters.loadImage": "Cargar imagen fuente",
    "filters.execute": "Ejecutar Pipeline",
    "filters.stages": "Etapas del Pipeline",
    "filters.palette": "Paleta",
    "filters.paletteMore": (count) => `+${count} colores más`,
    "filters.dataArray": "Arreglo de Datos de Salida",
    "filters.exportPng": "Exportar PNG",
    "filters.exportJson": "Exportar Arreglo JSON",
    "filters.reset": "Reiniciar Pipeline",
    "filters.allArtifacts": "Todos los Artefactos",
    "filters.emptyTitle": "Ejecuta el pipeline para ver sus etapas",
    "filters.emptyHint": "Esperando datos de entrada…",

    // Image Composition
    "composition.title": "Composición de Imagen",
    "composition.titleSuffix": "_SUMA",
    "composition.subtitle":
      "Combina dos matrices de imagen mediante suma ponderada elemento a elemento. Ajusta los pesos de mezcla para controlar cuánto contribuye cada fuente.",
    "composition.landscape": "Paisaje [A]",
    "composition.character": "Personaje [B]",
    "composition.baseImage": "Imagen base",
    "composition.overlayImage": "Imagen superpuesta",
    "composition.settingsTitle": "Ajustes de Composición",
    "composition.weightAlpha": "Peso α [Paisaje]",
    "composition.weightBeta": "Peso β [Personaje]",
    "composition.computeSum": "Calcular Suma",
    "composition.individualMatrices": "Matrices Individuales",
    "composition.finalComposition": "Composición Final",
    "composition.matrixInspector": "Inspector de Matrices [Recorte Central]",
    "composition.exportArray": "Exportar Arreglo",
    "composition.dimensionMismatch":
      "Las dimensiones no coinciden. Selecciona archivos con el mismo ancho y alto.",
    "composition.selectBoth": "Selecciona ambas imágenes: paisaje y personaje.",
    "composition.sameDimensions": "Las imágenes deben tener exactamente las mismas dimensiones.",
    "composition.emptyTitle": "Sube dos imágenes para ver su composición",
    "composition.emptyHint": "Esperando datos de entrada…",

    // Settings
    "settings.title": "Configuración",
    "settings.subtitle": "Preferencias de Pixel-Math.",
    "settings.language": "Idioma",
    "settings.defaultParams": "Parámetros por Defecto",
    "settings.defaultParamsHint":
      "Las tres herramientas inician nuevas sesiones con estos valores.",
    "settings.matrixViewer": "Estilo del Visor de Matrices",
    "settings.matrixViewerTable": "Tabla",
    "settings.matrixViewerTerminal": "Terminal",
    "settings.restore": "Restaurar valores",

    // Documentation
    "docs.title": "Documentación",
    "docs.subtitle": "Cómo Pixel-Math convierte una imagen en una matriz, y de regreso.",
    "docs.matrixOpsBody":
      "Sube una imagen y elige Transpuesta, Rotación o Determinante. La imagen primero se simplifica y pixela en una matriz numérica de colores, la operación se aplica sobre esa matriz, y el resultado se reconstruye como imagen. Rotación y Determinante requieren una matriz cuadrada — las imágenes no cuadradas se recortan automáticamente a su mayor región cuadrada antes de procesarse.",
    "docs.filtersBody":
      "Ejecuta solo el pipeline de simplificación y pixelación sobre una imagen, sin ninguna operación matricial, para que puedas inspeccionar los pasos intermedios y la matriz numérica resultante.",
    "docs.compositionBody":
      "Combina una imagen de paisaje [A] y una de personaje [B] mediante una suma ponderada elemento a elemento de sus matrices de píxeles: C = αA + βB. Ambas imágenes deben tener las mismas dimensiones. Ajustar los pesos cambia cuánto contribuye cada fuente a la imagen final.",
    "docs.source": "Código Fuente",
    "docs.sourceLink": "Ver el código fuente en GitHub",

    // Página no encontrada
    "notFound.title": "Página no encontrada",
    "notFound.body": "Esta dirección no corresponde a ningún módulo.",
    "notFound.back": "Ir al Inicio",
  },
};

// Traduce los mensajes de error del backend (siempre en inglés) al idioma
// activo. Los mensajes que no coinciden con ningún patrón se muestran tal cual.
export function translateApiError(message, t) {
  if (!message) return message;

  // Los endpoints envuelven la causa: "<Operación> failed: <detalle>"
  const wrapped = message.match(
    /^.+?(?:operation failed|processing failed|composition failed): (.+)$/
  );
  if (wrapped) {
    return t("apiError.operationFailed", translateApiError(wrapped[1], t));
  }

  const serverError = message.match(/^Server error \((\d+)\)$/);
  if (serverError) return t("apiError.serverError", serverError[1]);

  const pixelTooBig = message.match(
    /pixel_size \((\d+)\) cannot exceed the smallest side of the processed image \((\d+)px\)/
  );
  if (pixelTooBig) return t("apiError.pixelSizeExceedsImage", pixelTooBig[1], pixelTooBig[2]);

  const tooLarge = message.match(/File exceeds max size of (\d+) MB/);
  if (tooLarge) return t("apiError.fileTooLarge", tooLarge[1]);

  if (message.includes("cannot both be zero")) return t("apiError.weightsZero");
  if (message.includes("must be an image")) return t("apiError.notAnImage");
  if (message.includes("must have the same dimensions")) return t("apiError.dimensionsMismatch");
  if (message.includes("Job not found")) return t("apiError.jobNotFound");
  if (message.includes("did not finish in time")) return t("apiError.jobTimeout");
  if (message.includes("must be between")) return t("apiError.invalidParams");
  if (message.startsWith("Could not process image file")) return t("apiError.unprocessableImage");
  if (message.startsWith("Invalid image file")) return t("apiError.unprocessableImage");

  return message;
}
