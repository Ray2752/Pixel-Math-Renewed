export default function Documentation() {
  return (
    <div>
      <div className="page-header">
        <h1>Documentation</h1>
        <p>How Pixel-Math turns an image into a matrix, and back again.</p>
      </div>

      <section className="panel">
        <h2>Matrix Operations</h2>
        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>
          Upload an image and choose Transpose, Rotate, or Determinant. The image is first
          simplified and pixelated into a numeric color matrix, the operation is applied to that
          matrix, and the result is rendered back into an image. Rotate and Determinant require a
          square matrix — non-square images are automatically cropped to their largest square
          region before processing.
        </p>
      </section>

      <section className="panel">
        <h2>Image Filters</h2>
        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>
          Runs just the simplification and pixelation pipeline on an image, without any matrix
          operation, so you can inspect the intermediate steps and the resulting numeric matrix.
        </p>
      </section>

      <section className="panel">
        <h2>Image Composition</h2>
        <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>
          Combines a landscape image [A] and a character image [B] through a weighted
          element-wise sum of their pixel matrices: C = αA + βB. Both images must share the same
          dimensions. Adjusting the weights changes how strongly each source contributes to the
          final composed image.
        </p>
      </section>

      <section className="panel">
        <h2>Source</h2>
        <p style={{ marginTop: "0.75rem" }}>
          <a
            href="https://github.com/Ray2752/Pixel-Math-Renewed"
            target="_blank"
            rel="noreferrer"
          >
            View the source code on GitHub
          </a>
        </p>
      </section>
    </div>
  );
}
