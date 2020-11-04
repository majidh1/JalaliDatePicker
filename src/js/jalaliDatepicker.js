import defaults from './defaults';
import methods from './methods';
import render from './render';
import handlers from './handlers';
import Input from './input';
import { extend, jalaliToday } from './utilities';

class JalaliDatepicker {
    constructor(element, options = {}) {
        this.options = extend(defaults, options);
        this.input = new Input(element);
        this.init();
        return this;
    }

    init() {
        const { options } = this;
        this.input.value = options.initDate || jalaliToday(options.separatorChar);
    }
}
JalaliDatepicker.prototype = extend(JalaliDatepicker.prototype, methods, render, handlers);

export default JalaliDatepicker;
