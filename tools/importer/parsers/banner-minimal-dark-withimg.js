/* eslint-disable */
/* global WebImporter */
/**
 * Parser for banner-minimal-dark-withimg
 * Base block: banner
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (banner decorate()): single content row x 2 columns.
 *   The block JS reads `:scope > div > div` as [imageCell, contentCell]:
 *   - Cell 1: background image (full-bleed, dark overlay applied via CSS ::after)
 *   - Cell 2: content = heading + subheading + CTA button
 *
 * Source DOM:
 *   div.grid-layout > div(relative) > img.cover-image.utility-overlay
 *                                   + div.overlay
 *                                   + div.card-body > h2 + p.subheading + div.button-group > a
 */
export default function parse(element, { document }) {
  // The banner content lives inside a single positioned wrapper.
  const wrapper = element.querySelector(':scope > div') || element;

  // --- Image cell: full-bleed background image ---
  const image = wrapper.querySelector('img.cover-image, img[class*="overlay"], img[class*="cover"], img')
    || element.querySelector('img');

  // --- Content cell: heading + subheading + CTA ---
  const contentCell = [];
  const body = wrapper.querySelector('.card-body') || wrapper;
  const heading = body.querySelector('h1, h2, h3, [class*="heading"], [class*="title"]');
  if (heading) contentCell.push(heading);
  const subheading = body.querySelector('p.subheading, .subheading, p');
  if (subheading) contentCell.push(subheading);
  const ctas = Array.from(body.querySelectorAll('.button-group a, a.button, a.inverse-button'));
  ctas.forEach((cta) => contentCell.push(cta));

  // Empty-block guard.
  if (!image && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row, two columns: [image, content]
  cells.push([image || '', contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-minimal-dark-withimg', cells });
  element.replaceWith(block);
}
