from pathlib import Path
from tkinter import Tk, Canvas, Button, PhotoImage,messagebox
from PIL import Image, ImageTk
import pandas as pd
import customtkinter as ctk
import sys


# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.utils.MostrarMatrices import open_matrix_interface
from src.utils.DescargarArchivos import descargar_archivo
from src.utils.CambiarDePantallas import Desplazarse_a
from src.utils.Redim_Imgs import redimencionar_imagenes

# Configurar customtkinter
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

BASE_DIR = Path(__file__).resolve().parent
RutaNav = Path(__file__).resolve().parent.parent.parent
print(RutaNav)
ASSETS_PATH = BASE_DIR / "assets" / "frame0"
Img_prcs= RutaNav/"imagenes"/"ImgsProcesadas"
Img_nums= RutaNav/"imagenes"/"matricesimgs"
Matrices = RutaNav/"imagenes"/"matricestablas"

ruta_personaje = Img_prcs/"imagen_pixeleada_personaje.png"
ruta_paisaje = Img_prcs/"imagen_pixeleada_paisaje.png"

matriz_personaje = Img_nums/"matrizPersonaje.png"
matriz_paisaje = Img_nums/"matrizPaisaje.png"

MatrizPersonajeExcel =  Matrices / "MatrizNumerica_Personaje.xlsx"
MatrizPaisajejeExcel =  Matrices / "MatrizNumerica_Paisaje.xlsx"


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)



window = ctk.CTk()
window.title("Pixel-math")  
window.configure(bg = "#121A21")

window_width = 1400
window_height = 930
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
    bg = "#121A21",
    height = 930,
    width = 1400,
    bd = 0,
    highlightthickness = 0,
    relief = "ridge"
)

canvas.place(x = 0, y = 0)
image_image_1 = PhotoImage(
    file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(
    697.0,
    91.0,
    image=image_image_1
)

image_image_2 = PhotoImage(
    file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(
    697.0,
    132.0,
    image=image_image_2
)

image_3_path = relative_to_assets(ruta_personaje)
image_image_3 = redimencionar_imagenes(image_3_path,  515, 290)
image_3 = canvas.create_image( 413, 320, image=image_image_3)

image_4_path = relative_to_assets(ruta_paisaje)
image_image_4 = redimencionar_imagenes(image_4_path,  515, 290)
image_4 = canvas.create_image( 979, 320, image=image_image_4)

image_5_path = relative_to_assets(matriz_personaje)
image_image_5 = redimencionar_imagenes(image_5_path,  367, 210)
image_5 = canvas.create_image( 491, 634, image=image_image_5)

image_6_path = relative_to_assets(matriz_paisaje)
image_image_6 = redimencionar_imagenes(image_6_path,  367, 210)
image_6 = canvas.create_image( 901, 634, image=image_image_6)


image_image_7 = PhotoImage(
    file=relative_to_assets("image_7.png"))
image_7 = canvas.create_image(
    700.0,
    25.0,
    image=image_image_7
)

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaCgSuma"),
    relief="flat"
)
button_1.place(
    x=4.0,
    y=4.0,
    width=139.0,
    height=45.0
)

button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaFinalSuma"),
    relief="flat"
)
button_2.place(
    x=66.0,
    y=828.0,
    width=1269.0,
    height=80.0
)

button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizPersonajeExcel, "excel"),
    relief="flat"
)
button_3.place(
    x=615.0,
    y=743.0,
    width=74.0,
    height=46.0
)

button_image_4 = PhotoImage(
    file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Personaje","MatrizNumerica_Personaje.xlsx"),
    relief="flat"
)
button_4.place(
    x=408.0,
    y=743.0,
    width=167.0,
    height=46.0
)


button_image_5 = PhotoImage(
    file=relative_to_assets("button_5.png"))
button_5 = Button(
    image=button_image_5,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizPaisajejeExcel, "excel"),
    relief="flat"
)
button_5.place(
    x=1025.0,
    y=743.0,
    width=73.0,
    height=46.0
)

button_image_6 = PhotoImage(
    file=relative_to_assets("button_6.png"))
button_6 = Button(
    image=button_image_6,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Paisaje","MatrizNumerica_Paisaje.xlsx"),
    relief="flat"
)
button_6.place(
    x=818.0,
    y=743.0,
    width=167.0,
    height=46.0
)

button_image_7 = PhotoImage(
    file=relative_to_assets("button_7.png"))
button_7 = Button(
    image=button_image_7,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ruta_personaje,"imagen"),
    relief="flat"
)
button_7.place(
    x=605.0,
    y=473.0,
    width=74.0,
    height=40.0
)

button_image_8 = PhotoImage(
    file=relative_to_assets("button_8.png"))
button_8 = Button(
    image=button_image_8,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ruta_paisaje,"imagen"),
    relief="flat"
)
button_8.place(
    x=714.0,
    y=473.0,
    width=74.0,
    height=40.0
)
button_image_9 = PhotoImage(
    file=relative_to_assets("button_9.png"))
button_9 = Button(
    image=button_image_9,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_9.place(
    x=1266.0,
    y=7.0,
    width=119.0,
    height=42.0
)
window.resizable(False, False)
window.mainloop()
