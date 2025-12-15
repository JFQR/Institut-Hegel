from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import os

# Ruta a una imagen muy pesada (3000x3000 px o más)
IMAGE_PATH = "big-image.png"  # Usa PNG para más peso
OUTPUT_PATH = "local_test.pdf"
REPEAT_COUNT = 2000 # Más páginas = más peso

def generate_heavy_pdf(image_path, output_path, repeat_count):
    if not os.path.exists(image_path):
        print("⚠️ La imagen no existe:", image_path)
        return

    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    for i in range(repeat_count):
        c.drawImage(image_path, 0, 0, width=width, height=height)
        c.showPage()
        print(f"Página {i+1}/{repeat_count} añadida...")

    c.save()
    print(f"✅ PDF generado: {output_path}")

generate_heavy_pdf(IMAGE_PATH, OUTPUT_PATH, REPEAT_COUNT)

