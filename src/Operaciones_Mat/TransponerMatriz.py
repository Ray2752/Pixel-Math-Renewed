import pandas as pd

def Transponer_matriz_excel(ruta_entrada, ruta_salida):
    df = pd.read_excel(ruta_entrada, header=None)
    df_transpuesta = df.transpose()
    df_transpuesta.to_excel(ruta_salida, index=False, header=False)
    print(f"Matriz transpuesta guardada en: {ruta_salida}")
    return df_transpuesta.to_numpy()