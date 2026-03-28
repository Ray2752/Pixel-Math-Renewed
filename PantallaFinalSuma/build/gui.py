from pathlib import Path
from tkinter import Tk, Canvas, Button, PhotoImage
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
OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = BASE_DIR / "assets" / "frame0"
RutaNav = Path(__file__).resolve().parent.parent.parent
Img_nums= RutaNav/"imagenes"/"matricesimgs"
Img_prcs= RutaNav/"imagenes"/"ImgsProcesadas"

matriz_personaje = Img_nums/"matrizPersonaje.png"
matriz_paisaje = Img_nums/"matrizPaisaje.png"

Matrices = RutaNav/"imagenes"/"matricestablas"
matriz_personaje = Img_nums/"matrizPersonaje.png"
matriz_paisaje = Img_nums/"matrizPaisaje.png"
matriz_final = Img_nums/"ImagenNumericaSuma.png"
imagenSuma= Img_prcs / "imagenSuma.png"
MatrizSuma =  Matrices / "MatrizFinal.xlsx"
MatrizPersonajeExcel =  Matrices / "MatrizNumerica_Personaje.xlsx"
MatrizPaisajejeExcel =  Matrices / "MatrizNumerica_Paisaje.xlsx"

def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


window = ctk.CTk()
window.title("Pixel-math")  
window.configure(bg = "#121A21")

window_width = 1409
window_height = 898
# Resolución Full HD
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()-85

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
    height = 898,
    width = 1409,
    bd = 0,
    highlightthickness = 0,
    relief = "ridge"
)

canvas.place(x = 0, y = 0)


image_1_path = relative_to_assets(imagenSuma)
image_image_1 = redimencionar_imagenes(image_1_path,  664, 374)
image_1 = canvas.create_image( 397, 340, image=image_image_1)



image_2_path = relative_to_assets(matriz_final)
image_image_2 = redimencionar_imagenes(image_2_path,  536, 306)
image_2 = canvas.create_image( 1076, 680, image=image_image_2)



image_3_path = relative_to_assets(matriz_personaje)
image_image_3 = redimencionar_imagenes(image_3_path,  229, 131)
image_3 = canvas.create_image( 251, 690, image=image_image_3)


image_image_4 = PhotoImage(
    file=relative_to_assets("image_4.png"))
image_4 = canvas.create_image(
    1077.0,
    414.0,
    image=image_image_4
)

image_image_5 = PhotoImage(
    file=relative_to_assets("image_5.png"))
image_5 = canvas.create_image(
    1076.0,
    215.0,
    image=image_image_5
)


image_6_path = relative_to_assets(matriz_paisaje)
image_image_6 = redimencionar_imagenes(image_6_path,  229, 131)
image_6 = canvas.create_image( 542, 690, image=image_image_6)


image_image_7 = PhotoImage(
    file=relative_to_assets("image_7.png"))
image_7 = canvas.create_image(
    1077.0,
    314.0,
    image=image_image_7
)

image_image_8 = PhotoImage(
    file=relative_to_assets("image_8.png"))
image_8 = canvas.create_image(
    704.0,
    25.0,
    image=image_image_8
)

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaSuma"),
    relief="flat"
)
button_1.place(
    x=4.0,
    y=3.0,
    width=127.0,
    height=46.0
)

image_image_9 = PhotoImage(
    file=relative_to_assets("image_9.png"))
image_9 = canvas.create_image(
    397.0,
    690.0,
    image=image_image_9
)

image_image_10 = PhotoImage(
    file=relative_to_assets("image_10.png"))
image_10 = canvas.create_image(
    732.0,
    678.0,
    image=image_image_10
)


button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Suma","MatrizFinal.xlsx"),
    relief="flat"
)
button_2.place(
    x=920.0,
    y=835.0,
    width=292.0,
    height=40.0
)


button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizSuma, "excel"),
    relief="flat"
)
button_3.place(
    x=1268.0,
    y=835.0,
    width=85.0,
    height=40.0
)


button_image_4 = PhotoImage(
    file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(imagenSuma,"imagen"),
    relief="flat"
)
button_4.place(
    x=307.0,
    y=531.0,
    width=181.0,
    height=40.0
)


button_image_7 = PhotoImage(
    file=relative_to_assets("button_7.png"))
button_7 = Button(
    image=button_image_7,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizPaisajejeExcel, "excel"),
    relief="flat"
)
button_7.place(
    x=615.0,
    y=758.0,
    width=49.0,
    height=46.0
)

button_image_8 = PhotoImage(
    file=relative_to_assets("button_8.png"))
button_8 = Button(
    image=button_image_8,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Paisaje","MatrizNumerica_Paisaje.xlsx"),
    relief="flat"
)
button_8.place(
    x=478.0,
    y=757.0,
    width=128.0,
    height=46.0
)

button_image_9 = PhotoImage(
    file=relative_to_assets("button_9.png"))
button_9 = Button(
    image=button_image_9,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizPersonajeExcel, "excel"),
    relief="flat"
)
button_9.place(
    x=326.0,
    y=757.0,
    width=57.0,
    height=46.0
)


button_image_10 = PhotoImage(
    file=relative_to_assets("button_10.png"))
button_10 = Button(
    image=button_image_10,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Personaje","MatrizNumerica_Personaje.xlsx"),
    relief="flat"
)
button_10.place(
    x=187.0,
    y=757.0,
    width=128.0,
    height=46.0
)

button_image_11 = PhotoImage(
    file=relative_to_assets("button_11.png"))
button_11 = Button(
    image=button_image_11,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_11.place(
    x=1281.0,
    y=6.0,
    width=119.0,
    height=42.0
)
image_image_11 = PhotoImage(
    file=relative_to_assets("image_11.png"))
image_11 = canvas.create_image(
    396.0,
    136.0,
    image=image_image_11
)

canvas.create_rectangle(
    0.0,
    237.0,
    65.0,
    443.0,
    fill="#D9D9D9",
    outline="")

canvas.create_rectangle(
    1344.0,
    577.0,
    1409.0,
    783.0,
    fill="#D9D9D9",
    outline="")
window.resizable(False, False)
window.mainloop()
