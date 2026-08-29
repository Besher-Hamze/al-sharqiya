"""Build labelled contact sheets so the photo library can be reviewed at a glance."""

import os

from PIL import Image, ImageDraw

SRC = r"d:\al-sharqiya\data\images"
OUT = r"d:\al-sharqiya\data\extracted"

COLS, ROWS = 3, 3
CELL_W, CELL_H = 420, 300
LABEL_H = 26

files = sorted(f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg", ".png")))
print(f"{len(files)} source photos")

per_sheet = COLS * ROWS
for sheet_idx in range(0, len(files), per_sheet):
    batch = files[sheet_idx : sheet_idx + per_sheet]
    sheet = Image.new("RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), "white")
    draw = ImageDraw.Draw(sheet)

    for i, name in enumerate(batch):
        col, row = i % COLS, i // COLS
        x, y = col * CELL_W, row * (CELL_H + LABEL_H)
        with Image.open(os.path.join(SRC, name)) as img:
            img = img.convert("RGB")
            img.thumbnail((CELL_W - 8, CELL_H - 8))
            sheet.paste(img, (x + 4, y + 4))
        draw.text((x + 6, y + CELL_H + 6), name, fill="black")

    n = sheet_idx // per_sheet + 1
    path = os.path.join(OUT, f"contact_sheet_{n}.jpg")
    sheet.save(path, quality=88)
    print(f"wrote {path}: {', '.join(batch)}")
