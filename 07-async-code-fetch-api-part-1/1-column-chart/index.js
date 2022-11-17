import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

  element;
  subElements = {};
  chartHeight = 50;

  constructor({
                label = '',
                link = '',
                formatHeading = data => data,
                url = '',
                range = {
                  from: new Date(),
                  to: new Date(),
                }
              } = {}) {


    this.url = new URL(url, BACKEND_URL);


    this.range = range;
    this.label = label;
    this.link = link;
    this.columnChartLoading = 'column-chart_loading';
    if (formatHeading) {
      this.formatHeading = formatHeading;
    }


    this.render();
    this.update(this.range.from, this.range.to);

  }

  formatHeading(data) {
    return data;
  }

  destroy() {
    this.element.remove();
  }

  update(from, to) {

    this.range.from = from;
    this.range.to = to;

    this.url.searchParams.set('from', (this.range.from.toISOString()));
    this.url.searchParams.set('to', (this.range.to.toISOString()));

    return fetchJson(this.url)
      .then(data => {
        this.data = Object.values(data);
        if (this.data.length === 0) {
          this.data = [];
        }
        this.value = this.data.reduce((a, b) => a + b, 0);
        this.subElements.body.innerHTML = this.renderColumn();
        this.element.classList.remove(this.columnChartLoading);
        this.subElements.header.innerHTML = this.formatHeading(this.value);
      })
      .catch(reason => {
        console.error(reason);
      });

  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  getTemplate() {
    return `
      <div class="dashboard__chart_${this.label} ${this.columnChartLoading}">
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        <a href="${this.link}" class="column-chart__link">View all</a>
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
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }
}
