# SixthVision Caravan Photography & Film

A static SixthVision studio site for Melbourne caravan and RV manufacturers and dealers. The site combines commercial service sections, a responsive interactive lighting study, project galleries, a shoot planner and a local enquiry brief.

## Build and review

- **Build:** npm run build
- **Public branch output:** dist/
- **Source:** site/index.html and site/assets/. The branch build uses Node.js only. No runtime framework or CDN CSS is required.
- **Local server:** python -m http.server 8000 --bind 127.0.0.1 --directory dist

The existing Cloudflare Pages build command and dist output still work. site/assets/study contains artwork migrated from the original prototype. The artwork is presented as a digital visualisation across the hero, interactive sequence and study gallery.

## Photography and films

The public build reads approved-media/manifest.json only if present. Set release to approved only with documented photographer, client, brand and applicable music clearances. Copy in optimised derivatives, posters and caption tracks. The build copies only the files referenced by the manifest.

For private local review, run node scripts/build.mjs --review-media PATH_TO_LOCAL_MANIFEST_DIRECTORY, then serve dist-review on loopback. This output is separate from dist and is ignored by Git. The local input directory can live outside the checkout. Keep review derivatives and source material out of issue comments, GitHub assets and Cloudflare Pages.

See DEPLOYMENT.md for the manifest shape and release checks, and AUDIT.md for research and testing notes.
