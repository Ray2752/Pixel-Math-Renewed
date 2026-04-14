from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

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

    job_id = body["job_id"]
    status_response = client.get(f"/api/v1/jobs/{job_id}")
    assert status_response.status_code == 200
    assert status_response.json()["status"] == "completed"

    result_response = client.get(f"/api/v1/results/{job_id}")
    assert result_response.status_code == 200
    assert result_response.json()["result"]["operation"] == "sum"


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


def _make_test_image_bytes() -> bytes:
    image = Image.new("RGBA", (4, 4), (255, 0, 0, 255))
    output = BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


def test_filter_process_success() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 2, "color_levels": 64},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "completed"
    assert "pixel_art" in body["artifacts"]
    assert "numeric_matrix_xlsx" in body["artifacts"]
    assert "numeric_matrix_preview" in body["artifacts"]

    job_id = body["job_id"]
    status_response = client.get(f"/api/v1/jobs/{job_id}")
    assert status_response.status_code == 200
    assert status_response.json()["status"] == "completed"

    result_response = client.get(f"/api/v1/results/{job_id}")
    assert result_response.status_code == 200
    assert result_response.json()["result"]["operation"] == "filters"


def test_filter_process_rejects_invalid_pixel_size() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 0, "color_levels": 64},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "pixel_size must be between 1 and 64"


def test_unknown_job_returns_not_found() -> None:
    status_response = client.get("/api/v1/jobs/unknown-job")
    assert status_response.status_code == 404

    result_response = client.get("/api/v1/results/unknown-job")
    assert result_response.status_code == 404
