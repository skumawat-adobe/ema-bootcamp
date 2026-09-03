/*
 * Banner (overlay call-to-action) variant.
 * Full-bleed background image with a dark overlay and text/CTA on top.
 * Expected structure: one row whose first cell holds the background image
 * and subsequent cell(s) hold the heading, subheading and CTA content.
 */

export default function decorate(block) {
  const [imageCell, contentCell] = block.querySelectorAll(':scope > div > div');

  if (imageCell && imageCell.querySelector('picture, img')) {
    imageCell.classList.add('banner-minimal-dark-withimg-image');
  } else {
    block.classList.add('no-image');
  }

  if (contentCell) {
    contentCell.classList.add('banner-minimal-dark-withimg-content');
  }
}
