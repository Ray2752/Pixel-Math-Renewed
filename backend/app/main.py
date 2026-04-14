from fastapi import FastAPI, HTTPException

from .config import get_settings
from .schemas import (
    FilterProcessRequest,
    FilterProcessResponse,
    JobStatusResponse,
    OperationRequest,
    OperationResponse,
)
from .services import MatrixDomainService

settings = get_settings()

app = FastAPI(title=settings.app_name, version=settings.app_version)
matrix_service = MatrixDomainService()


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
def process_filters(payload: FilterProcessRequest) -> FilterProcessResponse:
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
