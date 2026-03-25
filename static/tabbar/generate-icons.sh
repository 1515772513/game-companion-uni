#!/bin/bash

# TabBar 图标生成脚本
# 使用 ImageMagick 或 Python 生成简单的 TabBar 图标

cd "$(dirname "$0")"

# 方法1: 使用 ImageMagick (如果已安装)
if command -v convert &> /dev/null; then
    echo "使用 ImageMagick 生成图标..."

    # 灰色图标 (未选中状态)
    convert -size 81x81 xc:#999999 -gravity center -pointsize 40 -fill white -annotate +0+0 "⌂" home.png
    convert -size 81x81 xc:#FF6B00 -gravity center -pointsize 40 -fill white -annotate +0+0 "⌂" home-active.png

    convert -size 81x81 xc:#999999 -gravity center -pointsize 40 -fill white -annotate +0+0 "📋" order.png
    convert -size 81x81 xc:#FF6B00 -gravity center -pointsize 40 -fill white -annotate +0+0 "📋" order-active.png

    convert -size 81x81 xc:#999999 -gravity center -pointsize 40 -fill white -annotate +0+0 "💬" message.png
    convert -size 81x81 xc:#FF6B00 -gravity center -pointsize 40 -fill white -annotate +0+0 "💬" message-active.png

    convert -size 81x81 xc:#999999 -gravity center -pointsize 40 -fill white -annotate +0+0 "👤" profile.png
    convert -size 81x81 xc:#FF6B00 -gravity center -pointsize 40 -fill white -annotate +0+0 "👤" profile-active.png

    echo "图标生成完成！"
    exit 0
fi

# 方法2: 使用 Python (如果 ImageMagick 不可用)
if command -v python3 &> /dev/null; then
    echo "使用 Python 生成图标..."
    
    python3 << 'EOFPYTHON'
from PIL import Image, ImageDraw, ImageFont
import os

# 创建简单的纯色图标作为占位符
def create_icon(filename, color):
    img = Image.new('RGB', (81, 81), color)
    # 可以在这里添加更复杂的绘制逻辑
    img.save(filename)
    print(f"创建 {filename}")

# 生成图标
icons = [
    ('home.png', '#999999'),
    ('home-active.png', '#FF6B00'),
    ('order.png', '#999999'),
    ('order-active.png', '#FF6B00'),
    ('message.png', '#999999'),
    ('message-active.png', '#FF6B00'),
    ('profile.png', '#999999'),
    ('profile-active.png', '#FF6B00'),
]

for filename, color in icons:
    create_icon(filename, color)

print("图标生成完成！")
EOFPYTHON

    exit 0
fi

# 方法3: 创建占位文件
echo "未找到 ImageMagick 或 Python，创建占位文件..."
for name in home home-active order order-active message message-active profile profile-active; do
    echo "placeholder" > ${name}.png
done
echo "占位文件已创建，请使用 icon-generator.html 生成真实图标"
