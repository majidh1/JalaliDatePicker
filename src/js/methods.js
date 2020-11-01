import {
  EVENT_SHOW,
  EVENT_HIDE,
} from './constants';

export default {
  // Show the datepicker
  show() {
    this.shown = true;
    this.element.dispatchEvent(EVENT_SHOW);
  },

  // Hide the datepicker
  hide() {
    this.shown = false;
    this.element.dispatchEvent(EVENT_HIDE);
  },

  toggle() {
    if (this.shown) {
      this.hide();
    } else {
      this.show();
    }
  },

  // Update the datepicker with the current input value
  update() {
    const value = this.getValue();

    if (value === this.oldValue) {
      return;
    }

    this.setDate(value, true);
    this.oldValue = value;
  },

};
