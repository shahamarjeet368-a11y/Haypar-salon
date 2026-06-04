import sys
import numpy as np
from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=240):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Extract RGB channels
    r, g, b, a = data.T
    
    # Define white area (where all RGB values are high)
    white_areas = (r > tolerance) & (g > tolerance) & (b > tolerance)
    
    # Set alpha channel to 0 for white areas
    data[..., 3][white_areas.T] = 0
    
    # Create new image and save
    new_img = Image.fromarray(data)
    new_img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    remove_white_bg(sys.argv[1], sys.argv[2])
