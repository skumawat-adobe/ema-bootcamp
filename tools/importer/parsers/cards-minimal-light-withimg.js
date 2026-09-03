/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-minimal-light-withimg
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (Cards library convention + cards decorate()): 2 columns.
 *   Each card is one row: cell 1 = cover image, cell 2 = text (empty here —
 *   this is an image-only gallery). The empty second cell keeps every row at
 *   the convention's 2-column width.
 *
 * Source DOM: div.grid-layout > div.utility-aspect-1x1 > img.cover-image (x8)
 */
export default function parse(element, { document }) {
  // Each direct child is one image card.
  const items = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img.cover-image, img[class*="cover"], img');
    // Image cell + empty text cell (image-only gallery) → even 2-column rows.
    if (img) cells.push([img, '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-minimal-light-withimg', cells });
  element.replaceWith(block);
}
