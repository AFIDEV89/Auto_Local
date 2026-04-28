from rembg import remove
from PIL import Image
import io
import os

input_path = r'C:\Users\prabh\.gemini\antigravity\brain\47dac705-e767-4df3-a885-4b2e6551d41a\seat_synthesis_silhouette_1775279114634.png'
output_path = r'd:\Autoform_Local\autoform-ai-configurator\frontend\src\assets\synthesis_core.png'

# Ensure the assets directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(input_path, 'rb') as i:
    input_image = i.read()
    output_image = remove(input_image)
    
    # Save as PNG with transparency
    img = Image.open(io.BytesIO(output_image)).convert("RGBA")
    img.save(output_path, "PNG")

print(f"Synthesis Core (Seat Wireframe) extracted to {output_path}")
