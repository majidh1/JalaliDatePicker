import { extend, createElement, triggerEvent, jalaliToday, isValidDateString, getDateFromString, getDateToString, isString, clon, isPlainObject, normalizeMinMaxDate, getScrollParent, getEventTarget, containsDom } from "./utils";
import { CONTAINER_ELM_QUERY, EVENT_FOCUS_STR, EVENT_CHANGE_INPUT_STR, MIN_MAX_TODAY_SETTING, MIN_MAX_ATTR_SETTING, MIN_MAX_ATTR_SETTING_MAX_ATTR_NAME, MIN_MAX_ATTR_SETTING_MIN_ATTR_NAME, STYLE_VISIBILITY_VISIBLE, STYLE_VISIBILITY_HIDDEN, STYLE_DISPLAY_BLOCK, STYLE_DISPLAY_HIDDEN, STYLE_POSITION_FIXED } from "./constants";
import draw from "./draw";
import defaults from "./defaults";

const jalaliDatepicker = {
    init(options) {
        this.options = extend(defaults, options);
        this.options = normalizeOptions(this.options);
        window.onresize = windowResize;

        if (this.options.autoHide) document.body.onclick = documentClick;
        if (this.options.autoShow) addEventListenerOnInputs(this.options.selector);
    },
    options: defaults,
    input: null,
    get dpContainer() {
        this._dpContainer = this._dpContainer || createElement(CONTAINER_ELM_QUERY, this.options.container);
        return this._dpContainer;
    },
    get today() {
        this._today = this._today || jalaliToday();
        return this._today;
    },
    get valueDate() {
        this._valueDate = clon(this.input.value);

        if (isString(this._valueDate)) {
            if (isValidDateString(this._valueDate, this.options.separatorChar)) {
                this._valueDate = getDateFromString(this._valueDate, this.options.separatorChar);
            } else {
                this._valueDate = {};
            }
        }

        return this._valueDate;
    },
    get initDate() {
        this._initDate = this._initDate || clon(this.valueDate);

        if (isPlainObject(this._initDate)) {
            this._initDate = this.options.initDate || clon(this.today);
        }
        if (isString(this._initDate) && isValidDateString(this._initDate, this.options.separatorChar)) {
            this._initDate = getDateFromString(this._initDate, this.options.separatorChar);
        }
        return normalizeMinMaxDate(this._initDate.year, this._initDate.month, this._initDate.day, this._initDate, this.options.minDate, this.options.maxDate);
    },
    _draw: draw,
    show(input) {
        this._initDate = null;
        this._valueDate = null;
        this.input = input;
        this._draw();
        this.dpContainer.style.visibility = STYLE_VISIBILITY_VISIBLE;
        this.dpContainer.style.display = STYLE_DISPLAY_BLOCK;
        this.dpContainer.style.zIndex = this.options.zIndex;
        this.setPosition();
        setScrollOnParent(input);
        setReadOnly(input, this.options);
    },
    hide() {
        this.dpContainer.style.visibility = STYLE_VISIBILITY_HIDDEN;
        this.dpContainer.style.display = STYLE_DISPLAY_HIDDEN;
    },
    setPosition() {
        if (this.dpContainer.style.visibility !== STYLE_VISIBILITY_VISIBLE) {
            return;
        }
        const inputBounds = this.input.getBoundingClientRect();
        let left = inputBounds.left;
        let top = inputBounds.top;
        const inputHeight = inputBounds.height;
        const windowHeight = window.document.body.offsetWidth;
        const dpContainerWidth = this.dpContainer.offsetWidth;
        const dpContainerHeight = this.dpContainer.offsetHeight;

        if (left + dpContainerWidth >= windowHeight) {
            left -= (left + dpContainerWidth) - (windowHeight + 10);
        }
        if (top >= dpContainerHeight&&top + dpContainerHeight >= window.innerHeight) {
            top -= dpContainerHeight + inputHeight;
        }
        this.dpContainer.style.position = STYLE_POSITION_FIXED;
        this.dpContainer.style.left = left + "px";
        this.dpContainer.style.top = top + this.input.offsetHeight + "px";
    },
    setValue(year, month, day) {
        this._valueDate.year = year;
        this._valueDate.month = month;
        this._valueDate.day = day;
        this.hide();
        if (isNaN(year + month + day)) {
            this.input.value = "";
        } else {
            this.input.value = getDateToString(year, month, day, this.options.separatorChar);
        }
        triggerEvent(this.input, EVENT_CHANGE_INPUT_STR);
    },
    increaseMonth() {
        const isLastMonth = this._initDate.month === 12;
        if (this.options.changeMonthRotateYear && isLastMonth) {
            this.increaseYear();
        }
        this.monthChange(isLastMonth ? 1 : this._initDate.month + 1);
    },
    decreaseMonth() {
        const isFirstMonth = this._initDate.month === 1;
        if (this.options.changeMonthRotateYear && isFirstMonth) {
            this.decreaseYear();
        }
        this.monthChange(isFirstMonth ? 12 : this._initDate.month - 1);
    },
    monthChange(month) {
        this._initDate = normalizeMinMaxDate(this._initDate.year, month, this._initDate.day, this._initDate, this.options.minDate, this.options.maxDate);
        this._draw();
    },
    increaseYear() {
        this.yearChange(this._initDate.year + 1);
    },
    decreaseYear() {
        this.yearChange(this._initDate.year - 1);
    },
    yearChange(year) {
        this._initDate = normalizeMinMaxDate(year, this._initDate.month, this._initDate.day, this._initDate, this.options.minDate, this.options.maxDate);
        this._draw();
    }
};

const getDefaultFromAttr = (attrName, sepChar) => {
    let dateAttrVal = jalaliDatepicker.input.getAttribute(attrName);
    if (dateAttrVal === MIN_MAX_TODAY_SETTING) {
        dateAttrVal = clon(jalaliDatepicker.today);
    } else if (isString(dateAttrVal) && isValidDateString(dateAttrVal, sepChar)) {
        dateAttrVal = getDateFromString(dateAttrVal, sepChar);
    } else {
        dateAttrVal = {};
    }

    return dateAttrVal;
};

const normalizeOptions = (options) => {
    if (options.minDate === MIN_MAX_TODAY_SETTING) options.minDate = clon(jalaliDatepicker.today);
    if (options.maxDate === MIN_MAX_TODAY_SETTING) options.maxDate = clon(jalaliDatepicker.today);

    if (options.minDate === MIN_MAX_ATTR_SETTING) {
        delete options.minDate;
        window.Object.defineProperty(options, "minDate", {
            get: () => {
                return getDefaultFromAttr(MIN_MAX_ATTR_SETTING_MIN_ATTR_NAME, options.separatorChar);
            }
        });
    }
    if (options.maxDate === MIN_MAX_ATTR_SETTING) {
        delete options.maxDate;
        window.Object.defineProperty(options, "maxDate", {
            get: () => {
                return getDefaultFromAttr(MIN_MAX_ATTR_SETTING_MAX_ATTR_NAME, options.separatorChar);
            }
        });
    }

    return options;
};

function documentClick(e) {
    if (jalaliDatepicker.dpContainer.style.visibility !== STYLE_VISIBILITY_VISIBLE ||
        containsDom(jalaliDatepicker.dpContainer, e) ||
        getEventTarget(e) === jalaliDatepicker.input
    ) {
        return;
    }
    jalaliDatepicker.hide();
}

function windowResize() {
    jalaliDatepicker.setPosition();
}

function setScrollOnParent(input) {
    getScrollParent(input).addEventListener("scroll", function () {
        jalaliDatepicker.setPosition();
    }, { passive: true });
}

function setReadOnly(input, options) {
    if (options.autoReadOnlyInput && !input.readOnly) input.readOnly = true;
}

function addEventListenerOnInputs(querySelector) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    document.body.addEventListener(EVENT_FOCUS_STR, (e) => {
        if (e.target && e.target.matches(querySelector)) {
            jalaliDatepicker.show(e.target);
        }
    });
}

window.jalaliDatepicker = {
    startWatch(options = {}) {
        jalaliDatepicker.init(options);
    },
    show(input) {
        jalaliDatepicker.show(input);
    },
    hide() {
        jalaliDatepicker.hide();
    }
};