import pandas as pd


def cargar_y_sumar_matrices(
    matrizpersonaje,
    matrizpaisaje,
    colores_paisaje,
    colores_personaje,
    nummaxpaisa,
    ruta_excel_suma,
    alpha=1.0,
    beta=1.0,
):
    archivo_excel_personaje = matrizpersonaje
    archivo_excel_paisaje = matrizpaisaje

    datos_excel_personaje = pd.read_excel(archivo_excel_personaje, header=None)
    matriz_personaje = datos_excel_personaje.values
    datos_excel_paisaje = pd.read_excel(archivo_excel_paisaje, header=None)
    matriz_paisaje = datos_excel_paisaje.values

    filas = len(matriz_personaje)
    columnas = len(matriz_personaje[0])

    matriz_suma = [[0] * columnas for _ in range(filas)]
    color_a_numero = {}

    for i in range(filas):
        for j in range(columnas):
            paisaje_raw = matriz_paisaje[i][j]
            personaje_raw = matriz_personaje[i][j]
            suma = max(round(alpha * paisaje_raw + beta * personaje_raw), 0)

            if personaje_raw == 0 and paisaje_raw != 0:
                color = colores_paisaje[paisaje_raw]
            elif paisaje_raw == 0 and personaje_raw != 0:
                color = colores_personaje[personaje_raw]
            elif paisaje_raw == 0 and personaje_raw == 0:
                color = (0, 0, 0, 0)
            else:
                # Both sides contribute a real color: whichever weighted
                # magnitude is larger wins that pixel's color.
                if alpha * paisaje_raw >= beta * personaje_raw:
                    color = colores_paisaje[paisaje_raw]
                else:
                    color = colores_personaje[personaje_raw]

            color_a_numero[suma] = color
            matriz_suma[i][j] = suma

    df_sumado = pd.DataFrame(matriz_suma)
    df_sumado.to_excel(str(ruta_excel_suma) + '.xlsx', header=False, index=False, engine='openpyxl')
    print(f"La suma de las matrices se ha guardado en '{ruta_excel_suma}.xlsx'.")
    return df_sumado.to_numpy(), color_a_numero
