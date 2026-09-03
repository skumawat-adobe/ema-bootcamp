/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html (validated for both the article-detail and
 * landing-page templates on https://wknd-trendsetters.site/).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (selectors from captured DOM):
    //  - a.skip-link   : accessibility skip link
    //  - div.navbar    : global header / nav with mega menu
    //  - footer.footer : global site footer (class "footer inverse-footer")
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);

    // Breadcrumbs: scoped removal. The hero parser (hero-minimal-dark-withimg)
    // extracts div.breadcrumbs into the hero block's content cell and moves it
    // inside the generated <table> BEFORE this afterTransform hook runs. That
    // breadcrumb is authorable hero content (e.g. landing-page rc2 hero) and
    // must survive. Only remove breadcrumbs that remain as standalone site
    // chrome (i.e. not captured inside a parsed block table).
    element.querySelectorAll('div.breadcrumbs').forEach((bc) => {
      if (!bc.closest('table')) bc.remove();
    });
  }
}
