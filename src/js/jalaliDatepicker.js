import defaults from './defaults';
import methods from './methods';
import render from './render';
import {
    CLASS_HIDE,
    EVENT_CLICK,
    EVENT_FOCUS,
    EVENT_HIDE,
    EVENT_KEYUP,
    EVENT_PICK,
    EVENT_SHOW,
    LANGUAGES,
    NAMESPACE,
    VIEWS,
} from './constants';
import utilities from './utilities';


class JalaliDatepicker {
    constructor(element, options = {}) {
        this.options = {
            ...defaults,
            ...options
        };
    }
}

export default JalaliDatepicker;