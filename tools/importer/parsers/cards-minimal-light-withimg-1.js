/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-minimal-light-withimg-1
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (Cards library convention: 2 columns + cards decorate()): one row per card.
 *   Each card row: cell 1 = image, cell 2 = text body (tag + date meta + H3 title).
 *   The block JS turns a single-image div into the card image and the other into
 *   the card body. The card's link is preserved on the title so the card stays clickable.
 *
 * Source DOM:
 *   div.grid-layout > a.article-card.card-link
 *                      > div.article-card-image > img.cover-image
 *                      + div.article-card-body > (div.article-card-meta > span.tag + span.date)
 *                                              + h3.h4-heading
 */
export default function parse(element, { document }) {
  // Each card is an anchor wrapping image + body.
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cards.forEach((card) => {
    const href = card.getAttribute('href');

    // --- Image cell ---
    const img = card.querySelector('.article-card-image img, img.cover-image, img[class*="cover"], img');

    // --- Body cell: meta (tag + date) + heading, with title linked to the card href ---
    const bodyCell = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) bodyCell.push(meta);
    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) {
      if (href) {
        // Wrap the heading text in a link so the card title remains clickable.
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.append(...heading.childNodes);
        heading.append(link);
      }
      bodyCell.push(heading);
    }

    if (!img && bodyCell.length === 0) return;
    cells.push([img || '', bodyCell.length ? bodyCell : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-minimal-light-withimg-1', cells });
  element.replaceWith(block);
}
