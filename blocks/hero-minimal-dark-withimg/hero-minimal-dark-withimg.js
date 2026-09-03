/**
 * hero-minimal-dark-withimg
 * Article-detail two-column hero: cover image + title/author-meta/tag.
 * Groups the flat meta paragraphs into structured rows and marks the
 * trailing category paragraph as a pill tag.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const imgCell = cells.find((c) => c.querySelector('picture'));
  const textCell = cells.find((c) => !c.querySelector('picture'));

  if (imgCell) {
    imgCell.classList.add('hero-image');
  } else {
    block.classList.add('no-image');
  }

  if (!textCell) return;
  textCell.classList.add('hero-content');

  const paragraphs = [...textCell.querySelectorAll(':scope > p')];
  if (!paragraphs.length) return;

  // Last paragraph is the category tag pill.
  const tag = paragraphs[paragraphs.length - 1];
  tag.classList.add('hero-tag');

  // Remaining paragraphs form the author/date meta block.
  const meta = paragraphs.slice(0, -1);
  if (!meta.length) return;

  const metaWrap = document.createElement('div');
  metaWrap.className = 'hero-meta';
  const authorRow = document.createElement('div');
  authorRow.className = 'hero-meta-row';
  const dateRow = document.createElement('div');
  dateRow.className = 'hero-meta-row';

  meta.forEach((p, i) => {
    p.classList.add('hero-meta-item');
    if (p.textContent.trim() === 'By') p.classList.add('hero-meta-label');
    // First two items ("By" + author) go on the author row, rest on the date row.
    if (i < 2) authorRow.appendChild(p);
    else dateRow.appendChild(p);
  });

  metaWrap.appendChild(authorRow);
  if (dateRow.children.length) metaWrap.appendChild(dateRow);
  tag.before(metaWrap);
}
