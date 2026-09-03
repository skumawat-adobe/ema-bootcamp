import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const DATE_RE = new RegExp(`\\s*(${MONTHS}\\s+\\d{1,2})\\s*$`, 'i');

/**
 * Split a "Category words Month Day" string into a category pill and a date meta.
 * Falls back to just a category tag when no trailing date is present.
 */
function decorateMeta(p) {
  const text = p.textContent.trim();
  const match = text.match(DATE_RE);
  const dateText = match ? match[1] : '';
  const categoryText = match ? text.slice(0, match.index).trim() : text;

  p.textContent = '';
  p.classList.add('cards-minimal-light-withimg-1-card-meta');

  if (categoryText) {
    const tag = document.createElement('span');
    tag.className = 'cards-minimal-light-withimg-1-card-tag';
    tag.textContent = categoryText;
    p.append(tag);
  }
  if (dateText) {
    const date = document.createElement('span');
    date.className = 'cards-minimal-light-withimg-1-card-date';
    date.textContent = dateText;
    p.append(date);
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-minimal-light-withimg-1-card-image';
      else div.className = 'cards-minimal-light-withimg-1-card-body';
    });

    const body = li.querySelector('.cards-minimal-light-withimg-1-card-body');
    if (body) {
      const meta = body.querySelector('p');
      if (meta) decorateMeta(meta);

      // Make the whole card clickable, mirroring the source (card = link).
      const link = body.querySelector('h3 a, a');
      if (link) {
        li.classList.add('cards-minimal-light-withimg-1-card-clickable');
        li.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          link.click();
        });
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
