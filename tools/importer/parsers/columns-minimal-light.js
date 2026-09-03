/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-minimal-light.
 * Base block: columns.
 * Source: rc3 "Let's connect" contact section — a two-column text layout
 *   (left: intro heading + lead paragraph; right: labeled contact details).
 * Generated: 2026-09-03
 *
 * Structure (per library-description.txt): flexible columns block.
 *   Row 1: block name (added by createBlock).
 *   Row 2: one cell per visual column. Column count is derived from the
 *          direct child columns in the source grid, matching the block's
 *          decorate expectation (block.firstElementChild.children === columns).
 */
export default function parse(element, { document }) {
  // Each direct child <div> of the grid is a visual column.
  let columns = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: some variants may wrap columns one level deeper.
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Build one cell per column, preserving each column's inner content
  // (headings, paragraphs, mailto/tel links, nested contact groups).
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

  const cells = [];
  cells.push(rowCells); // single content row: one cell per column

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-minimal-light', cells });
  element.replaceWith(block);
}
