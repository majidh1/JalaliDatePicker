/*!
 * Jalalidatepicker v0.0.1
 * undefined
 *
 * Copyright 2020-present Majid Hooshiyar
 * Released under the MIT license
 *
 * Date: 2020-11-02T14:10:31.072Z
 */

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var NAMESPACE = 'jalalidatepicker';
  var EVENT_HIDE = new Event("hide.".concat(NAMESPACE));
  var EVENT_SHOW = new Event("show.".concat(NAMESPACE));
  var DATA_ATTR = "data-".concat(NAMESPACE);
  var DATA_ATTR_YEARS = "".concat(DATA_ATTR, "=\"years\"");
  var DATA_ATTR_YEAR_PICKER = "".concat(DATA_ATTR, "=\"year-picker\"");
  var DATA_ATTR_YEAR_PREV = "".concat(DATA_ATTR, "=\"year-prev\"");
  var DATA_ATTR_YEAR_CURRENT = "".concat(DATA_ATTR, "=\"year-current\"");
  var DATA_ATTR_YEAR_NEXT = "".concat(DATA_ATTR, "=\"year-next\"");
  var DATA_ATTR_MONTHS = "".concat(DATA_ATTR, "=\"months\"");
  var DATA_ATTR_MONTH_PICKER = "".concat(DATA_ATTR, "=\"month-picker\"");
  var DATA_ATTR_MONTH_PREV = "".concat(DATA_ATTR, "=\"month-prev\"");
  var DATA_ATTR_MONTH_CURRENT = "".concat(DATA_ATTR, "=\"month-current\"");
  var DATA_ATTR_MONTH_NEXT = "".concat(DATA_ATTR, "=\"month-next\"");
  var DATA_ATTR_DAYS = "".concat(DATA_ATTR, "=\"days\"");
  var DATA_ATTR_DAYS_TITLE = "".concat(DATA_ATTR, "=\"days-title\"");
  var DATA_ATTR_DAY_PICKER = "".concat(DATA_ATTR, "=\"day-picker\"");

  var defaults = {
    // Show the datepicker automatically when initialized
    autoShow: false,
    // Hide the datepicker automatically when picked
    autoHide: false,
    // The date string format
    separatorChar: '/',
    // The initial view date
    initDate: null,
    // The min view date
    minDate: null,
    // The max view date
    maxDate: null,
    // Days' name of the week.
    days: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه‌', 'چهارشنبه', 'پنجشنبه‌', 'جمعه'],
    // Months' name
    months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    // The offset top or bottom of the datepicker from the element
    offset: 10,
    // The `z-index` of the datepicker
    zIndex: 1000,
    // The template of the datepicker
    template: "<div class=\"".concat(NAMESPACE, "-container\">\n            <div class=\"").concat(NAMESPACE, "-panel\" ").concat(DATA_ATTR_YEAR_PICKER, ">\n                <ul>\n                    <li ").concat(DATA_ATTR_YEAR_PREV, ">&lsaquo;</li>\n                    <li ").concat(DATA_ATTR_YEAR_CURRENT, "></li>\n                    <li ").concat(DATA_ATTR_YEAR_NEXT, ">&rsaquo;</li>\n                </ul>\n                <ul ").concat(DATA_ATTR_YEARS, "></ul>\n            </div>\n            <div class=\"").concat(NAMESPACE, "-panel\" ").concat(DATA_ATTR_MONTH_PICKER, ">\n                <ul>\n                    <li ").concat(DATA_ATTR_MONTH_PREV, ">&lsaquo;</li>\n                    <li ").concat(DATA_ATTR_MONTH_CURRENT, "></li>\n                    <li ").concat(DATA_ATTR_MONTH_NEXT, ">&rsaquo;</li>\n                </ul>\n                <ul ").concat(DATA_ATTR_MONTHS, "></ul>\n            </div>\n            <div class=\"").concat(NAMESPACE, "-panel\" ").concat(DATA_ATTR_DAY_PICKER, ">\n                <ul ").concat(DATA_ATTR_DAYS_TITLE, "></ul>\n                <ul ").concat(DATA_ATTR_DAYS, "></ul>\n            </div>\n        </div>"),
    // The item tagname for template
    itemTagname: 'li',
    // The parent of the datepicker
    container: 'body'
  };

  function isObject(value) {
    return _typeof(value) === 'object';
  }
  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  function isString(value) {
    return typeof value === 'string';
  }

  function isPlainObject(obj) {
    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }

    var proto = window.Object.getPrototypeOf(obj); // Objects with no prototype (e.g., `Object.create( null )`) are plain

    if (!proto) {
      return true;
    } // Objects with prototype are plain iff they were constructed by a global Object function


    var ctor = {}.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof ctor === 'function';
  }

  function extend() {
    var options;
    var src;
    var copy;
    var copyIsArray;
    var clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false; // Handle a deep copy situation

    if (typeof target === 'boolean') {
      deep = target; // Skip the boolean and the target

      target = arguments[i] || {};
      i += 1;
    } // Handle case when target is a string or something (possible in deep copy)


    if (!isObject(target) && typeof target !== 'function') {
      target = {};
    } // Extend jQuery itself if only one argument is passed


    if (i === length) {
      target = this;
      i -= 1;
    }

    for (; i < length; i++) {
      options = arguments[i]; // Only deal with non-null/undefined values

      if (options !== null) {
        // Extend the base object
        for (var j = 0; j < window.Object.keys(options).length; j++) {
          var name = window.Object.keys(options)[j];

          if (Object.prototype.hasOwnProperty.call(options, name)) {
            copy = options[name]; // Prevent Object.prototype pollution
            // Prevent never-ending loop

            if (name === '__proto__' || target === copy) {
              return true;
            }

            copyIsArray = Array.isArray(copy); // Recurse if we're merging plain objects or arrays

            if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
              src = target[name]; // Ensure proper type for the source value

              if (copyIsArray && !Array.isArray(src)) {
                clone = [];
              } else if (!copyIsArray && !isPlainObject(src)) {
                clone = {};
              } else {
                clone = src;
              } // Never move original objects, clone them


              target[name] = extend(deep, clone, copy); // Don't bring in undefined values
            } else if (!isUndefined(copy)) {
              target[name] = copy;
            }
          }
        }
      }
    } // Return the modified object


    return target;
  }
  function createElement(tag, parent) {
    var element = window.document.createElement(tag);

    if (isString(parent)) {
      window.document.querySelector(parent).appendChild(element);
    } else {
      parent.appendChild(element);
    }

    return element;
  }
  function findElement(element, querySelector) {
    if (querySelector.indexOf("=") > -1 && querySelector.indexOf("[") == -1) {
      querySelector = "[".concat(querySelector, "]");
    }

    return element.querySelector(querySelector);
  }
  function jalaliToday(sepChar) {
    var date = new Date();
    var gy = date.getFullYear();
    var gm = date.getMonth() + 1;
    var gd = date.getDay();
    var gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    var gy2 = gm > 2 ? gy + 1 : gy;
    var days = 365 * gy + window.parseInt((gy2 + 3) / 4) - window.parseInt((gy2 + 99) / 100) + window.parseInt((gy2 + 399) / 400) - 80 + gd + gdm[gm - 1];
    jy += 33 * window.parseInt(days / 12053);
    days %= 12053;
    jy += 4 * window.parseInt(days / 1461);
    days %= 1461;
    jy += window.parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    var jm = days < 186 ? 1 + window.parseInt(days / 31) : 7 + window.parseInt((days - 186) / 30);
    var jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    var result = [jy, jm, jd];
    return sepChar ? result.join(sepChar) : result;
  }
  function createItems(parent, min, max, itemTagname, current, stringList) {
    for (var item = min; item <= max; item++) {
      var itemEl = createElement(itemTagname, parent);
      itemEl.innerHTML = stringList ? stringList[item - 1] : item;

      if (item === current) {
        itemEl.className = "current";
      }
    }
  }

  var methods = {
    // Show the datepicker
    show: function show() {
      if (this.shown) {
        return;
      }

      this.render();
      this.shown = true;
      this.element.dispatchEvent(EVENT_SHOW);
    },
    // Hide the datepicker
    hide: function hide() {
      this.shown = false;
      this.element.dispatchEvent(EVENT_HIDE);
    },
    toggle: function toggle() {
      if (this.shown) {
        this.hide();
      } else {
        this.show();
      }
    },
    // Update the datepicker with the current input value
    update: function update() {
      var value = this.getValue();

      if (value === this.oldValue) {
        return;
      }

      this.setDate(value, true);
      this.oldValue = value;
    },
    getJalaliDatePickerElement: function getJalaliDatePickerElement() {
      if (isUndefined(this.jalaliDatePickerElement)) {
        this.jalaliDatePickerElement = createElement('div', this.options.container);
        this.jalaliDatePickerElement.innerHTML = this.options.template;
      }

      return this.jalaliDatePickerElement;
    },
    getSplitDate: function getSplitDate(date) {
      return date.split(this.options.separatorChar);
    },
    getYear: function getYear() {
      return this.getSplitValue()[0];
    },
    getMinYear: function getMinYear() {
      var minDate = this.options.minDate;
      return minDate ? this.getSplitDate(minDate)[0] : 1300;
    },
    getMaxYear: function getMaxYear() {
      var maxDate = this.options.maxDate;
      return maxDate ? this.getSplitDate(maxDate)[0] : 1500;
    },
    getMinMonth: function getMinMonth() {
      var minDate = this.options.minDate;
      return minDate ? this.getSplitDate(minDate)[1] : 1;
    },
    getMaxMonth: function getMaxMonth() {
      var maxDate = this.options.maxDate;
      return maxDate ? this.getSplitDate(maxDate)[1] : 12;
    },
    getMonth: function getMonth() {
      return this.getSplitValue()[1];
    },
    getDay: function getDay() {
      return this.getSplitValue()[2];
    },
    getSplitValue: function getSplitValue() {
      return this.getSplitDate(this.element.value).map(function (a) {
        return window.parseInt(a);
      });
    }
  };

  var render = {
    render: function render() {
      this.renderYears();
      this.renderMonths();
      this.renderDays();
    },
    renderYears: function renderYears() {
      createItems(findElement(this.getJalaliDatePickerElement(), DATA_ATTR_YEARS), this.getMinYear(), this.getMaxYear(), this.options.itemTagname, this.getYear());
    },
    renderMonths: function renderMonths() {
      createItems(findElement(this.getJalaliDatePickerElement(), DATA_ATTR_MONTHS), this.getMinMonth(), this.getMaxMonth(), this.options.itemTagname, this.getMonth(), this.options.months);
    },
    renderDays: function renderDays() {
      createItems(findElement(this.getJalaliDatePickerElement(), DATA_ATTR_DAYS), 1, 31, this.options.itemTagname, this.getDay());
    }
  };

  var handlers = {
    click: function click(e) {
      window.console.log(e.target.dataset.view);
    }
  };

  var JalaliDatepicker = /*#__PURE__*/function () {
    function JalaliDatepicker(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, JalaliDatepicker);

      this.options = extend(defaults, options);
      this.element = element;
      this.init();
      return this;
    }

    _createClass(JalaliDatepicker, [{
      key: "init",
      value: function init() {
        this.element.jalaliDatepicker = this;
        var options = this.options;
        this.element.value = options.initDate || jalaliToday(this.options.separatorChar);
      } /// / Destroy the datepicker and remove the instance from the target element
      // destroy() {
      // }

    }]);

    return JalaliDatepicker;
  }();

  JalaliDatepicker.prototype = extend(JalaliDatepicker.prototype, methods, render, handlers);

  window.jalaliDatepicker = function (element, options) {
    return new JalaliDatepicker(element, options);
  };

  window.jalaliDatepicker = function (element, options) {
    return new JalaliDatepicker(element, options);
  };

})));
