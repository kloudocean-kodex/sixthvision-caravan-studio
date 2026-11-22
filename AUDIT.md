# SixthVision review and implementation notes

## Baseline

The live title identified commercial photography and film, while the hero led with “Crafted to endure” and pointed visitors to “Explore Disassembly”. The concept notice, repeated gallery captions and local-import labels made the site read like a development storyboard. Both player slots showed animated stills. The scroll track occupied 500 viewport heights on desktop, eased by a fixed fraction per frame and updated text against raw scroll separately from the rendered scene. The local brief did not deliver messages.

The revised hero leads with Melbourne caravan photography and videography. The primary action goes to a shoot enquiry with the public studio phone line. The secondary action goes directly to work. Service sections explain the deliverables. The revised scene uses time-based damping and chapter, slider, X-ray and native scroll controls. The pinned track is 290 small viewport heights at supported desktop sizes. Mobile and reduced-motion layouts use direct chapter controls. The visual artwork is credited once and no longer fills portfolio cards or film slots.

## Copy decisions

| Previous treatment | Revised treatment |
|---|---|
| Crafted to endure. Filmed to be desired. | Caravan Photography & Videography in Melbourne |
| Explore Disassembly / Packages | Discuss Your Shoot / View Photography & Films |
| A Visual Anatomy of a Caravan | A Caravan Through Our Lens |
| Engineering features and proposed filenames on gallery cards | Shot titles and descriptions in the visual study, plus a portfolio for attributed real work |
| Concept slideshows in the film slots | Native video players for finished films in local review |
| Submit Production Brief with a Netlify preview note | Prepare Brief, copy it, or call the studio |

## Research

Reviewed 22 November 2026 using web search results and studios’ own portfolios. Search results were not a Melbourne-IP Google rank-tracking session. Locations and offered work were taken from first-party pages. No search volume, rank or campaign impact estimates were used.

| Reference | Verified work and positioning | Applied decision |
|---|---|---|
| [IJ Productions](https://www.ijproductions.com/blog/2024/1/4/lotus-caravans-automotive-photography), Moorabbin | Lotus Caravans photography with separate crew credits and a named video collaborator | Show what was delivered and credit the actual roles when the project can be published. |
| [New Way Media](https://newwaymedia.com.au/), Banyule | Melbourne video-first positioning with Australian Caravan Club and On the Go RV work near the top | Include film in the first screen and give finished films dedicated controls and posters. |
| [Marcus Cozzolino](https://www.marcuscozzolinophotography.com.au/portfolio), Altona Meadows | Essential Caravans stills, sizzle reel, walkthrough and vertical content | Give distinct commercial formats names clients recognise. |
| [MMP Studio](https://mmpstudio.au/case-studies/bothie), Melbourne | A commissioned Bothie Camper studio shoot presented as a case study | Give the approved project a concise brief and tightly curated exterior and interior edit. |
| [OAA Media](https://www.oaamedia.com.au/camping-4wd-content-production), Victorian High Country | Adjacent 4WD and camping stills and motion on location, with website and launch uses | Explain where the finished work will appear and show context from real shoots. |
| [Cameron Damon Media](https://www.camerondamon.com.au/), Melbourne | Broader multi-platform production with Caravan Industry Victoria work | Keep SixthVision’s own offer specific to stills, launch films and dealer content. |
| [BG Photography](https://bgphotography.com.au/), Australian RV benchmark | Markets photography, videography and launch assets to RV manufacturers | Name the commissioning buyer in the hero. |
| [Lucas Wroe](https://lucaswroe.com/portfolios/melbourne-caravan-product-photography-titanium-2022/), Australian benchmark | Titanium product-range photography and lighting constraints. His current site lists Brisbane. | Explain why matched lighting and angles matter for a model range. |

Motion references: [Animorio](https://animorio.com/en/animations/exploded-view-watch-on-scroll/) for staggered separation, [APEX GT](https://omnilabs.studio/work/apex/) for camera-led pacing, and [Longines](https://immersive-g.com/projects/longines-flyback/) for restrained visual sequencing. The repository contains layered image artwork and no rigged 3D model. The existing 2.5D assets support a common camera transform and reversible compositing without a WebGL dependency. The visualisation conveys shot intent and does not assert mechanical accuracy.

## Search intent and page mapping

| Query family | Intent observed | Target |
|---|---|---|
| Caravan photography Melbourne, caravan photographer Melbourne | Specialist photographer or portfolio | Homepage, hero and #product-photography |
| Caravan videography Melbourne, caravan videographer Melbourne, caravan video production Melbourne | Film production, mixed with consumer and creator video depending on modifier | Homepage, #caravan-films and real films under #work when cleared |
| Commercial caravan photography, caravan product photography, RV photography Victoria | Commissioned product imagery, mixed with consumer RV results on broad wording | #product-photography, #work |
| Caravan interior photography | Mixed architectural, product and shopper interest | #interior-photography |
| Caravan launch film, dealership walkthrough, camper-trailer photography Melbourne | Mixed B2B, completed project examples and vehicle browsing | #caravan-films, #packages, published case studies once there is distinct material |
| Caravan for sale, reviews, floor plans, caravan prices | Vehicle shopping | Excluded from intentional targets |

Title: **Caravan Photography & Videography Melbourne | SixthVision**. Description: “Melbourne caravan photography and videography for RV manufacturers and dealers. Book SixthVision for product photography, launch films and dealership content.” The public build supplies social metadata, a canonical and verified general organisation details. It retains one strong page instead of creating overlapping landing pages. See [Google Search Essentials](https://developers.google.com/search/docs/essentials), [video SEO](https://developers.google.com/search/docs/appearance/video) and [LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## Media status

The supplied Dropbox folder contains 57 unbranded-export JPGs, 57 branded-export JPGs and two finished films. Selected original stills were inspected along with frames from both films. Several files without added watermark still show Billabong vehicle branding. An eight-image edit, real hero and two native videos are available in a local review build. Original videos are approximately 68.5 s and 67.1 s. These source assets and private derivatives are outside the Git checkout and excluded from the branch preview while clearance is unconfirmed. The public work section links to SixthVision’s own [published commercial portfolio](https://sixthvisioncommercial.com.au/portfolio/). The general phone number is listed on the [official commercial site](https://sixthvisioncommercial.com.au/).
