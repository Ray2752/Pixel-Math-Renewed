from PIL import Image, ImageTk

def redimencionar_imagenes(image_path, width, height):
    img = Image.open(image_path)
    img = img.resize((width, height), Image.LANCZOS)
    resized_image = ImageTk.PhotoImage(img)
    return resized_image