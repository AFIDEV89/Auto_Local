from PIL import Image, ImageDraw, ImageFont
import io

def apply_watermark(image_bytes, logo_path, position="bottom-right"):
    """
    Applies the Autoform watermark to the generated image.
    """
    try:
        print(f"[DEBUG] Watermark: Opening base image ({len(image_bytes)} bytes)")
        base_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
        print(f"[DEBUG] Watermark: Opening logo from {logo_path}")
        logo = Image.open(logo_path).convert("RGBA")
        
        # Resize logo to fit reasonably (e.g., 15% of width)
        base_width, base_height = base_image.size
        logo_width = int(base_width * 0.15)
        w_percent = (logo_width / float(logo.size[0]))
        h_size = int((float(logo.size[1]) * float(w_percent)))
        logo = logo.resize((logo_width, h_size), Image.Resampling.LANCZOS)
        
        # Define position
        padding = 20
        if position == "bottom-right":
            x = base_width - logo_width - padding
            y = base_height - h_size - padding
        else:
            x, y = padding, padding
            
        # Create a combined layer
        combined = Image.new("RGBA", base_image.size, (0,0,0,0))
        combined.paste(base_image, (0,0))
        combined.paste(logo, (x, y), mask=logo)
        
        # Convert back to RGB for final output
        print(f"[DEBUG] Watermark: Finalizing image merge...")
        final_img = combined.convert("RGB")
        output = io.BytesIO()
        final_img.save(output, format="JPEG", quality=95)
        print(f"[DEBUG] Watermark: Success.")
        return output.getvalue()
    except Exception as e:
        print(f"[ERROR] Watermarking failed: {e}")
        return image_bytes
