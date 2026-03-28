
from pathlib import Path
import importlib.util


def Desplazarse_a(window,Rt_Desp):
    window.destroy()
    ejecutar_script(Rt_Desp+"/build/gui.py")    

RutaNav = Path(__file__).resolve().parent.parent.parent
print(RutaNav)

def ejecutar_script(ruta_script):
    """
    Importa y ejecuta el archivo Python especificado en ruta_script.
    """
    ruta_completa = RutaNav / ruta_script
    module_name = ruta_completa.stem
    
    spec = importlib.util.spec_from_file_location(module_name, ruta_completa)
    module = importlib.util.module_from_spec(spec)
    
    try:
        spec.loader.exec_module(module)
    except Exception as e:
        print(f"Error al ejecutar {ruta_script}: {e}")
