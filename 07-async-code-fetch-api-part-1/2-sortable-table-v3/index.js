import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  onScroll = (event) => this.scrollFetch(event);

  constructor(headersConfig, {
    url = '',
  } = {}) {
    this.url = `${BACKEND_URL}/${url}`;
    this.headerConfig = headersConfig;
    this.tableData = [];
    this.headerIds = [];
    this.subElements = {};
    this.start = 0;
    this.end = 30;
    this.step = 30;
    this.sortedBy = '';
    this.loading = false;
    this.order = 'asc';

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
    this.update({ title: this.headerConfig[0].id });

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    document.addEventListener('scroll', this.onScroll);

    const headers = this.subElements.header.querySelectorAll('[data-name]');
    for (const header of headers) {
      if (header.dataset.sortable === 'true') {
        header.onclick = () => {
          if (header.dataset.order === 'asc') {
            header.dataset.order = 'desc';
          } else {
            header.dataset.order = 'asc';
          }

          this.order = header.dataset.order;

          this.update({ title: header.dataset.name })
        };
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

  async fetchData({ title }) {
    const params = {
      _sort: title,
      _order: this.order,
      _start: this.start,
      _end: this.end,
    }
    const url = new URL(this.url);
    url.search = new URLSearchParams(params).toString();

    try {
      const response = await fetch(url);

      if (response.ok) {
        this.tableData = await response.json()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async scrollFetch() {
    const { bottom } = this.element.getBoundingClientRect();

    if (bottom < document.documentElement.clientHeight && !this.loading) {
      this.start = this.end;
      this.end = this.end + this.step;

      this.loading = true;

      await this.update({ title: this.sortedBy });

      this.loading = false;
    }
  }

  async update(params) {
    if (params.title !== this.sortedBy) {
      this.sortedBy = params.title;
      this.start = 0;
      this.end = 30;

      await this.fetchData(params);
      this.subElements.body.innerHTML = this.body;
    } else {
      await this.fetchData(params);
      this.subElements.body.innerHTML += this.body;
    }
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
