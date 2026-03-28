from pathlib import Path
from tkinter import Tk, Canvas, Entry, Text, Button, PhotoImage
import customtkinter as ctk
import sys

# Agrega el directorio principal del proyecto al path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from src.utils.CambiarDePantallas import Desplazarse_a


# Configurar customtkinter
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")


BASE_DIR = Path(__file__).resolve().parent
RutaNav = Path(__file__).resolve().parent
ASSETS_PATH = BASE_DIR / "build" / "assets" / "frame0"


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


window = ctk.CTk()
window.title("Pixel-math")  

# Dimensiones de la ventana
window_width = 638
window_height = 338

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
    bg = "#0D0B1B",
    height = 338,
    width = 638,
    bd = 0,
    highlightthickness = 0,
    relief = "ridge"
)

canvas.place(x = 0, y = 0)
image_image_1 = PhotoImage(
    file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(
    319.0,
    169.0,
    image=image_image_1
)

button_image_1 = PhotoImage(
    file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    command=lambda: Desplazarse_a(window,"PantallaMenu"),
    relief="flat"
)

button_1.place(
    x=233.06951904296875,
    y=211.95716857910156,
    width=173.15908813476562,
    height=39.91541290283203
)

image_image_2 = PhotoImage(
    file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(
    334.0,
    164.0,
    image=image_image_2
)

image_image_3 = PhotoImage(
    file=relative_to_assets("image_3.png"))
image_3 = canvas.create_image(
    148.0,
    119.0,
    image=image_image_3
)
window.resizable(False, False)
window.mainloop()
