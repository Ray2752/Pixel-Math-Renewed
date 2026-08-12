import os
from PIL import Image

def simplificar_colores(imagen_path, destino_path, name, niveles_por_canal=64):
    # Abrir la imagen y convertir a RGBA
    imagen = Image.open(imagen_path)
    imagen = imagen.convert('RGBA')  # Asegurar que haya canal alfa
    datos_pixeles = list(imagen.getdata())

    # Crear la nueva paleta de colores simplificada.
    # niveles_por_canal es el número de valores posibles por canal (2..256):
    # cada canal se redondea al nivel más cercano de una escala uniforme 0..255.
    paso = 255 / (niveles_por_canal - 1)
    paleta_simplificada = []
    for r, g, b, a in datos_pixeles:
        if (r, g, b) == (0, 0, 0) and a == 0:
            paleta_simplificada.append((255, 255, 255, 0))  # Mantén transparencia total
        else:
            r_nuevo = round(round(r / paso) * paso)
            g_nuevo = round(round(g / paso) * paso)
            b_nuevo = round(round(b / paso) * paso)
            # El alfa se conserva tal cual: cuantizarlo volvía translúcidas las imágenes opacas
            paleta_simplificada.append((r_nuevo, g_nuevo, b_nuevo, a))

    # Crear nueva imagen y asignar los datos de píxeles simplificados
    nueva_imagen = Image.new('RGBA', imagen.size)
    nueva_imagen.putdata(paleta_simplificada)

    # Definir el nombre del archivo y la ruta
    nuevo_nombre_archivo = f"imgsimplificada_{name}.png"
    nueva_ruta = os.path.join(destino_path, nuevo_nombre_archivo)

    # Guardar la imagen
    nueva_imagen.save(nueva_ruta)

    return nueva_ruta
