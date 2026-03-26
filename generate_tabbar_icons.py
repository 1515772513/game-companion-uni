#!/usr/bin/env python3
"""
Generate tabbar icons for game-companion-uni app
Creates home, order, message, and profile icons in both inactive and active states
"""

from PIL import Image, ImageDraw
import os

def create_directory(path):
    """Create directory if it doesn't exist"""
    if not os.path.exists(path):
        os.makedirs(path)

def draw_home_icon(draw, color, offset_x=0, offset_y=0):
    """Draw home icon"""
    # House body
    points = [
        (20 + offset_x, 40 + offset_y),  # bottom left
        (40 + offset_x, 25 + offset_y),  # top
        (60 + offset_x, 40 + offset_y),  # bottom right
        (60 + offset_x, 60 + offset_y),  # bottom right corner
        (20 + offset_x, 60 + offset_y),  # bottom left corner
    ]
    draw.polygon(points, fill=color)

    # Door
    draw.rectangle([35 + offset_x, 45 + offset_y, 45 + offset_x, 60 + offset_y], fill='white')

def draw_order_icon(draw, color, offset_x=0, offset_y=0):
    """Draw order/document icon"""
    # Document shape
    draw.rectangle([25 + offset_x, 20 + offset_y, 55 + offset_x, 60 + offset_y], fill=color)

    # Lines inside
    line_color = 'white'
    draw.rectangle([30 + offset_x, 30 + offset_y, 50 + offset_x, 35 + offset_y], fill=line_color)
    draw.rectangle([30 + offset_x, 38 + offset_y, 50 + offset_x, 43 + offset_y], fill=line_color)
    draw.rectangle([30 + offset_x, 46 + offset_y, 45 + offset_x, 51 + offset_y], fill=line_color)

def draw_message_icon(draw, color, offset_x=0, offset_y=0):
    """Draw message icon"""
    # Message bubble
    points = [
        (20 + offset_x, 20 + offset_y),  # top left
        (60 + offset_x, 20 + offset_y),  # top right
        (60 + offset_x, 50 + offset_y),  # right
        (50 + offset_x, 60 + offset_y),  # bottom point
        (40 + offset_x, 50 + offset_y),  # left of point
        (20 + offset_x, 50 + offset_y),  # left
    ]
    draw.polygon(points, fill=color)

    # Dots for messages
    draw.ellipse([30 + offset_x, 32 + offset_y, 36 + offset_x, 38 + offset_y], fill='white')
    draw.ellipse([40 + offset_x, 32 + offset_y, 46 + offset_x, 38 + offset_y], fill='white')
    draw.ellipse([50 + offset_x, 32 + offset_y, 56 + offset_x, 38 + offset_y], fill='white')

def draw_profile_icon(draw, color, offset_x=0, offset_y=0):
    """Draw profile icon"""
    # Head
    draw.ellipse([30 + offset_x, 20 + offset_y, 50 + offset_x, 40 + offset_y], fill=color)

    # Body
    points = [
        (20 + offset_x, 65 + offset_y),  # bottom left
        (20 + offset_x, 55 + offset_y),  # top left
        (35 + offset_x, 45 + offset_y),  # neck left
        (45 + offset_x, 45 + offset_y),  # neck right
        (60 + offset_x, 55 + offset_y),  # top right
        (60 + offset_x, 65 + offset_y),  # bottom right
    ]
    draw.polygon(points, fill=color)

def generate_icon(filename, icon_draw_func, color, size=81):
    """Generate a single icon"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Draw the icon
    icon_draw_func(draw, color)

    # Save the image
    img.save(filename, 'PNG')
    print(f"Created: {filename}")

def main():
    # Define colors
    inactive_color = '#999999'  # Gray for inactive state
    active_color = '#4285f4'    # Blue for active state

    # Define icon drawing functions
    icons = [
        ('home', draw_home_icon),
        ('order', draw_order_icon),
        ('message', draw_message_icon),
        ('profile', draw_profile_icon),
    ]

    # Create tabbar directory
    tabbar_dir = '/home/kemove/ai_dev_projects/PRJ-20260325135440/game-companion-uni/branchs/sit/static/tabbar'
    create_directory(tabbar_dir)

    # Generate all icons
    for icon_name, draw_func in icons:
        # Inactive version (gray)
        inactive_file = os.path.join(tabbar_dir, f'{icon_name}.png')
        generate_icon(inactive_file, draw_func, inactive_color)

        # Active version (blue)
        active_file = os.path.join(tabbar_dir, f'{icon_name}-active.png')
        generate_icon(active_file, draw_func, active_color)

    print("\nAll tabbar icons generated successfully!")
    print(f"Location: {tabbar_dir}")

if __name__ == '__main__':
    main()
