from tkinter import filedialog,messagebox
import shutil

def descargar_archivo(archivo_descargar, tipo_archivo):
    if archivo_descargar:
        # Configurar extensión y tipos de archivo según el tipo
        if tipo_archivo == "imagen":
            defaultextension = ".png"
            filetypes = [("PNG Files", "*.png"), ("All Files", "*.*")]
        elif tipo_archivo == "excel":
            defaultextension = ".xlsx"
            filetypes = [("Excel Files", "*.xlsx"), ("All Files", "*.*")]
        else:
            print("Tipo de archivo no válido.")
            return

        # Abrir cuadro de diálogo para elegir la ubicación de destino
        ruta_destino = filedialog.asksaveasfilename(
            defaultextension=defaultextension,
            filetypes=filetypes,
            title="Guardar archivo como"
        )

        # Verificar si se ha elegido una ruta
        if ruta_destino:
            try:
                shutil.copy(archivo_descargar, ruta_destino)
                # Mostrar un mensaje de éxito
                messagebox.showinfo(
                    title="Archivo guardado",
                    message=f"El archivo se ha guardado correctamente en:\n{ruta_destino}"
                )
            except Exception as e:
                messagebox.showerror(
                    title="Error",
                    message=f"Error al intentar guardar el archivo:\n{e}"
                )
        else:
            print("No se seleccionó ninguna ruta.")
    else:
        print("Opción de archivo no válida.")

