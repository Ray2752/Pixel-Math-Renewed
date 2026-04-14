from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.staticfiles import StaticFiles

from src.Filtros.ConvertPixelart import pixelar_imagen
from src.Filtros.SimplificarColores import simplificar_colores

from .config import get_settings
from .schemas import (
    FilterProcessResponse,
    JobStatusResponse,
    OperationRequest,
    OperationResponse,
)
from .services import MatrixDomainService

settings = get_settings()

app = FastAPI(title=settings.app_name, version=settings.app_version)
matrix_service = MatrixDomainService()

ARTIFACTS_ROOT = Path(__file__).resolve().parent.parent / "storage"
ARTIFACTS_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/artifacts", StaticFiles(directory=ARTIFACTS_ROOT), name="artifacts")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "environment": settings.app_env,
        "version": settings.app_version,
    }


@app.post(f"{settings.api_prefix}/operations/sum", response_model=OperationResponse)
def sum_operation(payload: OperationRequest) -> OperationResponse:
    if payload.matrix_b is None:
        raise HTTPException(status_code=400, detail="matrix_b is required for sum")

    try:
        result_matrix = matrix_service.sum_matrices(payload.matrix_a, payload.matrix_b)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return OperationResponse(
        job_id=matrix_service.generate_job_id("sum"),
        operation="sum",
        result_matrix=result_matrix,
    )


@app.post(
    f"{settings.api_prefix}/operations/determinant", response_model=OperationResponse
)
def determinant_operation(payload: OperationRequest) -> OperationResponse:
    try:
        result_matrix, scalar_result, warnings = matrix_service.determinant(
            payload.matrix_a
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return OperationResponse(
        job_id=matrix_service.generate_job_id("det"),
        operation="determinant",
        result_matrix=result_matrix,
        scalar_result=scalar_result,
        warnings=warnings,
    )


@app.post(f"{settings.api_prefix}/operations/rotate", response_model=OperationResponse)
def rotate_operation(payload: OperationRequest) -> OperationResponse:
    try:
        result_matrix = matrix_service.rotate_matrix(payload.matrix_a)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return OperationResponse(
        job_id=matrix_service.generate_job_id("rotate"),
        operation="rotate",
        result_matrix=result_matrix,
    )


@app.post(
    f"{settings.api_prefix}/operations/transpose", response_model=OperationResponse
)
def transpose_operation(payload: OperationRequest) -> OperationResponse:
    try:
        result_matrix = matrix_service.transpose_matrix(payload.matrix_a)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return OperationResponse(
        job_id=matrix_service.generate_job_id("transpose"),
        operation="transpose",
        result_matrix=result_matrix,
    )


@app.post(f"{settings.api_prefix}/filters/process", response_model=FilterProcessResponse)
async def process_filters(
    image: Annotated[UploadFile, File(...)],
    pixel_size: Annotated[int, Form(...)] = 10,
    color_levels: Annotated[int, Form(...)] = 64,
) -> FilterProcessResponse:
    if pixel_size < 1 or pixel_size > 64:
        raise HTTPException(status_code=400, detail="pixel_size must be between 1 and 64")

    if color_levels < 2 or color_levels > 256:
        raise HTTPException(
            status_code=400, detail="color_levels must be between 2 and 256"
        )

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    job_id = matrix_service.generate_job_id("filter")
    job_dir = ARTIFACTS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    extension = Path(image.filename or "input.png").suffix or ".png"
    source_path = job_dir / f"source{extension}"

    content = await image.read()
    source_path.write_bytes(content)

    try:
        simplified_path = simplificar_colores(
            str(source_path), str(job_dir), job_id, niveles_por_canal=color_levels
        )
        pixel_path = pixelar_imagen(
            simplified_path, str(job_dir), pixel_size, name=job_id
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {exc}") from exc

    return FilterProcessResponse(
        job_id=job_id,
        status="completed",
        artifacts={
            "source": f"/artifacts/{job_id}/{source_path.name}",
            "simplified": f"/artifacts/{job_id}/{Path(simplified_path).name}",
            "pixel_art": f"/artifacts/{job_id}/{Path(pixel_path).name}",
        },
    )
    return FilterProcessResponse(
        job_id="stub-filter-job",
        status="queued",
        artifacts={
            "pixel_art": "/tmp/pixel_art_stub.png",
            "numeric_matrix": "/tmp/matrix_stub.xlsx",
        },
    )


@app.get(f"{settings.api_prefix}/jobs/{{job_id}}", response_model=JobStatusResponse)
def get_job_status(job_id: str) -> JobStatusResponse:
    return JobStatusResponse(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Stub job status endpoint.",
    )


@app.get(f"{settings.api_prefix}/results/{{job_id}}")
def get_result(job_id: str) -> dict[str, str]:
    return {
        "job_id": job_id,
        "result": "Stub result endpoint. Artifact retrieval pending.",
    }
