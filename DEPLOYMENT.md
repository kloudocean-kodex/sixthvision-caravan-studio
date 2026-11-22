# SixthVision live cutover

**Status** — Review site available. Public-domain cutover is pending Sankush’s feedback, release decisions and explicit go-ahead.

Use this file as the cutover checklist. Record the approved choices in the release PR, then work through the steps in order.

## Current review setup

| Item | Value |
| --- | --- |
| Review homepage | [sixthvision-caravan-studio.pages.dev](https://sixthvision-caravan-studio.pages.dev/) |
| Cloudflare Pages project | `sixthvision-caravan-studio` |
| Production branch | `main` |
| Build command | `npm install --no-audit --no-fund && node scripts/build.mjs` |
| Output | `dist` |
| Runtime | Node.js 20 or newer |
| Canonical configuration | `SITE_CANONICAL_URL` defaults to the Pages review homepage |

The Pages production branch currently publishes the review site. Use per-PR Cloudflare previews to check proposed changes. A preview can be opened by anyone with its URL unless access controls are configured. Keep private review media in the local build described below. [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Cloudflare preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)

## 1. Approve the release

- [ ] Sankush signs off on the exact review URL, hero typography and mobile layout. Record the approved commit and intended launch date.
- [ ] Confirm the permanent HTTPS homepage URL and who manages its DNS. Agree which existing hostnames should redirect and which links should remain available for review.
- [ ] Approve the public portfolio and media rights, including visible vehicle or client branding, people if applicable, soundtracks, credits and captions. Confirm the studio name, public contact information and any privacy notice used by the approved enquiry flow.
- [ ] Confirm how new work enquiries should reach the studio. The current “Prepare Brief” flow validates and formats details in the browser, then offers a copy action and a separate phone link. Its current number is `0474 126 276`. Test both actions and use copy that describes the actual behaviour. If the launch needs submissions, agree on an owner-approved destination and verify acceptance, receipt and failure handling before labelling the action “Send.”

## 2. Prepare the publication assets

- [ ] Put only approved derivatives in `approved-media/` with a sibling `manifest.json`. A public manifest requires `"release": "approved"`. The public build copies referenced files into `/assets/portfolio/`. Keep original files and unapproved derivatives outside the repo.
- [ ] Review the hero crop on desktop and mobile, gallery previews, alt text, credits, posters, playback and captions. For films above the Pages file limit, provision an approved video host and adapt the manifest delivery path. [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)

Use lowercase hyphenated basenames. Photos support WebP, JPEG, AVIF and PNG. Films support MP4 and WebM with an image poster and an optional WebVTT caption track. The example below shows how to reference those files.

```json
{
  "release": "approved",
  "project": {
    "name": "Approved project name",
    "description": "What SixthVision delivered"
  },
  "hero": {
    "file": "exterior.webp", "small": "exterior-small.webp",
    "width": 1440, "smallWidth": 720,
    "alt": "Exterior description", "caption": "Project credit"
  },
  "handoff": { "file": "exterior.webp", "small": "exterior-small.webp" },
  "photos": [
    {
      "file": "exterior.webp", "small": "exterior-small.webp",
      "width": 1440, "smallWidth": 720, "title": "Exterior hero",
      "alt": "Exterior description", "category": "Exterior", "caption": "Shot detail"
    }
  ],
  "films": [
    {
      "file": "launch.mp4", "poster": "launch-poster.webp",
      "captions": "launch-captions.vtt", "title": "Launch film", "caption": "Film overview"
    }
  ]
}
```

For a private local review, use the same schema with `"release": "local-review"` and pass the directory that contains the manifest and media.

```powershell
node scripts/build.mjs --review-media "<private-media-directory>"
```

This writes `dist-review`. The regular build writes `dist`, with the visual study and approved project media when supplied.

## 3. Prepare the canonical host and indexing

- [ ] Attach the approved custom domain in the Pages project, confirm DNS and HTTPS, and configure any agreed permanent redirects. Match only the intended hosts. Preserve paths and query strings where appropriate, and verify redirect targets and preview aliases individually. If the current `pages.dev` homepage is retained for review, use separate protected hosting or a hostname-specific setup so it can still serve review controls. A custom domain and the default Pages homepage attached to one project normally serve the same production deployment. [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [Redirecting a Pages hostname](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)
- [ ] Set `SITE_CANONICAL_URL` for production to the approved HTTPS homepage. Verify the generated canonical, Open Graph URL and image, Twitter image, and Service schema IDs point to the intended addresses. Check the Organization ID, name, phone number and Melbourne/Victoria service area against the approved business details.
- [ ] Change the build only after approval to support an indexable production output while keeping the protected review output as the default. Today, `site/index.html` declares `noindex,nofollow`, `_headers` sends `X-Robots-Tag: noindex, nofollow`, `robots.txt` disallows all paths, and `scripts/build.mjs` requires the protective meta tag. Coordinate all four so the approved host's public pages can be crawled and indexed and review deployments still have their indexing protections. Keep the separate `404.html` non-indexable. Check actual HTTP headers as well as rendered HTML. [Google indexing directives](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [ ] Add `/sitemap.xml` to the production output with absolute canonical URLs for the indexable homepage and approved standalone pages. Include its HTTPS URL in production `robots.txt`. Verify the final host in Search Console, submit the sitemap after publishing and use URL Inspection to check the homepage. [Google’s sitemap guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## 4. Check search and answer visibility

- [ ] Verify the homepage title, description, one clear H1, service sections, internal links, social preview and structured data against the published page. The starting search focus is caravan photography and videography for Melbourne and Victorian RV manufacturers and dealers.
- [ ] For AEO and GEO, write short, factual service answers and publish approved project details such as location, shoot scope and deliverables. Add captions or transcripts for published films. Where a video is the primary content on a dedicated page, check Google’s video eligibility and add accurate `VideoObject` metadata where appropriate. [Google AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · [Google video SEO](https://developers.google.com/search/docs/appearance/video)

## 5. Verify and publish

- [ ] Run `npm run build` and inspect the generated output for canonical and indexing settings, expected public assets and any broken links. Test the exact candidate on desktop and mobile, including the hero typography, galleries and films, scroll controls, keyboard navigation, reduced motion and the approved enquiry path. Run cold-load lab checks for LCP and CLS and record results alongside the release. [Web Vitals guidance](https://web.dev/articles/vitals)
- [ ] Record the current successful Cloudflare production deployment ID, Git SHA and current domain/redirect settings before promoting the approved release. Verify the release on the real host in an unauthenticated browser. The canonical homepage, required assets and sitemap should return `200`, unknown URLs should return `404`, and any approved redirects should land without a loop. Repeat the contact check and confirm preview indexing protections.
- [ ] Monitor the Cloudflare deployment and Search Console after launch. Review the first usable field performance data and confirm the approved enquiry path is receiving or producing what the studio expects.

## Rollback

If the public homepage, access settings, media rights or lead path fails release verification, the release owner can select the recorded successful **production** deployment in Cloudflare Pages and choose **Rollback to this deployment**. Restore any domain, redirect or environment settings that changed separately, then rerun the main URL, preview-protection and contact checks. Reconcile `main` with the rollback before allowing the next automatic deployment. [Cloudflare Pages rollback](https://developers.cloudflare.com/pages/configuration/rollbacks/)
