export default function decorate(block) {
  const cols = [...block.children];
  cols.forEach((col) => {
    if (col.querySelector('picture')) {
      col.classList.add('hero-images');
    } else {
      col.classList.add('hero-content');
    }
  });

  const content = block.querySelector('.hero-content');
  if (content) {
    const cell = content.querySelector('h1')?.closest('div') || content;
    const linkParas = [...cell.querySelectorAll(':scope > p')].filter((p) => {
      const a = p.querySelector(':scope > a');
      return a && p.childElementCount === 1;
    });
    if (linkParas.length) {
      const group = document.createElement('div');
      group.className = 'button-group';
      linkParas.forEach((p, i) => {
        const a = p.querySelector('a');
        a.classList.add('button');
        if (i > 0) a.classList.add('secondary');
        group.append(p);
      });
      cell.append(group);
    }
  }

  if (!block.querySelector('.hero-images')) {
    block.classList.add('no-image');
  }
}
