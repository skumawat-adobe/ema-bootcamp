/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-minimal-dark-withimg
 * Base block: hero
 * Source: https://wknd-trendsetters.site/blog/ace-pro-court-polo
 * Generated: 2026-09-03
 *
 * Structure (per authoring-analysis.json blockStructures): two-column layout,
 * 1 content row x 2 columns.
 *   - Column 1: image cell (cover image)
 *   - Column 2: content cell (breadcrumbs + H1 title + author/date/read-time meta + category tag)
 *
 * Source DOM: div.grid-layout > (div > img.cover-image) + (div > breadcrumbs, h1, meta, tag)
 */
export default function parse(element, { document }) {
  // Direct children of the grid layout are the two columns (image, content).
  const columns = element.querySelectorAll(':scope > div');
  const firstCol = columns[0] || null;
  const secondCol = columns[1] || null;

  // --- Column 1: image ---
  // Prefer the cover image; fall back to any image in the first column, then anywhere.
  const image = (firstCol && firstCol.querySelector('img.cover-image, img[class*="cover"], img'))
    || element.querySelector('img.cover-image, img[class*="cover"], img');

  // --- Column 2: content ---
  const contentSource = secondCol || element;
  const contentCell = [];

  // Breadcrumbs (optional)
  const breadcrumbs = contentSource.querySelector('.breadcrumbs, nav, [class*="breadcrumb"]');
  if (breadcrumbs) contentCell.push(breadcrumbs);

  // Title heading (H1, with fallbacks for heading variations)
  const heading = contentSource.querySelector('h1, h2, [class*="heading"], [class*="title"]');
  if (heading) contentCell.push(heading);

  // Author / date / read-time meta and category tag.
  // Collect the remaining direct-child blocks of the content column that are not
  // the breadcrumbs or heading (meta wrapper(s) and tag), preserving order.
  const contentChildren = contentSource.querySelectorAll(':scope > *');
  contentChildren.forEach((child) => {
    if (child === breadcrumbs || child === heading) return;
    if (child.tagName === 'IMG') return; // guard against stray images in content
    contentCell.push(child);
  });

  // Empty-block guard: if we have neither an image nor content, unwrap gracefully.
  if (!image && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = image || '';

  const cells = [];
  // Single content row, two columns: [image, content]
  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-minimal-dark-withimg', cells });
  element.replaceWith(block);
}
