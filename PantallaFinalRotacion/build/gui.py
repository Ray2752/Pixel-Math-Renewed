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
Imagen_matrizNumericaRotada= Img_nums/"ImagenNumFinal.png"
ImagenOriginal= Img_prcs/"imagen_pixeleada_pixeleada.png"
ImagenRotada = Img_prcs/"ImagenFinal.png"
MatrizOriginal =  Matrices / "MatrizOriginal.xlsx"
MatrizRotada = matrix_file_path = Matrices / "MatrizFinal.xlsx"


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


window = ctk.CTk()
window.title("Pixel-math")  
window.geometry("1280x995")
window_width = 1280
window_height = 995



# Resolución Full HD
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()-90

# Calcular la posición en el centro
position_top = int(screen_height / 2 - window_height / 2)
position_right = int(screen_width / 2 - window_width / 2)

# Configurar la geometría de la ventana
window.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")
window.configure(bg = "#121A21")
# Configura el icono de la ventana con .ico
window.iconbitmap(RutaNav / "imagenes" / "logo.ico")

canvas = Canvas(
    window,
    bg = "#121A21",
    height = 995,
    width = 1280,
    bd = 0,
    highlightthickness = 0,
    relief = "ridge"
)

canvas.place(x = 0, y = 0)
canvas.create_rectangle(
    0.0,
    0.0,
    1280.0,
    55.0,
    fill="#18181D",
    outline="")

image_1_path = relative_to_assets(ImagenOriginal)
image_image_1 = redimencionar_imagenes(image_1_path,  280, 280)
image_1 = canvas.create_image( 478.0, 342.0, image=image_image_1)

image_2_path = relative_to_assets(ImagenRotada)
image_image_2 = redimencionar_imagenes(image_2_path,  280, 280)
image_2 = canvas.create_image( 801.0, 342.0, image=image_image_2)

image_3_path = relative_to_assets(Imagen_matrizNumericaOriginal)
image_image_3 = redimencionar_imagenes(image_3_path,  280, 280)
image_3 = canvas.create_image( 477.0, 737.0, image=image_image_3)

image_4_path = relative_to_assets(Imagen_matrizNumericaRotada)
image_image_4 = redimencionar_imagenes(image_4_path,  280, 280)
image_4 = canvas.create_image( 800.0, 737.0, image=image_image_4)


button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Original","MatrizOriginal.xlsx"),
    relief="flat"
)
button_1.place(
    x=392.0,
    y=885.0,
    width=170.0,
    height=71.0
)

button_image_2 = PhotoImage(
    file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ImagenOriginal,"imagen"),
    relief="flat"
)
button_2.place(
    x=393.0,
    y=495.0,
    width=170.0,
    height=71.0
)

button_image_3 = PhotoImage(
    file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizOriginal, "excel"),
    relief="flat"
)
button_3.place(
    x=555.0,
    y=885.0,
    width=74.0,
    height=71.0
)

button_image_4 = PhotoImage(
    file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: open_matrix_interface("Rotada","MatrizFinal.xlsx"),
    relief="flat"
)
button_4.place(
    x=715.0,
    y=885.0,
    width=170.0,
    height=71.0
)

button_image_5 = PhotoImage(
    file=relative_to_assets("button_5.png"))
button_5 = Button(
    image=button_image_5,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(MatrizRotada, "excel"),
    relief="flat"
)
button_5.place(
    x=878.0,
    y=885.0,
    width=74.0,
    height=71.0
)

button_image_6 = PhotoImage(
    file=relative_to_assets("button_6.png"))
button_6 = Button(
    image=button_image_6,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: descargar_archivo(ImagenRotada,"imagen"),
    relief="flat"
)
button_6.place(
    x=719.0,
    y=495.0,
    width=170.0,
    height=71.0
)

button_image_7 = PhotoImage(
    file=relative_to_assets("button_7.png"))
button_7 = Button(
    image=button_image_7,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaCgRotacion"),
    relief="flat"
)
button_7.place(
    x=34.0,
    y=6.0,
    width=127.0,
    height=46.0
)

button_image_8 = PhotoImage(
    file=relative_to_assets("button_8.png"))
button_8 = Button(
    image=button_image_8,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)
button_8.place(
    x=1153.0,
    y=9.0,
    width=119.0,
    height=42.0
)

image_image_5 = PhotoImage(
    file=relative_to_assets("image_5.png"))
image_5 = canvas.create_image(
    639.0,
    118.0,
    image=image_image_5
)





window.resizable(False, False)
window.mainloop()
