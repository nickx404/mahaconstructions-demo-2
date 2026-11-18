"""Deterministic derivatives of approved artwork. Requires Pillow; originals stay intact."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1] / 'public'
images = root / 'images'
logo = Image.open(images / 'maha-constructions-logo.png').convert('RGBA')
assert logo.size == (2001, 646), 'The approved logo changed; review the favicon crop coordinates.'
for filename in ['maha-constructions-logo.png', 'maha-constructions-logo-white.png']:
    brand_image = Image.open(images / filename)
    brand_image.thumbnail((600, 600), Image.Resampling.LANCZOS)
    brand_image.save((images / filename).with_suffix('.webp'), 'WEBP', lossless=True, method=6)
# Extract the existing roof/A symbol; do not redraw or change the approved mark.
mark = logo.crop((1590, 0, 2001, 446))
icon = Image.new('RGBA', (512, 512), 'white')
mark.thumbnail((432, 432), Image.Resampling.LANCZOS)
icon.alpha_composite(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2))
icon.save(root / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
for size, filename in [(96, 'favicon-96x96.png'), (180, 'apple-touch-icon.png')]:
    icon.resize((size, size), Image.Resampling.LANCZOS).convert('RGB').save(root / filename, optimize=True)

social = Image.new('RGB', (1200, 630), '#FAFAF6')
brand = logo.copy()
brand.thumbnail((960, 310), Image.Resampling.LANCZOS)
social.paste(brand, ((1200 - brand.width) // 2, 130), brand)
draw = ImageDraw.Draw(social)
draw.line((120, 480, 1080, 480), fill='#0D3820', width=2)
# Pillow's bundled font keeps regeneration independent of installed system fonts.
font = ImageFont.load_default(size=28)
caption = 'CHENNAI  |  SINCE 1990'
draw.text((600, 535), caption, fill='#0D3820', font=font, anchor='mm')
social.save(images / 'maha-social-preview.jpg', quality=93, optimize=True)

for name in [
    'hero-maha-kuber-desktop-v4.jpg', 'hero-maha-kuber-mobile.jpg',
    'hero-mahaa-achyuda-desktop-v2.jpg', 'hero-mahaa-achyuda-mobile-v1.jpg',
    'hero-joint-venture-banner.jpg', 'hero-joint-venture-banner-mobile.jpg',
    'maha-kuber-elevation-expanded.png', 'mahaa-achyuda-project-card-v1.jpg',
    'mahaa-achyuda-detail-hero-v1.jpg',
]:
    source = images / name
    image = Image.open(source)
    target = source.with_suffix('.webp')
    image.save(target, 'WEBP', quality=92, method=6)
    print(f'{name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes; {image.width}x{image.height}')
    if 'mobile' in name:
        image.thumbnail((800, 1400), Image.Resampling.LANCZOS)
        image.save(source.with_name(source.stem + '-800.webp'), 'WEBP', quality=92, method=6)
