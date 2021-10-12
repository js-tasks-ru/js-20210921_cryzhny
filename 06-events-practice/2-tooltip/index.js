class Tooltip {
  static instance;

  onMouseover = e => Tooltip.instance.showTooltip(e);
  onMousemove = e => Tooltip.instance.onMouseMove(e);
  onMouseout = () => Tooltip.instance.remove();

  constructor() {
    this.message = '';
    this.subElements = document;
    this.render();
  }

  get template() {
    return `<div class="tooltip">${this.message}</div>`
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
  }

  addEventListeners() {
    this.subElements.addEventListener("mouseover", this.onMouseover);
    this.subElements.addEventListener("mouseout", this.onMouseout);
  }

  removeEventListeners() {
    this.subElements.removeEventListener("mouseover", this.onMouseover);
    this.subElements.removeEventListener("mousemove", this.onMousemove);
    this.subElements.removeEventListener("mouseout", this.onMouseout);
  }

  showTooltip({ target, pageX, pageY }) {
    if (target.dataset.tooltip) {
      this.update(target.dataset.tooltip);

      this.element.style.position = 'absolute';
      this.element.style.zIndex = 1000;
      document.body.append(this.element);
      this.subElements.addEventListener("mousemove", this.onMousemove);
    }

    this.moveAt(pageX, pageY);
  }

  moveAt(pageX, pageY) {
    this.element.style.left = pageX + 20 + 'px';
    this.element.style.top = pageY + 20 + 'px';
  }

  onMouseMove(event) {
    this.moveAt(event.pageX, event.pageY);
  }

  initialize() {
    if (Tooltip.instance) return Tooltip.instance;
    Tooltip.instance = this;

    Tooltip.instance.addEventListeners();
  }

  update(newData) {
    this.message = newData;
    if (this.element) {
      this.element.remove();
    }
    this.render()
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
