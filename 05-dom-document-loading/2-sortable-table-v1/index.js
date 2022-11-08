export default class SortableTable {

  element;

  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = document.createElement("div");

    this.render();
  }

  sort(fieldValue, orderValue) {

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

        const isImagesColumn = this.headerConfig.filter(obj => {
          return obj.id === 'images';
        });

        const isTitleColumn = this.headerConfig.filter(obj => {
          return obj.id === 'title';
        });

        const isQuantityColumn = this.headerConfig.filter(obj => {
          return obj.id === 'quantity';
        });

        const isPriceColumn = this.headerConfig.filter(obj => {
          return obj.id === 'price';
        });

        const isSalesColumn = this.headerConfig.filter(obj => {
          return obj.id === 'sales';
        });

        if (isImagesColumn) {
          result.push(`<div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${getImage(item)}">
          </div>`);
        }

        if (isTitleColumn) {
          result.push(`<div class="sortable-table__cell">${item.title}</div>`);
        }

        if (isQuantityColumn) {
          result.push(`<div class="sortable-table__cell">${item.quantity}</div>`);
        }

        if (isPriceColumn) {
          result.push(`<div class="sortable-table__cell">${item.price}</div>`);
        }

        if (isSalesColumn) {
          result.push(`<div class="sortable-table__cell">${item.sales}</div>`);
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
  }

  getHeader() {

    return this.headerConfig.map(item => {
      let arrow = "";
      if (this.fieldValue === item.id) {
        arrow = `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
      }
      return `<div class="sortable-table__cell" data-id="images" data-sortable="false" >
        <span>${item.title}</span>
        ${arrow}
      </div>`;
    }).join("");

  }
}

