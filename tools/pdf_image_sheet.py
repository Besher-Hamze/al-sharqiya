"""Contact sheet for the images embedded in the profile PDF."""

import os

from PIL import Image, ImageDraw

SRC = r"d:\al-sharqiya\data\extracted\images"
OUT = r"d:\al-sharqiya\data\extracted\pdf_images_sheet.jpg"

COLS, ROWS = 4, 4
CELL_W, CELL_H = 340, 260
LABEL_H = 24

files = sorted(f for f in os.listdir(SRC))
sheet = Image.new("RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), "white")
draw = ImageDraw.Draw(sheet)

for i, name in enumerate(files[: COLS * ROWS]):
    col, row = i % COLS, i // COLS
    x, y = col * CELL_W, row * (CELL_H + LABEL_H)
    with Image.open(os.path.join(SRC, name)) as img:
        img = img.convert("RGB")
        img.thumbnail((CELL_W - 8, CELL_H - 8))
        sheet.paste(img, (x + 4, y + 4))
    draw.text((x + 6, y + CELL_H + 5), name, fill="black")

sheet.save(OUT, quality=88)
print(f"wrote {OUT} with {len(files)} images")
