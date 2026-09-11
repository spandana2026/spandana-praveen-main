SPANDANA V115 — VOLUNTEER HEADER FIT PATCH

Purpose:
Replace the previous split/duplicated hero rendering with the two approved poster images as the complete header.

Files:
frontend/src/pages/volunteer.tsx
frontend/public/images/volunteer-header-desktop.png
frontend/public/images/volunteer-header-mobile.jpg

Locked image sizes:
Desktop: 2048 x 768 px (3:1)
Mobile: 1024 x 576 px (16:9)

Rendering:
- Desktop/tablet uses the 2048x768 image.
- Phones (max-width 767px) use the 1024x576 image.
- Images are rendered at width:100%, height:auto, with no object-cover crop.
- No duplicate hero text, benefit strip, overlay slogan, or overlay CTA is rendered by the page.
- The artwork itself is the complete header composition.

Do not replace settings.json with this patch.
