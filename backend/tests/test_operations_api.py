from io import BytesIO

import numpy as np
from fastapi.testclient import TestClient
from PIL import Image

from backend.app.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"


def test_system_info_endpoint_matches_health() -> None:
    response = client.get("/api/v1/system")
    assert response.status_code == 200
    assert response.json() == client.get("/health").json()


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
    # Rotación 90° horaria (equivalente a np.rot90(matrix, k=-1))
    assert response.json()["result_matrix"] == [[3.0, 1.0], [4.0, 2.0]]


def test_determinant_operation_success_with_duplicate_adjustment() -> None:
    payload = {"operation": "determinant", "matrix_a": [[1, 1], [1, 1]]}
    response = client.post("/api/v1/operations/determinant", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["operation"] == "determinant"
    assert isinstance(body["scalar_result"], float)
    assert len(body["warnings"]) == 1


def test_determinant_reports_singularity_when_adjustment_cannot_fix_it() -> None:
    payload = {
        "operation": "determinant",
        "matrix_a": [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    }
    response = client.post("/api/v1/operations/determinant", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["scalar_result"] == 0.0
    assert len(body["warnings"]) == 1
    assert "still singular" in body["warnings"][0]


def test_determinant_overflow_returns_null_scalar_with_warning() -> None:
    rng = np.random.default_rng(42)
    big = rng.integers(1, 256, size=(200, 200)).astype(float)
    payload = {"operation": "determinant", "matrix_a": big.tolist()}
    response = client.post("/api/v1/operations/determinant", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["scalar_result"] is None
    assert any("overflows double precision" in warning for warning in body["warnings"])


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
    assert "bundle_zip" in body["artifacts"]

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


def test_filter_bundle_download_endpoint() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 2, "color_levels": 64},
    )
    assert response.status_code == 200
    job_id = response.json()["job_id"]

    download_response = client.get(f"/api/v1/results/{job_id}/download")
    assert download_response.status_code == 200
    assert download_response.headers["content-type"].startswith("application/zip")


def test_sum_images_composition_success() -> None:
    image_a = _make_test_image_bytes()
    image_b = _make_test_image_bytes()

    response = client.post(
        "/api/v1/compositions/sum-images",
        files={
            "landscape_image": ("landscape.png", image_a, "image/png"),
            "character_image": ("character.png", image_b, "image/png"),
        },
        data={"pixel_size": 2, "color_levels": 64},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "completed"
    assert "sum_final_image" in body["artifacts"]
    assert "sum_matrix_xlsx" in body["artifacts"]

    job_id = body["job_id"]
    result_response = client.get(f"/api/v1/results/{job_id}")
    assert result_response.status_code == 200
    result_body = result_response.json()["result"]
    assert result_body["operation"] == "sum_images"
    # Defaults from the endpoint signature when alpha/beta aren't supplied.
    assert result_body["alpha"] == 0.7
    assert result_body["beta"] == 0.3


def test_sum_images_composition_weights_change_result() -> None:
    output_a = BytesIO()
    Image.new("RGBA", (4, 4), (200, 0, 0, 255)).save(output_a, format="PNG")
    output_b = BytesIO()
    Image.new("RGBA", (4, 4), (0, 0, 200, 255)).save(output_b, format="PNG")

    def _sum_xlsx_bytes(alpha: float, beta: float) -> bytes:
        response = client.post(
            "/api/v1/compositions/sum-images",
            files={
                "landscape_image": ("landscape.png", output_a.getvalue(), "image/png"),
                "character_image": ("character.png", output_b.getvalue(), "image/png"),
            },
            data={"pixel_size": 2, "color_levels": 64, "alpha": alpha, "beta": beta},
        )
        assert response.status_code == 200
        job_id = response.json()["job_id"]
        xlsx_response = client.get(f"/api/v1/results/{job_id}/csv/sum_matrix_xlsx")
        assert xlsx_response.status_code == 200
        return xlsx_response.content

    # Both source images are a single solid color each, so every non-transparent
    # cell has the same raw id (1) on both sides. Weight pairs whose alpha+beta
    # totals differ still round to different summed values even in that case.
    csv_a = _sum_xlsx_bytes(alpha=0.7, beta=0.3)
    csv_b = _sum_xlsx_bytes(alpha=0.9, beta=0.9)

    assert csv_a != csv_b


def test_sum_images_composition_rejects_out_of_range_alpha() -> None:
    image_a = _make_test_image_bytes()
    image_b = _make_test_image_bytes()

    response = client.post(
        "/api/v1/compositions/sum-images",
        files={
            "landscape_image": ("landscape.png", image_a, "image/png"),
            "character_image": ("character.png", image_b, "image/png"),
        },
        data={"pixel_size": 2, "color_levels": 64, "alpha": 1.5},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "alpha must be between 0.0 and 1.0"


def test_sum_images_composition_rejects_dimension_mismatch() -> None:
    image_small = _make_test_image_bytes()

    output = BytesIO()
    Image.new("RGBA", (6, 4), (0, 255, 0, 255)).save(output, format="PNG")
    image_large = output.getvalue()

    response = client.post(
        "/api/v1/compositions/sum-images",
        files={
            "landscape_image": ("landscape.png", image_small, "image/png"),
            "character_image": ("character.png", image_large, "image/png"),
        },
        data={"pixel_size": 2, "color_levels": 64},
    )

    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Landscape and character images must have the same dimensions"
    )


def test_unknown_job_returns_not_found() -> None:
    status_response = client.get("/api/v1/jobs/unknown-job")
    assert status_response.status_code == 404

    result_response = client.get("/api/v1/results/unknown-job")
    assert result_response.status_code == 404


def test_matrix_csv_export_success() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 2, "color_levels": 64},
    )
    job_id = response.json()["job_id"]

    csv_response = client.get(f"/api/v1/results/{job_id}/csv/numeric_matrix_xlsx")
    assert csv_response.status_code == 200
    assert csv_response.headers["content-type"].startswith("text/csv")
    assert len(csv_response.text.strip()) > 0


def test_matrix_csv_export_unknown_artifact_returns_404() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 2, "color_levels": 64},
    )
    job_id = response.json()["job_id"]

    csv_response = client.get(f"/api/v1/results/{job_id}/csv/does_not_exist")
    assert csv_response.status_code == 404


def test_palette_endpoint_success() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 2, "color_levels": 64},
    )
    job_id = response.json()["job_id"]

    palette_response = client.get(f"/api/v1/results/{job_id}/palette/color_map_xlsx")
    assert palette_response.status_code == 200
    body = palette_response.json()
    assert "swatches" in body
    assert len(body["swatches"]) >= 1
    assert len(body["swatches"][0]["rgba"]) == 4


def test_image_operation_rejects_pixel_size_larger_than_image() -> None:
    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/operations/image/determinant",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 8, "color_levels": 64},
    )
    assert response.status_code == 400
    assert "cannot exceed the smallest side" in response.json()["detail"]


def test_job_results_survive_process_restart() -> None:
    from backend.app.main import JOB_STORE

    image_bytes = _make_test_image_bytes()
    response = client.post(
        "/api/v1/filters/process",
        files={"image": ("sample.png", image_bytes, "image/png")},
        data={"pixel_size": 2, "color_levels": 64},
    )
    assert response.status_code == 200
    job_id = response.json()["job_id"]

    JOB_STORE.clear()  # simula un reinicio del proceso

    recovered = client.get(f"/api/v1/results/{job_id}")
    assert recovered.status_code == 200
    assert recovered.json()["job_id"] == job_id
    assert recovered.json()["artifacts"]
