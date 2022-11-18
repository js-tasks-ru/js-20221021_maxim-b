import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  element;

  subElements = {};

  data = [];

  constructor(headerConfig = [], {
    url = 'api/dashboard/bestsellers',
    isSortLocally = false,
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headerConfig = headerConfig;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;


    /*
    _embed:
subcategory.category
    * _sort:
title
_order:
asc
_start:
0
_end:
30
    * */

    this.url.searchParams.set('_embed', 'subcategory.category');
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', 0);
    this.url.searchParams.set('_end', 30);


    this.render();
    this.loadData();

    this.subElements = this.getSubElements(this.element);

    this.addListener();

  }

  sort(fieldValue, orderValue) {

    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getTemplate() {
    return `<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">

    <div data-element="header" class="sortable-table__header sortable-table__row">

      ${this.getHeader()}

    </div>

    <div data-element="body" class="sortable-table__body">

    ${this.getElements()}

    </div>


  </div>
</div>
`;
  }

  destroy() {
    this.element.remove();
  }

  getElements() {

    return this.data
      .map(item => {

        let result = [];
        result.push(`<a href="/products/dvd/${item.id}" class="sortable-table__row">`);

        for (const headerItem of this.headerConfig) {
          if (typeof headerItem.template === 'function') {
            result.push(headerItem.template(item.images));
          } else {
            result.push(`<div class="sortable-table__cell">${item[headerItem.id]}</div>`);
          }
        }

        result.push(`</a>`);

        return result.join("");

      })
      .join("");
  }

  render() {
    this.element = document.createElement("div");
    this.element.innerHTML = this.getTemplate();
    this.element = this.element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getHeader() {

    return this.headerConfig.map(item => {

      if (item.id === this.sorted.id) {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="true" data-order="${this.sorted.order}" >
        <span>${item.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
      } else {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="false" >
        <span>${item.title}</span>
      </div>`;
      }


    }).join("");

  }

  sortOnServer(fieldValue, orderValue) {
    this.url.searchParams.set('_sort', fieldValue);
    this.url.searchParams.set('_order', orderValue);
    this.loadData();
  }

  sortOnClient(fieldValue, orderValue) {
    this.fieldValue = fieldValue;

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];

    const column = this.headerConfig.find(item => item.id === fieldValue);
    const {sortType, customSorting} = column;


    this.data.sort((a, b) => {
      if (sortType === 'string') {
        return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], {'caseFirst': 'upper'});
      } else if (sortType === 'number') {
        return direction * (parseInt(a[fieldValue]) - parseInt(b[fieldValue]));
      } else if (sortType === 'custom') {
        return direction * customSorting(a, b);
      }
    });
    this.render();
  }

  addListener() {
    document.addEventListener('pointerdown', (event) => {
      let headElem = event.target.closest('.sortable-table__cell');
      if (headElem.dataset.sortable) {
        this.sorted.id = headElem.dataset.id;
        this.sorted.order = (this.sorted.order === 'asc') ? 'desc' : 'asc';
        this.sort(this.sorted.id, this.sorted.order);
      }
    });

  }

  loadData() {
    fetchJson(this.url)
      .then(data => {
        this.data = data;
        this.subElements.header.innerHTML = this.getHeader();
        this.subElements.body.innerHTML = this.getElements();
        //this.sort(this.sorted.id, this.sorted.order);
      });

  }

}