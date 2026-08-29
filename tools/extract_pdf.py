"""Extract text, embedded images and page renders from the company profile PDF."""

import json
import os
import pymupdf

PDF = r"d:\al-sharqiya\data\profile\Sharqiya profile.pdf"
OUT = r"d:\al-sharqiya\data\extracted"

os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(OUT, "images"), exist_ok=True)
os.makedirs(os.path.join(OUT, "pages"), exist_ok=True)

doc = pymupdf.open(PDF)
print(f"pages: {doc.page_count}")

manifest = []
text_parts = []

for pno in range(doc.page_count):
    page = doc[pno]
    text = page.get_text("text")
    text_parts.append(f"\n\n===== PAGE {pno + 1} =====\n{text}")

    # Render page as PNG for visual inspection (logo/colors/layout).
    pix = page.get_pixmap(dpi=110)
    pix.save(os.path.join(OUT, "pages", f"page_{pno + 1:02d}.png"))

    for idx, info in enumerate(page.get_images(full=True)):
        xref = info[0]
        try:
            img = doc.extract_image(xref)
        except Exception as exc:  # pragma: no cover
            print(f"  skip xref {xref}: {exc}")
            continue
        ext = img["ext"]
        name = f"p{pno + 1:02d}_i{idx + 1}_x{xref}.{ext}"
        path = os.path.join(OUT, "images", name)
        with open(path, "wb") as fh:
            fh.write(img["image"])
        manifest.append(
            {
                "page": pno + 1,
                "file": name,
                "xref": xref,
                "ext": ext,
                "width": img.get("width"),
                "height": img.get("height"),
                "bytes": len(img["image"]),
            }
        )

with open(os.path.join(OUT, "text.txt"), "w", encoding="utf-8") as fh:
    fh.write("".join(text_parts))

with open(os.path.join(OUT, "images.json"), "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=2)

print(f"extracted {len(manifest)} images")
print(f"text chars: {sum(len(p) for p in text_parts)}")
