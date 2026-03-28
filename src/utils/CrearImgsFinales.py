import pandas as pd
from PIL import Image, ImageDraw, ImageFont


def generar_imagen_numerica(matriz_Procesada, ruta_salida_imagen_numerica, tamano_pixel):
    alto, ancho = matriz_Procesada.shape
    imagen_numerica = Image.new('RGB', (ancho * tamano_pixel, alto * tamano_pixel), (255, 255, 255))
    draw = ImageDraw.Draw(imagen_numerica)
    font = ImageFont.load_default()

    for i in range(alto):
        for j in range(ancho):
            numero = matriz_Procesada[i, j]
            draw.text((j * tamano_pixel, i * tamano_pixel), str(numero), fill=(0, 0, 0), font=font)

    imagen_numerica.save(ruta_salida_imagen_numerica)
    print(f"Imagen numérica guardada en: {ruta_salida_imagen_numerica}")


def crear_imagen_final(matriz_Procesada, color_a_numero, tamano_pixel, ruta_destino_imagen_final):
    ancho = len(matriz_Procesada[0]) * tamano_pixel
    alto = len(matriz_Procesada) * tamano_pixel
    
    imagen_final = Image.new('RGBA', (ancho, alto), color=(255, 255, 255, 0))  # Fondo transparente
    pixels = imagen_final.load()

    for i in range(len(matriz_Procesada)):
        for j in range(len(matriz_Procesada[0])):
            numero = matriz_Procesada[i][j]
            
            if numero == 0:
                # Si el número es 0, dejar transparente
                continue
            elif numero in color_a_numero:
                color = color_a_numero[numero]
                if len(color) == 4:  # Validar que tiene RGBA
                    for y in range(i * tamano_pixel, (i + 1) * tamano_pixel):
                        for x in range(j * tamano_pixel, (j + 1) * tamano_pixel):
                            pixels[x, y] = color
                else:
                    raise ValueError(f"Color inválido para el número {numero}: {color}")
    # Guardar la imagen como PNG
    imagen_final.save(ruta_destino_imagen_final, "PNG")
    print(f"La imagen final se ha guardado en '{ruta_destino_imagen_final}'.")


def CrearImagenesFinales(MatrizProcesada,RutaImgNumFinal,RutaImgFinal,MapeoColor):
    generar_imagen_numerica(MatrizProcesada,RutaImgNumFinal,10)
    crear_imagen_final(MatrizProcesada,MapeoColor,10,RutaImgFinal)