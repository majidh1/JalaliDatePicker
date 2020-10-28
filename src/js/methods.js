import {
  EVENT_HIDE,
} from './constants';

export default {
  // Show the datepicker
  show() {
    this.shown = true;
  },

  // Hide the datepicker
  hide() {
    this.shown = false;
    this.Class = EVENT_HIDE;
  },

  toggle() {
    if (this.shown) {
      this.hide();
    } else {
      this.show();
    }
  },
};
