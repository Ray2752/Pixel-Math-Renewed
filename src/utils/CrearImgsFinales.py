import numpy as np
from PIL import Image, ImageFont

from src.utils.ObtenerMatricesNum import _pegar_numeros


def generar_imagen_numerica(matriz_Procesada, ruta_salida_imagen_numerica, tamano_pixel):
    alto, ancho = matriz_Procesada.shape
    imagen_numerica = Image.new('RGB', (ancho * tamano_pixel, alto * tamano_pixel), (255, 255, 255))
    font = ImageFont.load_default()

    posiciones = [
        (j * tamano_pixel, i * tamano_pixel, str(matriz_Procesada[i, j]))
        for i in range(alto)
        for j in range(ancho)
    ]
    _pegar_numeros(imagen_numerica, posiciones, font)

    imagen_numerica.save(ruta_salida_imagen_numerica)
    print(f"Imagen numérica guardada en: {ruta_salida_imagen_numerica}")


def crear_imagen_final(matriz_Procesada, color_a_numero, tamano_pixel, ruta_destino_imagen_final):
    matriz = np.asarray(matriz_Procesada)

    # LUT: cada valor único de la matriz -> su color RGBA (0 y valores sin
    # mapeo quedan transparentes, igual que el legado celda a celda).
    valores_unicos = np.unique(matriz)
    colores = np.zeros((len(valores_unicos), 4), dtype=np.uint8)
    colores[:] = (255, 255, 255, 0)  # Fondo transparente
    for k, valor in enumerate(valores_unicos.tolist()):
        if valor == 0:
            continue
        if valor in color_a_numero:
            color = color_a_numero[valor]
            if len(color) == 4:  # Validar que tiene RGBA
                colores[k] = color
            else:
                raise ValueError(f"Color inválido para el número {valor}: {color}")

    indices = np.searchsorted(valores_unicos, matriz)
    celdas = colores[indices]  # (alto, ancho, 4)
    pixeles = np.repeat(np.repeat(celdas, tamano_pixel, axis=0), tamano_pixel, axis=1)

    Image.fromarray(pixeles, 'RGBA').save(ruta_destino_imagen_final, "PNG")
    print(f"La imagen final se ha guardado en '{ruta_destino_imagen_final}'.")


def CrearImagenesFinales(MatrizProcesada,RutaImgNumFinal,RutaImgFinal,MapeoColor):
    generar_imagen_numerica(MatrizProcesada,RutaImgNumFinal,10)
    crear_imagen_final(MatrizProcesada,MapeoColor,10,RutaImgFinal)
