/*!
 * Jalalidatepicker v0.0.1
 * undefined
 *
 * Copyright 2020-present Majid Hooshiyar
 * Released under the MIT license
 *
 * Date: 2020-11-01T11:37:30.147Z
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

  var defaults = {
    // Show the datepicker automatically when initialized
    autoShow: false,
    // Hide the datepicker automatically when picked
    autoHide: false,
    // The date string format
    format: 'mm/dd/yyyy',
    // The start view date
    startDate: null,
    // The end view date
    endDate: null,
    // Days' name of the week.
    days: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه‌', 'چهارشنبه', 'پنجشنبه‌', 'جمعه'],
    // Months' name
    months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    // The offset top or bottom of the datepicker from the element
    offset: 10,
    // The `z-index` of the datepicker
    zIndex: 1000,
    // The template of the datepicker
    template: "<div class=\"jdp-container\">\n            <div class=\"jdp-panel\" data-view=\"years picker\">\n                <ul>\n                    <li data-view=\"years prev\">&lsaquo;</li>\n                    <li data-view=\"years current\"></li>\n                    <li data-view=\"years next\">&rsaquo;</li>\n                </ul>\n                <ul data-view=\"years\"></ul>\n            </div>\n            <div class=\"jdp-panel\" data-view=\"months picker\">\n                <ul>\n                    <li data-view=\"year prev\">&lsaquo;</li>\n                    <li data-view=\"year current\"></li>\n                    <li data-view=\"year next\">&rsaquo;</li>\n                </ul>\n                <ul data-view=\"months\"></ul>\n            </div>\n            <div class=\"jdp-panel\" data-view=\"days picker\">\n                <ul>\n                    <li data-view=\"month prev\">&lsaquo;</li>\n                    <li data-view=\"month current\"></li>\n                    <li data-view=\"month next\">&rsaquo;</li>\n                </ul>\n                <ul data-view=\"week\"></ul>\n                <ul data-view=\"days\"></ul>\n            </div>\n        </div>",
    // The parent of the datepicker
    container: 'body'
  };

  var IS_BROWSER = typeof window !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var NAMESPACE = 'jalalidatepicker';
  var EVENT_HIDE = new Event("hide.".concat(NAMESPACE));
  var EVENT_SHOW = new Event("show.".concat(NAMESPACE));

  var methods = {
    // Show the datepicker
    show: function show() {
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
    }
  };

  function isPlainObject(obj) {
    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }

    var proto = WINDOW.Object.getPrototypeOf(obj); // Objects with no prototype (e.g., `Object.create( null )`) are plain

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


    if (_typeof(target) !== 'object' && typeof target !== 'function') {
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
        for (var j = 0; j < WINDOW.Object.keys(options).length; j++) {
          var name = WINDOW.Object.keys(options)[j];

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
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
    } // Return the modified object


    return target;
  }
  function createElement(tag, parent) {
    var element = WINDOW.document.createElement(tag);
    parent.appendChild(element);
    return element;
  }

  function createJalaliDatePickerElement() {
    if (!this.jalaliDatePickerElement) {
      this.jalaliDatePickerElement = createElement('div', defaults.container);
    }

    return this.jalaliDatePickerElement;
  }

  var render = {
    draw: function draw(year, month, day) {
      WINDOW.console.log(year, month, day);
      var jdpEl = createJalaliDatePickerElement();
      jdpEl.innerHTML = defaults.template;
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
      }
    }]);

    return JalaliDatepicker;
  }();

  console.log(JalaliDatepicker.prototype);
  JalaliDatepicker.prototype = extend(JalaliDatepicker.prototype, methods, render);
  console.log(JalaliDatepicker.prototype);

  window.jalaliDatepicker = function (element, options) {
    return new JalaliDatepicker(element, options);
  };

})));
