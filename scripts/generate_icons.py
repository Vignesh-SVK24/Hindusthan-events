import os
from PIL import Image, ImageDraw

SOURCE_PATH = r"C:\Users\selva\.gemini\antigravity\brain\1435ca27-f280-46a1-be0d-72475df2d372\.user_uploaded\media_1794916717563_cf749036.jpg"
WORKSPACE = r"C:\Users\selva\.gemini\antigravity\scratch\college-events-hub"
PUBLIC_DIR = os.path.join(WORKSPACE, "public")
APP_DIR = os.path.join(WORKSPACE, "src", "app")

im = Image.open(SOURCE_PATH).convert("RGBA")
width, height = im.size

# 1. Create a transparent circular version (cuts out white corners outside the blue ring)
# Radius is ~468px from center (509, 512)
center_x = (45 + 973) / 2
center_y = (44 + 980) / 2
radius = (928 + 936) / 4 + 2 # slightly pad to preserve the outer blue border

# High-resolution super-sampled mask for smooth anti-aliased edges
mask_scale = 4
mask_img = Image.new("L", (width * mask_scale, height * mask_scale), 0)
draw = ImageDraw.Draw(mask_img)
draw.ellipse(
    [
        (center_x - radius) * mask_scale,
        (center_y - radius) * mask_scale,
        (center_x + radius) * mask_scale,
        (center_y + radius) * mask_scale,
    ],
    fill=255,
)
mask_img = mask_img.resize((width, height), Image.Resampling.LANCZOS)

# Create transparent image
im_transparent = im.copy()
im_transparent.putalpha(mask_img)

# Solid white background image (for apple-touch-icon which does not support transparency)
im_solid = Image.new("RGBA", (width, height), (255, 255, 255, 255))
im_solid.paste(im_transparent, (0, 0), im_transparent)
im_solid = im_solid.convert("RGB")

print("Generating favicon sizes...")

# Favicon sizes
sizes = [16, 32, 48]
ico_images = []
for s in sizes:
    resized = im_transparent.resize((s, s), Image.Resampling.LANCZOS)
    ico_images.append(resized)

# Save multi-size favicon.ico in public and src/app
ico_images[0].save(
    os.path.join(PUBLIC_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=ico_images[1:],
)
ico_images[0].save(
    os.path.join(APP_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=ico_images[1:],
)

# PNG Favicons (for modern browsers)
im_transparent.resize((32, 32), Image.Resampling.LANCZOS).save(
    os.path.join(PUBLIC_DIR, "favicon-32x32.png"), "PNG"
)
im_transparent.resize((16, 16), Image.Resampling.LANCZOS).save(
    os.path.join(PUBLIC_DIR, "favicon-16x16.png"), "PNG"
)
# Next.js App Router metadata icon
im_transparent.resize((32, 32), Image.Resampling.LANCZOS).save(
    os.path.join(APP_DIR, "icon.png"), "PNG"
)

# Apple Touch Icons (180x180) - Solid white background with subtle safe padding
apple_180 = Image.new("RGBA", (180, 180), (255, 255, 255, 255))
badge_168 = im_transparent.resize((168, 168), Image.Resampling.LANCZOS)
apple_180.paste(badge_168, (6, 6), badge_168)
apple_180.convert("RGB").save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG")
apple_180.convert("RGB").save(os.path.join(APP_DIR, "apple-icon.png"), "PNG")

# Android / Mobile Web App Icons (192x192 & 512x512)
im_transparent.resize((192, 192), Image.Resampling.LANCZOS).save(
    os.path.join(PUBLIC_DIR, "icon-192.png"), "PNG"
)
im_transparent.resize((512, 512), Image.Resampling.LANCZOS).save(
    os.path.join(PUBLIC_DIR, "icon-512.png"), "PNG"
)
im_transparent.resize((512, 512), Image.Resampling.LANCZOS).save(
    os.path.join(PUBLIC_DIR, "app-icon.png"), "PNG"
)

# Maskable Android Icon (512x512 with safe-zone padding)
maskable_512 = Image.new("RGBA", (512, 512), (255, 253, 245, 255))
inner_410 = im_transparent.resize((410, 410), Image.Resampling.LANCZOS)
maskable_512.paste(inner_410, (51, 51), inner_410)
maskable_512.save(os.path.join(PUBLIC_DIR, "maskable-icon-512.png"), "PNG")

print("All icons successfully generated!")
