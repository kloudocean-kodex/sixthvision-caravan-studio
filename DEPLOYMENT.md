# Deployment

Cloudflare Pages project sixthvision-caravan-studio deploys main to the existing site. Review changes on feat/cinematic-scroll-photography-seo-v2 using the Cloudflare Git preview.

- Build command: npm install --no-audit --no-fund && node scripts/build.mjs
- Output directory: dist
- Build runtime: Node.js 20 or newer
- Preview configuration: preserve the noindex HTML meta, X-Robots-Tag header and current robots.txt. Cloudflare aliases are accessible to anyone with the URL unless access controls are configured.
- SITE_CANONICAL_URL defaults to the existing Pages homepage. Set it to the approved permanent URL when the final host is chosen.

The local shooting brief validates and formats form data in the browser. Copying the brief and opening the public studio phone link are independent actions. There is no form submission service on this branch.

## Media manifest

Place manifest.json alongside the derivative media files. Use lowercase hyphenated basenames. Photos support WebP, JPEG, AVIF and PNG. Films support MP4 or WebM, with an image poster and an optional WebVTT caption track.

Example fields:

    {
      "release": "approved",
      "project": { "name": "Approved project name", "description": "What SixthVision delivered" },
      "hero": { "file": "exterior.webp", "small": "exterior-small.webp", "width": 1440, "smallWidth": 720, "alt": "Exterior description", "caption": "Project credit" },
      "handoff": { "file": "exterior.webp", "small": "exterior-small.webp" },
      "photos": [
        { "file": "exterior.webp", "small": "exterior-small.webp", "width": 1440, "smallWidth": 720, "title": "Exterior hero", "alt": "Exterior description", "category": "Exterior", "caption": "Shot detail" }
      ],
      "films": [
        { "file": "launch.mp4", "poster": "launch-poster.webp", "captions": "launch-captions.vtt", "title": "Launch film", "caption": "Film overview" }
      ]
    }

Local review uses the same schema with release set to local-review and an explicit directory argument. It writes dist-review only. If public film delivery requires files beyond the Pages single-file limit, provision a suitable approved video host and adapt the manifest delivery path.

## Launch checks

1. Confirm which project photos, films, visible logos and soundtracks can be published. Add caption tracks where applicable. Confirm the studio bio and photographer’s preferred public name.
2. Confirm the canonical hostname, public contact details, privacy text, and whether a delivered web enquiry is required. Add and test an approved delivery path before using a Send CTA.
3. Verify actual hosted media playback and social sharing. Add eligible video structured data only when project metadata and watch-page conditions are met.
4. After explicit approval, allow intended routes through both indexing controls and robots.txt. Publish an XML sitemap containing the permanent canonical URL and any useful case-study URLs. Verify the host and submit the sitemap in Search Console.
5. Review the preview branch and merge only after approval.
