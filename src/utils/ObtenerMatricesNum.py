from PIL import Image, ImageDraw, ImageFont
import numpy as np
import pandas as pd


def _pegar_numeros(imagen, posiciones_y_textos, font):
    """Dibuja los números cacheando el glifo de cada texto (draw.text por celda
    es ~50x más lento que paste con máscara)."""
    glifos = {}
    for x, y, texto in posiciones_y_textos:
        glifo = glifos.get(texto)
        if glifo is None:
            bbox = font.getbbox(texto)
            ancho_g = max(1, bbox[2] - bbox[0])
            alto_g = max(1, bbox[3] - bbox[1])
            glifo = Image.new('RGBA', (ancho_g, alto_g), (0, 0, 0, 0))
            ImageDraw.Draw(glifo).text((-bbox[0], -bbox[1]), texto, fill=(0, 0, 0, 255), font=font)
            glifos[texto] = glifo
        imagen.paste(glifo, (x, y), glifo)


def GenerarMatrices(ruta_imagen_entrada, ruta_salida_excel, ruta_salida_mapeo, ruta_salida_imagen_numerica, numero_inicial, tamañopixel,numeromaxpaisa):
    imagen_original = Image.open(ruta_imagen_entrada)
    ancho, alto = imagen_original.size

    tamano_pixel = tamañopixel

    # pixelar_imagen reduce con división entera (ancho // tamano_pixel bloques) y
    # reescala de vuelta, así que el tamaño real de bloque es ancho / n_bloques (no
    # tamano_pixel). Se muestrea el centro de cada bloque real para que la matriz
    # corresponda 1:1 con el pixel art, sin filas/columnas duplicadas artificialmente.
    bloques_x = max(1, ancho // tamano_pixel)
    bloques_y = max(1, alto // tamano_pixel)
    bloque_ancho = ancho / bloques_x
    bloque_alto = alto / bloques_y

    datos = np.asarray(imagen_original.convert('RGBA'))
    xs = ((np.arange(bloques_x) + 0.5) * bloque_ancho).astype(int)
    ys = ((np.arange(bloques_y) + 0.5) * bloque_alto).astype(int)
    muestras = datos[ys][:, xs]  # (bloques_y, bloques_x, 4)

    r = muestras[..., 0].astype(np.uint32)
    g = muestras[..., 1].astype(np.uint32)
    b = muestras[..., 2].astype(np.uint32)
    a = muestras[..., 3].astype(np.uint32)

    # Asigna 0 si es transparente (mismos dos casos que el legado)
    transparente = (((r == 255) & (g == 255) & (b == 255)) | ((r == 0) & (g == 0) & (b == 0))) & (a == 0)

    llaves = (r << 24) | (g << 16) | (b << 8) | a
    llaves_planas = llaves.ravel()
    visibles = ~transparente.ravel()

    # Códigos por color en orden de primera aparición, con el mismo esquema de
    # incrementos del legado: siguiente = numeromaxpaisa + actual + 1.
    paso_codigo = numeromaxpaisa + 1
    unicas, primeras = np.unique(llaves_planas[visibles], return_index=True)
    orden_aparicion = np.argsort(primeras)
    codigos_de_unicas = np.zeros(len(unicas), dtype=np.int64)
    codigos_de_unicas[orden_aparicion] = numero_inicial + np.arange(len(unicas)) * paso_codigo

    matriz_plana = np.zeros(llaves_planas.shape, dtype=np.int64)
    if len(unicas):
        indices = np.searchsorted(unicas, llaves_planas[visibles])
        matriz_plana[visibles] = codigos_de_unicas[indices]
    matriz = matriz_plana.reshape(bloques_y, bloques_x)

    numero_a_color = {}
    for k in orden_aparicion:
        llave = int(unicas[k])
        color = ((llave >> 24) & 255, (llave >> 16) & 255, (llave >> 8) & 255, llave & 255)
        numero_a_color[int(codigos_de_unicas[k])] = color

    pd.DataFrame(matriz).to_excel(ruta_salida_excel, header=False, index=False, engine='openpyxl')

    # Crear el mapeo de número a color en un archivo Excel
    df_mapeo_color = pd.DataFrame(list(numero_a_color.items()), columns=['Número', 'Color (RGB)'])
    df_mapeo_color.to_excel(ruta_salida_mapeo, index=False)

    # Imagen de la matriz numérica
    imagen_numerica = Image.new('RGB', (ancho, alto), (255, 255, 255))
    font = ImageFont.load_default()
    posiciones = [
        (int(j * bloque_ancho), int(i * bloque_alto), str(matriz[i, j]))
        for i in range(bloques_y)
        for j in range(bloques_x)
    ]
    _pegar_numeros(imagen_numerica, posiciones, font)
    imagen_numerica.save(ruta_salida_imagen_numerica)

    print("Procesamiento completado para:", ruta_imagen_entrada)

    numero_final = numero_inicial + len(unicas) * paso_codigo - 1
    return numero_final, numero_a_color
