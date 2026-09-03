import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  // Metadata-independent dual-path: try the local content path first (aem up
  // serves the working-copy fragment under /content), then fall back to the
  // site root where DA/EDS publishes the fragment in production.
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment) fragment = await loadFragment('/footer');

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag the brand column (first section: logo + social list) and its social row
  // so the layout CSS can target them without relying on positional selectors.
  const [brandCol] = footer.children;
  if (brandCol) {
    brandCol.classList.add('footer-brand');
    const socialList = brandCol.querySelector('ul');
    if (socialList) socialList.classList.add('footer-social');
  }

  block.append(footer);
}
