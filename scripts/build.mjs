import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import sharp from 'sharp';

// Reconstruct the design source from Git-friendly text chunks and convert
// component PNGs into lightweight, transparent WebP files.
const sourceDir = '.source';
const parts = readdirSync(sourceDir).filter(n => /^part-\d{3}\.txt$/.test(n)).sort();
if (parts.length !== 15) throw Error('Source chunks are missing');
let html = parts.map(n => readFileSync(join(sourceDir, n), 'utf8')).join('');
if (html.length < 13000000) throw Error('Incomplete source');
const out = 'dist';
rmSync(out, { recursive:true, force:true });
mkdirSync(join(out,'assets'), {recursive:true});
const seen = new Map();
const assets = [];
html = html.replace(/data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)/g, (full, subtype, b64) => {
  const originalExt = subtype === 'jpeg' ? 'jpg' : subtype === 'svg+xml' ? 'svg' : subtype;
  const targetExt = subtype === 'png' ? 'webp' : originalExt;
  const hash = createHash('sha256').update(b64).digest('hex').slice(0,20);
  const pathname = '/assets/image-' + hash + '.' + targetExt;
  if (!seen.has(hash)) {
    const bytes = Buffer.from(b64, 'base64');
    if (!bytes.length) throw Error('Empty image payload');
    assets.push({ pathname, bytes, isPng: subtype === 'png' });
    seen.set(hash, pathname);
  }
  return pathname;
});
for (const asset of assets) {
  const output = asset.isPng ? await sharp(asset.bytes).webp({ quality:84, effort:5 }).toBuffer() : asset.bytes;
  writeFileSync(join(out,asset.pathname.slice(1)), output);
}
// Cloudflare preview: remove Netlify-only form parsing; this form does not transmit enquiries.
html = html.replace(/\sdata-netlify="true"/g,'').replace(/\snetlify-honeypot="bot-field"/g,'');
if (!html.includes('name="robots" content="noindex,nofollow"')) throw Error('Review safety flag missing');
writeFileSync(join(out, 'index.html'), html, 'utf8');
for (const file of ['404.html','favicon.svg','robots.txt','_headers']) copyFileSync(file,join(out,file));
copyFileSync('assets/real-media.json',join(out,'assets/real-media.json'));
console.log('Built '+assets.length+' distinct assets, '+parts.length+' source parts');
