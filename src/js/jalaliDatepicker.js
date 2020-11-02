import defaults from './defaults';
import methods from './methods';
import render from './render';
import handlers from './handlers';
import { extend, jalaliToday } from './utilities';

class JalaliDatepicker {
  constructor(element, options = {}) {
    this.options = extend(defaults, options);
    this.element = element;

    this.init();
    return this;
  }

  init() {
    this.element.jalaliDatepicker = this;
    const { options } = this;
    this.element.value = options.initDate || jalaliToday(this.options.separatorChar);
  }

  /// / Destroy the datepicker and remove the instance from the target element
  // destroy() {

  // }
}
JalaliDatepicker.prototype = extend(JalaliDatepicker.prototype, methods, render, handlers);

export default JalaliDatepicker;
