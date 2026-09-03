/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMinimalLightWithimg1Parser from './parsers/hero-minimal-light-withimg-1.js';
import accordionModerateLightParser from './parsers/accordion-moderate-light.js';
import columnsMinimalLightParser from './parsers/columns-minimal-light.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'faq-accordion',
  description: 'Support page with hero header, an FAQ accordion, a two-column contact section, and an accent call-to-action',
  urls: [
    'https://wknd-trendsetters.site/faq',
  ],
  blocks: [
    {
      name: 'hero-minimal-light-withimg-1',
      instances: ['#main-content > header.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'accordion-moderate-light',
      instances: ['#main-content > section.section div.faq-list'],
    },
    {
      name: 'columns-minimal-light',
      instances: ['#main-content > section.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl'],
    },
  ],
  sections: [
    { id: 'rc1', name: 'hero-header', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['hero-minimal-light-withimg-1'], defaultContent: [] },
    { id: 'rc2', name: 'faq-accordion', selector: '#main-content > section.section:has(div.faq-list)', style: null, blocks: ['accordion-moderate-light'], defaultContent: [] },
    { id: 'rc3', name: 'contact-columns', selector: '#main-content > section.section.secondary-section:has(div.grid-layout.tablet-1-column.grid-gap-xxl)', style: 'secondary', blocks: ['columns-minimal-light'], defaultContent: [] },
    { id: 'rc4', name: 'accent-cta', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section > div.container'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-minimal-light-withimg-1': heroMinimalLightWithimg1Parser,
  'accordion-moderate-light': accordionModerateLightParser,
  'columns-minimal-light': columnsMinimalLightParser,
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
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
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
      if (!block.element.parentNode) return;
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
