export default class ColumnChart {

  chartHeight = 50;

  constructor(params) {

    if (!params) {
      this.columnChartLoading = "column-chart_loading";
      this.label = 'orders';
    } else {
      this.data = params.data;
      this.label = params.label;
      this.value = params.value;
      this.columnChartLoading = "";
      if (typeof params.formatHeading === 'function') {
        this.formatHeading = params.formatHeading;
      }

    }

    this.render();
    this.initEventListeners();
  }

  formatHeading(data) {
    return data;
  }

  destroy() {

  }

  remove() {
    this.element.remove();
  }

  update() {

  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  initEventListeners() {

  }

  getTemplate() {
    return `
      <div class="dashboard__chart_${this.label} ${this.columnChartLoading}">
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        <a href="/${this.label}" class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.renderColumn()}
        </div>
      </div>
    </div>
  </div>
    `;
  }

  renderColumn() {
    let result = '';
    if (!this.data) {
      return result;
    }
    for (let dataItem of this.getColumnProps(this.data)) {
      result += `<div style="--value: ${dataItem.value}" data-tooltip="${dataItem.percent}"></div>`;
    }
    return result;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
