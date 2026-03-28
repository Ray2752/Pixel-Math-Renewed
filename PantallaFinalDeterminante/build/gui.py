from pathlib import Path
from PIL import Image,ImageTk
import sys
from tkinter import Tk, Canvas, Button, PhotoImage,messagebox
import customtkinter as ctk
import threading


# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.utils.MostrarMatrices import open_matrix_interface
from src.utils.DescargarArchivos import descargar_archivo
from src.utils.Redim_Imgs import redimencionar_imagenes
from src.utils.CambiarDePantallas import Desplazarse_a
from src.Operaciones_Mat.CalcularDeterminante import calcular_determinante
from src.utils.CrearImgsFinales import generar_imagen_numerica
from src.Operaciones_Mat.CalcularDeterminante import crear_imagen_determinante2
 
# Configurar customtkinter
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = BASE_DIR / "assets" / "frame0"
RutaNav = Path(__file__).resolve().parent.parent.parent
Img_nums= RutaNav/"imagenes"/"matricesimgs"
Matrices = RutaNav/"imagenes"/"matricestablas"
Img_prcs= RutaNav/"imagenes"/"ImgsProcesadas"
RutaMatrizDeterminante = Matrices/"MatrizFinal.xlsx"
RutaMapColores = Matrices/"Tabladecolores.xlsx"
RtimgDeterminante =  RutaNav/"imagenes"/"matricesimgs"/"ImagenNumFinal.png"

Imagen_matrizNumericaOriginal = Img_nums/"ImagenNumOriginal.png"
Imagen_matrizNumericaRotada= Img_nums/"ImagenNumFinal.png"
ImagenOriginal= Img_prcs/"imagen_pixeleada_pixeleada.png"
ImagenDetermiante = Img_prcs/"ImagenFinal.png"
MatrizOriginal =  Matrices / "MatrizOriginal.xlsx"


# Variables globales para mantener las imágenes

global_image_5 = None
global_image_6 = None
texto_id = None


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)



def resize_image(image_path, width, height):
    img = Image.open(image_path)
    img = img.resize((width, height), Image.LANCZOS)
    resized_image = ImageTk.PhotoImage(img)
    return resized_image

def inicializar_canvas():
    global texto_id
    texto_id = canvas.create_text(
        502.0,
        908.0,
        anchor="nw",
        text="...",
        fill="#B1BCC6",
        font=("Manrope Bold", 16 * -1)
    )




def ejecutartodo():
    global global_image_5, global_image_6
    
    MatrizDeterminante, determinante = calcular_determinante(MatrizOriginal, RutaMatrizDeterminante)
    crear_imagen_determinante2(
        RutaMatrizDeterminante,
        RutaMapColores,
        ImagenDetermiante
    )
    
    generar_imagen_numerica(
        MatrizDeterminante,
        RtimgDeterminante, 
        10
    )

    # Cargar nuevas imágenes redimensionadas
    image_5_path = ImagenDetermiante
    global_image_5 = resize_image(image_5_path, 280, 280)  # Carga y redimensiona la imagen
    canvas.itemconfig(image_5, image=global_image_5)  # Actualiza la imagen en el canvas
    
    image_6_path = Imagen_matrizNumericaRotada
    global_image_6 = resize_image(image_6_path, 280, 280)
    canvas.itemconfig(image_6, image=global_image_6)  # Actualiza la imagen en el canvas

    # Actualiza el texto del determinante
    canvas.itemconfig(texto_id, text=f"{determinante}")

    # Mostrar mensaje con el resultado
    messagebox.showinfo("Determinante Calculado", f"El determinante de la matriz es: {determinante}")
    button_6.place(x=541.0, y=800.0, width=99.0, height=33.0)
    button_7.place(x=873.0, y=799.0, width=83.0, height=34.0)
    button_3.place(x=755.0, y=798.0, width=102.0, height=35.0)



window = ctk.CTk()
window.title("Pixel-math")  
window.configure(bg = "#121A21")

# Dimensiones de la ventana
window_width = 1280
window_height = 995

# Resolución Full HD
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight() - 80

# Calcular la posición en el centro
position_top = int(screen_height / 2 - window_height / 2)
position_right = int(screen_width / 2 - window_width / 2)

# Configurar la geometría de la ventana
window.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")
window.configure(bg="#121A21")

window.iconbitmap(RutaNav / "imagenes" / "logo.ico")

canvas = Canvas(
    window,
    bg="#121A21",
    height=995,
    width=1280,
    bd=0,
    highlightthickness=0,
    relief="ridge"
)

canvas.place(x=0, y=0)
canvas.create_rectangle(
    -0.998291015625,
    54.5,
    1280.0052490234375,
    55.5,
    fill="#E0D9D9",
    outline=""
)

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaCgDeterminante"),
    relief="flat"
)
button_1.place(
    x=7.0,
    y=2.0,
    width=196.0,
    height=46.0
)


button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Determinante","MatrizFinal.xlsx"),
    relief="flat"
)
button_3.place(
    x=755.0,
    y=798.0,
    width=102.0,
    height=35.0
)


button_image_4 = PhotoImage(
    file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizOriginal, "excel"),
    relief="flat"
)
button_4.place(
    x=869.0,
    y=478.0,
    width=101.0,
    height=28.0
)

button_image_5 = PhotoImage(
    file=relative_to_assets("button_5.png"))
button_5 = Button(
    image=button_image_5,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ImagenOriginal,"imagen"),
    relief="flat"
)
button_5.place(
    x=519.0,
    y=479.0,
    width=154.0,
    height=28.0
)

button_image_6 = PhotoImage(
    file=relative_to_assets("button_6.png"))
button_6 = Button(
    image=button_image_6,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ImagenDetermiante,"imagen"),
    relief="flat"
)
button_6.place(
    x=541.0,
    y=800.0,
    width=99.0,
    height=33.0
)

button_image_7 = PhotoImage(
    file=relative_to_assets("button_7.png"))
button_7 = Button(
    image=button_image_7,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(RutaMatrizDeterminante, "excel"),
    relief="flat"
)
button_7.place(
    x=873.0,
    y=799.0,
    width=83.0,
    height=34.0
)

button_image_8 = PhotoImage(
    file=relative_to_assets("button_8.png"))
button_8 = Button(
    image=button_image_8,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Original","MatrizOriginal.xlsx"),
    relief="flat"
)
button_8.place(
    x=755.0,
    y=478.0,
    width=108.0,
    height=28.0
)


button_image_22 = PhotoImage(
    file=relative_to_assets("button_22.png"))
button_22 = Button(
    image=button_image_22,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_22.place(
    x=1192.0,
    y=7.0,
    width=60.0,
    height=37.0
)


# Ocultar los botones al inicio
button_6.place_forget()
button_7.place_forget()
button_3.place_forget()


image_image_1 = PhotoImage(
    file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(
    119.0,
    28.0,
    image=image_image_1
)

image_image_2 = PhotoImage(
    file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(
    640.0,
    135.0,
    image=image_image_2
)


image_3_path = relative_to_assets(ImagenOriginal)
image_image_3 = redimencionar_imagenes(image_3_path,  280, 280)
image_3 = canvas.create_image( 477.0, 331.0, image=image_image_3)



image_4_path = relative_to_assets(Imagen_matrizNumericaOriginal)
image_image_4 = redimencionar_imagenes(image_4_path,  280, 280)
image_4 = canvas.create_image( 800, 331, image=image_image_4)




image_image_5 = PhotoImage(
    file=relative_to_assets("image_5.png"))
image_5 = canvas.create_image(
    477.0,
    653.0,
    image=image_image_5
)

image_image_6 = PhotoImage(
    file=relative_to_assets("image_6.png"))
image_6 = canvas.create_image(
    800.0,
    653.0,
    image=image_image_6
)

button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=ejecutartodo,
    relief="flat"
)
button_2.place(
    x=321.0,
    y=835.0,
    width=508.0,
    height=42.0
)

image_image_7 = PhotoImage(
    file=relative_to_assets("image_7.png"))
image_7 = canvas.create_image(
    575.0,
    919.0,
    image=image_image_7
)



# Inicialmente ocultar botones
button_6.pack_forget()
button_7.pack_forget()
button_3.pack_forget()

canvas.create_text(
    502.0,
    908.0,
    anchor="nw",
    text="",
    fill="#B1BCC6",
    font=("Manrope Bold", 16 * -1)
)
inicializar_canvas()





window.resizable(False, False)
window.mainloop()
