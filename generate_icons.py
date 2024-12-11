from PIL import Image, ImageDraw

def create_icon(size):
    # Create a new image with a white background
    image = Image.new('RGB', (size, size), 'white')
    draw = ImageDraw.Draw(image)
    
    # Draw a simple blue circle
    margin = size // 4
    draw.ellipse([margin, margin, size - margin, size - margin], fill='#4285f4')
    
    # Save the image
    image.save(f'public/icon{size}.png')

# Generate icons in different sizes
for size in [16, 48, 128]:
    create_icon(size) 