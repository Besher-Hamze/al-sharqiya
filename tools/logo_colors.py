"""Sample the dominant brand colours out of the extracted logo artwork."""

from collections import Counter

import pymupdf

LOGO = r"d:\al-sharqiya\data\extracted\images\p01_i1_x22.png"

pix = pymupdf.Pixmap(LOGO)
if pix.alpha:
    pix = pymupdf.Pixmap(pix, 0)

counts = Counter()
for y in range(0, pix.height, 2):
    for x in range(0, pix.width, 2):
        px = pix.pixel(x, y)[:3]
        # Ignore near-white background and near-black text.
        if min(px) > 240 or max(px) < 30:
            continue
        counts[px] += 1

print("top colours in logo:")
for rgb, n in counts.most_common(12):
    print(f"  #{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}  rgb{rgb}  x{n}")
