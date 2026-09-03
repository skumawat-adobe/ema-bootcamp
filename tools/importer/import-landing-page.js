/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMinimalLightWithimg1Parser from './parsers/hero-minimal-light-withimg-1.js';
import heroMinimalDarkWithimgParser from './parsers/hero-minimal-dark-withimg.js';
import cardsMinimalLightWithimgParser from './parsers/cards-minimal-light-withimg.js';
import tabsMinimalLightWithimgParser from './parsers/tabs-minimal-light-withimg.js';
import cardsMinimalLightWithimg1Parser from './parsers/cards-minimal-light-withimg-1.js';
import accordionModerateLightParser from './parsers/accordion-moderate-light.js';
import bannerMinimalDarkWithimgParser from './parsers/banner-minimal-dark-withimg.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'landing-page',
  description: 'Rich multi-section landing with hero header, centered intro blocks, multiple 4-column feature/card grids, a tabbed section, and an overlay call-to-action banner',
  urls: [
    'https://wknd-trendsetters.site/',
    'https://wknd-trendsetters.site/fashion-trends-of-the-season',
    'https://wknd-trendsetters.site/fashion-trends-young-adults',
  ],
  blocks: [
    {
      name: 'hero-minimal-light-withimg-1',
      instances: ['#main-content > header.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'hero-minimal-dark-withimg',
      instances: ['#main-content > section.section div.grid-layout.tablet-1-column.grid-gap-lg:has(.breadcrumbs)'],
    },
    {
      name: 'cards-minimal-light-withimg',
      instances: [
        'section.section.secondary-section div.grid-layout.desktop-4-column.grid-gap-sm',
        'div.grid-layout.desktop-4-column.grid-gap-sm',
        'div.grid-layout.desktop-3-column.grid-gap-sm',
      ],
    },
    {
      name: 'tabs-minimal-light-withimg',
      instances: ['#main-content > section.section div.tabs-wrapper'],
    },
    {
      name: 'cards-minimal-light-withimg-1',
      instances: [
        'section.section.secondary-section div.grid-layout.desktop-4-column.grid-gap-md',
        '#trends > div.container > div.grid-layout.desktop-4-column.grid-gap-md',
        'div.grid-layout.desktop-4-column.grid-gap-md',
        'div.grid-layout.desktop-3-column.grid-gap-lg',
        'div.grid-layout.desktop-3-column.grid-gap-xxl',
      ],
    },
    {
      name: 'accordion-moderate-light',
      instances: ['#main-content > section.section div.faq-list'],
    },
    {
      name: 'banner-minimal-dark-withimg',
      instances: ['#main-content > section.section.inverse-section div.grid-layout.desktop-1-column'],
    },
  ],
  sections: [
    { id: 'rc1', name: 'hero-header', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['hero-minimal-light-withimg-1'], defaultContent: [] },
    { id: 'rc2', name: 'article-teaser-hero', selector: '#main-content > section.section:has(.breadcrumbs)', style: null, blocks: ['hero-minimal-dark-withimg'], defaultContent: [] },
    { id: 'rc3', name: 'image-gallery', selector: '#main-content > section.section.secondary-section:has(div.grid-layout.desktop-4-column.grid-gap-sm)', style: 'secondary', blocks: ['cards-minimal-light-withimg'], defaultContent: ['#main-content > section.section.secondary-section:has(div.grid-layout.desktop-4-column.grid-gap-sm) > div.container > div.utility-text-align-center'] },
    { id: 'rc4', name: 'testimonials-tabs', selector: '#main-content > section.section:has(div.tabs-wrapper)', style: null, blocks: ['tabs-minimal-light-withimg'], defaultContent: [] },
    { id: 'rc5', name: 'latest-articles', selector: '#main-content > section.section:has(div.grid-layout.desktop-4-column.grid-gap-md)', style: 'secondary', blocks: ['cards-minimal-light-withimg-1'], defaultContent: ['#main-content > section.section:has(div.grid-layout.desktop-4-column.grid-gap-md) > div.container > div.utility-text-align-center'] },
    { id: 'rc6', name: 'faq-accordion', selector: '#main-content > section.section:has(div.faq-list)', style: null, blocks: ['accordion-moderate-light'], defaultContent: ['#main-content > section.section:has(div.faq-list) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div:first-child'] },
    { id: 'rc7', name: 'cta-banner', selector: '#main-content > section.section.inverse-section', style: 'inverse', blocks: ['banner-minimal-dark-withimg'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-minimal-light-withimg-1': heroMinimalLightWithimg1Parser,
  'hero-minimal-dark-withimg': heroMinimalDarkWithimgParser,
  'cards-minimal-light-withimg': cardsMinimalLightWithimgParser,
  'tabs-minimal-light-withimg': tabsMinimalLightWithimgParser,
  'cards-minimal-light-withimg-1': cardsMinimalLightWithimg1Parser,
  'accordion-moderate-light': accordionModerateLightParser,
  'banner-minimal-dark-withimg': bannerMinimalDarkWithimgParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * De-duplicates the same DOM element matched by multiple fallback selectors so
 * a block is only parsed once.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return; // same element via another fallback selector
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
