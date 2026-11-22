# Development review / release gates

This repository is a preview build, not an approved public portfolio launch.

The interactive product sequence is a 2.5D illustrated concept, not a manufacturer-verified mechanical model. The authentic client photographs and finished videos are **not yet embedded**. Lead enquiry UI only compiles a local brief; it does not send an email or store submissions. The site deliberately sets `noindex,nofollow` and disallows crawling until approvals and a working lead channel are in place.

Prior **local** Chromium visual tests covered 360px, 390px, tablet, 1440px, and 1920px widths and found no broken images, horizontal overflow or uncaught JavaScript errors at those sizes. This is not a claim about a hosted deployment; run live QA after Cloudflare deploys.

Build from Git: `node scripts/build.mjs`, publish directory: `dist`, production branch: `main`.
