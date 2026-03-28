import os
from PIL import Image

def pixelar_imagen(ruta_entrada, carpeta_salida, tamaño_pixel, name):
    imagen_original = Image.open(ruta_entrada)
    ancho, alto = imagen_original.size
    nuevo_ancho = ancho // tamaño_pixel
    nuevo_alto = alto // tamaño_pixel
    imagen_pixeleada = imagen_original.resize((nuevo_ancho, nuevo_alto), resample=Image.NEAREST)
    imagen_pixeleada = imagen_pixeleada.resize((ancho, alto), resample=Image.NEAREST)
    nombre_archivo = f"imagen_pixeleada_{name}.png"
    ruta_salida = os.path.join(carpeta_salida, nombre_archivo)
    imagen_pixeleada.save(ruta_salida)
    return ruta_salida



