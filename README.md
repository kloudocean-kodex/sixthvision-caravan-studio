# SixthVision Caravan Studio

Interactive caravan and RV commercial photography portfolio — **development demonstration**.

This repository hosts a labelled design concept. The current imagery is illustrative; real approved Billabong portfolio photos and finished films are not yet embedded, and the enquiry brief is not a delivered form submission. **Do not remove the `noindex` setting or claim a production launch without media rights, business contact configuration, and live QA.**

## Cloudflare Pages

- Framework preset: None
- Build command: `node scripts/build.mjs`
- Build output directory: `dist`
- Production branch: `main`
- Auto deploy: Cloudflare Git integration

The build processes `source-standalone.html` into a normal fast-loading static site, extracting embedded base64 image assets into `/assets` and removing duplicate payloads.

The project originates from the SixthVision-Caravans-Refined-Standalone.html user-approved working concept.
