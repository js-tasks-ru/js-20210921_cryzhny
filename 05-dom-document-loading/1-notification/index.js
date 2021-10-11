export default class NotificationMessage {
  static active;

  timer;

  constructor(message = '', options = {}) {
    this.message = message;
    this.options = options;

    this.render();
  }

  get template() {
    const duration = this.options.duration && this.options.duration / 1000;
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

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
  }

  show() {
    if (NotificationMessage.active) {
      NotificationMessage.active.remove();
    }

    document.body.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove()
    }, this.options.duration);

    NotificationMessage.active = this;
  }

  remove() {
    clearTimeout(this.timer);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.active = null;
  }
}
