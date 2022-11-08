export default class NotificationMessage {

  duration = 0;

  constructor(title, params) {
    this.title = title;
    if (params && params.duration) {
      this.duration = params.duration;
    }

    if (params && params.type) {
      this.type = params.type;
    }

    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  getDuration() {
    return this.duration;
  }

  getType() {
    return this.type;
  }

  getTitle() {
    return this.title;
  }


  show(element = document.body) {

    const selector = element.querySelector('.notification');
    if (selector) {
      selector.remove();
    }

    element.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.getDuration());

  }

  getTemplate() {
    return `<div class="notification ${this.getType()}" style="--value:${this.getDuration() / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.getType()}</div>
      <div class="notification-body">
        ${this.getTitle()}
      </div>
    </div>
  </div>`;
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}
