/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-content-detail.js
  var import_content_detail_exports = {};
  __export(import_content_detail_exports, {
    default: () => import_content_detail_default
  });

  // tools/importer/parsers/hero-minimal-light-withimg-1.js
  function parse(element, { document: document2 }) {
    const columns = element.querySelectorAll(":scope > div");
    const textCol = columns[0] || element;
    const imageCol = columns[1] || null;
    const imageSource = imageCol || element;
    const images = Array.from(imageSource.querySelectorAll('img.cover-image, img[class*="cover"], img'));
    const contentCell = [];
    const heading = textCol.querySelector('h1, h2, [class*="heading"], [class*="title"]');
    if (heading) contentCell.push(heading);
    const subheading = textCol.querySelector("p.subheading, .subheading, p");
    if (subheading) contentCell.push(subheading);
    const ctas = Array.from(textCol.querySelectorAll(".button-group a, a.button"));
    ctas.forEach((cta) => contentCell.push(cta));
    if (images.length === 0 && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([images.length ? images : ""]);
    cells.push([contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-minimal-light-withimg-1", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-minimal-light-withimg-1.js
  function parse2(element, { document: document2 }) {
    const IMAGE_SEL = '.article-card-image, .trend-card-image, [class*="card-image"]';
    const BODY_SEL = '.article-card-body, .trend-card-body, [class*="card-body"]';
    const firstAnchor = element.querySelector("a[href]");
    const fallbackHref = firstAnchor ? firstAnchor.getAttribute("href") : null;
    const isImageWrapper = (node) => node && node.nodeType === 1 && typeof node.className === "string" && /card-image/.test(node.className);
    const cells = [];
    let bodyWrappers = Array.from(element.querySelectorAll(BODY_SEL));
    const buildRow = (imgWrapper, bodyContainer, href) => {
      const img = imgWrapper ? imgWrapper.querySelector("img") : bodyContainer ? null : null;
      const bodyCell = [];
      if (bodyContainer) {
        Array.from(bodyContainer.children).forEach((node) => {
          if (node.nodeType !== 1) return;
          const isHeading = /^H[1-6]$/.test(node.tagName) || typeof node.className === "string" && /heading/.test(node.className);
          if (isHeading && href) {
            const link = document2.createElement("a");
            link.setAttribute("href", href);
            link.append(...node.childNodes);
            node.append(link);
          }
          bodyCell.push(node);
        });
      }
      if (!img && bodyCell.length === 0) return;
      cells.push([img || "", bodyCell.length ? bodyCell : ""]);
    };
    if (bodyWrappers.length) {
      bodyWrappers.forEach((body) => {
        let imgWrapper = body.previousElementSibling;
        if (!isImageWrapper(imgWrapper)) {
          const anchor = body.closest("a");
          imgWrapper = anchor ? anchor.querySelector(IMAGE_SEL) : null;
        }
        const ownAnchor = body.closest("a");
        const href = ownAnchor && ownAnchor.getAttribute("href") || fallbackHref;
        buildRow(imgWrapper, body, href);
      });
    } else {
      const anchors = Array.from(element.querySelectorAll(":scope > a"));
      anchors.forEach((card) => {
        const href = card.getAttribute("href") || fallbackHref;
        const imgWrapper = card.querySelector(IMAGE_SEL);
        const img = card.querySelector('img.cover-image, img[class*="cover"], img');
        const bodyCell = [];
        Array.from(card.children).forEach((node) => {
          if (node.nodeType !== 1) return;
          if (imgWrapper && (node === imgWrapper || node.contains(imgWrapper))) return;
          if (!imgWrapper && img && (node === img || node.contains(img))) return;
          const isHeading = /^H[1-6]$/.test(node.tagName) || typeof node.className === "string" && /heading/.test(node.className);
          if (isHeading && href) {
            const link = document2.createElement("a");
            link.setAttribute("href", href);
            link.append(...node.childNodes);
            node.append(link);
          }
          bodyCell.push(node);
        });
        if (!img && bodyCell.length === 0) return;
        cells.push([img || "", bodyCell.length ? bodyCell : ""]);
      });
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-minimal-light-withimg-1", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-minimal-light-withimg.js
  function parse3(element, { document: document2 }) {
    let columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      columns = Array.from(element.children);
    }
    const rowCells = columns.map((col) => {
      const content = Array.from(col.childNodes).filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0;
      });
      return content;
    }).filter((cell) => cell.length > 0);
    if (rowCells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const columnCount = rowCells.length;
    while (rowCells.length < columnCount) {
      rowCells.push("");
    }
    const cells = [];
    cells.push(rowCells);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-minimal-light-withimg", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer"
      ]);
      element.querySelectorAll("div.breadcrumbs").forEach((bc) => {
        if (!bc.closest("table")) bc.remove();
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-content-detail.js
  var PAGE_TEMPLATE = {
    name: "content-detail",
    description: "Single-topic content page with hero header, a trend card grid, a two-column image+text block, and an accent call-to-action",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    blocks: [
      {
        name: "hero-minimal-light-withimg-1",
        instances: ["#main-content > header.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "cards-minimal-light-withimg-1",
        instances: ["#trends div.grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "columns-minimal-light-withimg",
        instances: ["#main-content > section.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-lg"]
      }
    ],
    sections: [
      { id: "rc1", name: "hero-header", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["hero-minimal-light-withimg-1"], defaultContent: [] },
      { id: "rc2", name: "trend-card-grid", selector: "#trends", style: null, blocks: ["cards-minimal-light-withimg-1"], defaultContent: ["#trends > div.container > div.utility-text-align-center"] },
      { id: "rc3", name: "secondary-two-column", selector: "#main-content > section.section.secondary-section:has(div.grid-layout.tablet-1-column.grid-gap-lg)", style: "secondary", blocks: ["columns-minimal-light-withimg"], defaultContent: [] },
      { id: "rc4", name: "accent-cta", selector: "#main-content > section.section.accent-section", style: "accent", blocks: [], defaultContent: ["#main-content > section.section.accent-section > div.container"] }
    ]
  };
  var parsers = {
    "hero-minimal-light-withimg-1": parse,
    "cards-minimal-light-withimg-1": parse2,
    "columns-minimal-light-withimg": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_content_detail_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_content_detail_exports);
})();
