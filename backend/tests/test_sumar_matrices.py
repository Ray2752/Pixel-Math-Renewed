from pathlib import Path

import pandas as pd

from src.Operaciones_Mat.SumarMatrices import cargar_y_sumar_matrices


def _write_matrix_xlsx(path: Path, rows: list[list[int]]) -> Path:
    pd.DataFrame(rows).to_excel(str(path), header=False, index=False, engine="openpyxl")
    return path


def test_weighted_sum_extreme_alpha_matches_landscape_only(tmp_path: Path) -> None:
    paisaje_path = _write_matrix_xlsx(tmp_path / "paisaje.xlsx", [[1, 2], [1, 2]])
    personaje_path = _write_matrix_xlsx(tmp_path / "personaje.xlsx", [[3, 4], [3, 4]])
    colores_paisaje = {1: (10, 10, 10, 255), 2: (20, 20, 20, 255)}
    colores_personaje = {3: (30, 30, 30, 255), 4: (40, 40, 40, 255)}

    matrix, color_map = cargar_y_sumar_matrices(
        matrizpersonaje=str(personaje_path),
        matrizpaisaje=str(paisaje_path),
        colores_paisaje=colores_paisaje,
        colores_personaje=colores_personaje,
        nummaxpaisa=2,
        ruta_excel_suma=str(tmp_path / "sum_alpha_only"),
        alpha=1.0,
        beta=0.0,
    )

    assert matrix.tolist() == [[1, 2], [1, 2]]
    assert color_map[1] == (10, 10, 10, 255)
    assert color_map[2] == (20, 20, 20, 255)


def test_weighted_sum_extreme_beta_matches_character_only(tmp_path: Path) -> None:
    paisaje_path = _write_matrix_xlsx(tmp_path / "paisaje.xlsx", [[1, 2], [1, 2]])
    personaje_path = _write_matrix_xlsx(tmp_path / "personaje.xlsx", [[3, 4], [3, 4]])
    colores_paisaje = {1: (10, 10, 10, 255), 2: (20, 20, 20, 255)}
    colores_personaje = {3: (30, 30, 30, 255), 4: (40, 40, 40, 255)}

    matrix, color_map = cargar_y_sumar_matrices(
        matrizpersonaje=str(personaje_path),
        matrizpaisaje=str(paisaje_path),
        colores_paisaje=colores_paisaje,
        colores_personaje=colores_personaje,
        nummaxpaisa=2,
        ruta_excel_suma=str(tmp_path / "sum_beta_only"),
        alpha=0.0,
        beta=1.0,
    )

    assert matrix.tolist() == [[3, 4], [3, 4]]
    assert color_map[3] == (30, 30, 30, 255)
    assert color_map[4] == (40, 40, 40, 255)


def test_weighted_sum_transparency_overlap_does_not_raise_keyerror(tmp_path: Path) -> None:
    # Landscape transparent (0) where character has color, and vice versa —
    # the exact overlap shape that broke the old `suma <= nummaxpaisa`
    # threshold classification once weights were introduced.
    paisaje_path = _write_matrix_xlsx(tmp_path / "paisaje.xlsx", [[0, 1], [1, 0]])
    personaje_path = _write_matrix_xlsx(tmp_path / "personaje.xlsx", [[5, 0], [0, 5]])
    colores_paisaje = {1: (10, 10, 10, 255)}
    colores_personaje = {5: (50, 50, 50, 255)}

    # Low alpha used to push transparent-landscape/opaque-character sums
    # below `nummaxpaisa`, causing a colores_paisaje[0] KeyError.
    matrix, color_map = cargar_y_sumar_matrices(
        matrizpersonaje=str(personaje_path),
        matrizpaisaje=str(paisaje_path),
        colores_paisaje=colores_paisaje,
        colores_personaje=colores_personaje,
        nummaxpaisa=1,
        ruta_excel_suma=str(tmp_path / "sum_overlap"),
        alpha=0.1,
        beta=0.9,
    )

    # (0,0): landscape transparent, character opaque -> character's color.
    assert color_map[matrix[0][0]] == (50, 50, 50, 255)
    # (0,1): landscape opaque, character transparent -> landscape's color.
    assert color_map[matrix[0][1]] == (10, 10, 10, 255)


def test_weighted_sum_both_transparent_is_fully_transparent(tmp_path: Path) -> None:
    paisaje_path = _write_matrix_xlsx(tmp_path / "paisaje.xlsx", [[0]])
    personaje_path = _write_matrix_xlsx(tmp_path / "personaje.xlsx", [[0]])

    matrix, color_map = cargar_y_sumar_matrices(
        matrizpersonaje=str(personaje_path),
        matrizpaisaje=str(paisaje_path),
        colores_paisaje={},
        colores_personaje={},
        nummaxpaisa=0,
        ruta_excel_suma=str(tmp_path / "sum_both_transparent"),
        alpha=0.7,
        beta=0.3,
    )

    assert color_map[matrix[0][0]] == (0, 0, 0, 0)


def test_weighted_sum_different_weights_produce_different_results(tmp_path: Path) -> None:
    paisaje_path = _write_matrix_xlsx(tmp_path / "paisaje.xlsx", [[10, 20]])
    personaje_path = _write_matrix_xlsx(tmp_path / "personaje.xlsx", [[30, 40]])
    colores_paisaje = {10: (1, 1, 1, 255), 20: (2, 2, 2, 255)}
    colores_personaje = {30: (3, 3, 3, 255), 40: (4, 4, 4, 255)}

    matrix_a, _ = cargar_y_sumar_matrices(
        matrizpersonaje=str(personaje_path),
        matrizpaisaje=str(paisaje_path),
        colores_paisaje=colores_paisaje,
        colores_personaje=colores_personaje,
        nummaxpaisa=20,
        ruta_excel_suma=str(tmp_path / "sum_weights_a"),
        alpha=0.7,
        beta=0.3,
    )
    matrix_b, _ = cargar_y_sumar_matrices(
        matrizpersonaje=str(personaje_path),
        matrizpaisaje=str(paisaje_path),
        colores_paisaje=colores_paisaje,
        colores_personaje=colores_personaje,
        nummaxpaisa=20,
        ruta_excel_suma=str(tmp_path / "sum_weights_b"),
        alpha=0.2,
        beta=0.8,
    )

    assert matrix_a.tolist() != matrix_b.tolist()
