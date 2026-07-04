export default function MatrixTable({ rows, shape }) {
  if (!rows || rows.length === 0) return <p className="meta-text">Empty matrix.</p>;
  return (
    <div>
      {shape && (
        <p className="meta-text">
          Showing {shape[0]}×{shape[1]} matrix
        </p>
      )}
      <div className="matrix-table-wrap">
        <table className="matrix-table">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
