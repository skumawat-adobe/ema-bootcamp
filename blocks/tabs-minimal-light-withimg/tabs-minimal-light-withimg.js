// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * Testimonials tabs block.
 * Authored structure: each row = [tab-cell (avatar + name + role),
 * panel-cell (image + name + role + quote)].
 * Renders the active testimonial panel on top and a row of tab buttons below.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-minimal-light-withimg-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const tabContent = cells[0]; // avatar + name + role
    const panelContent = cells[1]; // large image + name + role + quote

    const id = toClassName(tabContent.textContent) || `tab-${i}`;

    // --- Panel (reuse the row element) ---
    row.className = 'tabs-minimal-light-withimg-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');

    if (panelContent) {
      panelContent.className = 'tabs-minimal-light-withimg-panel-inner';
      const mediaP = panelContent.querySelector('picture')?.closest('p')
        || panelContent.firstElementChild;
      if (mediaP) mediaP.classList.add('tabs-minimal-light-withimg-panel-media');
      const body = document.createElement('div');
      body.className = 'tabs-minimal-light-withimg-panel-body';
      [...panelContent.children].forEach((child) => {
        if (child !== mediaP) body.append(child);
      });
      panelContent.append(body);
    }

    // --- Tab button (structured: avatar + name/role stack) ---
    const button = document.createElement('button');
    button.className = 'tabs-minimal-light-withimg-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    const avatarP = tabContent.querySelector('picture')?.closest('p');
    const textWrap = document.createElement('div');
    textWrap.className = 'tabs-minimal-light-withimg-tab-text';
    [...tabContent.children].forEach((child) => {
      if (child === avatarP) {
        avatarP.classList.add('tabs-minimal-light-withimg-tab-avatar');
        button.append(avatarP);
      } else {
        textWrap.append(child);
      }
    });
    button.append(textWrap);
    tabContent.remove();

    button.addEventListener('click', () => {
      block.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        panel.setAttribute('aria-hidden', 'true');
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
      });
      row.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-selected', 'true');
    });

    tablist.append(button);
  });

  // panel(s) render first (active on top), tab menu below — matches source
  block.append(tablist);
}
