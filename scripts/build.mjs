import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
// Cloudflare Pages static build: reconstruct verified source chunks and extract
// embedded illustration assets to deduplicated files for efficient caching.
const sourceDir = '.source';
const parts = readdirSync(sourceDir).filter(n => /^part-\d{3}\.txt$/.test(n)).sort();
if (parts.length !== 15) throw Error('Missing source chunks: expected 15, got ' + parts.length);
let html = parts.map(n => readFileSync(join(sourceDir,n), 'utf8')).join('');
if (html.length < 13000000) throw Error('Incomplete source content');
const out = 'dist';
mkdirSync(join(out,'assets'), {recursive:true});
const seen = new Map();
html = html.replace(/data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)/g, (full, subtype, b64) => {
  const ext = subtype === 'jpeg' ? 'jpg' : subtype === 'svg+xml' ? 'svg' : subtype;
  const hash = createHash('sha256').update(b64).digest('hex').slice(0,20);
  const pathname = '/assets/image-' + hash + '.' + ext;
  if (!seen.has(hash)) {
    const bytes = Buffer.from(b64,'base64');
    if (!bytes.length) throw Error('Empty image: ' + hash);
    writeFileSync(join(out,pathname.slice(1)), bytes);
    seen.set(hash, pathname);
  }
  return pathname;
});
if (!html.includes('name="robots" content="noindex,nofollow"')) throw Error('Preview safety gate missing: noindex');
writeFileSync(join(out, 'index.html'), html, 'utf8');
for (const file of ['404.html','favicon.svg','robots.txt','_headers']) copyFileSync(file,join(out,file));
copyFileSync('assets/real-media.json',join(out,'assets/real-media.json'));
console.log('Built preview: '+parts.length+' source chunks, '+seen.size+' unique image files');
