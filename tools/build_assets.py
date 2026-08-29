"""Build brand assets and the optimised media library used to seed the CMS.

Outputs
-------
sharqiya_backend/uploads/media/library/*.webp        full-size (max 1920px) images
sharqiya_backend/uploads/media/library/*.thumb.webp  400px thumbnails
sharqiya_backend/src/seed/media-library.json         manifest consumed by the seeder
sharqiya_website/public, sharqiya_dashboard/public    logo / favicon / og-image
"""

import json
import os
import shutil

from PIL import Image, ImageDraw, ImageFont

ROOT = r"d:\al-sharqiya"
PHOTOS = os.path.join(ROOT, "data", "images")
PDF_IMAGES = os.path.join(ROOT, "data", "extracted", "images")
UPLOADS = os.path.join(ROOT, "sharqiya_backend", "uploads", "media", "library")
SEED_DIR = os.path.join(ROOT, "sharqiya_backend", "src", "seed")
WEBSITE_PUBLIC = os.path.join(ROOT, "sharqiya_website", "public")
DASHBOARD_PUBLIC = os.path.join(ROOT, "sharqiya_dashboard", "public")

GOLD = (218, 173, 73)
CHARCOAL = (14, 14, 16)

MAX_WIDTH = 1920
THUMB_WIDTH = 400
QUALITY = 82

# key, source file, English alt, Arabic alt, tag
LIBRARY = [
    ("gypsum-ceiling-installation", PDF_IMAGES, "p03_i1_x34.jpeg",
     "Technician fixing gypsum board to a suspended ceiling frame",
     "فني يقوم بتثبيت ألواح الجبس على هيكل السقف المستعار", "gypsum"),
    ("grc-decorative-wave-panel", PDF_IMAGES, "p02_i1_x28.jpeg",
     "Three-dimensional decorative GRC wave wall panel",
     "لوح جداري مموج ثلاثي الأبعاد من الجي آر سي", "gypsum"),
    ("painter-applying-roller-coat", PDF_IMAGES, "p02_i2_x29.jpeg",
     "Painter applying a roller coat to an interior wall",
     "دهّان يقوم بطلاء حائط داخلي بالرول", "painting"),
    ("interior-hall-painting-works", PDF_IMAGES, "p08_i2_x59.jpeg",
     "Interior hall painting works with access scaffolding",
     "أعمال دهان قاعة داخلية باستخدام السقالات", "painting"),
    ("ev-parking-epoxy-bays-daylight", PHOTOS, "IMG_0793.JPG",
     "Green epoxy electric vehicle charging bays at daylight",
     "مواقف شحن السيارات الكهربائية بطلاء إيبوكسي أخضر في النهار", "ev-parking"),
    ("ev-parking-epoxy-bays-sunset", PHOTOS, "IMG_0794.JPG",
     "Newly coated electric vehicle parking bays at sunset",
     "مواقف السيارات الكهربائية حديثة الطلاء عند الغروب", "ev-parking"),
    ("ev-parking-canopy-night", PHOTOS, "IMG_3341.JPG",
     "Shaded electric vehicle charging court finished in green epoxy at night",
     "ساحة شحن السيارات الكهربائية المظللة بطلاء إيبوكسي أخضر ليلاً", "ev-parking"),
    ("office-building-exterior-painting", PHOTOS, "IMG_4251.JPG",
     "Exterior painting of a multi-storey office building from a suspended cradle",
     "دهان الواجهة الخارجية لمبنى مكاتب متعدد الطوابق باستخدام منصة معلقة", "painting"),
    ("bus-depot-epoxy-walkway", PHOTOS, "IMG_4327.JPG",
     "Green epoxy pedestrian walkway with yellow lining inside a bus depot",
     "ممر للمشاة بطلاء إيبوكسي أخضر مع خطوط صفراء داخل مستودع الحافلات", "flooring"),
    ("workshop-bay-line-marking", PHOTOS, "IMG_4497.JPG",
     "Numbered workshop service bay with yellow epoxy line marking",
     "خليج خدمة مرقّم في الورشة مع خطوط إيبوكسي صفراء", "flooring"),
    ("warehouse-polished-floor", PHOTOS, "IMG_4601.JPG",
     "Large warehouse hall with a polished seamless floor finish",
     "قاعة مستودع كبيرة بأرضية ملساء مصقولة", "flooring"),
    ("depot-floor-yellow-lining", PHOTOS, "IMG_4642.JPG",
     "Bus depot floor with fresh yellow lane markings",
     "أرضية مستودع الحافلات مع خطوط مسارات صفراء جديدة", "flooring"),
    ("interior-corridor-finish", PHOTOS, "IMG_5408.JPG",
     "Completed interior corridor with white wall finish",
     "ممر داخلي مكتمل بتشطيب جداري أبيض", "painting"),
    ("warehouse-exterior-coating", PHOTOS, "IMG_6606.JPG",
     "Warehouse exterior after protective coating works",
     "الواجهة الخارجية لمستودع بعد أعمال الطلاء الواقي", "painting"),
    ("workshop-yellow-line-marking", PHOTOS, "IMG_6961.JPG",
     "Industrial workshop floor with yellow safety line marking",
     "أرضية ورشة صناعية مع خطوط أمان صفراء", "flooring"),
    ("warehouse-shutters-exterior", PHOTOS, "IMG_7380.JPG",
     "Warehouse facade and roller shutters prepared for coating",
     "واجهة المستودع والأبواب المتحركة الجاهزة للطلاء", "painting"),
    ("service-corridor-green-epoxy", PHOTOS, "IMG_7675.JPG",
     "Service corridor finished with seamless green epoxy flooring",
     "ممر خدمي بأرضية إيبوكسي خضراء ملساء", "flooring"),
    ("villa-exterior-classical-finish", PHOTOS, "IMG_8117.JPG",
     "Classical villa facade with fresh exterior paint finish",
     "واجهة فيلا كلاسيكية بتشطيب دهان خارجي جديد", "painting"),
    ("loading-bay-floor-marking", PHOTOS, "IMG_8352.JPG",
     "Loading bay with floor marking and protective coating",
     "منطقة تحميل مع علامات أرضية وطلاء واقٍ", "flooring"),
    ("interior-room-white-finish", PHOTOS, "IMG_8719.JPG",
     "Interior room handed over with a smooth white wall finish",
     "غرفة داخلية مسلّمة بتشطيب جداري أبيض ناعم", "painting"),
    ("mall-ev-charging-bay", PHOTOS, "IMG_9973.JPG",
     "Mall basement electric vehicle bay marked ELECTRIC VEHICLE ONLY",
     "موقف سيارات كهربائية في قبو المركز التجاري مخصص للسيارات الكهربائية فقط", "ev-parking"),
    ("mall-ev-charging-bay-wide", PHOTOS, "IMG_9974.JPG",
     "Wide view of mall electric vehicle charging bays in green epoxy",
     "منظر واسع لمواقف شحن السيارات الكهربائية بطلاء إيبوكسي أخضر", "ev-parking"),
    ("basement-ev-parking-court", PHOTOS, "IMG_9995.JPG",
     "Basement electric vehicle parking court with epoxy coating and markings",
     "ساحة مواقف السيارات الكهربائية في القبو بطلاء إيبوكسي وعلامات أرضية", "ev-parking"),
    ("basement-ev-parking-bays", PHOTOS, "IMG_9996.JPG",
     "Freshly coated basement electric vehicle parking bays",
     "مواقف سيارات كهربائية حديثة الطلاء في القبو", "ev-parking"),
    ("rta-office-building-facade", PHOTOS, "photo_1_2026-08-28_17-26-05.jpg",
     "Completed office building facade after exterior painting",
     "واجهة مبنى مكاتب مكتملة بعد أعمال الدهان الخارجي", "painting"),
]

LOGO_SRC = os.path.join(PDF_IMAGES, "p01_i1_x22.png")


def ensure_dirs() -> None:
    for path in (UPLOADS, SEED_DIR, WEBSITE_PUBLIC, DASHBOARD_PUBLIC):
        os.makedirs(path, exist_ok=True)


def build_media_library() -> list[dict]:
    manifest = []
    for key, folder, filename, alt_en, alt_ar, tag in LIBRARY:
        src = os.path.join(folder, filename)
        if not os.path.exists(src):
            print(f"  MISSING {src}")
            continue

        with Image.open(src) as img:
            img = img.convert("RGB")
            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                img = img.resize((MAX_WIDTH, round(img.height * ratio)), Image.LANCZOS)

            full_name = f"{key}.webp"
            full_path = os.path.join(UPLOADS, full_name)
            img.save(full_path, "WEBP", quality=QUALITY, method=5)

            thumb = img.copy()
            ratio = THUMB_WIDTH / thumb.width
            thumb = thumb.resize((THUMB_WIDTH, round(thumb.height * ratio)), Image.LANCZOS)
            thumb_name = f"{key}.thumb.webp"
            thumb.save(os.path.join(UPLOADS, thumb_name), "WEBP", quality=QUALITY, method=5)

            manifest.append({
                "key": key,
                "filename": full_name,
                "url": f"/uploads/media/library/{full_name}",
                "thumbUrl": f"/uploads/media/library/{thumb_name}",
                "mimeType": "image/webp",
                "size": os.path.getsize(full_path),
                "width": img.width,
                "height": img.height,
                "alt": {"en": alt_en, "ar": alt_ar},
                "folder": "media/library",
                "tag": tag,
            })
            print(f"  {key}: {img.width}x{img.height} ({os.path.getsize(full_path) // 1024} KB)")

    return manifest


def transparent_logo() -> Image.Image:
    """Knock the white background out of the gold logo mark, keeping soft edges."""
    with Image.open(LOGO_SRC) as raw:
        src = raw.convert("RGB")

    floor = min(GOLD)  # darkest channel of the brand gold
    out = Image.new("RGBA", src.size)
    src_px = src.load()
    out_px = out.load()

    for y in range(src.height):
        for x in range(src.width):
            r, g, b = src_px[x, y]
            darkest = min(r, g, b)
            if darkest >= 255:
                out_px[x, y] = (*GOLD, 0)
                continue
            alpha = round(255 * (255 - darkest) / (255 - floor))
            out_px[x, y] = (*GOLD, max(0, min(255, alpha)))

    return out.crop(out.getbbox())


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    candidates = ["arialbd.ttf", "segoeuib.ttf", "arial.ttf", "segoeui.ttf"]
    if not bold:
        candidates = ["arial.ttf", "segoeui.ttf"]
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def build_brand_assets(manifest: list[dict]) -> None:
    mark = transparent_logo()

    # Square, padded mark on transparency.
    side = max(mark.size)
    pad = round(side * 0.06)
    square = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    square.paste(mark, ((square.width - mark.width) // 2, (square.height - mark.height) // 2), mark)

    logo_512 = square.resize((512, 512), Image.LANCZOS)
    logo_192 = square.resize((192, 192), Image.LANCZOS)

    # Apple touch icon: gold mark on charcoal, no transparency.
    apple = Image.new("RGB", (180, 180), CHARCOAL)
    icon = square.resize((140, 140), Image.LANCZOS)
    apple.paste(icon, (20, 20), icon)

    # Open Graph card: charcoal field, gold mark, wordmark.
    og = Image.new("RGB", (1200, 630), CHARCOAL)
    draw = ImageDraw.Draw(og)
    og_mark = square.resize((260, 260), Image.LANCZOS)
    og.paste(og_mark, (110, 130), og_mark)

    draw.text((430, 205), "AL-SHARQIYA", font=load_font(76), fill=(255, 255, 255))
    draw.text((434, 300), "GYPSUM  •  GRC  •  FLOORING  •  PAINTING", font=load_font(24), fill=GOLD)
    draw.text((434, 348), "United Arab Emirates  —  Since 1986", font=load_font(24, bold=False),
              fill=(150, 150, 155))
    draw.rectangle([(430, 285), (700, 289)], fill=GOLD)

    for public in (WEBSITE_PUBLIC, DASHBOARD_PUBLIC):
        logo_512.save(os.path.join(public, "logo-mark.png"))
        logo_192.save(os.path.join(public, "logo-mark-192.png"))
        apple.save(os.path.join(public, "apple-touch-icon.png"))
        og.save(os.path.join(public, "og-image.jpg"), quality=90)
        square.resize((64, 64), Image.LANCZOS).save(
            os.path.join(public, "favicon.ico"),
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        )
        print(f"  brand assets -> {public}")

    # The logo also belongs in the media library so the CMS can reference it.
    logo_512.convert("RGB").save(os.path.join(UPLOADS, "logo-mark.webp"), "WEBP", quality=90)
    logo_192.convert("RGB").save(os.path.join(UPLOADS, "logo-mark.thumb.webp"), "WEBP", quality=90)
    manifest.insert(0, {
        "key": "logo-mark",
        "filename": "logo-mark.webp",
        "url": "/uploads/media/library/logo-mark.webp",
        "thumbUrl": "/uploads/media/library/logo-mark.thumb.webp",
        "mimeType": "image/webp",
        "size": os.path.getsize(os.path.join(UPLOADS, "logo-mark.webp")),
        "width": 512,
        "height": 512,
        "alt": {"en": "Al-Sharqiya logo mark", "ar": "شعار الشرقية"},
        "folder": "media/library",
        "tag": "brand",
    })


def main() -> None:
    ensure_dirs()
    print("Building media library...")
    manifest = build_media_library()
    print("Building brand assets...")
    build_brand_assets(manifest)

    out = os.path.join(SEED_DIR, "media-library.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)
    print(f"\n{len(manifest)} media records -> {out}")

    total = sum(item["size"] for item in manifest)
    print(f"library size: {total / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
