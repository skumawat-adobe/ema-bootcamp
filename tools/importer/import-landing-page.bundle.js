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

  // tools/importer/import-landing-page.js
  var import_landing_page_exports = {};
  __export(import_landing_page_exports, {
    default: () => import_landing_page_default
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

  // tools/importer/parsers/hero-minimal-dark-withimg.js
  function parse2(element, { document: document2 }) {
    const columns = element.querySelectorAll(":scope > div");
    const firstCol = columns[0] || null;
    const secondCol = columns[1] || null;
    const image = firstCol && firstCol.querySelector('img.cover-image, img[class*="cover"], img') || element.querySelector('img.cover-image, img[class*="cover"], img');
    const contentSource = secondCol || element;
    const contentCell = [];
    const breadcrumbs = contentSource.querySelector('.breadcrumbs, nav, [class*="breadcrumb"]');
    if (breadcrumbs) contentCell.push(breadcrumbs);
    const heading = contentSource.querySelector('h1, h2, [class*="heading"], [class*="title"]');
    if (heading) contentCell.push(heading);
    const contentChildren = contentSource.querySelectorAll(":scope > *");
    contentChildren.forEach((child) => {
      if (child === breadcrumbs || child === heading) return;
      if (child.tagName === "IMG") return;
      contentCell.push(child);
    });
    if (!image && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = image || "";
    const cells = [];
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-minimal-dark-withimg", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-minimal-light-withimg.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector('img.cover-image, img[class*="cover"], img');
      if (img) cells.push([img, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-minimal-light-withimg", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-minimal-light-withimg.js
  function parse4(element, { document: document2 }) {
    const panels = Array.from(element.querySelectorAll(".tab-pane"));
    const buttons = Array.from(element.querySelectorAll(".tab-menu-link, .tab-menu button"));
    const count = Math.max(panels.length, buttons.length);
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const button = buttons[i] || null;
      const panel = panels[i] || null;
      let labelCell = "";
      if (button) {
        const labelContent = Array.from(button.childNodes);
        labelCell = labelContent.length ? labelContent : "";
      }
      let panelCell = "";
      if (panel) {
        const inner = panel.querySelector(":scope > .grid-layout") || panel;
        const panelContent = Array.from(inner.childNodes);
        panelCell = panelContent.length ? panelContent : "";
      }
      if (labelCell === "" && panelCell === "") continue;
      cells.push([labelCell, panelCell]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-minimal-light-withimg", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-minimal-light-withimg-1.js
  function parse5(element, { document: document2 }) {
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

  // tools/importer/parsers/accordion-moderate-light.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll("details.faq-item, details, .faq-item"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let questionCell = "";
      if (summary) {
        const questionText = summary.querySelector("span");
        questionCell = questionText || summary.textContent.trim();
      }
      const answer = item.querySelector(".faq-answer");
      const answerCell = answer || "";
      if (questionCell === "" && answerCell === "") return;
      cells.push([questionCell, answerCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-moderate-light", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/banner-minimal-dark-withimg.js
  function parse7(element, { document: document2 }) {
    const wrapper = element.querySelector(":scope > div") || element;
    const image = wrapper.querySelector('img.cover-image, img[class*="overlay"], img[class*="cover"], img') || element.querySelector("img");
    const contentCell = [];
    const body = wrapper.querySelector(".card-body") || wrapper;
    const heading = body.querySelector('h1, h2, h3, [class*="heading"], [class*="title"]');
    if (heading) contentCell.push(heading);
    const subheading = body.querySelector("p.subheading, .subheading, p");
    if (subheading) contentCell.push(subheading);
    const ctas = Array.from(body.querySelectorAll(".button-group a, a.button, a.inverse-button"));
    ctas.forEach((cta) => contentCell.push(cta));
    if (!image && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([image || "", contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "banner-minimal-dark-withimg", cells });
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

  // tools/importer/import-landing-page.js
  var PAGE_TEMPLATE = {
    name: "landing-page",
    description: "Rich multi-section landing with hero header, centered intro blocks, multiple 4-column feature/card grids, a tabbed section, and an overlay call-to-action banner",
    urls: [
      "https://wknd-trendsetters.site/",
      "https://wknd-trendsetters.site/fashion-trends-of-the-season",
      "https://wknd-trendsetters.site/fashion-trends-young-adults"
    ],
    blocks: [
      {
        name: "hero-minimal-light-withimg-1",
        instances: ["#main-content > header.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "hero-minimal-dark-withimg",
        instances: ["#main-content > section.section div.grid-layout.tablet-1-column.grid-gap-lg:has(.breadcrumbs)"]
      },
      {
        name: "cards-minimal-light-withimg",
        instances: [
          "section.section.secondary-section div.grid-layout.desktop-4-column.grid-gap-sm",
          "div.grid-layout.desktop-4-column.grid-gap-sm",
          "div.grid-layout.desktop-3-column.grid-gap-sm"
        ]
      },
      {
        name: "tabs-minimal-light-withimg",
        instances: ["#main-content > section.section div.tabs-wrapper"]
      },
      {
        name: "cards-minimal-light-withimg-1",
        instances: [
          "section.section.secondary-section div.grid-layout.desktop-4-column.grid-gap-md",
          "#trends > div.container > div.grid-layout.desktop-4-column.grid-gap-md",
          "div.grid-layout.desktop-4-column.grid-gap-md",
          "div.grid-layout.desktop-3-column.grid-gap-lg",
          "div.grid-layout.desktop-3-column.grid-gap-xxl"
        ]
      },
      {
        name: "accordion-moderate-light",
        instances: ["#main-content > section.section div.faq-list"]
      },
      {
        name: "banner-minimal-dark-withimg",
        instances: ["#main-content > section.section.inverse-section div.grid-layout.desktop-1-column"]
      }
    ],
    sections: [
      { id: "rc1", name: "hero-header", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["hero-minimal-light-withimg-1"], defaultContent: [] },
      { id: "rc2", name: "article-teaser-hero", selector: "#main-content > section.section:has(.breadcrumbs)", style: null, blocks: ["hero-minimal-dark-withimg"], defaultContent: [] },
      { id: "rc3", name: "image-gallery", selector: "#main-content > section.section.secondary-section:has(div.grid-layout.desktop-4-column.grid-gap-sm)", style: "secondary", blocks: ["cards-minimal-light-withimg"], defaultContent: ["#main-content > section.section.secondary-section:has(div.grid-layout.desktop-4-column.grid-gap-sm) > div.container > div.utility-text-align-center"] },
      { id: "rc4", name: "testimonials-tabs", selector: "#main-content > section.section:has(div.tabs-wrapper)", style: null, blocks: ["tabs-minimal-light-withimg"], defaultContent: [] },
      { id: "rc5", name: "latest-articles", selector: "#main-content > section.section:has(div.grid-layout.desktop-4-column.grid-gap-md)", style: "secondary", blocks: ["cards-minimal-light-withimg-1"], defaultContent: ["#main-content > section.section:has(div.grid-layout.desktop-4-column.grid-gap-md) > div.container > div.utility-text-align-center"] },
      { id: "rc6", name: "faq-accordion", selector: "#main-content > section.section:has(div.faq-list)", style: null, blocks: ["accordion-moderate-light"], defaultContent: ["#main-content > section.section:has(div.faq-list) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div:first-child"] },
      { id: "rc7", name: "cta-banner", selector: "#main-content > section.section.inverse-section", style: "inverse", blocks: ["banner-minimal-dark-withimg"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-minimal-light-withimg-1": parse,
    "hero-minimal-dark-withimg": parse2,
    "cards-minimal-light-withimg": parse3,
    "tabs-minimal-light-withimg": parse4,
    "cards-minimal-light-withimg-1": parse5,
    "accordion-moderate-light": parse6,
    "banner-minimal-dark-withimg": parse7
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
  var import_landing_page_default = {
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
  return __toCommonJS(import_landing_page_exports);
})();
