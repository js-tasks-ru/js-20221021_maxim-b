class Tooltip {

  offset = 5;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  get offset() {
    return this.offset;
  }

// Initialize object
  initialize() {
    this.initListeners();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const element = wrapper.firstElementChild;
    this.element = element;

    if (this.event) {
      this.element.style.top = this.event.clientY + this.offset + "px";
      this.element.style.left = this.event.clientX + this.offset + "px";
    }


    document.body.append(this.element);
  }

  getTemplate() {
    return `<div class="tooltip">${this.name}</div>`;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }

  initListeners() {
    document.addEventListener('pointerover', this.callbackOver);
    document.addEventListener('pointerout', this.callbackOut);
  }

  callbackOver = (event) => {
    const id = event.target.dataset.tooltip;
    if (!id) {
      this.destroy();
      return;
    }
    this.name = id;
    this.event = event;
    this.render();
    document.addEventListener('mousemove', this.callbackMove);
  };

  callbackMove = (event) => {
    const id = event.target.dataset.tooltip;
    if (!id) {
      return;
    }
    this.name = id;
    this.element.style.top = event.clientY + this.offset + "px";
    this.element.style.left = event.clientX + this.offset + "px";
  };

  callbackOut = (event) => {
    document.removeEventListener('mousemove', this.callbackMove);
    this.destroy();
  };

}

export default Tooltip;
