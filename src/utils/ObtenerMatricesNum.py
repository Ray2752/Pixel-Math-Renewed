from PIL import Image, ImageDraw, ImageFont
import openpyxl
import math
import pandas as pd

def GenerarMatrices(ruta_imagen_entrada, ruta_salida_excel, ruta_salida_mapeo, ruta_salida_imagen_numerica, numero_inicial, tamañopixel,numeromaxpaisa):
    imagen_original = Image.open(ruta_imagen_entrada)
    ancho, alto = imagen_original.size

    tamano_pixel = tamañopixel

    libro_color = openpyxl.Workbook()
    hoja_color = libro_color.active

    color_a_numero = {}
    numero_a_color = {}
    numero_actual = numero_inicial  # Inicializa el número con el valor inicial dado

    # Crear una nueva imagen para la matriz numérica
    imagen_numerica = Image.new('RGB', (ancho, alto), (255, 255, 255))
    draw = ImageDraw.Draw(imagen_numerica)
    font = ImageFont.load_default()

    for i in range(math.ceil(alto / tamano_pixel)):
        for j in range(math.ceil(ancho / tamano_pixel)):
            color_pixel = imagen_original.getpixel((j * tamano_pixel, i * tamano_pixel))

            # Asigna 0 si es transparente
            if color_pixel == (255, 255, 255, 0) or color_pixel == (0, 0, 0, 0):
                hoja_color.cell(row=i + 1, column=j + 1, value=0)
                draw.text((j * tamano_pixel, i * tamano_pixel), "0", fill=(0, 0, 0), font=font)
            else:
                # Si el color ya tiene un número asignado, lo reutiliza
                if color_pixel not in color_a_numero:
                    color_a_numero[color_pixel] = numero_actual
                    numero_a_color[numero_actual] = color_pixel
                    numero_actual = numeromaxpaisa+numero_actual+1
                # Escribe el número asignado en el Excel y en la imagen de salida
                hoja_color.cell(row=i + 1, column=j + 1, value=color_a_numero[color_pixel])
                draw.text((j * tamano_pixel, i * tamano_pixel), str(color_a_numero[color_pixel]), fill=(0, 0, 0), font=font)

    libro_color.save(ruta_salida_excel)

    # Crear el mapeo de número a color en un archivo Excel
    df_mapeo_color = pd.DataFrame(list(numero_a_color.items()), columns=['Número', 'Color (RGB)'])
    df_mapeo_color.to_excel(ruta_salida_mapeo, index=False)

    # Guardar la imagen de la matriz numérica
    imagen_numerica.save(ruta_salida_imagen_numerica)

    print("Procesamiento completado para:", ruta_imagen_entrada)

    return numero_actual - 1, numero_a_color





