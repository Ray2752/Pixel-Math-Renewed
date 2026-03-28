from pathlib import Path
from tkinter import Tk, Canvas, Button, PhotoImage,filedialog,messagebox
import customtkinter as ctk
import sys


# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.utils.MostrarMatrices import open_matrix_interface
from src.utils.DescargarArchivos import descargar_archivo
from src.utils.Redim_Imgs import redimencionar_imagenes
from src.utils.CambiarDePantallas import Desplazarse_a


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

Imagen_matrizNumericaOriginal = Img_nums/"ImagenNumOriginal.png"
Imagen_matrizNumericaTranspuesta= Img_nums/"ImagenNumFinal.png"
ImagenOriginal= Img_prcs/"imagen_pixeleada_pixeleada.png"
ImagenTranspuesta = Img_prcs/"ImagenFinal.png"
MatrizOriginal =  Matrices / "MatrizOriginal.xlsx"
MatrizTranspuesta = matrix_file_path = Matrices / "MatrizFinal.xlsx"


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


# Crear la ventana principal
window = ctk.CTk()
window.title("Pixel-math")  
window.geometry("1703x954")
window_width = 1703
window_height = 954

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
    bg = "#18181D",
    height = 950,
    width = 1703,
    bd = 0,
    highlightthickness = 0,
    relief = "ridge"
)

canvas.place(x = 0, y = 0)
image_image_1 = PhotoImage(
    file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(
    851.0,
    21.0,
    image=image_image_1
)

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaCgTranspuesta"),
    relief="flat"
)
button_1.place(
    x=10.0,
    y=0.0,
    width=118.0,
    height=43.0
)

button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_2.place(
    x=1590.0,
    y=2.0,
    width=105.0,
    height=40.0
)

image_image_2 = PhotoImage(
    file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(
    851.0,
    477.0,
    image=image_image_2
)

image_image_3 = PhotoImage(
    file=relative_to_assets("image_3.png"))
image_3 = canvas.create_image(
    485.0,
    476.0,
    image=image_image_3
)

image_image_4 = PhotoImage(
    file=relative_to_assets("image_4.png"))
image_4 = canvas.create_image(
    1279.0,
    543.0,
    image=image_image_4
)




image_5_path = relative_to_assets(ImagenTranspuesta)
image_image_5 = redimencionar_imagenes(image_5_path,  240, 443)
image_5 = canvas.create_image( 1136, 557, image=image_image_5)




image_image_6 = PhotoImage(
    file=relative_to_assets("image_6.png"))
image_6 = canvas.create_image(
    1136.355712890625,
    321.163330078125,
    image=image_image_6
)


image_7_path = relative_to_assets(Imagen_matrizNumericaTranspuesta)
image_image_7 = redimencionar_imagenes(image_7_path,  193, 357)
image_7 = canvas.create_image( 1424, 564, image=image_image_7)


image_image_8 = PhotoImage(
    file=relative_to_assets("image_8.png"))
image_8 = canvas.create_image(
    1422.7264404296875,
    375.69036865234375,
    image=image_image_8
)




image_9_path = relative_to_assets(ImagenOriginal)
image_image_9 = redimencionar_imagenes(image_9_path,  590, 330)
image_9 = canvas.create_image( 484, 359, image=image_image_9)


image_image_10 = PhotoImage(
    file=relative_to_assets("image_10.png"))
image_10 = canvas.create_image(
    483.88275146484375,
    172.95892333984375,
    image=image_image_10
)



image_11_path = relative_to_assets(Imagen_matrizNumericaOriginal)
image_image_11 = redimencionar_imagenes(image_11_path,  296, 164)
image_11 = canvas.create_image( 484, 676, image=image_image_11)



image_image_12 = PhotoImage(
    file=relative_to_assets("image_12.png"))
image_12 = canvas.create_image(
    484.087158203125,
    584.40283203125,
    image=image_image_12
)

button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Original","MatrizOriginal.xlsx"),
    relief="flat"
)
button_3.place(
    x=391.0,
    y=764.0,
    width=189.0,
    height=40.0
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
    x=580.0,
    y=761.0,
    width=59.0,
    height=46.0
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
    x=395.0,
    y=527.0,
    width=181.0,
    height=40.0
)

button_image_6 = PhotoImage(
    file=relative_to_assets("button_6.png"))
button_6 = Button(
    image=button_image_6,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizTranspuesta, "excel"),
    relief="flat"
)
button_6.place(
    x=1486.0,
    y=743.0,
    width=55.0,
    height=40.0
)

button_image_7 = PhotoImage(
    file=relative_to_assets("button_7.png"))
button_7 = Button(
    image=button_image_7,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ImagenTranspuesta,"imagen"),
    relief="flat"
)
button_7.place(
    x=1033.9779052734375,
    y=779.4739379882812,
    width=206.6182403564453,
    height=39.904808044433594
)

button_image_8 = PhotoImage(
    file=relative_to_assets("button_8.png"))
button_8 = Button(
    image=button_image_8,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Transpuesta","MatrizFinal.xlsx"),
    relief="flat"
)
button_8.place(
    x=1358.537109375,
    y=745.7765502929688,
    width=126.8086166381836,
    height=35.470943450927734
)

image_image_13 = PhotoImage(
    file=relative_to_assets("image_13.png"))
image_13 = canvas.create_image(
    1278.0,
    174.05410766601562,
    image=image_image_13
)

canvas.create_rectangle(
    1703.0,
    0.0,
    1736.0,
    35.0,
    fill="#FF0000",
    outline="")
window.resizable(False, False)
window.mainloop()
