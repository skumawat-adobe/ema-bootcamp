/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-minimal-light-withimg
 * Base block: tabs
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (Tabs library convention + tabs decorate()): 2 columns, one row per tab.
 *   The block JS takes each row's first element child as the tab label (button
 *   content) and the remaining cell as the tab panel.
 *   - Cell 1: tab label = avatar + name + role (from the .tab-menu button)
 *   - Cell 2: panel content = image + name + role + quote (from the matching .tab-pane)
 *
 * Source DOM:
 *   div.tabs-wrapper > div.tabs-content > div.tab-pane (x4, panel content)
 *                    + div.tab-menu > button.tab-menu-link (x4, label content)
 */
export default function parse(element, { document }) {
  const panels = Array.from(element.querySelectorAll('.tab-pane'));
  const buttons = Array.from(element.querySelectorAll('.tab-menu-link, .tab-menu button'));

  const count = Math.max(panels.length, buttons.length);
  const cells = [];

  for (let i = 0; i < count; i += 1) {
    const button = buttons[i] || null;
    const panel = panels[i] || null;

    // --- Tab label cell: inner content of the menu button (avatar + name + role) ---
    let labelCell = '';
    if (button) {
      const labelContent = Array.from(button.childNodes);
      labelCell = labelContent.length ? labelContent : '';
    }

    // --- Panel cell: content of the tab pane (image + name + role + quote) ---
    let panelCell = '';
    if (panel) {
      // The pane wraps its content in a grid-layout; use it if present, else the pane itself.
      const inner = panel.querySelector(':scope > .grid-layout') || panel;
      const panelContent = Array.from(inner.childNodes);
      panelCell = panelContent.length ? panelContent : '';
    }

    if (labelCell === '' && panelCell === '') continue;
    cells.push([labelCell, panelCell]);
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-minimal-light-withimg', cells });
  element.replaceWith(block);
}
