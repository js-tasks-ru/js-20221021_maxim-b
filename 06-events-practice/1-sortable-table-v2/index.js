export default class SortableTable {

  element;

  subElements = {};
  isSortLocally;

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}, isSortLocally = true) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.element = document.createElement("div");

    this.sort(this.sorted.id, this.sorted.order);

    this.addLintener();

  }

  sort(fieldValue, orderValue) {

    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }
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

  getTemplate() {
    return `<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">

    <div data-element="header" class="sortable-table__header sortable-table__row">

      ${this.getHeader()}

    </div>

    <div data-element="body" class="sortable-table__body">

    ${this.getElements()}

    </div>

    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>

  </div>
</div>
`;
  }

  destroy() {
    this.element.remove();
  }

  getElements() {

    function getImage(item) {
      if (item.images && item.images[0] && item.images[0].url.length) {
        return item.images[0].url;
      }
      return "";
    }

    return this.data
      .map(item => {

        let result = [];
        result.push(`<a href="/products/dvd/${item.id}" class="sortable-table__row">`);

        for (const headerItem of this.headerConfig) {
          if (typeof headerItem.template === 'function') {
            result.push(headerItem.template(item));
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
    this.element.innerHTML = this.getTemplate();
    this.element = this.element.firstElementChild;
    this.subElements = this.getSubElements();
    this.addLintener();
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

  sortOnServer() {

  }

  sortOnClient(fieldValue, orderValue) {
    this.fieldValue = fieldValue;

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];

    const sortTypeObj = this.headerConfig.filter(obj => {
      return obj.id === fieldValue;
    });

    const sortType = sortTypeObj[0].sortType;


    this.data.sort((a, b) => {
      if (sortType === 'string') {
        return direction * a.title.localeCompare(b.title, ['ru', 'en'], {'caseFirst': 'upper'});
      } else if (sortType === 'number') {
        return direction * (parseInt(a[fieldValue]) - parseInt(b[fieldValue]));
      }
    });
    this.render();
  }

  addLintener() {
    for (const selector of this.element.querySelectorAll('.sortable-table__header .sortable-table__cell')) {
      selector.addEventListener('click', (event) => {
        this.sorted.id = event.currentTarget.dataset.id;
        this.sorted.order = (event.currentTarget.dataset.order === 'asc') ? 'desc' : 'asc';
        this.sort(this.sorted.id, this.sorted.order);
      });
    }
  }
}

