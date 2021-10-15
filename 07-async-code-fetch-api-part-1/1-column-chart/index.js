import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  constructor({url = '', range = {}, label = '', formatHeading = () => {}} = {}) {
    this.url = `${BACKEND_URL}/${url}`;
    this.range = range;
    this.data = [];
    this.label = label;
    this.link = '';
    this.value = 0;
    this.formatHeading = formatHeading;
    this.chartHeight = 50
    this.subElements = {};

    this.update(this.range.from, this.range.to);
    this.render();
  }

  getColumnProps(data) {
    const dataArr = Object.entries(data);
    const maxValue = Math.max(...Object.values(data));
    const scale = this.chartHeight / maxValue;

    return dataArr.map(item => {
      return {
        percent: (item[1] / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item[1] * scale))
      };
    });
  }

  getTemplate() {
    return `
      <div
        class="column-chart column-chart_loading"
        style="--chart-height: ${this.chartHeight}"
      >
        <div class="column-chart__title">
          Total ${this.label}
          <a class="column-chart__link" href="#">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value) || this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getChartColumns()}
          </div>
        </div>
        </div>
      </div>
    `;
  }

  getChartColumns() {
    const chartColumnsValues = this.getColumnProps(this.data);
    const result = document.createElement('div');

    chartColumnsValues.forEach(({ value, percent }) => {
      const child = document.createElement('div');
      child.dataset.tooltip = percent;
      child.style.cssText = `--value: ${value}`;

      result.append(child);
    })

    return result.innerHTML;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  async fetchData(range) {
    const url = new URL(this.url);
    url.search = new URLSearchParams(range).toString();

    try {
      const response = await fetch(url);

      if (response.ok) {
        this.data = await response.json()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async update(from, to) {
    await this.fetchData({from, to})
    if (Object.entries(this.data).length) {
      this.element.classList.remove('column-chart_loading');
    }
    this.subElements.body.innerHTML = this.getChartColumns();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
