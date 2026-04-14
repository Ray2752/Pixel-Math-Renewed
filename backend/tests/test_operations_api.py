from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"


def test_sum_operation_success() -> None:
    payload = {
        "operation": "sum",
        "matrix_a": [[1, 2], [3, 4]],
        "matrix_b": [[10, 20], [30, 40]],
    }
    response = client.post("/api/v1/operations/sum", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["operation"] == "sum"
    assert body["result_matrix"] == [[11.0, 22.0], [33.0, 44.0]]


def test_sum_operation_requires_matrix_b() -> None:
    payload = {"operation": "sum", "matrix_a": [[1, 2], [3, 4]]}
    response = client.post("/api/v1/operations/sum", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "matrix_b is required for sum"


def test_transpose_operation_success() -> None:
    payload = {"operation": "transpose", "matrix_a": [[1, 2, 3], [4, 5, 6]]}
    response = client.post("/api/v1/operations/transpose", json=payload)
    assert response.status_code == 200
    assert response.json()["result_matrix"] == [[1.0, 4.0], [2.0, 5.0], [3.0, 6.0]]


def test_rotate_operation_requires_square_matrix() -> None:
    payload = {"operation": "rotate", "matrix_a": [[1, 2, 3], [4, 5, 6]]}
    response = client.post("/api/v1/operations/rotate", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "rotate operation requires a square matrix"


def test_rotate_operation_success() -> None:
    payload = {"operation": "rotate", "matrix_a": [[1, 2], [3, 4]]}
    response = client.post("/api/v1/operations/rotate", json=payload)
    assert response.status_code == 200
    assert response.json()["result_matrix"] == [[2.0, 1.0], [4.0, 3.0]]


def test_determinant_operation_success_with_duplicate_adjustment() -> None:
    payload = {"operation": "determinant", "matrix_a": [[1, 1], [1, 1]]}
    response = client.post("/api/v1/operations/determinant", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["operation"] == "determinant"
    assert isinstance(body["scalar_result"], float)
    assert len(body["warnings"]) == 1


def test_determinant_requires_square_matrix() -> None:
    payload = {"operation": "determinant", "matrix_a": [[1, 2, 3], [4, 5, 6]]}
    response = client.post("/api/v1/operations/determinant", json=payload)
    assert response.status_code == 400
    assert (
        response.json()["detail"] == "determinant operation requires a square matrix"
    )
