import pandas as pd
from tkinter import messagebox


def cargar_y_sumar_matrices(matrizpersonaje, matrizpaisaje, colores_paisaje, colores_personaje, nummaxpaisa, ruta_excel_suma):
    color_a_numero = {}
    archivo_excel_personaje = matrizpersonaje
    archivo_excel_paisaje = matrizpaisaje

    datos_excel_personaje = pd.read_excel(archivo_excel_personaje, header=None)
    matriz_personaje = datos_excel_personaje.values
    datos_excel_paisaje = pd.read_excel(archivo_excel_paisaje, header=None)
    matriz_paisaje = datos_excel_paisaje.values

    filas = len(matriz_personaje)
    columnas = len(matriz_personaje[0])

    matriz_suma = [[0]*columnas for _ in range(filas)]

    for i in range(filas):
        for j in range(columnas):
            suma = matriz_personaje[i][j] + matriz_paisaje[i][j]
            if suma <= nummaxpaisa:
                if suma==0:
                    #messagebox.showinfo("Advertencia", "Tu paisaje no es un paisaje >;/")
                    #exit()
                    color_a_numero[suma] = (0, 0, 0, 0)
                else:
                    color_a_numero[suma] = colores_paisaje[matriz_paisaje[i][j]]
            else:
                color_a_numero[suma] = colores_personaje[matriz_personaje[i][j]]
            matriz_suma[i][j] = matriz_personaje[i][j] + matriz_paisaje[i][j]

    df_sumado=pd.DataFrame(matriz_suma)
    df_sumado.to_excel(str(ruta_excel_suma) + '.xlsx', header=False, index=False, engine='openpyxl')
    print(f"La suma de las matrices se ha guardado en '{ruta_excel_suma}.xlsx'.")
    return df_sumado.to_numpy(),color_a_numero
