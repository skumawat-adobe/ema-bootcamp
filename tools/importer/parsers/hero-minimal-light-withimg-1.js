/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-minimal-light-withimg-1
 * Base block: hero
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (Hero library convention): 1 column.
 *   - Row 1 (block name) added by createBlock.
 *   - Row 2: background image cell (the stacked cover images become the full-bleed
 *            background per the block CSS: picture is absolute, z-index -1).
 *   - Row 3: content cell (H1 heading + subheading + two CTA buttons).
 *
 * Source DOM: div.grid-layout > (div > h1 + p.subheading + div.button-group>a)
 *                              + (div.grid-layout > img.cover-image x3)
 * The block's decorate() checks the first row for a picture to toggle 'no-image';
 * placing the images in the first content row keeps the image state correct.
 */
export default function parse(element, { document }) {
  // Top-level columns of the source grid: text column + image column.
  const columns = element.querySelectorAll(':scope > div');
  const textCol = columns[0] || element;
  const imageCol = columns[1] || null;

  // --- Background image row: stacked cover images ---
  const imageSource = imageCol || element;
  const images = Array.from(imageSource.querySelectorAll('img.cover-image, img[class*="cover"], img'));

  // --- Content row: heading + subheading + CTA buttons ---
  const contentCell = [];
  const heading = textCol.querySelector('h1, h2, [class*="heading"], [class*="title"]');
  if (heading) contentCell.push(heading);
  const subheading = textCol.querySelector('p.subheading, .subheading, p');
  if (subheading) contentCell.push(subheading);
  const ctas = Array.from(textCol.querySelectorAll('.button-group a, a.button'));
  ctas.forEach((cta) => contentCell.push(cta));

  // Empty-block guard.
  if (images.length === 0 && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row: background image(s) (single column)
  cells.push([images.length ? images : '']);
  // Row: content (single column)
  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-minimal-light-withimg-1', cells });
  element.replaceWith(block);
}
