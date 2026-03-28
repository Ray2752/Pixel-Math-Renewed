import pandas as pd
import tkinter as tk
from pathlib import Path

RutaNav = Path(__file__).resolve().parent.parent.parent
print(RutaNav)
Matrices = RutaNav / "imagenes" / "matricestablas"

def open_matrix_interface(title, matrizAmostrar):
    matrix_file_path = Matrices / matrizAmostrar
    window_title = "Matriz Numérica " + title

    try:
        # Leer la matriz desde el archivo Excel
        df = pd.read_excel(matrix_file_path, header=None)
        df = df.astype(str)

        # Agregar etiquetas de columna
        column_labels = [f"Col{i+1}" for i in range(df.shape[1])]
        df.columns = column_labels

        # Agregar etiquetas de fila
        df.insert(0, "Fila", [f"Fila{i+1}" for i in range(df.shape[0])])

        # Crear la fila de encabezados (incluye "Fila" como primer encabezado)
        header_row = [""] + column_labels
        df.loc[-1] = header_row  # Insertar en la primera posición
        df.index = df.index + 1  # Ajustar índices
        df = df.sort_index()  # Ordenar por índice

        # Crear la ventana principal
        root = tk.Tk()
        root.title(window_title)
        icon_path = Matrices.parent / "logo.ico"
        root.iconbitmap(icon_path)
        root.geometry("600x400")
        root.resizable(False, False)

        # Tamaño inicial de la fuente
        font_size = tk.IntVar(value=10)

        # Crear un Canvas para contener el widget Text
        canvas = tk.Canvas(root, bg="white")
        canvas.pack(fill=tk.BOTH, expand=True)

        # Crear un Frame dentro del Canvas
        frame = tk.Frame(canvas, bg="black")
        frame.pack(fill=tk.BOTH, expand=True)

        # Crear un widget Text para mostrar la matriz
        text_widget = tk.Text(frame, wrap=tk.NONE, font=("Courier", font_size.get()), fg="white", bg="black")
        text_widget.grid(row=0, column=0, sticky="nsew")

        # Añadir scrollbars
        scrollbar_y = tk.Scrollbar(frame, orient=tk.VERTICAL, command=text_widget.yview)
        scrollbar_y.grid(row=0, column=1, sticky="ns")
        scrollbar_x = tk.Scrollbar(frame, orient=tk.HORIZONTAL, command=text_widget.xview)
        scrollbar_x.grid(row=1, column=0, sticky="ew")
        text_widget.config(yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)

        # Configurar redimensionamiento
        frame.grid_rowconfigure(0, weight=1)
        frame.grid_columnconfigure(0, weight=1)

        # Convertir la matriz a texto y mostrarla
        matrix_text = df.to_string(index=False, header=False)
        text_widget.insert("1.0", matrix_text)
        text_widget.config(state=tk.DISABLED)

        # Funcionalidad de zoom con Ctrl + más/menos
        def adjust_zoom(change):
            current_size = font_size.get()
            new_size = current_size + change
            if 1 <= new_size <= 20:
                font_size.set(new_size)
                text_widget.config(font=("Courier", font_size.get()))
        root.bind("<Control-plus>", lambda event: adjust_zoom(1))
        root.bind("<Control-minus>", lambda event: adjust_zoom(-1))

        # Zoom con Ctrl + rueda del ratón
        def mouse_wheel(event):
            if event.state & 0x4:
                if event.delta > 0:
                    adjust_zoom(1)
                else:
                    adjust_zoom(-1)
        root.bind("<MouseWheel>", mouse_wheel)

        # Desplazamiento con teclas de flecha
        text_widget.bind("<Up>", lambda e: text_widget.yview_scroll(-2, "units"))
        text_widget.bind("<Down>", lambda e: text_widget.yview_scroll(2, "units"))
        text_widget.bind("<Left>", lambda e: text_widget.xview_scroll(-9, "units"))
        text_widget.bind("<Right>", lambda e: text_widget.xview_scroll(9, "units"))

        # Menú de opciones para pantalla completa
        def toggle_fullscreen():
            is_fullscreen = root.attributes("-fullscreen")
            root.attributes("-fullscreen", not is_fullscreen)
        def exit_fullscreen(event=None):
            root.attributes("-fullscreen", False)
        menu_bar = tk.Menu(root)
        view_menu = tk.Menu(menu_bar, tearoff=0)
        view_menu.add_command(label="Pantalla Completa", command=toggle_fullscreen)
        view_menu.add_command(label="Salir de Pantalla Completa", command=exit_fullscreen)
        menu_bar.add_cascade(label="Opciones", menu=view_menu)
        root.config(menu=menu_bar)

        # --- Funcionalidad para resaltar número al hacer clic ---
        # Configuramos el tag "highlight" para colorear de rojo
        text_widget.tag_configure("highlight", background="red")
        def on_click(event):
            # Habilitamos temporalmente para modificar el contenido
            text_widget.config(state="normal")
            index = text_widget.index("@%d,%d" % (event.x, event.y))
            # Quitar cualquier resaltado previo
            text_widget.tag_remove("highlight", "1.0", tk.END)
            # Determinar el inicio y fin de la palabra (celda) clickeada
            start_index = text_widget.index("%s wordstart" % index)
            end_index = text_widget.index("%s wordend" % index)
            selected_text = text_widget.get(start_index, end_index)
            try:
                float(selected_text)
                # Si es un número, aplicar el tag "highlight"
                text_widget.tag_add("highlight", start_index, end_index)
            except ValueError:
                pass
            text_widget.config(state="disabled")
        text_widget.bind("<Button-1>", on_click)
        # --- Fin funcionalidad ---

        root.mainloop()

    except Exception as e:
        print(f"Error al abrir la matriz: {e}")
