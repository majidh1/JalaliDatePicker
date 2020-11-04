import {
  EVENT_SHOW,
  EVENT_HIDE,
} from './constants';
import {
  isUndefined,
  createElement,
} from './utilities';

export default {
  // Show the datepicker
  show() {
    if (this.shown) {
      return;
    }
    this.render();
    this.shown = true;
        this.input.trigger(EVENT_SHOW);
  },

  // Hide the datepicker
  hide() {
    this.shown = false;
    this.input.trigger(EVENT_HIDE);
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

  getJalaliDatePickerElement() {
    if (isUndefined(this.jalaliDatePickerElement)) {
      this.jalaliDatePickerElement = createElement('div', this.options.container);
      this.jalaliDatePickerElement.innerHTML = this.options.template;
    }
    return this.jalaliDatePickerElement;
  },
  getSplitDate(date) {
    return date.split(this.options.separatorChar);
  },
  getYear() {
    return this.getSplitValue()[0];
  },

  getMinYear() {
    const { minDate } = this.options;
    return minDate ? this.getSplitDate(minDate)[0] : 1300;
  },

  getMaxYear() {
    const { maxDate } = this.options;
    return maxDate ? this.getSplitDate(maxDate)[0] : 1500;
  },

  getMinMonth() {
    const { minDate } = this.options;
    return minDate ? this.getSplitDate(minDate)[1] : 1;
  },

  getMaxMonth() {
    const { maxDate } = this.options;
    return maxDate ? this.getSplitDate(maxDate)[1] : 12;
  },

  getMonth() {
    return this.getSplitValue()[1];
  },

  getDay() {
    return this.getSplitValue()[2];
  },

  getSplitValue() {
    return this.getSplitDate(this.input.value).map((a) => window.parseInt(a));
  },
};
