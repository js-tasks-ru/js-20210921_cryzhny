export default class ColumnChart {
  constructor(data = {}) {
    this.data = data.data || [];
    this.label = data.label || '';
    this.link = data.link || '';
    this.value = data.value || 0;
    this.formatHeading = data.formatHeading || (() => {});
    this.chartHeight = 50
    this.render();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getTemplate() {
    return `
      <div
        class="column-chart ${!this.data.length ? 'column-chart_loading' : ''}"
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
            ${this.getChartColumns().innerHTML}
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

    return result;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
  }

  update(newData) {
    this.data = newData;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
