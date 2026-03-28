import pandas as pd
import numpy as np
from tkinter import messagebox
from PIL import Image


def verificar_filas_columnas_repetidas(matriz):
    filas_repetidas = [i for i in range(len(matriz)) if list(map(tuple, matriz)).count(tuple(matriz[i])) > 1]
    columnas_repetidas = [j for j in range(len(matriz[0])) if list(map(tuple, matriz.T)).count(tuple(matriz[:, j])) > 1]
    return filas_repetidas, columnas_repetidas

def modificar_repetidos(matriz, filas_repetidas, columnas_repetidas):
    for i, fila in enumerate(filas_repetidas):
        for col in range(matriz.shape[1]):
            matriz[fila, col] += i + 1

    for j, col in enumerate(columnas_repetidas):
        for fila in range(matriz.shape[0]):
            matriz[fila, col] += j + 1
    
    return matriz

def calcular_determinante(ruta_entrada, ruta_salida):
    df = pd.read_excel(ruta_entrada, header=None)
    matriz = df.to_numpy()
    
    messages = []
    filas_repetidas, columnas_repetidas = verificar_filas_columnas_repetidas(matriz)

    if filas_repetidas or columnas_repetidas:
        filas_msg = f"Filas repetidas: {', '.join(map(str, filas_repetidas))}" if filas_repetidas else ""
        columnas_msg = f"Columnas repetidas: {', '.join(map(str, columnas_repetidas))}" if columnas_repetidas else ""
        messagebox.showinfo("Mensaje", f"La matriz tiene repeticiones.\n{filas_msg}\n{columnas_msg}")
        
        matriz = modificar_repetidos(matriz, filas_repetidas, columnas_repetidas)
        messages.append("Aplicando cambios a la matriz para evitar que el determinante sea 0...")
    
    df_resultado = pd.DataFrame(matriz)
    df_resultado.to_excel(ruta_salida, index=False, header=False)
    
    if messages:
        messagebox.showinfo("Información", "\n".join(messages))
    
    determinante = np.linalg.det(matriz)
    print(f"Matriz guardada en: {ruta_salida}")
    print(f"Determinante: {determinante}")
    
    return df_resultado.to_numpy(), determinante


def crear_imagen_determinante2(RtMatNum,RtmapColor,Rtimgfinal):
    # Rutas de los archivos
    ruta_matriz_numerica = RtMatNum
    ruta_mapeo_colores = RtmapColor
    ruta_destino_imagen = Rtimgfinal
    
    # Cargar la matriz numérica
    df_matriz = pd.read_excel(ruta_matriz_numerica, header=None)
    matriz_numerica = df_matriz.values
    
    # Cargar el mapeo de colores
    df_mapeo = pd.read_excel(ruta_mapeo_colores)
    
    # Crear un diccionario de mapeo de colores
    mapeo_colores = {row['Número']: tuple(map(int, row['Color (RGB)'].strip('()').split(', '))) for _, row in df_mapeo.iterrows()}
    
    # Tamaño de los píxeles en la imagen final
    tamaño_pixel = 10
    
    # Crear la imagen final
    ancho = len(matriz_numerica[0]) * tamaño_pixel
    alto = len(matriz_numerica) * tamaño_pixel
    imagen_final = Image.new('RGBA', (ancho, alto), (255, 255, 255, 0))  # Fondo transparente
    
    pixels = imagen_final.load()
    
    # Llenar la imagen final con los colores según la matriz numérica y el mapeo de colores
    for i in range(len(matriz_numerica)):
        for j in range(len(matriz_numerica[0])):
            numero = matriz_numerica[i][j]
            if numero in mapeo_colores:
                color = mapeo_colores[numero]
                for y in range(i * tamaño_pixel, (i + 1) * tamaño_pixel):
                    for x in range(j * tamaño_pixel, (j + 1) * tamaño_pixel):
                        pixels[x, y] = color
    
    # Guardar la imagen final
    imagen_final.save(ruta_destino_imagen)
    print(f"La imagen determinante se ha guardado en '{ruta_destino_imagen}'.")


