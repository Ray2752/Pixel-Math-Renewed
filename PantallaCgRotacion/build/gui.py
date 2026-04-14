import sys
import os
from pathlib import Path
from tkinter import  Canvas, Button, PhotoImage, filedialog, messagebox
from PIL import Image, ImageTk
import customtkinter as ctk
import threading



# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.Filtros.SimplificarColores import simplificar_colores
from src.Filtros.ConvertPixelart import pixelar_imagen
from src.utils.ObtenerMatricesNum import GenerarMatrices
from src.Operaciones_Mat.RotarMatriz import RotarMatriz
from src.utils.CrearImgsFinales import CrearImagenesFinales
from src.utils.CambiarDePantallas import Desplazarse_a
from src.utils.CambiarDePantallas import ejecutar_script
from src.utils.PantallaDecarga import mostrar_barra_progreso

# Configurar customtkinter
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

BASE_DIR = Path(__file__).resolve().parent
RutaNav = Path(__file__).resolve().parent.parent.parent
ASSETS_PATH = BASE_DIR / "assets" / "frame0"
Img_prcs= RutaNav/"imagenes"/"ImgsProcesadas"
Matrices = RutaNav/"imagenes"/"matricestablas"
Img_matrices =  RutaNav/"imagenes"/"matricesimgs"
MatrizOriginal = Matrices/"MatrizOriginal.xlsx"
RutaMatrizRotada = Matrices/"MatrizFinal.xlsx"
ImagenNumericaRotacion =  RutaNav/"imagenes"/"matricesimgs"/"ImagenNumFinal.png"
ImagenRotada = Img_prcs / "ImagenFinal.png"
imag_a_procesar=None


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


#Funciones Para el procesamiento u operaciones------------------------------------------------------------------------------------------------------------------------------
def Agregarlaimagen():
    global imag_a_procesar
    # Definir los tipos de archivo permitidos
    filetypes = [("Image Files", "*.png;*.jpg;*.jpeg;*.bmp;*.gif")]

    # Abrir el diálogo para seleccionar una imagen
    file_handle = filedialog.askopenfile(mode="rb", filetypes=filetypes)
    if file_handle:
        try:
            suffix = Path(file_handle.name).suffix.lower() or ".png"
            carpeta_tmp = Img_prcs / "tmp_uploads"
            carpeta_tmp.mkdir(parents=True, exist_ok=True)
            file_path = carpeta_tmp / f"imagen_rotacion{suffix}"
            try:
                with open(file_path, "wb") as salida:
                    salida.write(file_handle.read())
            except OSError as error:
                messagebox.showerror(
                    "Error al leer archivo",
                    "No se pudo leer el archivo seleccionado. "
                    "Si el archivo esta en iCloud, descargalo primero localmente.\n"
                    f"Detalle: {error}"
                )
                return
        finally:
            file_handle.close()

        # Guardar la ruta de la imagen cargada en la variable
        imag_a_procesar= file_path

        # Redimensionar la imagen seleccionada para su visualización
        try:
            img = Image.open(file_path)
            img = img.resize((515, 290), Image.LANCZOS)
            new_image = ImageTk.PhotoImage(img)
        except OSError as error:
            messagebox.showerror(
                "Error al abrir imagen",
                f"No se pudo abrir la imagen seleccionada.\nDetalle: {error}"
            )
            imag_a_procesar = None
            return

        # Actualizar la imagen en el canvas
        canvas.itemconfig(image_2, image=new_image)
        canvas.image_2 = new_image  # Evitar recolección de basura
        print(imag_a_procesar)
        print("fin de la funcion")

def BorrarImagen():
    global imag_a_procesar
    print(imag_a_procesar)
    # Restablecer la imagen original
    img = Image.open(relative_to_assets("image_2.png"))
    img = img.resize((515, 290), Image.LANCZOS)  # Ajustar al tamaño adecuado
    original_image = ImageTk.PhotoImage(img)

    # Actualizar la imagen en el canvas con la imagen original
    canvas.itemconfig(image_2, image=original_image)
    canvas.image_2 = original_image  # Evitar recolección de basura

    # Reiniciar la variable de la ruta de la imagen
    imag_a_procesar = None
    print(imag_a_procesar)


def HacerCuadrada(img_path):
    messagebox.showinfo("Mensaje", "La imagen no es cuadrada. Intentando hacerla cuadrada...")      
    # Abrir la imagen
    img = Image.open(img_path)
    width, height = img.size
    
    # Calcular el tamaño del nuevo cuadrado
    min_dim = min(width, height)
    
    # Redimensionar la imagen al tamaño cuadrado
    img_cuadrada = img.resize((min_dim, min_dim), Image.Resampling.LANCZOS)
    
    return img_cuadrada



def LaimagenEsCuadrada(ruta_imagen):
    try:
        with Image.open(ruta_imagen) as img:
            ancho, alto = img.size
            return ancho == alto
    except Exception as e:
        print(f"Error al abrir la imagen: {e}")
        return False

def MinimizarColores():
    global imag_a_procesar
    # Ruta de destino para la imagen procesada
    ruta_destino = Img_prcs

    # Simplificar colores de la imagen cargada
    nueva_ruta = simplificar_colores(imag_a_procesar, ruta_destino, "simplificada", 64)
    imag_a_procesar = nueva_ruta
    # Imprimir la ruta de la imagen procesada
    print(f"Imagen simplificada guardada en: {imag_a_procesar}")

def PixelearImagenes():
    global imag_a_procesar
    ruta_destino = Img_prcs
    nueva_ruta = pixelar_imagen(imag_a_procesar, ruta_destino, 10, "pixeleada")
    imag_a_procesar = nueva_ruta
    print(f"Imagen pixelada guardada en: {imag_a_procesar}")


def GenerarMatricesNumericas():
    global mapeo_color_Rotacion
    # Definir como globales para acceso posterior
    ruta_destino_excel = Matrices
    ruta_destino_img_numerica = Img_matrices
    tamaño_pixel = 10  # Tamaño de los píxeles para la matriz
    numero_inicial = 1  # Número inicial para el mapeo de colores    
    # Rutas de salida
    ruta_salida_excel = ruta_destino_excel / f"MatrizOriginal.xlsx"
    ruta_salida_mapeo = ruta_destino_excel / f"Tabladecolores.xlsx"
    ruta_salida_imagen_numerica = ruta_destino_img_numerica / f"ImagenNumOriginal.png"
    # Ejecutar la función GenerarMatrices
    numero_final, mapeo_color = GenerarMatrices(
        imag_a_procesar,
        ruta_salida_excel,
        ruta_salida_mapeo,
        ruta_salida_imagen_numerica,
        numero_inicial,
        tamaño_pixel,
        0
        )
        
        # Asignar el mapeo de colores a las variables correspondientes
    mapeo_color_Rotacion = mapeo_color
    print(f"Matriz numérica de para rotar generada en: {ruta_salida_imagen_numerica}")



def EjecutarRotacion():
    global imag_a_procesar
    estado_proceso = {"error": None}

    def procesar():
        try:
            # Comenzar procesamiento (ya asumimos que todo está preparado)
            MinimizarColores()
            PixelearImagenes()
            GenerarMatricesNumericas()
            MatrizRotada = RotarMatriz(MatrizOriginal, RutaMatrizRotada)
            CrearImagenesFinales(
                MatrizRotada,
                ImagenNumericaRotacion, 
                ImagenRotada,
                mapeo_color_Rotacion
            )
        except Exception as error:
            estado_proceso["error"] = error

    def finalizar_proceso():
        progressbar = getattr(progreso_window, "_progressbar", None)
        if progressbar is not None:
            progressbar.stop()
        if progreso_window.grab_current() == progreso_window:
            progreso_window.grab_release()
        if progreso_window.winfo_exists():
            progreso_window.destroy()

        if estado_proceso["error"] is not None:
            messagebox.showerror("Error", f"Ocurrio un error durante el procesamiento:\n{estado_proceso['error']}")
            return

        Desplazarse_a(window, "PantallaFinalRotacion")

    def monitorear_hilo():
        if hilo_procesamiento.is_alive():
            window.after(100, monitorear_hilo)
            return
        finalizar_proceso()

    # Verificar las condiciones antes de mostrar la barra de progreso
    if not imag_a_procesar:
        messagebox.showinfo("Advertencia", "No has subido ninguna imagen. Por favor, selecciona una imagen para continuar.")
        return  # Salir si no se ha seleccionado una imagen

    if not LaimagenEsCuadrada(imag_a_procesar):
        ImagenCuadrada = HacerCuadrada(imag_a_procesar)
        # Guardar la imagen cuadrada temporalmente para pasar la ruta
        temp_img_path = os.path.join(ASSETS_PATH, "temp_img.png")
        ImagenCuadrada.save(temp_img_path)
        imag_a_procesar = temp_img_path

    # Mostrar la barra de progreso antes de iniciar el procesamiento
    progreso_window = mostrar_barra_progreso(window)

    # Ejecutar el procesamiento en un hilo separado
    hilo_procesamiento = threading.Thread(target=procesar, daemon=True)
    hilo_procesamiento.start()
    monitorear_hilo()




window = ctk.CTk()
window.title("Pixel-math")  

# Dimensiones de la ventana
window_width = 515
window_height = 850

# Resolución Full HD
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()-70

# Calcular la posición en el centro
position_top = int(screen_height / 2 - window_height / 2)
position_right = int(screen_width / 2 - window_width / 2)

# Configurar la geometría de la ventana
window.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")
window.iconbitmap(RutaNav / "imagenes" / "logo.ico")
window.configure(bg="#121A21")

canvas = Canvas(
    window,
    bg="#121A21",
    height=850,
    width=515,
    bd=0,
    highlightthickness=0,
    relief="ridge"
)

canvas.place(x=0, y=0)

image_image_1 = PhotoImage(
    file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(
    257.0,
    453.0,
    image=image_image_1
)

image_image_2 = PhotoImage(
    file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(
    257.0,
    207.0,
    image=image_image_2
)

# Save a reference to the original PhotoImage of image_2
canvas.image_image_2_original = image_image_2

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda:  EjecutarRotacion(),
    relief="flat"
)
button_1.place(
    x=4.0,
    y=736.0,
    width=508.0,
    height=80.0
)

button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda:  BorrarImagen(),
    relief="flat"
)
button_2.place(
    x=265.0,
    y=522.0,
    width=186.0,
    height=62.0
)

button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Agregarlaimagen(),
    relief="flat"
)
button_3.place(
    x=72.0,
    y=522.0,
    width=183.0,
    height=62.0
)

button_image_4 = PhotoImage(
    file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_4.place(
    x=0.0,
    y=9.0,
    width=68.0,
    height=45.0
)

window.resizable(False, False)
window.mainloop()
