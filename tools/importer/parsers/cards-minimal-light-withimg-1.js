/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-minimal-light-withimg-1
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (Cards library convention: 2 columns + cards decorate()): one row per card.
 *   Each card row: cell 1 = image, cell 2 = text body (tag + optional date meta + H3 title
 *   + optional description). The block JS turns a single-image div into the card image and
 *   the other into the card body. The card's link is preserved on the title so the card
 *   stays clickable.
 *
 * Source DOM (two shapes handled generically):
 *   Article cards (landing/listing pages) — each card wrapped in its own anchor:
 *     div.grid-layout > a.article-card.card-link
 *                        > div.article-card-image > img.cover-image
 *                        + div.article-card-body > (div.article-card-meta > span.tag + span.date)
 *                                                + h3.h4-heading
 *   Trend cards (content-detail page) — server markup collapses the per-card anchors so
 *   that ONLY the first card keeps its <a> wrapper and the remaining cards render as bare
 *   image/body div pairs directly under the grid:
 *     div.grid-layout > a.trend-card.card-link
 *                          > div.trend-card-image > img.cover-image
 *                          + div.trend-card-body  > span.tag + h3 + p.paragraph-sm
 *                      + div.trend-card-image ...      (card 2, no anchor)
 *                      + div.trend-card-body  ...
 *                      + ...                            (cards 3..N, no anchor)
 *
 * Because the anchor wrapping is unreliable, cards are detected by their BODY wrapper
 * (`*-card-body`) and each body is paired with its immediately preceding image wrapper
 * (`*-card-image`). This works for both shapes: for anchor-wrapped cards the image is the
 * body's previous sibling inside the anchor; for the flattened trend grid the image is the
 * body's previous sibling directly under the grid. All meaningful body content (tag/meta,
 * heading[linked], description) is captured in source order so trend-card descriptions and
 * tags are preserved without regressing article cards.
 */
export default function parse(element, { document }) {
  const IMAGE_SEL = '.article-card-image, .trend-card-image, [class*="card-image"]';
  const BODY_SEL = '.article-card-body, .trend-card-body, [class*="card-body"]';

  // Fallback href: when the per-card anchors have collapsed, only the first card
  // retains its <a>. All cards in such a grid share the same destination, so use
  // the first anchor's href for cards that have lost their own anchor.
  const firstAnchor = element.querySelector('a[href]');
  const fallbackHref = firstAnchor ? firstAnchor.getAttribute('href') : null;

  const isImageWrapper = (node) => node && node.nodeType === 1
    && typeof node.className === 'string' && /card-image/.test(node.className);

  const cells = [];

  // Primary strategy: one card per body wrapper.
  let bodyWrappers = Array.from(element.querySelectorAll(BODY_SEL));

  const buildRow = (imgWrapper, bodyContainer, href) => {
    // --- Image cell ---
    const img = imgWrapper
      ? imgWrapper.querySelector('img')
      : (bodyContainer ? null : null);

    // --- Body cell: capture all meaningful children in source order. ---
    const bodyCell = [];
    if (bodyContainer) {
      Array.from(bodyContainer.children).forEach((node) => {
        if (node.nodeType !== 1) return;
        const isHeading = /^H[1-6]$/.test(node.tagName)
          || (typeof node.className === 'string' && /heading/.test(node.className));
        if (isHeading && href) {
          // Wrap the heading text in a link so the card title remains clickable.
          const link = document.createElement('a');
          link.setAttribute('href', href);
          link.append(...node.childNodes);
          node.append(link);
        }
        bodyCell.push(node);
      });
    }

    if (!img && bodyCell.length === 0) return;
    cells.push([img || '', bodyCell.length ? bodyCell : '']);
  };

  if (bodyWrappers.length) {
    bodyWrappers.forEach((body) => {
      // Image wrapper is normally the body's immediately preceding sibling.
      let imgWrapper = body.previousElementSibling;
      if (!isImageWrapper(imgWrapper)) {
        // Fallback: look inside the same anchor, else the nearest preceding image wrapper.
        const anchor = body.closest('a');
        imgWrapper = anchor ? anchor.querySelector(IMAGE_SEL) : null;
      }
      const ownAnchor = body.closest('a');
      const href = (ownAnchor && ownAnchor.getAttribute('href')) || fallbackHref;
      buildRow(imgWrapper, body, href);
    });
  } else {
    // Fallback strategy: no recognizable body wrappers — treat each direct anchor
    // as a card and split its children into image vs. everything-else.
    const anchors = Array.from(element.querySelectorAll(':scope > a'));
    anchors.forEach((card) => {
      const href = card.getAttribute('href') || fallbackHref;
      const imgWrapper = card.querySelector(IMAGE_SEL);
      const img = card.querySelector('img.cover-image, img[class*="cover"], img');
      const bodyCell = [];
      Array.from(card.children).forEach((node) => {
        if (node.nodeType !== 1) return;
        if (imgWrapper && (node === imgWrapper || node.contains(imgWrapper))) return;
        if (!imgWrapper && img && (node === img || node.contains(img))) return;
        const isHeading = /^H[1-6]$/.test(node.tagName)
          || (typeof node.className === 'string' && /heading/.test(node.className));
        if (isHeading && href) {
          const link = document.createElement('a');
          link.setAttribute('href', href);
          link.append(...node.childNodes);
          node.append(link);
        }
        bodyCell.push(node);
      });
      if (!img && bodyCell.length === 0) return;
      cells.push([img || '', bodyCell.length ? bodyCell : '']);
    });
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-minimal-light-withimg-1', cells });
  element.replaceWith(block);
}
