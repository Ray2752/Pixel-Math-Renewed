from pathlib import Path

from PIL import Image

from src.Filtros.SimplificarColores import simplificar_colores


def _simplify_pixel(tmp_path: Path, pixel: tuple[int, int, int, int], niveles: int) -> tuple:
    source = tmp_path / "source.png"
    image = Image.new("RGBA", (1, 1), pixel)
    image.save(source)

    result_path = simplificar_colores(str(source), str(tmp_path), "test", niveles_por_canal=niveles)
    with Image.open(result_path) as result:
        return result.getpixel((0, 0))


def test_two_levels_snaps_channels_to_extremes(tmp_path: Path) -> None:
    assert _simplify_pixel(tmp_path, (200, 100, 30, 255), niveles=2) == (255, 0, 0, 255)


def test_max_levels_keeps_colors_intact(tmp_path: Path) -> None:
    assert _simplify_pixel(tmp_path, (200, 100, 30, 255), niveles=256) == (200, 100, 30, 255)


def test_alpha_channel_is_preserved(tmp_path: Path) -> None:
    assert _simplify_pixel(tmp_path, (200, 100, 30, 180), niveles=2)[3] == 180


def test_fully_transparent_pixels_stay_transparent(tmp_path: Path) -> None:
    assert _simplify_pixel(tmp_path, (0, 0, 0, 0), niveles=2) == (255, 255, 255, 0)
