import './study.js';

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.toggleAttribute('data-open', open);
}
menu.addEventListener('click', () => setMenu(!nav.hasAttribute('data-open')));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.hasAttribute('data-open')) {
    setMenu(false);
    menu.focus();
  }
});

const notice = document.querySelector('#toast');
let noticeTimeout;
function showNotice(message) {
  notice.textContent = message;
  notice.classList.remove('hidden');
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => notice.classList.add('hidden'), 3000);
}
document.addEventListener('scopeprepared', () => showNotice('Shoot details added to your brief.'));

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lb-image');
const lightboxTitle = document.querySelector('#lb-title');
const lightboxCaption = document.querySelector('#lb-caption');
const lightboxCounter = document.querySelector('#lb-counter');
const lightboxNav = document.querySelector('.lightbox-controls');
let activeImages = [];
let activeImage = 0;
let opener;

function viewImage(index) {
  activeImage = (index + activeImages.length) % activeImages.length;
  const card = activeImages[activeImage];
  const thumbnail = card.querySelector('img');
  lightboxImage.src = card.dataset.full;
  lightboxImage.alt = thumbnail.alt;
  lightboxTitle.textContent = card.querySelector('span').textContent;
  lightboxCaption.textContent = card.dataset.caption || '';
  lightboxCaption.hidden = !lightboxCaption.textContent;
  lightboxCounter.textContent = (activeImage + 1) + ' / ' + activeImages.length;
  lightboxNav.hidden = activeImages.length < 2;
}

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const cards = [...gallery.querySelectorAll('.gallery-card')];
  const filters = [...gallery.querySelectorAll('[data-filter]')];
  filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    cards.forEach(card => {
      card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
    });
  }));
  gallery.addEventListener('click', event => {
    const card = event.target.closest('.gallery-card');
    if (!card) return;
    opener = card;
    activeImages = cards.filter(item => !item.hidden);
    viewImage(activeImages.indexOf(card));
    lightbox.showModal();
  });
});

document.querySelector('#lb-prev').addEventListener('click', () => viewImage(activeImage - 1));
document.querySelector('#lb-next').addEventListener('click', () => viewImage(activeImage + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') viewImage(activeImage - 1);
  if (event.key === 'ArrowRight') viewImage(activeImage + 1);
});
lightbox.addEventListener('close', () => {
  lightboxImage.removeAttribute('src');
  opener?.focus();
});

const form = document.querySelector('#enquiry-form');
const briefPanel = document.querySelector('#brief-ready-panel');
const briefOutput = document.querySelector('#brief-output-text');
const copyBrief = document.querySelector('#copy-brief-btn');
const projectNotes = document.querySelector('#f-notes');

form.hidden = false;
form.addEventListener('input', () => {
  projectNotes.setCustomValidity('');
  briefPanel.classList.add('hidden');
  briefOutput.textContent = '';
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!projectNotes.value.trim()) {
    projectNotes.setCustomValidity('Enter a short description of the shoot.');
    projectNotes.reportValidity();
    return;
  }
  const details = new FormData(form);
  const value = name => String(details.get(name) || '').trim();
  briefOutput.textContent = [
    'SixthVision caravan photo and video brief',
    '',
    'Company: ' + value('company'),
    'Contact: ' + value('name') + ' (' + value('email') + ')',
    'Phone: ' + (value('phone') || 'Not supplied'),
    'Location: ' + value('location'),
    'Services: ' + value('service'),
    'Package: ' + (value('shootType') || 'To discuss'),
    'Models: ' + value('models'),
    'Timeframe: ' + value('timeframe'),
    '',
    'Project details',
    value('notes'),
  ].join('\n');
  briefPanel.classList.remove('hidden');
  briefPanel.focus();
});
copyBrief.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(briefOutput.textContent);
    showNotice('Brief copied.');
  } catch {
    const range = document.createRange();
    range.selectNodeContents(briefOutput);
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    showNotice('Brief selected. Use your device’s copy command.');
  }
});
