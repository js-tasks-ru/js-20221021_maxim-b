import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {

  element;
  subElements = {};

  onSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    this.save();
  };

  constructor(productId) {
    this.productId = productId;
  }

  isUpdate() {
    return this.productId;
  }

  isCreate() {
    return !this.isUpdate();
  }

  get template() {
    return `<div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
        </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">

        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    this.initEventListeners();
    this.initData();
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

  initEventListeners() {
    this.subElements.productForm.addEventListener('submit', this.onSubmit);
  }

  update() {

  }

  initData() {
    if (this.isUpdate()) {
      this.initProductData();
    }
    this.initCategories();
  }

  async initProductData() {
    let url = new URL('/api/rest/products', BACKEND_URL);
    url.searchParams.set('id', this.productId);
    let product = await fetchJson(url);
    product = product[0];
    let {
      id,
      title,
      description,
      brand,
      quantity,
      subcategory,
      status,
      characteristics,
      images,
      price,
      rating,
      discount
    } = product;

    this.subElements.productForm.title.value = title;
    this.subElements.productForm.description.innerHTML = description;
    this.subElements.imageListContainer.innerHTML = this.getImages(images);
    this.subElements.productForm.price.value = price;
    this.subElements.productForm.discount.value = discount;
    this.subElements.productForm.quantity.value = quantity;
    this.subElements.productForm.status.innerHTML = this.getStatus(status);
  }

  async initCategories() {
    const categoriesResponse = await fetchJson(new URL('/api/rest/categories?_sort=weight&_refs=subcategory', BACKEND_URL));
    this.subElements.productForm.subcategory.innerHTML = categoriesResponse.map(item => {
      let subCategoryRes = [];
      for (const subCategory of item.subcategories) {
        subCategoryRes.push(`<option value="${subCategory.id}">${item.title}${escapeHtml(" > ")}${subCategory.title}</option>`);
      }
      return subCategoryRes.join("");
    }).join("");
  }

  destroy() {
    this.element.remove();

    this.subElements.productForm.removeEventListener('submit', this.onSubmit);
    this.subElements = {};
    this.element = null;

  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  save() {

  }

  getImages(images) {
    let imagesResult = [];
    imagesResult.push(`<ul class="sortable-list">`);
    for (const image of images) {
      imagesResult.push(`<li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${image.url}">
          <input type="hidden" name="source" value="${image.source}">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
        <span>${image.source}</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button></li>`);
    }
    imagesResult.push(`</ul>`);
    return imagesResult.join("");
  }

  getStatus(status) {
    const statuses = ["Неактивен", "Активен"];

    return statuses.map((value, index) => {
      let selected = "";
      if (status === index) {
        selected = 'selected="selected"';
      }
      return `<option value="${index}" ${selected}>${value}</option>`;
    }).join("");
  }
}
