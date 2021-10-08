export default class NotificationMessage {
  constructor(message = '', options = {}) {
    this.message = message;
    this.options = options;
    this.open = false;
  }

  get template() {
    const duration = this.options.duration && this.options.duration / 100;
    return `
      <div class="notification ${this.options.type}" style="--value:${duration}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.options.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  show() {
    this.open = true;
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element;
    document.body.insertAdjacentHTML('beforeend', this.element.innerHTML);
  }

  remove() {
    this.open = false;
    const noty = document.querySelector('.notification')[0]
    noty.parentElement.removeChild(noty);
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
