
from tkinter import ttk,messagebox  # Importar ttk para la barra de progreso
import customtkinter as ctk


def mostrar_barra_progreso(window):
    messagebox.showinfo("Mensaje", "Comenzando Proceso de procesamiento por favor espere...")
    
    # Crear una ventana emergente para mostrar la barra de progreso
    progreso_window = ctk.CTkToplevel(window)
    progreso_window.geometry("400x100")
    progreso_window.title("Procesando...")
    progreso_window.resizable(False, False)

    # Calcular la posición para centrar la ventana
    window_width = 400
    window_height = 100
    screen_width = progreso_window.winfo_screenwidth()
    screen_height = progreso_window.winfo_screenheight()
    position_top = int(screen_height / 2 - window_height / 2)
    position_right = int(screen_width / 2 - window_width / 2)
    progreso_window.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")

    # Asegura que la ventana de progreso esté siempre por encima de la ventana principal
    progreso_window.lift()
    progreso_window.grab_set()

    label = ctk.CTkLabel(progreso_window, text="Procesando imágenes, por favor espere...")
    label.pack(pady=10)
    progress = ttk.Progressbar(progreso_window, orient="horizontal", mode="indeterminate", length=300)
    progress.pack(pady=10)
    progress.start()

    # Evita que se cierre la ventana manualmente
    progreso_window.protocol("WM_DELETE_WINDOW", lambda: None)
    
    return progreso_window
