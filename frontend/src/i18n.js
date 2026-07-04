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
    "shared.selectImageFirst": "Select an image file first.",
    "shared.processing": "Processing…",
    "shared.coldStartHint":
      "The server may be waking up from sleep — this can take up to a minute.",
    "shared.loading": "Loading…",

    // Upload zone
    "upload.dragDrop": "Drag & drop an image",
    "upload.hint": "PNG, JPG or WebP — or click to browse",
    "upload.currentInput": "Current input:",

    // Home
    "home.heroTitle": "Visualizing Linear Algebra",
    "home.heroTitleAccent": "Through Pixels",
    "home.heroBody":
      "An interactive laboratory for understanding image processing algorithms. Explore how matrices manipulate pixel data in real-time.",
    "home.getStarted": "Get Started",
    "home.readDocs": "Read Documentation",
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

    // Image Filters
    "filters.title": "Pixelation Pipeline",
    "filters.subtitle":
      "Configure source parameters to generate discrete numeric approximations of an image through color quantization and downsampling.",
    "filters.paramsTitle": "Parameters",
    "filters.loadImage": "Load source image",
    "filters.execute": "Execute Pipeline",
    "filters.stages": "Pipeline Stages",
    "filters.palette": "Palette",
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
    "composition.dimensionMismatch":
      "Dimension mismatch detected. Select files with the same width and height.",
    "composition.selectBoth": "Select both landscape and character images.",
    "composition.sameDimensions": "Images must have exactly the same dimensions.",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Preferences and system status for Pixel-Math.",
    "settings.language": "Language",
    "settings.defaultParams": "Default Parameters",
    "settings.defaultParamsHint":
      "New sessions of the three tools start with these values.",
    "settings.matrixViewer": "Matrix Viewer Style",
    "settings.matrixViewerTable": "Table",
    "settings.matrixViewerTerminal": "Terminal",
    "settings.restore": "Restore defaults",
    "settings.apiStatus": "API Status",
    "settings.apiStatusLabel": "Status",
    "settings.apiEnvironment": "Environment",
    "settings.apiVersion": "Version",
    "settings.backendUnavailableDev": "Backend unavailable. Start the FastAPI server on port 8000.",
    "settings.backendUnavailableProd":
      "Backend unavailable. The server may be waking up — try again in a moment.",
    "settings.checking": "Checking API status…",

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
    "shared.selectImageFirst": "Selecciona primero un archivo de imagen.",
    "shared.processing": "Procesando…",
    "shared.coldStartHint":
      "El servidor puede estar despertando — esto puede tardar hasta un minuto.",
    "shared.loading": "Cargando…",

    // Upload zone
    "upload.dragDrop": "Arrastra y suelta una imagen",
    "upload.hint": "PNG, JPG o WebP — o haz clic para elegir",
    "upload.currentInput": "Entrada actual:",

    // Home
    "home.heroTitle": "Visualizando Álgebra Lineal",
    "home.heroTitleAccent": "A Través de Píxeles",
    "home.heroBody":
      "Un laboratorio interactivo para comprender algoritmos de procesamiento de imágenes. Explora cómo las matrices manipulan datos de píxeles en tiempo real.",
    "home.getStarted": "Comenzar",
    "home.readDocs": "Leer Documentación",
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

    // Image Filters
    "filters.title": "Pipeline de Pixelación",
    "filters.subtitle":
      "Configura los parámetros de origen para generar aproximaciones numéricas discretas de una imagen mediante cuantización de color y submuestreo.",
    "filters.paramsTitle": "Parámetros",
    "filters.loadImage": "Cargar imagen fuente",
    "filters.execute": "Ejecutar Pipeline",
    "filters.stages": "Etapas del Pipeline",
    "filters.palette": "Paleta",
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
    "composition.dimensionMismatch":
      "Las dimensiones no coinciden. Selecciona archivos con el mismo ancho y alto.",
    "composition.selectBoth": "Selecciona ambas imágenes: paisaje y personaje.",
    "composition.sameDimensions": "Las imágenes deben tener exactamente las mismas dimensiones.",

    // Settings
    "settings.title": "Configuración",
    "settings.subtitle": "Preferencias y estado del sistema de Pixel-Math.",
    "settings.language": "Idioma",
    "settings.defaultParams": "Parámetros por Defecto",
    "settings.defaultParamsHint":
      "Las tres herramientas inician nuevas sesiones con estos valores.",
    "settings.matrixViewer": "Estilo del Visor de Matrices",
    "settings.matrixViewerTable": "Tabla",
    "settings.matrixViewerTerminal": "Terminal",
    "settings.restore": "Restaurar valores",
    "settings.apiStatus": "Estado del API",
    "settings.apiStatusLabel": "Estado",
    "settings.apiEnvironment": "Entorno",
    "settings.apiVersion": "Versión",
    "settings.backendUnavailableDev":
      "Backend no disponible. Inicia el servidor FastAPI en el puerto 8000.",
    "settings.backendUnavailableProd":
      "Backend no disponible. El servidor puede estar iniciando — intenta de nuevo en un momento.",
    "settings.checking": "Consultando estado del API…",

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
  },
};
