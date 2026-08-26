import { getMetadata } from '../../scripts/aem.js';

/**
 * Builds a human-readable label from a URL path segment.
 * @param {string} segment URL path segment
 * @returns {string} Humanized label
 */
function humanize(segment) {
  return decodeURIComponent(segment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function decorate(block) {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const pageTitle = getMetadata('og:title') || document.title;

  const crumbs = [{ label: 'Home', path: '/' }];
  let path = '';
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    const isLast = i === segments.length - 1;
    crumbs.push({
      label: isLast && pageTitle ? pageTitle : humanize(segment),
      path: isLast ? null : path,
    });
  });

  const ol = document.createElement('ol');
  crumbs.forEach((crumb) => {
    const li = document.createElement('li');
    if (crumb.path) {
      const a = document.createElement('a');
      a.href = crumb.path;
      a.textContent = crumb.label;
      li.append(a);
    } else {
      li.textContent = crumb.label;
      li.setAttribute('aria-current', 'page');
    }
    ol.append(li);
  });

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(ol);

  block.replaceChildren(nav);
}
