import os
from PIL import Image

def simplificar_colores(imagen_path, destino_path, name, niveles_por_canal=64):
    # Abrir la imagen y convertir a RGBA
    imagen = Image.open(imagen_path)
    imagen = imagen.convert('RGBA')  # Asegurar que haya canal alfa
    datos_pixeles = list(imagen.getdata())

    # Crear la nueva paleta de colores simplificada
    paleta_simplificada = []
    for r, g, b, a in datos_pixeles:
        if (r, g, b) == (0, 0, 0) and a == 0:
            paleta_simplificada.append((255, 255, 255, 0))  # Mantén transparencia total
        else:
            r_nuevo = int(r / niveles_por_canal) * niveles_por_canal
            g_nuevo = int(g / niveles_por_canal) * niveles_por_canal
            b_nuevo = int(b / niveles_por_canal) * niveles_por_canal
            a_nuevo = int(a / niveles_por_canal) * niveles_por_canal  # Nuevo: simplificar alfa
            paleta_simplificada.append((r_nuevo, g_nuevo, b_nuevo, a_nuevo))

    # Crear nueva imagen y asignar los datos de píxeles simplificados
    nueva_imagen = Image.new('RGBA', imagen.size)
    nueva_imagen.putdata(paleta_simplificada)

    # Definir el nombre del archivo y la ruta
    nuevo_nombre_archivo = f"imgsimplificada_{name}.png"
    nueva_ruta = os.path.join(destino_path, nuevo_nombre_archivo)

    # Guardar la imagen
    nueva_imagen.save(nueva_ruta)

    return nueva_ruta
