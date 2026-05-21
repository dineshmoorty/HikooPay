from PIL import Image, ImageDraw, ImageFont
import os

# Ensure assets/icons directory exists
os.makedirs('assets/icons', exist_ok=True)

def create_icon(size):
    """Create a PNG icon with green circle and HK text"""
    img = Image.new('RGBA', (size, size), color=(15, 23, 36, 0))  # Transparent
    draw = ImageDraw.Draw(img)
    
    # Draw green circle background
    circle_color = (110, 231, 183, 255)  # #6ee7b7 (hikoo green)
    margin = int(size * 0.1)
    draw.ellipse([margin, margin, size-margin, size-margin], fill=circle_color)
    
    # Draw "HK" text
    try:
        font = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", int(size * 0.4))
    except:
        font = ImageFont.load_default()
    
    text = "HK"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - int(size * 0.05)
    
    draw.text((text_x, text_y), text, fill=(4, 49, 58, 255), font=font)  # Dark text
    
    return img

# Create 192x192 icon
icon_192 = create_icon(192)
icon_192.save('assets/icons/icon-192.png')
print("Created icon-192.png")

# Create 512x512 icon
icon_512 = create_icon(512)
icon_512.save('assets/icons/icon-512.png')
print("Created icon-512.png")

print("PNG icons created successfully!")
