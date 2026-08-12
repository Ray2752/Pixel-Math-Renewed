import os

import numpy as np
from PIL import Image


def simplificar_colores(imagen_path, destino_path, name, niveles_por_canal=64):
    # Abrir la imagen y convertir a RGBA
    imagen = Image.open(imagen_path)
    imagen = imagen.convert('RGBA')  # Asegurar que haya canal alfa

    # niveles_por_canal es el número de valores posibles por canal (2..256):
    # cada canal RGB se redondea al nivel más cercano de una escala uniforme 0..255.
    datos = np.asarray(imagen)
    paso = 255 / (niveles_por_canal - 1)

    resultado = datos.copy()
    resultado[..., :3] = np.rint(np.rint(datos[..., :3] / paso) * paso).astype(np.uint8)
    # El alfa se conserva tal cual: cuantizarlo volvía translúcidas las imágenes opacas

    # Normalizar la transparencia total a blanco transparente
    transparencia_total = (datos[..., 3] == 0) & (datos[..., :3] == 0).all(axis=-1)
    resultado[transparencia_total] = (255, 255, 255, 0)

    nueva_imagen = Image.fromarray(resultado, 'RGBA')

    # Definir el nombre del archivo y la ruta
    nuevo_nombre_archivo = f"imgsimplificada_{name}.png"
    nueva_ruta = os.path.join(destino_path, nuevo_nombre_archivo)

    # Guardar la imagen
    nueva_imagen.save(nueva_ruta)

    return nueva_ruta
