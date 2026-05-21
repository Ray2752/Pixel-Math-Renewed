from io import BytesIO
from pathlib import Path
from typing import Annotated, Any
import zipfile

import numpy as np
import pandas as pd

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image

from src.Filtros.ConvertPixelart import pixelar_imagen
from src.Filtros.SimplificarColores import simplificar_colores
from src.Operaciones_Mat.SumarMatrices import cargar_y_sumar_matrices
from src.utils.CrearImgsFinales import CrearImagenesFinales
from src.utils.ObtenerMatricesNum import GenerarMatrices

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
JOB_STORE: dict[str, dict[str, Any]] = {}

ARTIFACTS_ROOT = Path(__file__).resolve().parent.parent / "storage"
ARTIFACTS_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/artifacts", StaticFiles(directory=ARTIFACTS_ROOT), name="artifacts")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def store_job(
    job_id: str,
    status: str,
    progress: int,
    message: str,
    artifacts: dict[str, str] | None = None,
    result: dict[str, Any] | None = None,
    job_dir: Path | None = None,
) -> None:
    JOB_STORE[job_id] = {
        "job_id": job_id,
        "status": status,
        "progress": progress,
        "message": message,
        "artifacts": artifacts or {},
        "result": result or {},
        "job_dir": str(job_dir) if job_dir else None,
    }


def as_artifact_url(job_id: str, file_path: Path) -> str:
    return f"/artifacts/{job_id}/{file_path.name}"


def validate_uploaded_image(content: bytes, filename: str) -> tuple[int, int]:
    try:
        with Image.open(BytesIO(content)) as image_obj:
            return image_obj.size
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image file: {filename}",
        ) from exc


def save_upload(content: bytes, destination: Path) -> None:
    destination.write_bytes(content)


def make_square(source: Path, dest: Path) -> None:
    with Image.open(source) as img:
        side = min(img.size)
        img.crop((0, 0, side, side)).save(dest)


def run_filter_pipeline(
    *,
    source_path: Path,
    job_dir: Path,
    token: str,
    pixel_size: int,
    color_levels: int,
    numero_inicial: int,
    numeromaxpaisa: int,
) -> dict[str, Any]:
    simplified_path = Path(
        simplificar_colores(
            str(source_path),
            str(job_dir),
            token,
            niveles_por_canal=color_levels,
        )
    )
    pixel_path = Path(
        pixelar_imagen(
            str(simplified_path),
            str(job_dir),
            pixel_size,
            name=token,
        )
    )

    matrix_xlsx = job_dir / f"{token}_numeric_matrix.xlsx"
    color_map_xlsx = job_dir / f"{token}_color_map.xlsx"
    numeric_preview = job_dir / f"{token}_numeric_matrix_preview.png"

    numero_max, numero_a_color = GenerarMatrices(
        ruta_imagen_entrada=str(pixel_path),
        ruta_salida_excel=str(matrix_xlsx),
        ruta_salida_mapeo=str(color_map_xlsx),
        ruta_salida_imagen_numerica=str(numeric_preview),
        numero_inicial=numero_inicial,
        tamañopixel=pixel_size,
        numeromaxpaisa=numeromaxpaisa,
    )

    return {
        "simplified_path": simplified_path,
        "pixel_path": pixel_path,
        "matrix_xlsx": matrix_xlsx,
        "color_map_xlsx": color_map_xlsx,
        "numeric_preview": numeric_preview,
        "numero_max": numero_max,
        "numero_a_color": numero_a_color,
    }


def build_zip_bundle(job_id: str, job_dir: Path) -> Path:
    zip_path = job_dir / f"{job_id}_artifacts.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for file_path in sorted(job_dir.iterdir()):
            if file_path.is_file() and file_path != zip_path:
                zip_file.write(file_path, arcname=file_path.name)

    return zip_path


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

    job_id = matrix_service.generate_job_id("sum")
    store_job(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Sum operation completed.",
        result={"operation": "sum", "result_matrix": result_matrix},
    )

    return OperationResponse(
        job_id=job_id,
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

    job_id = matrix_service.generate_job_id("det")
    store_job(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Determinant operation completed.",
        result={
            "operation": "determinant",
            "result_matrix": result_matrix,
            "scalar_result": scalar_result,
            "warnings": warnings,
        },
    )

    return OperationResponse(
        job_id=job_id,
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

    job_id = matrix_service.generate_job_id("rotate")
    store_job(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Rotate operation completed.",
        result={"operation": "rotate", "result_matrix": result_matrix},
    )

    return OperationResponse(
        job_id=job_id,
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

    job_id = matrix_service.generate_job_id("transpose")
    store_job(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Transpose operation completed.",
        result={"operation": "transpose", "result_matrix": result_matrix},
    )

    return OperationResponse(
        job_id=job_id,
        operation="transpose",
        result_matrix=result_matrix,
    )


def _image_operation_common(
    *,
    job_dir: Path,
    job_id: str,
    source_path: Path,
    pixel_size: int,
    color_levels: int,
    needs_square: bool,
) -> dict[str, Any]:
    """Run filter pipeline on source_path (auto-squaring if needed) and return raw outputs."""
    pipeline_source = source_path
    if needs_square:
        with Image.open(source_path) as _img:
            is_square = _img.size[0] == _img.size[1]
        if not is_square:
            square_path = job_dir / f"source_square{source_path.suffix}"
            make_square(source_path, square_path)
            pipeline_source = square_path

    return run_filter_pipeline(
        source_path=pipeline_source,
        job_dir=job_dir,
        token=job_id,
        pixel_size=pixel_size,
        color_levels=color_levels,
        numero_inicial=1,
        numeromaxpaisa=0,
    )


def _build_image_op_artifacts(
    job_id: str,
    source_path: Path,
    filter_outputs: dict[str, Any],
    result_image: Path,
    result_numeric_preview: Path,
    bundle_path: Path,
) -> dict[str, str]:
    return {
        "source": as_artifact_url(job_id, source_path),
        "simplified": as_artifact_url(job_id, filter_outputs["simplified_path"]),
        "pixel_art": as_artifact_url(job_id, filter_outputs["pixel_path"]),
        "numeric_matrix_xlsx": as_artifact_url(job_id, filter_outputs["matrix_xlsx"]),
        "color_map_xlsx": as_artifact_url(job_id, filter_outputs["color_map_xlsx"]),
        "numeric_matrix_preview": as_artifact_url(job_id, filter_outputs["numeric_preview"]),
        "result_image": as_artifact_url(job_id, result_image),
        "result_numeric_preview": as_artifact_url(job_id, result_numeric_preview),
        "bundle_zip": as_artifact_url(job_id, bundle_path),
    }


@app.post(
    f"{settings.api_prefix}/operations/image/transpose",
    response_model=FilterProcessResponse,
)
async def transpose_image_operation(
    image: Annotated[UploadFile, File(...)],
    pixel_size: Annotated[int, Form(...)] = 10,
    color_levels: Annotated[int, Form(...)] = 64,
) -> FilterProcessResponse:
    if pixel_size < 1 or pixel_size > 64:
        raise HTTPException(status_code=400, detail="pixel_size must be between 1 and 64")
    if color_levels < 2 or color_levels > 256:
        raise HTTPException(status_code=400, detail="color_levels must be between 2 and 256")
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    job_id = matrix_service.generate_job_id("transimg")
    job_dir = ARTIFACTS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    content = await image.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds max size of {settings.max_upload_mb} MB")
    extension = Path(image.filename or "input.png").suffix or ".png"
    source_path = job_dir / f"source{extension}"
    validate_uploaded_image(content, image.filename or "image")
    save_upload(content, source_path)

    try:
        filter_outputs = _image_operation_common(
            job_dir=job_dir, job_id=job_id, source_path=source_path,
            pixel_size=pixel_size, color_levels=color_levels, needs_square=False,
        )
        matrix_data = pd.read_excel(str(filter_outputs["matrix_xlsx"]), header=None).values.tolist()
        result_matrix = matrix_service.transpose_matrix(matrix_data)

        result_image = job_dir / f"{job_id}_result_image.png"
        result_numeric_preview = job_dir / f"{job_id}_result_numeric_preview.png"
        CrearImagenesFinales(
            MatrizProcesada=np.array(result_matrix),
            RutaImgNumFinal=str(result_numeric_preview),
            RutaImgFinal=str(result_image),
            MapeoColor=filter_outputs["numero_a_color"],
        )
        bundle_path = build_zip_bundle(job_id, job_dir)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Transpose image operation failed: {exc}") from exc

    artifacts = _build_image_op_artifacts(
        job_id, source_path, filter_outputs, result_image, result_numeric_preview, bundle_path
    )
    store_job(job_id=job_id, status="completed", progress=100,
              message="Transpose image operation completed.",
              artifacts=artifacts, result={"operation": "transpose_image"}, job_dir=job_dir)
    return FilterProcessResponse(job_id=job_id, status="completed", artifacts=artifacts)


@app.post(
    f"{settings.api_prefix}/operations/image/rotate",
    response_model=FilterProcessResponse,
)
async def rotate_image_operation(
    image: Annotated[UploadFile, File(...)],
    pixel_size: Annotated[int, Form(...)] = 10,
    color_levels: Annotated[int, Form(...)] = 64,
) -> FilterProcessResponse:
    if pixel_size < 1 or pixel_size > 64:
        raise HTTPException(status_code=400, detail="pixel_size must be between 1 and 64")
    if color_levels < 2 or color_levels > 256:
        raise HTTPException(status_code=400, detail="color_levels must be between 2 and 256")
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    job_id = matrix_service.generate_job_id("rotimg")
    job_dir = ARTIFACTS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    content = await image.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds max size of {settings.max_upload_mb} MB")
    extension = Path(image.filename or "input.png").suffix or ".png"
    source_path = job_dir / f"source{extension}"
    validate_uploaded_image(content, image.filename or "image")
    save_upload(content, source_path)

    try:
        filter_outputs = _image_operation_common(
            job_dir=job_dir, job_id=job_id, source_path=source_path,
            pixel_size=pixel_size, color_levels=color_levels, needs_square=True,
        )
        matrix_data = pd.read_excel(str(filter_outputs["matrix_xlsx"]), header=None).values.tolist()
        result_matrix = matrix_service.rotate_matrix(matrix_data)

        result_image = job_dir / f"{job_id}_result_image.png"
        result_numeric_preview = job_dir / f"{job_id}_result_numeric_preview.png"
        CrearImagenesFinales(
            MatrizProcesada=np.array(result_matrix),
            RutaImgNumFinal=str(result_numeric_preview),
            RutaImgFinal=str(result_image),
            MapeoColor=filter_outputs["numero_a_color"],
        )
        bundle_path = build_zip_bundle(job_id, job_dir)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Rotate image operation failed: {exc}") from exc

    artifacts = _build_image_op_artifacts(
        job_id, source_path, filter_outputs, result_image, result_numeric_preview, bundle_path
    )
    store_job(job_id=job_id, status="completed", progress=100,
              message="Rotate image operation completed.",
              artifacts=artifacts, result={"operation": "rotate_image"}, job_dir=job_dir)
    return FilterProcessResponse(job_id=job_id, status="completed", artifacts=artifacts)


@app.post(
    f"{settings.api_prefix}/operations/image/determinant",
    response_model=FilterProcessResponse,
)
async def determinant_image_operation(
    image: Annotated[UploadFile, File(...)],
    pixel_size: Annotated[int, Form(...)] = 10,
    color_levels: Annotated[int, Form(...)] = 64,
) -> FilterProcessResponse:
    if pixel_size < 1 or pixel_size > 64:
        raise HTTPException(status_code=400, detail="pixel_size must be between 1 and 64")
    if color_levels < 2 or color_levels > 256:
        raise HTTPException(status_code=400, detail="color_levels must be between 2 and 256")
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    job_id = matrix_service.generate_job_id("detimg")
    job_dir = ARTIFACTS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    content = await image.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds max size of {settings.max_upload_mb} MB")
    extension = Path(image.filename or "input.png").suffix or ".png"
    source_path = job_dir / f"source{extension}"
    validate_uploaded_image(content, image.filename or "image")
    save_upload(content, source_path)

    try:
        filter_outputs = _image_operation_common(
            job_dir=job_dir, job_id=job_id, source_path=source_path,
            pixel_size=pixel_size, color_levels=color_levels, needs_square=True,
        )
        matrix_data = pd.read_excel(str(filter_outputs["matrix_xlsx"]), header=None).values.tolist()
        result_matrix, scalar_result, warnings = matrix_service.determinant(matrix_data)

        result_image = job_dir / f"{job_id}_result_image.png"
        result_numeric_preview = job_dir / f"{job_id}_result_numeric_preview.png"
        CrearImagenesFinales(
            MatrizProcesada=np.array(result_matrix),
            RutaImgNumFinal=str(result_numeric_preview),
            RutaImgFinal=str(result_image),
            MapeoColor=filter_outputs["numero_a_color"],
        )
        bundle_path = build_zip_bundle(job_id, job_dir)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Determinant image operation failed: {exc}") from exc

    artifacts = _build_image_op_artifacts(
        job_id, source_path, filter_outputs, result_image, result_numeric_preview, bundle_path
    )
    store_job(job_id=job_id, status="completed", progress=100,
              message="Determinant image operation completed.",
              artifacts=artifacts,
              result={"operation": "determinant_image", "scalar_result": scalar_result, "warnings": warnings},
              job_dir=job_dir)
    return FilterProcessResponse(job_id=job_id, status="completed", artifacts=artifacts)


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
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds max size of {settings.max_upload_mb} MB",
        )

    validate_uploaded_image(content, image.filename or "image")

    save_upload(content, source_path)

    try:
        filter_outputs = run_filter_pipeline(
            source_path=source_path,
            job_dir=job_dir,
            token=job_id,
            pixel_size=pixel_size,
            color_levels=color_levels,
            numero_inicial=1,
            numeromaxpaisa=0,
        )

        bundle_path = build_zip_bundle(job_id, job_dir)
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail=f"Image processing failed: {exc}"
        ) from exc

    artifacts = {
        "source": as_artifact_url(job_id, source_path),
        "simplified": as_artifact_url(job_id, filter_outputs["simplified_path"]),
        "pixel_art": as_artifact_url(job_id, filter_outputs["pixel_path"]),
        "numeric_matrix_xlsx": as_artifact_url(job_id, filter_outputs["matrix_xlsx"]),
        "color_map_xlsx": as_artifact_url(job_id, filter_outputs["color_map_xlsx"]),
        "numeric_matrix_preview": as_artifact_url(
            job_id, filter_outputs["numeric_preview"]
        ),
        "bundle_zip": as_artifact_url(job_id, bundle_path),
    }

    store_job(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Filter pipeline completed.",
        artifacts=artifacts,
        result={"operation": "filters"},
        job_dir=job_dir,
    )

    return FilterProcessResponse(
        job_id=job_id,
        status="completed",
        artifacts=artifacts,
    )


@app.post(
    f"{settings.api_prefix}/compositions/sum-images", response_model=FilterProcessResponse
)
async def sum_images_composition(
    landscape_image: Annotated[UploadFile, File(...)],
    character_image: Annotated[UploadFile, File(...)],
    pixel_size: Annotated[int, Form(...)] = 10,
    color_levels: Annotated[int, Form(...)] = 64,
) -> FilterProcessResponse:
    if pixel_size < 1 or pixel_size > 64:
        raise HTTPException(status_code=400, detail="pixel_size must be between 1 and 64")

    if color_levels < 2 or color_levels > 256:
        raise HTTPException(
            status_code=400, detail="color_levels must be between 2 and 256"
        )

    if not landscape_image.content_type or not landscape_image.content_type.startswith(
        "image/"
    ):
        raise HTTPException(status_code=400, detail="Landscape file must be an image")

    if not character_image.content_type or not character_image.content_type.startswith(
        "image/"
    ):
        raise HTTPException(status_code=400, detail="Character file must be an image")

    landscape_content = await landscape_image.read()
    character_content = await character_image.read()

    for content in (landscape_content, character_content):
        if len(content) > settings.max_upload_mb * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"Each file must be <= {settings.max_upload_mb} MB",
            )

    landscape_size = validate_uploaded_image(
        landscape_content, landscape_image.filename or "landscape"
    )
    character_size = validate_uploaded_image(
        character_content, character_image.filename or "character"
    )

    if landscape_size != character_size:
        raise HTTPException(
            status_code=400,
            detail="Landscape and character images must have the same dimensions",
        )

    job_id = matrix_service.generate_job_id("sumimg")
    job_dir = ARTIFACTS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    landscape_ext = Path(landscape_image.filename or "landscape.png").suffix or ".png"
    character_ext = Path(character_image.filename or "character.png").suffix or ".png"

    landscape_source = job_dir / f"landscape_source{landscape_ext}"
    character_source = job_dir / f"character_source{character_ext}"

    save_upload(landscape_content, landscape_source)
    save_upload(character_content, character_source)

    try:
        landscape_outputs = run_filter_pipeline(
            source_path=landscape_source,
            job_dir=job_dir,
            token="landscape",
            pixel_size=pixel_size,
            color_levels=color_levels,
            numero_inicial=1,
            numeromaxpaisa=0,
        )

        character_outputs = run_filter_pipeline(
            source_path=character_source,
            job_dir=job_dir,
            token="character",
            pixel_size=pixel_size,
            color_levels=color_levels,
            numero_inicial=1,
            numeromaxpaisa=landscape_outputs["numero_max"],
        )

        sum_base = job_dir / "sum_matrix"
        summed_matrix, summed_color_map = cargar_y_sumar_matrices(
            matrizpersonaje=str(character_outputs["matrix_xlsx"]),
            matrizpaisaje=str(landscape_outputs["matrix_xlsx"]),
            colores_paisaje=landscape_outputs["numero_a_color"],
            colores_personaje=character_outputs["numero_a_color"],
            nummaxpaisa=landscape_outputs["numero_max"],
            ruta_excel_suma=str(sum_base),
        )

        sum_numeric_preview = job_dir / "sum_numeric_preview.png"
        sum_final_image = job_dir / "sum_final_image.png"

        CrearImagenesFinales(
            MatrizProcesada=summed_matrix,
            RutaImgNumFinal=str(sum_numeric_preview),
            RutaImgFinal=str(sum_final_image),
            MapeoColor=summed_color_map,
        )

        bundle_path = build_zip_bundle(job_id, job_dir)
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail=f"Sum image composition failed: {exc}"
        ) from exc

    artifacts = {
        "landscape_source": as_artifact_url(job_id, landscape_source),
        "character_source": as_artifact_url(job_id, character_source),
        "landscape_pixel": as_artifact_url(job_id, landscape_outputs["pixel_path"]),
        "landscape_matrix_xlsx": as_artifact_url(job_id, landscape_outputs["matrix_xlsx"]),
        "landscape_numeric_preview": as_artifact_url(job_id, landscape_outputs["numeric_preview"]),
        "character_pixel": as_artifact_url(job_id, character_outputs["pixel_path"]),
        "character_matrix_xlsx": as_artifact_url(job_id, character_outputs["matrix_xlsx"]),
        "character_numeric_preview": as_artifact_url(job_id, character_outputs["numeric_preview"]),
        "sum_matrix_xlsx": as_artifact_url(job_id, Path(f"{sum_base.name}.xlsx")),
        "sum_numeric_preview": as_artifact_url(job_id, sum_numeric_preview),
        "sum_final_image": as_artifact_url(job_id, sum_final_image),
        "bundle_zip": as_artifact_url(job_id, bundle_path),
    }

    store_job(
        job_id=job_id,
        status="completed",
        progress=100,
        message="Image composition sum completed.",
        artifacts=artifacts,
        result={"operation": "sum_images"},
        job_dir=job_dir,
    )

    return FilterProcessResponse(job_id=job_id, status="completed", artifacts=artifacts)


@app.get(f"{settings.api_prefix}/jobs/{{job_id}}", response_model=JobStatusResponse)
def get_job_status(job_id: str) -> JobStatusResponse:
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobStatusResponse(
        job_id=job["job_id"],
        status=job["status"],
        progress=job["progress"],
        message=job["message"],
    )


@app.get(f"{settings.api_prefix}/results/{{job_id}}")
def get_result(job_id: str) -> dict[str, Any]:
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "job_id": job["job_id"],
        "status": job["status"],
        "artifacts": job["artifacts"],
        "result": job["result"],
    }


@app.get(f"{settings.api_prefix}/results/{{job_id}}/matrix/{{artifact_key}}")
def view_matrix_data(job_id: str, artifact_key: str) -> dict[str, Any]:
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    artifacts = job.get("artifacts", {})
    if artifact_key not in artifacts:
        raise HTTPException(status_code=404, detail=f"Artifact '{artifact_key}' not found")

    artifact_url = artifacts[artifact_key]
    filename = Path(artifact_url).name
    file_path = ARTIFACTS_ROOT / job_id / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")

    if file_path.suffix.lower() != ".xlsx":
        raise HTTPException(status_code=400, detail="Artifact is not an Excel file")

    try:
        df = pd.read_excel(str(file_path), header=None)
        rows = df.fillna(0).astype(int).values.tolist()
        return {"rows": rows, "shape": [len(rows), len(rows[0]) if rows else 0]}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not read matrix: {exc}") from exc


@app.get(f"{settings.api_prefix}/results/{{job_id}}/download")
def download_result_bundle(job_id: str) -> FileResponse:
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    job_dir_raw = job.get("job_dir")
    if not job_dir_raw:
        raise HTTPException(status_code=404, detail="No artifact directory for this job")

    job_dir = Path(job_dir_raw)
    if not job_dir.exists():
        raise HTTPException(status_code=404, detail="Artifact directory not found")

    zip_path = build_zip_bundle(job_id, job_dir)
    job["artifacts"]["bundle_zip"] = as_artifact_url(job_id, zip_path)

    return FileResponse(
        path=zip_path,
        media_type="application/zip",
        filename=f"{job_id}_artifacts.zip",
    )
