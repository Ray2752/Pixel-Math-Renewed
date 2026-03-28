import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import numpy as np


def RotarMatriz(ruta_entrada, ruta_salida):
    df = pd.read_excel(ruta_entrada, header=None)
    matriz = df.to_numpy()

    n = matriz.shape[0]

    # Crear la matriz identidad con la diagonal inversa
    matriz_identidad_inversa = np.zeros((n, n))
    for i in range(n):
        matriz_identidad_inversa[i, n-i-1] = 1

    # Multiplicar la matriz original por la matriz identidad con la diagonal inversa
    matriz_resultante = np.dot(matriz, matriz_identidad_inversa)

    df_rotado = pd.DataFrame(matriz_resultante)
    df_rotado.to_excel(ruta_salida, index=False, header=False)

    print("La matriz ha sido multiplicada y guardada exitosamente.")
    return df_rotado.to_numpy()