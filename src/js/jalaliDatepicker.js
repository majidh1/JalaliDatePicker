import defaults from './defaults';
import methods from './methods';
import render from './render';
import { extend } from './utilities';

class JalaliDatepicker {
  constructor(element, options = {}) {
    this.options = extend(defaults, options);
    this.element = element;

    this.init();

    return this;
  }

  init() {
    this.element.jalaliDatepicker = this;
  }
}
console.log(JalaliDatepicker.prototype);
JalaliDatepicker.prototype = extend(JalaliDatepicker.prototype, methods, render);
console.log(JalaliDatepicker.prototype);

export default JalaliDatepicker;
