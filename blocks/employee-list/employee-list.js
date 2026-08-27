import { fetchConfigs, fetchPlaceholders } from '../../scripts/scripts.js';

const PAGE_SIZE = 10;
const DEFAULT_SOURCE = '/employees.json';

function buildEmployeeCard(employee) {
  const li = document.createElement('li');
  li.className = 'employee-list-card';

  const name = document.createElement('p');
  name.className = 'employee-list-name';
  name.textContent = employee.Name;
  li.append(name);

  const dl = document.createElement('dl');
  [
    ['Department', employee.Department],
    ['Experience', employee.Experience],
    ['City', employee.City],
  ].forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    dl.append(dt, dd);
  });
  li.append(dl);

  return li;
}

export default async function decorate(block) {
  block.textContent = '';

  const [configs, placeholders] = await Promise.all([fetchConfigs(), fetchPlaceholders()]);
  const source = configs.employeeListSource || DEFAULT_SOURCE;

  const resp = await fetch(source);
  if (!resp.ok) return;
  const { data = [] } = await resp.json();

  const list = document.createElement('ul');
  list.className = 'employee-list-items';

  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.className = 'employee-list-load-more';
  loadMore.textContent = placeholders.loadMore || 'Load more';

  let rendered = 0;
  const renderNext = () => {
    data
      .slice(rendered, rendered + PAGE_SIZE)
      .forEach((employee) => list.append(buildEmployeeCard(employee)));
    rendered += PAGE_SIZE;
    loadMore.hidden = rendered >= data.length;
  };

  loadMore.addEventListener('click', renderNext);
  renderNext();

  block.append(list, loadMore);
}
