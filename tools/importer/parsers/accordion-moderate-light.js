/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-moderate-light
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (Accordion library convention: 2 columns + accordion decorate()): one row per item.
 *   The block JS takes row.children[0] as the summary/question and row.children[1]
 *   as the details/answer body.
 *   - Cell 1: question text
 *   - Cell 2: answer content
 *
 * Source DOM:
 *   div.faq-list > details.faq-item > summary.faq-question > span (question) + img (icon)
 *                                   + div.faq-answer > p (answer)
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('details.faq-item, details, .faq-item'));

  const cells = [];
  items.forEach((item) => {
    // --- Question cell: text from the summary (drop the decorative toggle icon) ---
    const summary = item.querySelector('summary, .faq-question');
    let questionCell = '';
    if (summary) {
      const questionText = summary.querySelector('span');
      questionCell = questionText || summary.textContent.trim();
    }

    // --- Answer cell: the answer body ---
    const answer = item.querySelector('.faq-answer');
    const answerCell = answer || '';

    if (questionCell === '' && answerCell === '') return;
    cells.push([questionCell, answerCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-moderate-light', cells });
  element.replaceWith(block);
}
