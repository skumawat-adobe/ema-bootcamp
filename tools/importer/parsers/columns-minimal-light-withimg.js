/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-minimal-light-withimg.
 * Base block: columns.
 * Source: content-detail rc3 "secondary two-column" section — a single image
 *   beside a heading + lead paragraph + CTA button (image + text, side by side).
 * Generated: 2026-09-03
 *
 * Structure (per library-description.txt): flexible columns block.
 *   Row 1: block name (added by createBlock).
 *   Row 2: one cell per visual column. Here 2 columns:
 *          - image cell (the cover image)
 *          - content cell (heading + paragraph + CTA link)
 *   Column count is derived from the direct child <div> columns in the source
 *   grid, matching the block's decorate expectation
 *   (block.firstElementChild.children === columns).
 */
export default function parse(element, { document }) {
  // Each direct child <div> of the grid is a visual column.
  let columns = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: some variants may wrap columns one level deeper.
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Build one cell per column, preserving each column's inner content
  // (images/pictures, headings, paragraphs, CTA buttons/links).
  const rowCells = columns
    .map((col) => {
      const content = Array.from(col.childNodes).filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        // keep non-empty text nodes
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0;
      });
      return content;
    })
    .filter((cell) => cell.length > 0);

  // Empty-block guard: nothing meaningful to emit.
  if (rowCells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Even row padding: ensure the content row has the same number of cells as
  // the widest row (all rows share the max column count). With a single row
  // this is a no-op, but it keeps the block table well-formed if the source
  // ever yields uneven columns.
  const columnCount = rowCells.length;
  while (rowCells.length < columnCount) {
    rowCells.push('');
  }

  const cells = [];
  cells.push(rowCells); // single content row: one cell per column

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-minimal-light-withimg', cells });
  element.replaceWith(block);
}
