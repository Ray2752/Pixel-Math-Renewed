export default function MatrixTerminalView({ rows, shape }) {
  if (!rows || rows.length === 0) return <p className="meta-text">Empty matrix.</p>;

  const text = `# Pixel matrix data [${shape ? `${shape[0]}x${shape[1]}` : ""}]\n[\n${rows
    .map((row) => `  [${row.join(", ")}]`)
    .join(",\n")}\n]`;

  return (
    <div className="matrix-terminal">
      <pre>{text}</pre>
    </div>
  );
}
