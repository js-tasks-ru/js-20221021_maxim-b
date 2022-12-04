import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {

  element;
  subElements = {};

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElements[item.dataset.element] = item;
    }

    return subElements;
  }

  async render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    let {from, to} = this.getRange();

    this.initComponents(from, to);

    return this.element;
  }

  getTemplate() {
    return `<div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <!-- RangePicker component -->
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <!-- column-chart components -->
        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }

  }

  initRangePicker(from, to) {

    const rangePicker = new RangePicker({from, to});
    if (this.subElements.rangePicker.firstChild) {
      this.subElements.rangePicker.firstChild.remove();
    }
    this.subElements.rangePicker.append(rangePicker.element);
    rangePicker.element.addEventListener('date-select', this.onDateSelect);
  }

  initCharts(from, to) {

    const ordersChart = new ColumnChart({
      url: 'api/dashboard/orders',
      range: {
        from,
        to
      },
      label: 'orders',
      link: '#'
    });
    const salesChart = new ColumnChart({
      url: 'api/dashboard/sales',
      range: {
        from,
        to
      },
      label: 'sales',
      formatHeading: data => `$${data}`
    });

    const customersChart = new ColumnChart({
      url: 'api/dashboard/customers',
      range: {
        from,
        to
      },
      label: 'customers',
    });

    if (this.subElements.ordersChart.firstChild) {
      this.subElements.ordersChart.firstChild.remove();
    }
    this.subElements.ordersChart.append(ordersChart.element);

    if (this.subElements.salesChart.firstChild) {
      this.subElements.salesChart.firstChild.remove();
    }
    this.subElements.salesChart.append(salesChart.element);

    if (this.subElements.customersChart.firstChild) {
      this.subElements.customersChart.firstChild.remove();
    }
    this.subElements.customersChart.append(customersChart.element);
  }

  getRange = () => {
    const now = new Date();
    const to = new Date();
    const from = new Date(now.setMonth(now.getMonth() - 1));

    return {from, to};
  }

  initBestsellers(from, to) {
    const sortableTable = new SortableTable(header, {
      url: '/api/dashboard/bestsellers',
      from: from,
      to: to
    });
    if (this.subElements.sortableTable.firstChild) {
      this.subElements.sortableTable.firstChild.remove();
    }
    this.subElements.sortableTable.append(sortableTable.element);
  }

  onDateSelect = event => {
    this.initComponents(event.detail.from, event.detail.to);
  }

  initComponents(from, to) {
    this.initRangePicker(from, to);
    this.initCharts(from, to);
    this.initBestsellers(from, to);
  }
}
