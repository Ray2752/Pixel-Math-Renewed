import math
import uuid
from collections import Counter

import numpy as np


class MatrixDomainService:
    @staticmethod
    def generate_job_id(prefix: str) -> str:
        return f"{prefix}-{uuid.uuid4().hex[:8]}"

    @staticmethod
    def _to_matrix(values: list[list[float]]) -> np.ndarray:
        if not values:
            raise ValueError("matrix_a cannot be empty")

        row_length = len(values[0])
        if row_length == 0:
            raise ValueError("matrix rows cannot be empty")

        if any(len(row) != row_length for row in values):
            raise ValueError("matrix rows must have the same length")

        try:
            matrix = np.array(values, dtype=float)
        except ValueError as exc:
            raise ValueError("matrix contains non-numeric values") from exc

        return matrix

    def sum_matrices(
        self, matrix_a_values: list[list[float]], matrix_b_values: list[list[float]]
    ) -> list[list[float]]:
        matrix_a = self._to_matrix(matrix_a_values)
        matrix_b = self._to_matrix(matrix_b_values)

        if matrix_a.shape != matrix_b.shape:
            raise ValueError("matrix_a and matrix_b must have identical dimensions")

        return (matrix_a + matrix_b).tolist()

    def transpose_matrix(self, matrix_values: list[list[float]]) -> list[list[float]]:
        matrix = self._to_matrix(matrix_values)
        return matrix.T.tolist()

    def rotate_matrix(self, matrix_values: list[list[float]]) -> list[list[float]]:
        matrix = self._to_matrix(matrix_values)
        rows, cols = matrix.shape

        if rows != cols:
            raise ValueError("rotate operation requires a square matrix")

        anti_identity = np.zeros((rows, rows))
        for i in range(rows):
            anti_identity[i, rows - i - 1] = 1

        # Rotación de 90° horaria: transponer y luego invertir el orden de las
        # columnas multiplicando por la anti-identidad (A^T · J). Multiplicar solo
        # por J sería un espejo horizontal, no una rotación.
        return np.dot(matrix.T, anti_identity).tolist()

    @staticmethod
    def _find_duplicate_rows_and_cols(matrix: np.ndarray) -> tuple[list[int], list[int]]:
        rows_as_tuple = [tuple(row) for row in matrix]
        cols_as_tuple = [tuple(col) for col in matrix.T]

        row_counts = Counter(rows_as_tuple)
        col_counts = Counter(cols_as_tuple)

        duplicate_rows = [
            idx for idx, row in enumerate(rows_as_tuple) if row_counts[row] > 1
        ]
        duplicate_cols = [
            idx for idx, col in enumerate(cols_as_tuple) if col_counts[col] > 1
        ]

        return duplicate_rows, duplicate_cols

    @staticmethod
    def _adjust_duplicates(
        matrix: np.ndarray, duplicate_rows: list[int], duplicate_cols: list[int]
    ) -> np.ndarray:
        adjusted = matrix.copy()

        for i, row_idx in enumerate(duplicate_rows):
            adjusted[row_idx, :] += i + 1

        for j, col_idx in enumerate(duplicate_cols):
            adjusted[:, col_idx] += j + 1

        return adjusted

    def determinant(
        self, matrix_values: list[list[float]]
    ) -> tuple[list[list[float]], float | None, list[str]]:
        matrix = self._to_matrix(matrix_values)
        rows, cols = matrix.shape

        if rows != cols:
            raise ValueError("determinant operation requires a square matrix")

        warnings: list[str] = []
        duplicate_rows, duplicate_cols = self._find_duplicate_rows_and_cols(matrix)

        if duplicate_rows or duplicate_cols:
            matrix = self._adjust_duplicates(matrix, duplicate_rows, duplicate_cols)

        determinant_value = float(np.linalg.det(matrix))

        if duplicate_rows or duplicate_cols:
            # Adding a constant per duplicated row keeps 3+ identical rows inside a
            # rank-2 subspace, so the adjustment cannot always remove the singularity.
            if np.linalg.matrix_rank(matrix) < rows:
                determinant_value = 0.0
                warnings.append(
                    "Matrix had repeated rows/columns; the adjustment could not remove "
                    "the linear dependence, so the matrix is still singular (det = 0)."
                )
            else:
                warnings.append(
                    "Matrix had repeated rows/columns and was adjusted to avoid a zero "
                    "determinant."
                )

        if not math.isfinite(determinant_value):
            # float64 tops out near 1.8e308; large matrices of color codes exceed it.
            _, logabsdet = np.linalg.slogdet(matrix)
            if logabsdet == -math.inf:
                determinant_value = 0.0
            else:
                magnitude = logabsdet / math.log(10)
                warnings.append(
                    "Determinant overflows double precision "
                    f"(|det| is about 10^{magnitude:.0f}); the scalar result was omitted."
                )
                determinant_value = None

        return matrix.tolist(), determinant_value, warnings
