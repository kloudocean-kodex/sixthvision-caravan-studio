# SixthVision Caravan Studio

Live Cloudflare Pages development preview: https://sixthvision-caravan-studio.pages.dev

A responsive static portfolio for caravan and RV commercial photography, with a scroll-controlled illustrative 2.5D caravan disassembly, project galleries, package planner, and enquiry brief generator.

## Status — development preview

This is **not a client-approved final portfolio**. Current on-page caravan scenes and component diagrams are **illustrative concept assets**, not Ankkush's original Billabong project photos, film footage, or manufacturer engineering CAD. The enquiry builder **does not send messages**: it prepares a brief locally for review. Search indexing is intentionally disabled pending media approval, legal details, and live form delivery.

## Build

Cloudflare Pages is connected to this public GitHub repository and auto-deploys pushes to `main`.

- Framework: None / static
- Build command: `node scripts/build.mjs`
- Output directory: `dist`
- Node.js: 20 or newer; no dependencies needed

The original self-contained HTML visual prototype is stored as **15 text chunks** in `.source/part-000.txt` to `.source/part-014.txt`. The build script reconstructs the HTML, extracts embedded Base64 images into fingerprinted standalone files under `dist/assets/`, de-duplicates repeated images, and emits a static site. Do not edit individual chunks manually.

To rebuild locally:
```bash
node scripts/build.mjs
```

Deployable files then exist in `dist/`.

## Launch requirements

1. Replace illustrative visuals with approved, genuine photography and compressed final films.
2. Obtain approval for Billabong brand usage and any third-party imagery/music rights.
3. Implement and test real enquiries, notification delivery, validation, and spam control.
4. Verify business contact details, privacy policy, and claims.
5. Audit the hosted desktop/mobile site and performance.
6. Only then remove `noindex,nofollow` and update `robots.txt`.

See `AUDIT.md` for the local QA scope. This project is deliberately separate from the existing SixthVision commercial website.
