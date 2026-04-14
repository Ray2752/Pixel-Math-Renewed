from typing import Any

from pydantic import BaseModel, Field


OperationType = str


class ApiError(BaseModel):
    code: str = Field(description="Stable application error code")
    message: str = Field(description="Human-readable error message")
    details: dict[str, Any] | None = None


class OperationRequest(BaseModel):
    operation: OperationType = Field(
        description="Operation to run: sum, determinant, rotate, transpose"
    )
    matrix_a: list[list[float]] = Field(
        description="Primary matrix values in row-major order"
    )
    matrix_b: list[list[float]] | None = Field(
        default=None,
        description="Secondary matrix for operations that require two matrices",
    )


class OperationResponse(BaseModel):
    job_id: str
    operation: OperationType
    result_matrix: list[list[float]] | None = None
    scalar_result: float | None = None
    warnings: list[str] = Field(default_factory=list)


class FilterProcessRequest(BaseModel):
    pixel_size: int = Field(default=10, ge=1, le=64)
    color_levels: int = Field(default=64, ge=2, le=256)


class FilterProcessResponse(BaseModel):
    job_id: str
    status: str
    artifacts: dict[str, str] = Field(
        default_factory=dict,
        description="Artifact keys and temporary URLs/paths",
    )


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int = Field(ge=0, le=100)
    message: str
