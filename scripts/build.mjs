import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--review-media')) {
  throw new Error('Usage: node scripts/build.mjs [--review-media DIRECTORY]');
}

const review = args.length > 0;
const site = join(root, 'site');
const out = join(root, review ? 'dist-review' : 'dist');
const mediaDirectory = review ? resolve(args[1]) : join(root, 'approved-media');
const canonical = new URL(process.env.SITE_CANONICAL_URL || 'https://sixthvision-caravan-studio.pages.dev/');
if (canonical.protocol !== 'https:' || canonical.username || canonical.password || canonical.search || canonical.hash) {
  throw new Error('SITE_CANONICAL_URL must be a clean HTTPS homepage URL.');
}

const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const studyFolder = '/assets/study/';
const renderedMedia = new Map();
const types = { image: 'webp|jpe?g|avif|png', film: 'mp4|webm', track: 'vtt' };

function sourceAsset(name, type) {
  const pattern = new RegExp('^[a-z0-9][a-z0-9-]*\\.(' + types[type] + ')$');
  if (typeof name !== 'string' || !pattern.test(name)) throw new Error('Invalid media filename: ' + name);
  const input = join(mediaDirectory, name);
  if (!statSync(input).isFile()) throw new Error('Missing media file: ' + name);
  renderedMedia.set(name, input);
  return '/assets/portfolio/' + name;
}

function responsiveImage(image, { eager = false, sizes = '(max-width: 680px) 92vw, 49vw' } = {}) {
  const src = sourceAsset(image.file, 'image');
  const srcset = image.small
    ? ' srcset="' + sourceAsset(image.small, 'image') + ' ' + (image.smallWidth || 720) + 'w, ' +
      src + ' ' + (image.width || 1440) + 'w" sizes="' + sizes + '"'
    : '';
  return '<img src="' + src + '"' + srcset + ' alt="' + escape(image.alt) +
    (eager ? '" fetchpriority="high"' : '" loading="lazy"') + ' decoding="async">';
}

const manifest = join(mediaDirectory, 'manifest.json');
const media = review || existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : null;
if (media && !review && media.release !== 'approved') throw new Error('Public portfolio media requires an approved release.');
const hasWork = media && (media.photos?.length || media.films?.length);

const studies = [
  ['Exterior', 'Exterior under shaped light', 'Charcoal caravan seen from the front in a sunlit architectural space', 'image-6587a0c6cf45ab434ed5.jpg'],
  ['Exterior', 'The rear angle', 'Rear three-quarter view of a charcoal caravan', 'image-1b0f453ac53b105d3956.jpg'],
  ['Cutaway', 'Opening the roofline', 'Raised caravan roof showing the warm cabin below', 'image-185e869879ac6db332d4.jpg'],
  ['Cutaway', 'The layered exterior', 'Caravan body, interior and chassis shown as separate layers', 'image-1feda8107a93f8d775d3.jpg'],
  ['Interior', 'Lighting the galley', 'Warm wood cabinetry and a lit kitchen counter', 'image-acdd721918f82670dd32.jpg'],
  ['Interior', 'Light across the cabin', 'Soft light falling on a made bed inside a caravan', 'image-0f6b4e680e3720cd6e38.jpg'],
  ['Interior', 'Framing a compact room', 'Bathroom with a bronze tap and pale wall finish', 'image-0394968101e430940eec.jpg'],
  ['Detail', 'Close to the hardware', 'Close-up of the caravan front and tow assembly', 'image-5f23057860bc5ec16bab.jpg'],
  ['Detail', 'A lower point of view', 'Close-up of the wheel and lower assembly', 'image-350e0528faaf05dbbda5.jpg'],
  ['Detail', 'An exterior feature', 'Outdoor kitchen extended from the caravan side', 'image-f773b20910e5f24125da.jpg'],
  ['Location', 'A wider frame', 'High viewpoint over a caravan and the surrounding terrain', 'image-498c8fc6eb88541f0bc3.jpg'],
  ['Location', 'The caravan in context', 'Caravan in a landscape at golden hour', 'image-8b480f7817c0b474efbc.jpg'],
];

function gallery(items) {
  const categories = [...new Set(items.map(item => item.category))];
  const filters = categories.length > 1 ? '<div class="gallery-filters" role="group" aria-label="Filter images">' +
    ['all', ...categories].map(category => '<button type="button" data-filter="' + escape(category) +
      '" aria-pressed="' + (category === 'all') + '">' + (category === 'all' ? 'All' : escape(category)) + '</button>').join('') + '</div>' : '';
  const cards = items.map(item => '<button type="button" class="gallery-card" data-full="' + escape(item.full) +
    '" data-category="' + escape(item.category) + '" data-caption="' + escape(item.caption) + '">' +
    item.image + '<span>' + escape(item.title) + '</span></button>').join('\n');
  return '<div data-gallery>' + filters + '<div class="gallery-grid">' + cards + '</div></div>';
}

function portfolio() {
  if (!hasWork) return '';
  const photos = media.photos || [];
  const films = media.films || [];
  const galleryMarkup = photos.length ? gallery(photos.map(image => ({
    ...image,
    full: sourceAsset(image.file, 'image'),
    image: responsiveImage(image, { sizes: '(max-width: 680px) 45vw, 30vw' }),
  }))) : '';
  const filmMarkup = films.length ? '<div class="film-list">' + films.map(film =>
    '<article class="film-card"><video controls playsinline preload="none" width="960" height="540" aria-labelledby="' +
    escape(film.file) + '-title" poster="' + sourceAsset(film.poster, 'image') + '" src="' + sourceAsset(film.file, 'film') + '">' +
    (film.captions ? '<track kind="captions" srclang="en" label="English" src="' + sourceAsset(film.captions, 'track') + '">' : '') +
    '</video><h3 id="' + escape(film.file) + '-title">' + escape(film.title) + '</h3><p>' + escape(film.caption) + '</p></article>').join('\n') + '</div>' : '';
  return '<section id="work" class="work-section" aria-labelledby="work-title"><div class="shell">' +
    '<h2 id="work-title">Selected Caravan Photography &amp; Films</h2><p class="project-name">' +
    escape(media.project?.name) + '</p><p class="work-intro">' + escape(media.project?.description) + '</p>' +
    galleryMarkup + filmMarkup + '</div></section>';
}

const hero = media?.hero;
const cinematicAlt = 'Cream and charcoal caravan lit from the side in a warm architectural studio';
const socialImage = hero ? sourceAsset(hero.file, 'image') : studyFolder + 'cinematic-hero.webp';
const photo = hero ? responsiveImage(hero, { eager: true, sizes: '100vw' }) :
  '<img src="' + socialImage + '" srcset="' + studyFolder + 'cinematic-hero-small.webp 640w, ' +
  studyFolder + 'cinematic-hero-mid.webp 960w, ' + socialImage + ' 1774w" ' +
  'sizes="(max-width: 680px) 170vw, (max-width: 1000px) 135vw, 100vw" width="1774" height="887" alt="' +
  escape(cinematicAlt) + '" fetchpriority="high" decoding="async">';
const heroMarkup = '<div class="hero-media' + (hero ? ' is-project' : '') + '">' + photo + '</div>';

const organizationId = 'https://sixthvision.com.au/#organization';
const areaServed = [
  { '@type': 'City', name: 'Melbourne' },
  { '@type': 'AdministrativeArea', name: 'Victoria' },
];
const services = [
  ['product-photography', 'Caravan product photography', 'Exterior hero shots, model angles and close-ups for websites, brochures and dealer listings.'],
  ['interior-photography', 'Caravan interior photography', 'Wide cabin views and photographs of materials, joinery and finishes.'],
  ['caravan-films', 'Caravan launch films and dealership video', 'Model launch films, dealer walkthroughs and short edits for advertising and social.'],
];
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'SixthVision',
      url: 'https://sixthvision.com.au/',
      telephone: '+61 474 126 276',
      areaServed,
    },
    ...services.map(([anchor, name, description]) => {
      const url = new URL('#' + anchor, canonical).href;
      return {
        '@type': 'Service',
        '@id': url,
        url,
        name,
        serviceType: name,
        description,
        provider: { '@id': organizationId },
        areaServed,
      };
    }),
  ],
};
const social = '<link rel="canonical" href="' + escape(canonical.href) + '">\n  ' +
  '<meta property="og:url" content="' + escape(canonical.href) + '">\n  ' +
  '<meta property="og:image" content="' + escape(new URL(socialImage, canonical).href) + '">\n  ' +
  '<meta property="og:image:alt" content="' + escape(hero?.alt || cinematicAlt) + '">\n  ' +
  '<meta name="twitter:image" content="' + escape(new URL(socialImage, canonical).href) + '">\n  ' +
  '<script type="application/ld+json">' + JSON.stringify(structuredData) + '</script>';
const studyGallery = gallery(studies.map(([category, title, alt, file]) => ({
  category, title, full: studyFolder + file,
  image: '<img loading="lazy" decoding="async" src="' + studyFolder + 'thumbs/' +
    file.replace(/\.jpg$/, '.webp') + '" alt="' + escape(alt) + '">',
})));
const handoff = media?.handoff || hero;
const studyHandoff = handoff ? '<img id="plate-handoff" loading="lazy" alt="" data-src="' +
  sourceAsset(handoff.small || handoff.file, 'image') + '">' : '';

const replacements = {
  SOCIAL_METADATA: social, HERO_MEDIA: heroMarkup, STUDY_HANDOFF: studyHandoff,
  STUDY_GALLERY: studyGallery,
  WORK_ANCHOR: hasWork ? '' : '<span id="work" class="legacy-anchor" aria-hidden="true"></span>',
  PORTFOLIO: portfolio(),
};
let html = readFileSync(join(site, 'index.html'), 'utf8');
for (const [key, markup] of Object.entries(replacements)) {
  const token = '<!-- ' + key + ' -->';
  if (!html.includes(token)) throw new Error('Missing template slot: ' + key);
  html = html.replace(token, () => markup);
}
if (!html.includes('name="robots" content="noindex,nofollow"')) throw new Error('Preview indexing protection is missing.');

if (dirname(out) !== resolve(root)) throw new Error('Build output is outside the project.');
rmSync(out, { recursive: true, force: true });
cpSync(site, out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);
for (const file of ['404.html', 'favicon.svg', 'robots.txt', '_headers']) {
  copyFileSync(join(root, file), join(out, file));
}
if (renderedMedia.size) {
  const destination = join(out, 'assets', 'portfolio');
  mkdirSync(destination, { recursive: true });
  for (const [name, input] of renderedMedia) copyFileSync(input, join(destination, name));
}
console.log((review ? 'Local review' : 'Branch') + ' build: ' + out + ' (' + renderedMedia.size + ' portfolio files)');
