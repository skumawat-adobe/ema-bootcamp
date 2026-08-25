export default function decorate(block) {
  const [, titleRow, colorRow] = block.children;

  const titleCell = titleRow?.firstElementChild;
  titleCell?.classList.add('banner-title');

  const color = colorRow?.textContent.trim();
  if (color) block.style.setProperty('--banner-background-color', color);
  colorRow?.remove();
}
