export default class SortableTable {

  element;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = document.createElement("div");

    this.render();
  }

  sort(fieldValue, orderValue) {

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
      <div class="sortable-table__cell" data-id="images" data-sortable="false" >
        <span>Image</span>
      </div>
      <div class="sortable-table__cell" data-id="title" data-sortable="false" >
        <span>Name</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
      <div class="sortable-table__cell" data-id="quantity" data-sortable="false" >
        <span>Quantity</span>
      </div>
      <div class="sortable-table__cell" data-id="price" data-sortable="false" >
        <span>Price</span>
      </div>
      <div class="sortable-table__cell" data-id="sales" data-sortable="false" >
        <span>Sales</span>
      </div>
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

    return this.data
      .map(item => {

        return `<a href="/products/dvd/${item.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="http://magazilla.ru/jpg_zoom1/430982.jpg"></div>
        <div class="sortable-table__cell">${item.title}</div>

        <div class="sortable-table__cell">${item.quantity}</div>
        <div class="sortable-table__cell">${item.price}</div>
        <div class="sortable-table__cell">${item.sales}</div>
      </a>`;
      })
      .join("");
  }

  render() {
    this.element.innerHTML = this.getTemplate();
    this.element = this.element.firstElementChild;
    this.subElements = this.getSubElements();
  }
}

