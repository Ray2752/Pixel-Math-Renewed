from pathlib import Path
from tkinter import Tk, Canvas, Button, PhotoImage
import importlib.util
import customtkinter as ctk
import sys

# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.utils.CambiarDePantallas import ejecutar_script

# Configurar customtkinter
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")


BASE_DIR = Path(__file__).resolve().parent.parent.parent
RutaNav = Path(__file__).resolve().parent.parent.parent
ASSETS_PATH = BASE_DIR / "PantallaMenu" / "build" / "assets" / "frame0"
print(BASE_DIR)

def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)

def Desplazarse_a(Rt_Desp):
    window.destroy()
    ejecutar_script(Rt_Desp+"/build/gui.py")

def Regresar():
    window.destroy()
    ejecutar_script("main.py ")  

# Configuración de la ventana de Tkinter
window = ctk.CTk()
window.title("Pixel-math")  

# Dimensiones de la ventana
window_width = 512
window_height = 942

# Resolución Full HD
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight() - 70

# Calcular la posición en el centro
position_top = int(screen_height / 2 - window_height / 2)
position_right = int(screen_width / 2 - window_width / 2)

# Configurar la geometría de la ventana
window.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")
window.configure(bg="#121A21")


# Configura el icono de la ventana con .ico
window.iconbitmap(RutaNav / "imagenes" / "logo.ico")

canvas = Canvas(
    window,
    bg="#121A21",
    height=942,
    width=512,
    bd=0,
    highlightthickness=0,
    relief="ridge"
)

canvas.place(x=0, y=0)
image_image_1 = PhotoImage(file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(256.0, 789.0, image=image_image_1)

image_image_2 = PhotoImage(file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(256.0, 590.0, image=image_image_2)

image_image_3 = PhotoImage(file=relative_to_assets("image_3.png"))
image_3 = canvas.create_image(254.0, 391.0, image=image_image_3)

image_image_4 = PhotoImage(file=relative_to_assets("image_4.png"))
image_4 = canvas.create_image(255.0, 192.0, image=image_image_4)

button_image_1 = PhotoImage(file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a("PantallaCgTranspuesta"),
    relief="flat"
)
button_1.place(x=195.0, y=412.0, width=112.3, height=43.83)

button_image_2 = PhotoImage(file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a("PantallaCgDeterminante"),
    relief="flat"
)
button_2.place(x=197.0, y=611.0, width=112.3, height=43.83)

button_image_3 = PhotoImage(file=relative_to_assets("button_3.png"))
button_3 = Button(
    image=button_image_3,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a("PantallaCgSuma"),
    relief="flat"
)
button_3.place(x=196.0, y=213.0, width=112.3, height=43.83)

button_image_4 = PhotoImage(file=relative_to_assets("button_4.png"))
button_4 = Button(
    image=button_image_4,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a("PantallaCgRotacion"),
    relief="flat"
)
button_4.place(x=197.0, y=810.0, width=112.3, height=43.83)

button_image_5 = PhotoImage(file=relative_to_assets("button_5.png"))
button_5 = Button(
    image=button_image_5,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: print("button_5 clicked"),
    relief="flat"
)
button_5.place(x=229.47, y=1007.52, width=143.06, height=58.41)

image_image_5 = PhotoImage(file=relative_to_assets("image_5.png"))
image_5 = canvas.create_image(245.0, 56.0, image=image_image_5)



button_image_6 = PhotoImage(file=relative_to_assets("button_6.png"))
button_6 = Button(
    image=button_image_6,
    borderwidth=0,
    highlightthickness=0,
    command=Regresar,
    relief="flat"
)
button_6.place(x=394.0, y=17.0, width=91.0, height=41.0)

window.resizable(False, False)
window.mainloop()

