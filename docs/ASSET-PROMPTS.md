# Asset prompts

Prompts for generating replacement images with an image model (Midjourney, DALL·E, Ideogram, Imagen, etc.).
After generating, drop the file into `dist/images/` with the exact filename listed and the site will pick it up.

Brand palette to reference in prompts: deep burgundy `#7A1B24`, warm cream `#F7F3EA`, charcoal `#1E1A17`, muted gold `#B8912F`.

---

## 1. Hero background — `dist/images/hero.jpg` (highest priority)

The current hero is a generic stock desk photo with a visible Google logo on a phone. Replace it with a purpose-made image.

**Target:** 1920×1080 JPEG, under 400 KB. The right third of the image is covered by a dark burgundy gradient and white text, so the visual interest should sit on the **left** half.

**Prompt:**

> Editorial photograph for the website of a boutique insurance-industry recruitment agency in Israel. A bright, modern office meeting room with floor-to-ceiling windows and soft morning light. Two professionals in smart business attire (a woman in her 50s and a man in his 30s, diverse, natural expressions) sitting at a light-wood table reviewing a document together, shot from slightly above, shallow depth of field. Subjects positioned in the left half of the frame; the right half is calm negative space (window light, out-of-focus interior). Warm neutral palette with cream, oak wood and muted burgundy accents. No logos, no brand names, no readable text on screens or papers, no visible laptops brands. Photorealistic, 35 mm lens, wide landscape 16:9, high resolution.

**Negative prompt (if the tool supports one):** text, logos, watermark, distorted hands, cartoon, illustration, oversaturated colors, cluttered desk.

---

## 2. Social share image — `dist/images/og.jpg`

Used when the site is shared on WhatsApp, LinkedIn or Facebook. After generating it, change `og:image` in every HTML `<head>` from `images/hero.jpg` to `images/og.jpg`.

**Target:** 1200×630 JPEG.

**Prompt:**

> Clean social-media banner, 1200 by 630 pixels, for an insurance recruitment agency. Flat, minimal composition: warm cream background (#F7F3EA), a deep burgundy (#7A1B24) rounded rectangle occupying the right 45% of the canvas, a subtle thin gold (#B8912F) line accent. On the cream side, an abstract arrangement of three overlapping outlined shield and document icons in burgundy line-art style. Leave the burgundy panel completely empty so Hebrew text can be added later. No text, no letters, no logos. Vector style, crisp edges, high resolution.

Then overlay the logo (`dist/images/logo.png`, tinted white) and the line "שירותי גיוס והשמה בתחום הביטוח" on the burgundy panel in any editor.

---

## 3. About-page portrait — `dist/images/nurit.jpg` (optional)

A real photograph of Nurit will always beat a generated one for trust. If one is available, use it (square crop, at least 800×800, JPEG). If not, skip this asset rather than generating a fake person.

If used, add this inside the first `<div>` of the `two-col` section in `dist/about.html`, before `.stat-grid`:

```html
<img src="images/nurit.jpg" alt="נורית כנורי" style="width:100%;border-radius:20px;margin-bottom:1.5rem">
```

---

## 4. Specialty icons (optional — current inline SVG icons are fine)

The ten specialty tiles on the home page use inline SVG line icons. If you want a more distinctive set:

**Target:** ten PNG or SVG files, 256×256, transparent background, single color burgundy `#7A1B24`, consistent 2 px stroke style.

**Prompt (run once per item, replacing the subject):**

> Minimal single-color line icon, 2 px stroke, rounded corners, centered on a transparent background, in the style of Lucide or Feather icons. Subject: [car with shield]. Color #7A1B24. No fill, no shadow, no text, 256×256.

Subjects, in order: car with shield (חיתום אלמנטרי), shield with heart (ביטוח חיים ופנסיה), document with checkmark (תביעות), balance scale (עורכי דין), banknote (כספים), megaphone (שיווק ומכירות), headset (שירות ותפעול), computer monitor (מערכות מידע), graduation cap (אקדמאים), star badge (בכירים).

To use them, replace each `<svg>…</svg>` inside the `.spec-card` links in `dist/index.html` with `<img src="images/icons/NAME.svg" alt="" width="44" height="44">`.

---

## 5. Favicon (optional)

The current favicon is a cropped piece of the handwritten logo and reads poorly at 16×16.

**Target:** 512×512 PNG, then also export 32×32 and 180×180 (Apple touch icon).

**Prompt:**

> App icon, 512×512: a bold, rounded-square badge in deep burgundy (#7A1B24) with a single cream-colored (#F7F3EA) Hebrew letter "כ" in a modern serif typeface centered, subtle inner gold (#B8912F) ring. Flat vector style, no gradients, no text besides the letter, no shadows.

Save as `dist/images/favicon.png` (overwrites the current one).
