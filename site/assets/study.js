const chapters = [
  ['Exterior', 'The exterior hero shot', 'A clean three-quarter angle and shaped light establish the model’s proportions in a single frame.', 0],
  ['Separation', 'Finding the right angle', 'We change the camera and light to show the features that disappear from a straight-on view.', .29],
  ['Interior', 'The feel of the cabin', 'A wide interior frame shows the layout. Warm, balanced light lets the finishes read naturally.', .49],
  ['Details', 'The close-up', 'A tighter frame puts the wheel, finish and other small details in context.', .66],
  ['Reassembly', 'Back to the whole', 'We pull back to the full silhouette so the details feel part of one story.', .84],
  ['Photography & film', 'From the shot list to the screen', 'Stills for the brochure, a film for the launch and short edits for the campaign.', 1],
];

const track = document.querySelector('#disassembly-track');
const frame = document.querySelector('#disassembly-sticky');
const viewport = document.querySelector('#explode-viewport');
const camera = document.querySelector('#study-camera');
const scrubber = document.querySelector('#disassembly-scrubber');
const previous = document.querySelector('#beat-prev-btn');
const next = document.querySelector('#beat-next-btn');
const title = document.querySelector('#beat-title');
const description = document.querySelector('#beat-desc');
const storyButton = document.querySelector('#mode-scroll-btn');
const xrayButton = document.querySelector('#mode-xray-btn');
const xray = document.querySelector('#xray-layer');
const wipe = document.querySelector('#xray-range');
const hotspots = document.querySelector('#hotspot-layer');
const cutaway = document.querySelector('#plate-cutaway');
const assembly = document.querySelector('#assembly-parts');
const interior = document.querySelector('#plate-interior');
const detail = document.querySelector('#plate-detail');
const handoff = document.querySelector('#plate-handoff');

const components = [
  ['roof', 0, -8, .15, .34],
  ['nose', -9, -1, .21, .38],
  ['cabin', -3, 3, .19, .35],
  ['wall', 10, 0, .18, .37],
  ['chassis', 0, 9, .23, .39],
].map(([name, x, y, start, end]) => ({
  element: document.querySelector('#piece-' + name), x, y, start, end,
}));

const pin = matchMedia('(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const portrait = matchMedia('(max-width: 680px)');
const clamp = value => Math.max(0, Math.min(1, value));
const ease = (start, end, value) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};
const blend = (value, start, full, hold, end) => ease(start, full, value) * (1 - ease(hold, end, value));

let requested = 0;
let rendered = 0;
let active = -1;
let request = 0;
let lastFrame = 0;
let isXray = false;
let studyIsVisible = true;
let trackStart = 0;
let trackTravel = 0;
let loadedStudy = false;

const chapterList = document.querySelector('#beat-nav-list');
const chapterButtons = chapters.map(([label], index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => goToChapter(index));
  chapterList.append(button);
  return button;
});

function chapterAt(progress) {
  const index = chapters.findIndex((chapter, i) => i < chapters.length - 1 &&
    progress < (chapter[3] + chapters[i + 1][3]) / 2);
  return index === -1 ? chapters.length - 1 : index;
}

function setOpacity(element, opacity) {
  element.style.opacity = opacity.toFixed(3);
}

function render(progress) {
  rendered = progress;
  const opening = ease(.04, .46, progress);
  const pullback = ease(.55, .93, progress);
  const movement = reduce.matches ? 0 : (portrait.matches ? .57 : 1) * (opening - pullback);
  camera.style.transform = 'translate3d(' + (-2.1 * movement).toFixed(3) + '%,' +
    (-1.6 * movement).toFixed(3) + '%,0) scale(' + (1 + .12 * movement).toFixed(4) + ')';

  const assemblyOpacity = blend(progress, .20, .28, .47, .54) + blend(progress, .69, .76, .79, .84);
  const showAssembly = assemblyOpacity > 0 && components.every(({element}) => element.naturalWidth > 0);
  setOpacity(cutaway, blend(progress, .08, .16, .28, .37));
  setOpacity(assembly, showAssembly ? assemblyOpacity : 0);
  setOpacity(interior, blend(progress, .39, .48, .57, .65));
  setOpacity(detail, blend(progress, .57, .65, .70, .76));
  if (handoff) setOpacity(handoff, ease(.91, 1, progress));

  if (showAssembly) {
    const scale = portrait.matches ? .55 : 1;
    for (const {element, x, y, start, end} of components) {
      const separation = ease(start, end, progress) * (1 - ease(.73, .89, progress)) * scale;
      element.style.transform = 'translate3d(' + (x * separation).toFixed(2) + '%,' +
        (y * separation).toFixed(2) + '%,0)';
    }
  }
  hotspots.hidden = !showAssembly || isXray || reduce.matches || progress < .26 || progress > .41;
  scrubber.value = Math.round(progress * 1000);

  const index = chapterAt(progress);
  if (index === active) return;
  active = index;
  const [label, heading, text] = chapters[index];
  title.textContent = heading;
  description.textContent = text;
  scrubber.setAttribute('aria-valuetext', label);
  chapterButtons.forEach((button, item) => {
    if (item === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  previous.disabled = index === 0;
  next.disabled = index === chapters.length - 1;
}

function update(now) {
  request = 0;
  const elapsed = lastFrame ? now - lastFrame : 16;
  lastFrame = now;
  const difference = requested - rendered;
  if (Math.abs(difference) < .001 || reduce.matches) {
    render(requested);
    lastFrame = 0;
    return;
  }
  render(rendered + difference * (1 - Math.exp(-elapsed / 55)));
  request = requestAnimationFrame(update);
}

function setProgress(progress, immediate = false) {
  const bounded = clamp(progress);
  if (!immediate && bounded === requested && bounded === rendered) return;
  requested = bounded;
  if (isXray) return;
  if (immediate || reduce.matches || !studyIsVisible) {
    cancelAnimationFrame(request);
    request = 0;
    lastFrame = 0;
    render(requested);
  } else if (!request && Math.abs(requested - rendered) >= .001) {
    request = requestAnimationFrame(update);
  }
}

function readScroll() {
  if (pin.matches && trackTravel > 0) setProgress((scrollY - trackStart) / trackTravel);
}

function measureTrack() {
  if (!pin.matches) return;
  trackStart = scrollY + track.getBoundingClientRect().top - parseFloat(getComputedStyle(frame).top);
  trackTravel = track.offsetHeight - frame.offsetHeight;
  readScroll();
}

function loadStudy() {
  if (loadedStudy) return;
  loadedStudy = true;
  viewport.querySelectorAll('img[data-src]').forEach(image => {
    image.addEventListener('load', () => render(rendered), { once: true });
    image.loading = 'eager';
    image.src = image.dataset.src;
  });
}

function setMode(enabled) {
  loadStudy();
  isXray = enabled;
  xray.hidden = !enabled;
  camera.style.visibility = enabled ? 'hidden' : '';
  scrubber.disabled = enabled;
  storyButton.setAttribute('aria-pressed', String(!enabled));
  xrayButton.setAttribute('aria-pressed', String(enabled));
  if (enabled) {
    cancelAnimationFrame(request);
    request = 0;
    lastFrame = 0;
    hotspots.hidden = true;
  } else {
    setProgress(requested, true);
  }
}

function seek(progress, immediate = false) {
  loadStudy();
  if (isXray) setMode(false);
  setProgress(progress, immediate);
  if (pin.matches) window.scrollTo(0, trackStart + trackTravel * progress);
}

function goToChapter(index) {
  const bounded = Math.max(0, Math.min(chapters.length - 1, index));
  seek(chapters[bounded][3]);
}

previous.addEventListener('click', () => goToChapter(chapterAt(requested) - 1));
next.addEventListener('click', () => goToChapter(chapterAt(requested) + 1));
scrubber.addEventListener('input', () => seek(scrubber.valueAsNumber / 1000, true));
storyButton.addEventListener('click', () => setMode(false));
xrayButton.addEventListener('click', () => setMode(true));
wipe.addEventListener('input', () => xray.style.setProperty('--wipe', wipe.value + '%'));
hotspots.addEventListener('click', event => {
  const hotspot = event.target.closest('button');
  if (hotspot) goToChapter(Number(hotspot.dataset.chapter));
});

let touchStart;
viewport.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch' && !pin.matches && !isXray && !event.target.closest('button')) {
    touchStart = [event.clientX, event.clientY];
    viewport.setPointerCapture(event.pointerId);
  }
});
viewport.addEventListener('pointercancel', () => { touchStart = undefined; });
viewport.addEventListener('pointerup', event => {
  if (!touchStart) return;
  const x = event.clientX - touchStart[0];
  const y = event.clientY - touchStart[1];
  touchStart = undefined;
  if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.5) {
    goToChapter(chapterAt(requested) + (x < 0 ? 1 : -1));
  }
});

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([state]) => {
    studyIsVisible = state.isIntersecting;
    if (!studyIsVisible && request) setProgress(requested, true);
  }).observe(track);
  const studyLoader = new IntersectionObserver(([state]) => {
    if (!state.isIntersecting) return;
    studyLoader.disconnect();
    loadStudy();
  }, { rootMargin: '320px' });
  studyLoader.observe(track);
} else {
  loadStudy();
}
if ('ResizeObserver' in window) {
  const changes = new ResizeObserver(measureTrack);
  [track, frame, document.querySelector('#top'), document.querySelector('#services')].forEach(node => changes.observe(node));
}
window.addEventListener('scroll', readScroll, { passive: true });
window.addEventListener('resize', measureTrack, { passive: true });
pin.addEventListener('change', measureTrack);
portrait.addEventListener('change', () => setProgress(requested, true));
reduce.addEventListener('change', () => setProgress(requested, true));
render(0);
measureTrack();
