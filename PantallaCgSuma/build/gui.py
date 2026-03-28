import sys
from pathlib import Path
from tkinter import Tk, Canvas, Entry, Text, Button, PhotoImage,filedialog,messagebox
from PIL import Image,ImageTk
from pathlib import Path
import threading
import customtkinter as ctk


# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.Filtros.SimplificarColores import simplificar_colores
from src.Filtros.ConvertPixelart import pixelar_imagen
from src.utils.ObtenerMatricesNum import GenerarMatrices
from src.Operaciones_Mat.SumarMatrices import cargar_y_sumar_matrices
from src.utils.CrearImgsFinales import CrearImagenesFinales
from src.utils.CambiarDePantallas import Desplazarse_a
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
NumeroMaxpaisaje = 0
Img_nums= RutaNav/"imagenes"/"matricesimgs"

# Inicializa las variables globales
image_personaje = None
image_paisaje = None
ruta_imagen_simplificada_personaje = Img_prcs/"imgsimplificada_personaje.png"
ruta_imagen_simplificada_paisaje = Img_prcs/"imgsimplificada_paisaje.png"
ruta_imagen_pixelada_personaje = Img_prcs/"imagen_pixeleada_personaje.png"
ruta_imagen_pixelada_paisaje = Img_prcs/"imagen_pixeleada_paisaje.png"
matrizPersonaje= Matrices/"MatrizNumerica_Personaje.xlsx"
matrizPaisaje = Matrices/"MatrizNumerica_Paisaje.xlsx"
ruta_imagen_final = Img_matrices/"imagenSuma.png"
RutaMatrizSuma = Matrices/"MatrizFinal"
ImagenNumericaSuma =  Img_nums/"ImagenNumericaSuma.png"
ImagenSuma = Img_prcs / "imagenSuma.png"


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


#Funciones Para el procesamiento u operaciones------------------------------------------------------------------------------------------------------------------------------
def Agregarlaimagen(image_id):
    global image_personaje, image_paisaje
    if image_id == 'image_1':
        filetypes = [("PNG Files", "*.png")]
    else:
        filetypes = [("Image Files", ".png;.jpg;.jpeg;.bmp;*.gif")]
    # Abrir el diálogo para seleccionar una imagen
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    if file_path:
        # Guardar la ruta de la imagen cargada en la variable correspondiente
        if image_id == 'image_1':
            image_personaje = file_path
        elif image_id == 'image_2':
            image_paisaje = file_path
        # Redimencionar la imagen que eligio el usuario para que asi la pueda visualizar
        img = Image.open(file_path)
        img = img.resize((480, 270), Image.LANCZOS)  
        new_image = ImageTk.PhotoImage(img)
        # Actualizar la imagen correspondiente en el canvas
        if image_id == 'image_1':
            canvas.itemconfig(image_1, image=new_image)
            canvas.image_1 = new_image  # Evitar recolección de basura
        elif image_id == 'image_2':
            canvas.itemconfig(image_2, image=new_image)
            canvas.image_2 = new_image  # Evitar recolección de basura


def BorrarImagen(image_id):
    global image_personaje, image_paisaje
    # Restablecer la imagen original
    img = Image.open(relative_to_assets(f"{image_id}.png"))
    img = img.resize((515, 290), Image.LANCZOS)  # Asegurar que el tamaño sea el adecuado
    original_image = ImageTk.PhotoImage(img)
    # Actualizar la imagen correspondiente con la imagen original
    if image_id == 'image_1':
        print("antes")
        print(image_personaje)
        canvas.itemconfig(image_1, image=original_image)
        canvas.image_1 = original_image  # Evitar recolección de basura
        # Reiniciar la variable de la ruta de la imagen 1
        image_personaje = None
        print(image_personaje)
    elif image_id == 'image_2':
        print("antes")
        print(image_paisaje)
        canvas.itemconfig(image_2, image=original_image)
        canvas.image_2 = original_image  # Evitar recolección de basura
        # Reiniciar la variable de la ruta de la imagen 2
        image_paisaje = None
        print(image_paisaje)

def MinimizarColores():
    ruta_destino = Img_prcs
    imagenes = {"personaje": image_personaje, "paisaje": image_paisaje}
    for nombre, ruta in imagenes.items():
        nueva_ruta = simplificar_colores(ruta, ruta_destino, nombre, 64)
        print(f"Imagen de {nombre} simplificada guardada en: {nueva_ruta}")


def PixelearImagenes():
    ruta_destino = Img_prcs
    tamaño_pixel = 10  # Tamaño de pixelación deseado

    # Diccionario de imágenes simplificadas con sus nombres
    imagenes_simplificadas = {
        "paisaje": ruta_imagen_simplificada_paisaje,
        "personaje": ruta_imagen_simplificada_personaje,
    }
    for nombre, ruta_imagen in imagenes_simplificadas.items():
        nueva_ruta = pixelar_imagen(ruta_imagen, ruta_destino, tamaño_pixel, nombre)
        print(f"Imagen de {nombre} pixelada guardada en: {nueva_ruta}")


def GenerarMatricesNumericas():
    global mapeo_color_personaje, mapeo_color_paisaje, NumeroMaxpaisaje  # Definir como globales para acceso posterior
    ruta_destino_excel = Matrices
    ruta_destino_img_numerica = Img_matrices
    tamaño_pixel = 10  
    numero_inicial = 1  # Número inicial para el mapeo de colores
    # Diccionario con imágenes pixeladas y sus nombres
    imagenes_pixeladas = {
        "paisaje": ruta_imagen_pixelada_paisaje,
        "personaje": ruta_imagen_pixelada_personaje,
    }
    for nombre, ruta_imagen in imagenes_pixeladas.items():
        # Rutas de salida específicas para cada imagen
        ruta_salida_excel = ruta_destino_excel / f"MatrizNumerica_{nombre.capitalize()}.xlsx"
        ruta_salida_mapeo = ruta_destino_excel / f"Tabladecolores_{nombre.capitalize()}.xlsx"
        ruta_salida_imagen_numerica = ruta_destino_img_numerica / f"matriz{nombre.capitalize()}.png"

        # Ejecutar la función GenerarMatrices
        numero_final, mapeo_color = GenerarMatrices(
            ruta_imagen,
            ruta_salida_excel,
            ruta_salida_mapeo,
            ruta_salida_imagen_numerica,
            numero_inicial,
            tamaño_pixel,
            NumeroMaxpaisaje
        )
        # Asignar el mapeo de colores a las variables correspondientes
        if nombre == "paisaje":
            mapeo_color_paisaje = mapeo_color
            NumeroMaxpaisaje = numero_final
        elif nombre == "personaje":
            mapeo_color_personaje = mapeo_color
        numero_inicial = numero_final + 1  # Actualizar el número inicial para la siguiente imagen
        print(f"Matriz numérica de {nombre} generada en: {ruta_salida_imagen_numerica}")


def Verificar_Dimensiones():
    if image_personaje and image_paisaje:
        img1 = Image.open(image_personaje)
        img2 = Image.open(image_paisaje)
        
        if img1.size == img2.size:
            return True
        else:
            messagebox.showerror("Error", "Las imágenes no son del mismo tamaño, no se pueden sumar.")
            return False
    else:
        messagebox.showerror("Error", "Una o ambas imágenes no están cargadas.")
        return False


def Procesar_imagenes():
    def procesar():
        try:
            # Realizar las tareas de procesamiento (asumiendo que las imágenes ya son válidas)
            MinimizarColores()
            PixelearImagenes()
            GenerarMatricesNumericas()
            MatrizSuma, MapeodeColorSuma = cargar_y_sumar_matrices(
                matrizPersonaje,
                matrizPaisaje,
                mapeo_color_paisaje,
                mapeo_color_personaje,
                NumeroMaxpaisaje,
                RutaMatrizSuma
            )
            CrearImagenesFinales(
                MatrizSuma,
                ImagenNumericaSuma,
                ImagenSuma,
                MapeodeColorSuma
            )
        finally:
            # Usamos 'after' para asegurar el cierre de la ventana y el cambio de pantalla
            progreso_window.after(0, lambda: progreso_window.destroy())
            window.after(0, lambda: Desplazarse_a(window, "PantallaSuma"))  # Cambiar de pantalla en el hilo principal

    # Verificar las dimensiones antes de mostrar la barra de progreso
    if not Verificar_Dimensiones():
        return  # Salir si las imágenes no son válidas

    # Mostrar la barra de progreso antes de iniciar el procesamiento
    progreso_window = mostrar_barra_progreso(window)

    # Ejecutar el procesamiento en un hilo separado
    threading.Thread(target=procesar, daemon=True).start()


#---------------------------------------------------------------------------------------------------------------------------------------


window = ctk.CTk()
window.title("Pixel-math")  
window.geometry("1300x850")

window_width = 1300
window_height = 850

# Resolución Full HD
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()-70

# Calcular la posición en el centro
position_top = int(screen_height / 2 - window_height / 2)
position_right = int(screen_width / 2 - window_width / 2)

# Configurar la geometría de la ventana
window.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")
window.configure(bg = "#0D0B1B")

# Configura el icono de la ventana con .ico
window.iconbitmap(RutaNav / "imagenes" / "logo.ico")



canvas = Canvas(
    window,
    bg="#121A21",
    height=850,
    width=1300,
    bd=0,
    highlightthickness=0,
    relief="ridge"
)

canvas.place(x=0, y=0)
image_image_1 = PhotoImage(
    file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(
    360.0,
    286.0,
    image=image_image_1
)

canvas.create_rectangle(
    0.0,
    0.0,
    1399.0,
    58.0,
    fill="#18181D",
    outline="")

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Procesar_imagenes(),
    relief="flat"
)
button_1.place(
    x=83.0,
    y=725.0,
    width=1135.0,
    height=80.0
)

button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Agregarlaimagen('image_1'),
    relief="flat"
)
button_2.place(
    x=94.0,
    y=440.0,
    width=259.0,
    height=62.0
)

button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda:  BorrarImagen('image_1'),
    relief="flat"
)
button_3.place(
    x=372.0,
    y=440.0,
    width=255.0,
    height=62.0
)

image_image_2 = PhotoImage(
    file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(
    940.0,
    286.0,
    image=image_image_2
)

button_image_4 = PhotoImage(
    file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda:Agregarlaimagen('image_2'),
    relief="flat"
)
button_4.place(
    x=672.0,
    y=439.0,
    width=265.0,
    height=62.0
)

button_image_5 = PhotoImage(
    file=relative_to_assets("button_5.png"))
button_5 = Button(
    image=button_image_5,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: BorrarImagen('image_2'),
    relief="flat"
)
button_5.place(
    x=945.0,
    y=440.0,
    width=268.0,
    height=62.0
)

button_image_6 = PhotoImage(
    file=relative_to_assets("button_6.png"))
button_6 = Button(
    image=button_image_6,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_6.place(
    x=4.0,
    y=11.0,
    width=143.0,
    height=44.0
)


image_image_3 = PhotoImage(
    file=relative_to_assets("image_3.png"))
image_3 = canvas.create_image(
    651.0,
    635.0,
    image=image_image_3
)

image_image_4 = PhotoImage(
    file=relative_to_assets("image_4.png"))
image_4 = canvas.create_image(
    360.0,
    117.0,
    image=image_image_4
)

image_image_5 = PhotoImage(
    file=relative_to_assets("image_5.png"))
image_5 = canvas.create_image(
    940.0,
    117.0,
    image=image_image_5
)


window.resizable(False, False)
window.mainloop()