import uuid

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

        return np.dot(matrix, anti_identity).tolist()

    @staticmethod
    def _find_duplicate_rows_and_cols(matrix: np.ndarray) -> tuple[list[int], list[int]]:
        rows_as_tuple = [tuple(row) for row in matrix]
        cols_as_tuple = [tuple(col) for col in matrix.T]

        duplicate_rows = [
            idx for idx, row in enumerate(rows_as_tuple) if rows_as_tuple.count(row) > 1
        ]
        duplicate_cols = [
            idx for idx, col in enumerate(cols_as_tuple) if cols_as_tuple.count(col) > 1
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
    ) -> tuple[list[list[float]], float, list[str]]:
        matrix = self._to_matrix(matrix_values)
        rows, cols = matrix.shape

        if rows != cols:
            raise ValueError("determinant operation requires a square matrix")

        warnings: list[str] = []
        duplicate_rows, duplicate_cols = self._find_duplicate_rows_and_cols(matrix)

        if duplicate_rows or duplicate_cols:
            matrix = self._adjust_duplicates(matrix, duplicate_rows, duplicate_cols)
            warnings.append(
                "Matrix had repeated rows/columns and was adjusted to avoid zero determinant."
            )

        determinant_value = float(np.linalg.det(matrix))
        return matrix.tolist(), determinant_value, warnings
