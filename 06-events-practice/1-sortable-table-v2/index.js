export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.tableData = data;
    this.headerIds = [];
    this.subElements = {};
    this.render();
  }

  get header() {
    const result = document.createElement('div');

    this.headerConfig.forEach(item => {
      this.headerIds.push(item.id);
      result.insertAdjacentHTML(
        'beforeend',
        `<div class="sortable-table__cell" data-name="${item.id}" data-sortable="${item.sortable}" data-order="asc">
              <span>${item.title}</span>
              ${item.sortable ? '<span class="sortable-table__sort-arrow"><span class="sortable-table__sort-arrow_asc"></span></span>' : ''}
            </div>`
      );
    })

    return result.innerHTML;
  }

  get body() {
    const result = document.createElement('div');

    this.tableData.forEach(dataItem => {
      const row = document.createElement('div');
      row.classList.add('sortable-table__row');

      this.headerIds.forEach(item => {
        if (item === 'images') {
          row.insertAdjacentHTML(
            'beforeend',
            `<div class="sortable-table__cell"><img class="sortable-table-image" alt="Image" src="${dataItem[item].length ? dataItem[item][0].url : dataItem[item].url}"></div>`
          )
        } else {
          row.insertAdjacentHTML(
            'beforeend',
            `<div class="sortable-table__cell">${dataItem[item]}</div>`
          )
        }
      })

      result.append(row);
    })

    return result.innerHTML;
  }

  get template() {
    return `
      <div class="sortable-table">
      <div data-elem="header" class="sortable-table__header sortable-table__row">
        ${this.header}
      </div>
      <div data-elem="body" class="sortable-table__body">
        ${this.body}
      </div>
      <div data-elem="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-elem="emptyPlaceholder" class="sortable-table__empty-placeholder"><div>Нет данных</div></div>
    </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    const headers = this.subElements.header.querySelectorAll('[data-name]');
    for (const header of headers) {
      if (header.dataset.sortable === 'true') {
       header.onclick = () => this.sort(header);
      }
    }
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-elem]');

    for (const subElement of elements) {
      const name = subElement.dataset.elem;

      result[name] = subElement;
    }

    return result;
  }

  sort(header) {
    const fieldValue = header.dataset.name;
    const orderValue = header.dataset.order;
    const collator = Intl.Collator(undefined, { caseFirst: 'upper' });
    const arrCopy = [...this.tableData];
    const isNumber = typeof fieldValue === 'number';
    const sorted = arrCopy.sort(
      (a,b) => orderValue === 'asc'
        ? isNumber ? b[fieldValue] - a[fieldValue] : collator.compare(a[fieldValue], b[fieldValue])
        : isNumber ? a[fieldValue] - b[fieldValue] : collator.compare(b[fieldValue], a[fieldValue])
    );

    if (header.dataset.order === 'asc') {
      header.dataset.order = 'desc';
    } else {
      header.dataset.order = 'asc';
    }

    this.update(sorted);
  }

  update(newData) {
    this.tableData = newData;
    this.subElements.body.innerHTML = this.body;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
