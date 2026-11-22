let selectedPackage = 'Flagship Model Launch (Stills + Film)';
let baseStills = 40, baseReels = 4, modelCount = 1, shootEnv = 'Factory Bay / Yard';
const selectedAddons = new Set();

function updateScopeYield() {
  document.getElementById('scope-model-val').textContent = String(modelCount);
  const totalStills = baseStills * modelCount + (selectedAddons.has('Aerial Coverage') ? 8 * modelCount : 0);
  const totalReels = baseReels + (selectedAddons.has('6x Paid Social 9:16 Reels') ? 6 : 0);
  const filmNote = selectedPackage.includes('Dealer') ? 'Walkarounds' : 'Cuts + Film';
  document.getElementById('selected-scope-summary').textContent = selectedPackage.split(' (')[0];
  document.getElementById('yield-stills').textContent = '~' + totalStills + ' Frames';
  document.getElementById('yield-reels').textContent = totalReels + ' ' + filmNote;
}

document.querySelectorAll('.pkg-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedPackage = card.dataset.pkg;
    baseStills = parseInt(card.dataset.baseStills || '30', 10);
    baseReels = parseInt(card.dataset.baseReels || '4', 10);
    document.querySelectorAll('.pkg-card').forEach(c => {
      const isSel = c === card;
      c.classList.toggle('border-2', isSel);
      c.classList.toggle('border-bronze', isSel);
      c.classList.toggle('shadow-sm', isSel);
      c.classList.toggle('hairline-all', !isSel);
      const btn = c.querySelector('.pkg-select-btn');
      if (btn) {
        btn.classList.toggle('bg-espresso', isSel);
        btn.classList.toggle('text-ivory', isSel);
        btn.classList.toggle('border', !isSel);
        btn.classList.toggle('border-sand', !isSel);
        btn.classList.toggle('bg-alabaster', !isSel);
        btn.classList.toggle('text-espresso', !isSel);
        btn.textContent = isSel ? 'Selected' : 'Select Package';
        btn.setAttribute('aria-pressed', String(isSel));
      }
    });
    updateScopeYield();
  });
});

document.getElementById('scope-model-dec').addEventListener('click', () => { modelCount = Math.max(1, modelCount - 1); updateScopeYield(); });
document.getElementById('scope-model-inc').addEventListener('click', () => { modelCount = Math.min(12, modelCount + 1); updateScopeYield(); });

document.querySelectorAll('.env-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    shootEnv = btn.dataset.env;
    document.querySelectorAll('.env-btn').forEach(b => {
      const m = b === btn;
      b.setAttribute('aria-pressed', String(m));
      b.classList.toggle('border-bronze', m);
      b.classList.toggle('bg-alabaster', m);
      b.classList.toggle('text-espresso', m);
      b.classList.toggle('border-sand', !m);
      b.classList.toggle('bg-ivory', !m);
      b.classList.toggle('text-umber', !m);
    });
  });
});

document.querySelectorAll('.addon-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const addon = btn.dataset.addon;
    if (selectedAddons.has(addon)) {
      selectedAddons.delete(addon);
      btn.classList.remove('bg-espresso', 'text-ivory', 'border-espresso');
      btn.classList.add('bg-alabaster', 'text-espresso', 'border-sand');
    } else {
      selectedAddons.add(addon);
      btn.classList.add('bg-espresso', 'text-ivory', 'border-espresso');
      btn.classList.remove('bg-alabaster', 'text-espresso', 'border-sand');
    }
    btn.setAttribute('aria-pressed', String(selectedAddons.has(addon)));
    updateScopeYield();
  });
});

document.getElementById('prefill-brief-btn').addEventListener('click', () => {
  const shootSelect = document.getElementById('f-shoot-type');
  const modelsInput = document.getElementById('f-models');
  const notesField = document.getElementById('f-notes');
  if (shootSelect) shootSelect.value = selectedPackage;
  if (modelsInput) modelsInput.value = String(modelCount);
  const addonsList = selectedAddons.size > 0 ? '\nEnrichments: ' + Array.from(selectedAddons).join(', ') : '';
  const service = document.getElementById('f-service');
  if (!service.value) service.value = 'Photography and videography';
  notesField.value = 'Package: ' + selectedPackage + '\nEnvironment: ' + shootEnv + '\nModels: ' + modelCount + addonsList + '\n\n' + (notesField.value.split('\n\n').at(-1) || 'Additional notes: ');
  notesField.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('f-company').focus({ preventScroll: true });
  document.getElementById('enquiry').scrollIntoView();
  document.dispatchEvent(new Event('scopeprepared'));
});

const CHANNEL_TIERS = {
  launch: [
    { ch: 'Website Hero & Configurator', spec: '16:9 + 21:9 WebP', desc: 'Sunlit studio or golden-hour 3/4 exterior hero frames plus clean side and front elevations.' },
    { ch: 'Dealer Portal & Spec Sheets', spec: '30–40 Curated Stills', desc: 'Interior views, finish close-ups and images for dealer listings.' },
    { ch: 'Print Brochure & Expo Walls', spec: '16-Bit Print Masters', desc: 'Retouched high-resolution spreads calibrated for Caravan & Camping Supershow walls.' },
    { ch: 'YouTube Launch Film', spec: '60–90s 4K Master', desc: 'Cinema-graded model launch film with sound design, rolling tow shots, and cabin reveal.' },
    { ch: 'Paid Meta & Google Ads', spec: '3 × 15s Cutdowns', desc: 'Short edits for ads built around the features your campaign needs to highlight.' },
    { ch: 'Instagram Reels & TikTok', spec: '4–6 × 9:16 Verticals', desc: 'Vertical framing planned on set for the channels you use.' }
  ],
  range: [
    { ch: 'Unified Range Consistency', spec: '3–6 Models / Same Light', desc: 'Matched colour temperature, camera height, and lens geometry across your entire line.' },
    { ch: 'Model Comparison Grids', spec: 'Standardised Elevations', desc: 'Consistent 3/4 front, rear, and floorplan interior views so buyers compare effortlessly.' },
    { ch: 'Showroom & Press Kits', spec: 'Print + Digital Pack', desc: 'Organised per-model folder hierarchy ready for national dealer networks.' },
    { ch: 'Range Sizzle Reel', spec: '90s Brand Film', desc: 'Cohesive manufacturer brand film uniting multiple models in one narrative arc.' },
    { ch: 'Dealer Co-Op Ad Pack', spec: 'Per-Model Ad Stills', desc: 'Pre-sized 1:1, 4:5, and 16:9 creatives ready for regional dealer ad accounts.' },
    { ch: 'Social Content Bank', spec: '30-Day Vertical Library', desc: 'Detail loops, cabinetry transitions, and walk-through clips for sustained reach.' }
  ],
  dealer: [
    { ch: 'Yard Inventory Listings', spec: '20+ Stills / Van', desc: 'Fast, clean exterior and interior sets tailored for CaravanCampingSales and dealer sites.' },
    { ch: 'Walkaround Reels', spec: '45s Vertical Tours', desc: 'Walkthroughs that show how the cabin is laid out.' },
    { ch: 'Google Business & Local SEO', spec: 'Showroom Stills', desc: 'Showroom and stock images sized for your business profile and website.' },
    { ch: 'Facebook Marketplace & Meta', spec: '4:5 Lead-Gen Carousels', desc: 'Scroll-stopping hero + 4 interior highlights structured for high-intent lead forms.' },
    { ch: 'Handover & Brand Trust', spec: 'Optional Yard B-Roll', desc: 'Workshop, pre-delivery inspection, and dealership credibility clips.' },
    { ch: 'Predictable Cadence', spec: 'Monthly / Quarterly', desc: 'Repeatable content days scheduled as new factory stock lands on your yard.' }
  ]
};

const channelMatrixEl = document.getElementById('channel-matrix');
function renderChannelTier(tierKey) {
  const items = CHANNEL_TIERS[tierKey] || CHANNEL_TIERS.launch;
  channelMatrixEl.innerHTML = items.map((item, idx) => `
    <div class="p-6 bg-ivory hairline-all flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-[10px] font-semibold text-bronze">0${idx + 1}</span>
          <span class="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-alabaster hairline-all text-umber">${item.spec}</span>
        </div>
        <h3 class="mt-3 font-editorial text-2xl text-espresso">${item.ch}</h3>
        <p class="mt-2 text-xs sm:text-sm text-umber leading-relaxed">${item.desc}</p>
      </div>
    </div>
  `).join('');
}

document.querySelectorAll('.tier-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tier-btn').forEach(b => { b.setAttribute('aria-pressed', String(b === btn)); b.classList.remove('bg-espresso', 'text-ivory'); b.classList.add('border', 'border-sand', 'bg-ivory', 'text-umber'); });
    btn.classList.add('bg-espresso', 'text-ivory'); btn.classList.remove('border', 'border-sand', 'bg-ivory', 'text-umber');
    renderChannelTier(btn.dataset.tier);
  });
});

renderChannelTier('launch');
updateScopeYield();
