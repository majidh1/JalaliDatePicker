"use strict";

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function (_window$navigator) {
  "use strict";

  var isUndefined = function isUndefined(value) {
    return typeof value === "undefined";
  };
  var isFunction = function isFunction(value) {
    return typeof value === "function";
  };
  var isString = function isString(value) {
    return typeof value === "string";
  };
  var clon = function clon(a) {
    return JSON.parse(JSON.stringify(a));
  };
  var isPlainObject = function isPlainObject(obj) {
    if (!obj || !obj.constructor || obj.nodeType) {
      return false;
    }
    try {
      return JSON.stringify(obj) === "{}";
    } catch (e) {
      return true;
    }
  };
  var _extend = function extend() {
    var options;
    var src;
    var copy;
    var copyIsArray;
    var clone;
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }
    var target = params[0] || {};
    var i = 1;
    var length = params.length;
    var deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = params[i] || {};
      i += 1;
    }
    if (_typeof(target) !== "object" && isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = void 0;
      i -= 1;
    }
    for (; i < length; i++) {
      options = params[i];
      if (!isUndefined(options) && options !== null) {
        for (var j = 0; j < window.Object.keys(options).length; j++) {
          var name = window.Object.keys(options)[j];
          if (Object.prototype.hasOwnProperty.call(options, name)) {
            copy = options[name];
            if (name === "__proto__" || target === copy) {
              return true;
            }
            copyIsArray = Array.isArray(copy);
            if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
              src = target[name];
              if (copyIsArray && !Array.isArray(src)) {
                clone = [];
              } else if (!copyIsArray && !isPlainObject(src)) {
                clone = {};
              } else {
                clone = src;
              }
              target[name] = _extend(deep, clone, copy);
            } else if (!isUndefined(copy)) {
              target[name] = copy;
            }
          }
        }
      }
    }
    return target;
  };
  var mod = function mod(a, b) {
    return window.Math.abs(a - b * window.Math.floor(a / b));
  };
  var addLeadingZero = function addLeadingZero(value) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var str = String(Math.abs(value));
    var i = str.length;
    var result = "";
    if (value < 0) {
      result += "-";
    }
    while (i < length) {
      i += 1;
      result += "0";
    }
    return result + str;
  };
  var normalizeMinMaxDate = function normalizeMinMaxDate(jdp, dateObj, updateObj) {
    var _dateObj = _extend(dateObj, updateObj);
    var initDate = jdp.initDate;
    var maxDate = jdp.options.maxDate;
    var minDate = jdp.options.minDate;
    var year = _dateObj.year;
    var month = _dateObj.month;
    var day = _dateObj.day;
    if (isNaN(year) || year < 1e3 || year > 1999) {
      year = initDate.year;
    } else {
      if (year < minDate.year) {
        year = minDate.year;
        month = 1;
      } else if (year > maxDate.year) {
        year = maxDate.year;
      }
    }
    if (isNaN(month) || month < 1 || month > 12) {
      month = initDate.month;
    } else {
      if (year <= minDate.year && month < minDate.month) {
        month = minDate.month;
        day = 1;
      } else if (year >= maxDate.year && month > maxDate.month) {
        month = maxDate.month;
      }
    }
    if (isNaN(day) || day < 1) {
      day = initDate.day;
    } else {
      if (month <= minDate.month && day < minDate.day) {
        day = minDate.day;
      } else if (month >= maxDate.month && day > maxDate.day) {
        day = maxDate.day;
      }
    }
    return {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day)
    };
  };
  var normalizeMinMaxTime = function normalizeMinMaxTime(jdp, timeObj, updateObj) {
    var _timeObj = _extend(timeObj, updateObj);
    var initTime = jdp.initTime;
    var maxTime = jdp.options.maxTime;
    var minTime = jdp.options.minTime;
    var hour = _timeObj.hour;
    var minute = _timeObj.minute;
    var second = _timeObj.second;
    if (isNaN(hour) || hour < 0 || hour > 23) {
      hour = initTime.hour;
    } else {
      if (hour < minTime.hour) {
        hour = minTime.hour;
      } else if (hour > maxTime.hour) {
        hour = maxTime.hour;
      }
    }
    if (isNaN(minute) || minute < 0 || minute > 59) {
      minute = initTime.minute;
    } else {
      if (hour <= minTime.hour && minute < minTime.minute) {
        minute = minTime.minute;
      } else if (hour >= maxTime.hour && minute > maxTime.minute) {
        minute = maxTime.minute;
      }
    }
    if (isNaN(second) || second < 0 || second > 59) {
      second = initTime.second;
    } else {
      if (hour <= minTime.hour && minute <= minTime.minute && second < minTime.second) {
        second = minTime.second;
      } else if (hour >= maxTime.hour && minute >= maxTime.minute && second > maxTime.second) {
        second = maxTime.second;
      }
    }
    return {
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: parseInt(second)
    };
  };
  var getValidYears = function getValidYears(jdp) {
    function rnd(val) {
      return Math.round(val / 100) * 100;
    }
    var initYear = jdp.initDate.year;
    var min = jdp.options.minDate.year || rnd(initYear - 200);
    var max = jdp.options.maxDate.year || rnd(initYear + 200);
    return {
      min: min,
      max: max
    };
  };
  var getValidMonths = function getValidMonths(jdp) {
    var initYear = jdp.initDate.year;
    var minDate = jdp.options.minDate;
    var maxDate = jdp.options.maxDate;
    var months = [];
    var start = 1;
    var finish = 12;
    if (initYear === minDate.year) {
      start = minDate.month;
      if (initYear === maxDate.year) {
        finish = maxDate.month;
      }
    } else if (initYear === maxDate.year) {
      start = 1;
      finish = maxDate.month;
    }
    for (var i = start; i <= finish; i++) {
      months.push(i);
    }
    return months;
  };
  var isValidDate = function isValidDate(jdp, year, month, day) {
    var minDate = jdp.options.minDate;
    var maxDate = jdp.options.maxDate;
    var date = getDateValueStringFromValueObject(jdp, {
      year: year,
      month: month,
      day: day
    });
    minDate = isPlainObject(minDate) ? date : getDateValueStringFromValueObject(jdp, {
      year: minDate.year,
      month: minDate.month,
      day: minDate.day
    });
    maxDate = isPlainObject(maxDate) ? date : getDateValueStringFromValueObject(jdp, {
      year: maxDate.year,
      month: maxDate.month,
      day: maxDate.day
    });
    return date <= maxDate && date >= minDate;
  };
  var isValidDateToday = function isValidDateToday(jdp) {
    return isValidDate(jdp, jdp.today.year, jdp.today.month, jdp.today.day);
  };
  var isValidValueString = function isValidValueString(jdp, str) {
    if (!str) {
      return false;
    }
    var sepOpt = jdp.options.separatorChars;
    var datePattern = jdp.options.date ? "\\d{4}".concat(sepOpt.date, "\\d{2}").concat(sepOpt.date, "\\d{2}") : "";
    var timePattern = jdp.options.time ? "\\d{2}".concat(sepOpt.time, "\\d{2}") + (jdp.options.hasSecond ? "".concat(sepOpt.time, "\\d{2}") : "") : "";
    var regex = new RegExp(datePattern + (datePattern && timePattern ? sepOpt.between : "") + timePattern);
    return regex.test(str, "g");
  };
  var getValueObjectFromString = function getValueObjectFromString(jdp, str) {
    var sepOpt = jdp.options.separatorChars;
    var sep = str.split(sepOpt.between);
    var date = jdp.options.date ? sep[0].split(sepOpt.date) : {};
    var time = jdp.options.date ? jdp.options.time && sep[1] ? sep[1].split(sepOpt.time) : {} : sep[0].split(sepOpt.time);
    return {
      year: parseInt(date[0]),
      month: parseInt(date[1]),
      day: parseInt(date[2]),
      hour: parseInt(time[0]),
      minute: parseInt(time[1]),
      second: parseInt(time[2])
    };
  };
  var getValueStringFromValueObject = function getValueStringFromValueObject(jdp, obj) {
    var sepChar = jdp.options.separatorChars;
    var dateStr = jdp.options.date ? "".concat(obj.year).concat(sepChar.date).concat(addLeadingZero(obj.month)).concat(sepChar.date).concat(addLeadingZero(obj.day)) : "";
    var timeStr = jdp.options.time ? "".concat(addLeadingZero(obj.hour)).concat(sepChar.time).concat(addLeadingZero(obj.minute)) + (jdp.options.hasSecond ? sepChar.time + addLeadingZero(obj.second) : "") : "";
    var betweenStr = dateStr && timeStr ? sepChar.between : "";
    return dateStr + betweenStr + timeStr;
  };
  var getDateValueStringFromValueObject = function getDateValueStringFromValueObject(jdp, obj) {
    var sepChar = jdp.options.separatorChars;
    return "".concat(obj.year).concat(sepChar.date).concat(addLeadingZero(obj.month)).concat(sepChar.date).concat(addLeadingZero(obj.day));
  };
  var isValidDateString = function isValidDateString(jdp, str) {
    if (!str) {
      return false;
    }
    var date = str.substr(0, 10).split(jdp.options.separatorChars.date);
    return date.length === 3 && date[0].length === 4 && date[1].length === 2 && date[2].length === 2;
  };
  var isValidTimeString = function isValidTimeString(jdp, str) {
    if (!str) {
      return false;
    }
    var time = str.substr(jdp.options.date ? 11 : 0, 8).split(jdp.options.separatorChars.time);
    return time.length === (jdp.options.hasSecond ? 3 : 2) && !time.find(function (t) {
      return t.toString().length !== 2;
    });
  };
  var NAMESPACE = "jdp";
  var CONTAINER_ELM_QUERY = "".concat(NAMESPACE, "-container");
  var OVERLAY_ELM_QUERY = "".concat(NAMESPACE, "-overlay");
  var YEARS_ELM_QUERY = "div.".concat(NAMESPACE, "-years");
  var YEAR_ELM_QUERY = "div.".concat(NAMESPACE, "-year");
  var MONTHS_ELM_QUERY = "div.".concat(NAMESPACE, "-months");
  var MONTH_ELM_QUERY = "div.".concat(NAMESPACE, "-month");
  var DAYS_ELM_QUERY = "div.".concat(NAMESPACE, "-days");
  var DAY_ELM_QUERY = "div.".concat(NAMESPACE, "-day");
  var DAY_NOTINMONTH_ELM_QUERY = "div.".concat(NAMESPACE, "-day.not-in-month");
  var DAY_DISABLED_ELM_QUERY = "div.".concat(NAMESPACE, "-day.disabled-day");
  var DAY_DISABLED_NOTINMONTH_ELM_QUERY = "".concat(DAY_NOTINMONTH_ELM_QUERY, ".disabled-day");
  var DAY_NAME_ELM_QUERY = "div.".concat(NAMESPACE, "-day-name");
  var PLUS_ICON_ELM_QUERY = "div.".concat(NAMESPACE, "-icon-plus");
  var MINUS_ICON_ELM_QUERY = "div.".concat(NAMESPACE, "-icon-minus");
  var FOOTER_ELM_QUERY = "div.".concat(NAMESPACE, "-footer");
  var TODAY_BTN_ELM_QUERY = "div.".concat(NAMESPACE, "-btn-today");
  var EMPTY_BTN_ELM_QUERY = "div.".concat(NAMESPACE, "-btn-empty");
  var CLOSE_BTN_ELM_QUERY = "div.".concat(NAMESPACE, "-btn-close");
  var FOOTER_TIME_ELM_QUERY = "div.".concat(NAMESPACE, "-time-container");
  var TIME_DROPDOWN_PARENT_ELM_QUERY = "div.".concat(NAMESPACE, "-time");
  var SELECTED_CLASS_NAME = "selected";
  var TODAY_CLASS_NAME = "today";
  var LAST_WEEK_CLASS_NAME = "last-week";
  var DISABLE_CLASS_NAME = "not-in-range";
  var HOLLY_DAY_CLASS_NAME = "holly-day";
  var EVENT_CHANGE_INPUT_STR = "".concat(NAMESPACE, ":change");
  var EVENT_CHANGE_MONTH_DROPDOWN_STR = "change";
  var EVENT_CHANGE_YEAR_INPUT_STR = "keyup change";
  var EVENT_CHANGE_TIME_DROPDOWN_STR = "change";
  var EVENT_CLICK_STR = "click";
  var EVENT_FOCUS_STR = "focusin";
  var EVENT_KEYDOWN_STR = "keydown";
  var MIN_MAX_TODAY_SETTING = "today";
  var MIN_MAX_ATTR_SETTING = "attr";
  var INIT_DATE_ATTR_NAME = "data-jdp-init-date";
  var MAX_DATE_ATTR_NAME = "data-jdp-max-date";
  var MIN_DATE_ATTR_NAME = "data-jdp-min-date";
  var MAX_TIME_ATTR_NAME = "data-jdp-max-time";
  var MIN_TIME_ATTR_NAME = "data-jdp-min-time";
  var ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME = "data-jdp-only-date";
  var ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME = "data-jdp-only-time";
  var STYLE_VISIBILITY_VISIBLE = "visible";
  var STYLE_VISIBILITY_HIDDEN = "hidden";
  var STYLE_DISPLAY_BLOCK = "block";
  var STYLE_DISPLAY_HIDDEN = "none";
  var STYLE_POSITION_FIXED = "fixed";
  var _getScrollParent = function getScrollParent(node) {
    if (["html", "body", "#document"].indexOf((node.nodeName || "").toLowerCase()) >= 0) {
      return window;
    }
    if (node instanceof HTMLElement) {
      var _window$getComputedSt = window.getComputedStyle(node),
        overflow = _window$getComputedSt.overflow,
        overflowX = _window$getComputedSt.overflowX,
        overflowY = _window$getComputedSt.overflowY;
      if (/auto|scroll|overlay/.test(overflow + overflowY + overflowX)) {
        return node;
      }
    }
    return _getScrollParent(node.parentNode);
  };
  var getEventTarget = function getEventTarget(event) {
    try {
      if (isFunction(event.composedPath)) {
        return event.composedPath()[0];
      }
      return event.target;
    } catch (error) {
      return event.target;
    }
  };
  var containsDom = function containsDom(parent, event) {
    var path = event.path || event.composedPath && event.composedPath() || false;
    if (!path) {
      return parent.outerHTML.indexOf(event.target.outerHTML) > -1;
    }
    return path.indexOf(parent) !== -1;
  };
  var createEvent = function createEvent(name) {
    var e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
  };
  var triggerEvent = function triggerEvent(elm, event) {
    if (!elm) return;
    elm.dispatchEvent(createEvent(event));
    if (event === EVENT_CHANGE_INPUT_STR) {
      elm.dispatchEvent(createEvent("change"));
      elm.dispatchEvent(createEvent("input"));
    }
  };
  var addListenerMulti = function addListenerMulti(element, eventNames, listener) {
    var events = eventNames.split(" ");
    for (var i = 0, iLen = events.length; i < iLen; i++) {
      element.addEventListener(events[i], listener, false);
    }
  };
  var createElement = function createElement(tag, parent, eventNames, event, content) {
    var splits = tag.split(".");
    tag = splits.shift() || "div";
    var className = splits;
    var element = window.document.createElement(tag);
    if (isString(parent)) {
      window.document.querySelector(parent).appendChild(element);
    } else {
      parent.appendChild(element);
    }
    if (className.length) {
      element.className = className.join(" ");
    }
    if (eventNames && event) {
      addListenerMulti(element, eventNames, event);
    }
    if (!isUndefined(content)) {
      setInnerHTML(element, content);
    }
    return element;
  };
  var setInnerHTML = function setInnerHTML(element, html) {
    element.innerHTML = html;
  };
  var toPersianDigitsIfNeeded = function toPersianDigitsIfNeeded(data, convert) {
    if (convert) return data.toString().replace(/\d/g, function (d) {
      return "۰۱۲۳۴۵۶۷۸۹"[d];
    });
    return data;
  };
  var isLeapYear = function isLeapYear(jy) {
    function div(a, b) {
      return ~~(a / b);
    }
    var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178],
      bl = breaks.length;
    var jump = 0,
      jp = breaks[0],
      leap;
    for (var i = 1; i < bl; i += 1) {
      var jm = breaks[i];
      jump = jm - jp;
      if (jy < jm) break;
      jp = jm;
    }
    var n = jy - jp;
    if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;
    return leap === 0;
  };
  var jalaliToday = function jalaliToday() {
    var date = /* @__PURE__ */new Date();
    var gy = parseInt(date.getFullYear());
    var gm = parseInt(date.getMonth()) + 1;
    var gd = parseInt(date.getDate());
    var jy, days;
    var gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (gy > 1600) {
      jy = 979;
      gy -= 1600;
    } else {
      jy = 0;
      gy -= 621;
    }
    var gy2 = gm > 2 ? gy + 1 : gy;
    days = 365 * gy + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) - 80 + gd + gdm[gm - 1];
    jy += 33 * parseInt(days / 12053);
    days %= 12053;
    jy += 4 * parseInt(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += parseInt((days - 1) / 365);
      days = (days - 1) % 365;
    }
    var jm = days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    var jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return {
      year: jy,
      month: jm,
      day: jd
    };
  };
  var getWeekDay = function getWeekDay(year, month, day) {
    var getDays = function getDays(month2, day2) {
      if (month2 < 8) return (month2 - 1) * 31 + day2;
      return 6 * 31 + (month2 - 7) * 30 + day2;
    };
    var getDiffDays = function getDiffDays(year1, month1, day1, year2, month2, day2) {
      var diffDays = getDays(month2, day2) - getDays(month1, day1);
      var y1 = year1 < year2 ? year1 : year2;
      var y2 = year1 < year2 ? year2 : year1;
      for (var y = y1; y < y2; y++) {
        if (isLeapYear(y)) diffDays += year1 < year2 ? 366 : -366;else diffDays += year1 < year2 ? 365 : -365;
      }
      return diffDays;
    };
    return mod(getDiffDays(1392, 3, 25, year, month, day), 7);
  };
  var getDaysInMonth = function getDaysInMonth(year, month) {
    return [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, isLeapYear(year) ? 30 : 29][month];
  };
  var getArrayNumbersStringTo = function getArrayNumbersStringTo(min, max) {
    var items = [];
    for (var i = min; i <= max; i++) items.push(addLeadingZero(i));
    return items;
  };
  var timeDropDownRender = function timeDropDownRender(jdp, timePickerContainer, type) {
    var getItemForType = function getItemForType() {
      var minTime = _extend({
        hour: 0,
        minute: 0,
        second: 0
      }, jdp.options.minTime);
      var maxTime = _extend({
        hour: 23,
        minute: 59,
        second: 59
      }, jdp.options.maxTime);
      if (type == "hour") {
        return getArrayNumbersStringTo(minTime.hour, maxTime.hour);
      }
      if (type == "minute") {
        if (minTime.hour == maxTime.hour) {
          return getArrayNumbersStringTo(minTime.minute, maxTime.minute);
        }
        if (jdp.initTime.hour == minTime.hour) {
          return getArrayNumbersStringTo(minTime.minute, 59);
        }
        if (jdp.initTime.hour == maxTime.hour) {
          return getArrayNumbersStringTo(0, maxTime.minute);
        }
        return getArrayNumbersStringTo(0, 59);
      }
      if (type == "second") {
        if (minTime.hour == maxTime.hour && minTime.minute == maxTime.minute) {
          return getArrayNumbersStringTo(minTime.second, maxTime.second);
        }
        if (jdp.initTime.hour == minTime.hour && jdp.initTime.minute == minTime.minute) {
          return getArrayNumbersStringTo(minTime.second, 59);
        }
        if (jdp.initTime.hour == maxTime.hour && jdp.initTime.minute == maxTime.minute) {
          return getArrayNumbersStringTo(0, maxTime.second);
        }
        return getArrayNumbersStringTo(0, 59);
      }
      return getArrayNumbersStringTo(minTime.second, maxTime.second);
    };
    var container = createElement(TIME_DROPDOWN_PARENT_ELM_QUERY, timePickerContainer);
    var dropDownContainer = createElement("select", container, EVENT_CHANGE_TIME_DROPDOWN_STR, function (e) {
      jdp.setValue(normalizeMinMaxTime(jdp, jdp.initTime, _defineProperty({}, type, e.target.value)));
    });
    dropDownContainer.tabIndex = -1;
    var items = getItemForType();
    for (var i = 0; i < items.length; i++) {
      var optionElm = createElement("option", dropDownContainer);
      optionElm.value = items[i].toString();
      optionElm.text = toPersianDigitsIfNeeded(items[i], jdp.options.persianDigits);
      optionElm.selected = parseInt(items[i]) === parseInt(jdp.getValue[type] || jdp.initTime[type]);
    }
  };
  var renderTimePicker = function renderTimePicker(jdp) {
    var elmQuery = FOOTER_TIME_ELM_QUERY + (jdp.options.time && !jdp.options.date ? ".jdp-only-time" : "");
    var timePickerContainer = createElement(elmQuery, jdp.dpContainer);
    if (jdp.options.hasSecond) {
      timeDropDownRender(jdp, timePickerContainer, "second");
    }
    timeDropDownRender(jdp, timePickerContainer, "minute");
    timeDropDownRender(jdp, timePickerContainer, "hour");
  };
  var getLastWeekClassIfNessesary = function getLastWeekClassIfNessesary(dayOfWeek) {
    return dayOfWeek === 6 ? ".".concat(LAST_WEEK_CLASS_NAME, ".").concat(HOLLY_DAY_CLASS_NAME) : "";
  };
  var createElementPlus = function createElementPlus(jdp, container, isYear) {
    createElement(PLUS_ICON_ELM_QUERY + (isYear ? jdp.options.maxDate.year === jdp.initDate.year ? ".".concat(DISABLE_CLASS_NAME) : "" : jdp.options.maxDate.year === jdp.initDate.year && jdp.options.maxDate.month === jdp.initDate.month ? ".".concat(DISABLE_CLASS_NAME) : ""), container, EVENT_CLICK_STR, isYear ? function () {
      jdp.increaseYear();
    } : function () {
      jdp.increaseMonth();
    }, jdp.options.plusHtml);
  };
  var createElementMinus = function createElementMinus(jdp, container, isYear) {
    createElement(MINUS_ICON_ELM_QUERY + (isYear ? jdp.options.minDate.year === jdp.initDate.year ? ".".concat(DISABLE_CLASS_NAME) : "" : jdp.options.minDate.year === jdp.initDate.year && jdp.options.minDate.month === jdp.initDate.month ? ".".concat(DISABLE_CLASS_NAME) : ""), container, EVENT_CLICK_STR, isYear ? function () {
      jdp.decreaseYear();
    } : function () {
      jdp.decreaseMonth();
    }, jdp.options.minusHtml);
  };
  var renderYear = function renderYear(jdp) {
    var yearsContainer = createElement(YEARS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(jdp, yearsContainer, true);
    var yearContainer = createElement(YEAR_ELM_QUERY, yearsContainer);
    createElementMinus(jdp, yearsContainer, true);
    var useDropDownYears = jdp.options.useDropDownYears;
    var yearInputTagName = useDropDownYears ? "select" : "input";
    var yearInput = createElement(yearInputTagName, yearContainer, EVENT_CHANGE_YEAR_INPUT_STR, function (e) {
      if (e.target.value < 1e3 || e.target.value > 2e3) return;
      jdp.yearChange(e.target.value);
    });
    if (useDropDownYears) {
      var validYears = getValidYears(jdp);
      for (var i = validYears.min; i <= validYears.max; i++) {
        var optionElm = createElement("option", yearInput);
        optionElm.value = i;
        optionElm.text = toPersianDigitsIfNeeded(i, jdp.options.persianDigits);
        optionElm.selected = i === jdp.initDate.year;
      }
    } else {
      yearInput.tabIndex = -1;
      yearInput.value = jdp.initDate.year;
      yearInput.type = "number";
    }
  };
  var renderMonths = function renderMonths(jdp) {
    var monthsContainer = createElement(MONTHS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(jdp, monthsContainer, false);
    var monthContainer = createElement(MONTH_ELM_QUERY, monthsContainer);
    createElementMinus(jdp, monthsContainer, false);
    var monthDropDownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, function (e) {
      jdp.monthChange(e.target.value);
    });
    monthDropDownContainer.tabIndex = -1;
    var months = getValidMonths(jdp);
    var monthsName = jdp.options.months;
    for (var i = 0; i < months.length; i++) {
      var optionElm = createElement("option", monthDropDownContainer);
      optionElm.value = months[i];
      optionElm.text = toPersianDigitsIfNeeded(monthsName[months[i] - 1], jdp.options.persianDigits);
      optionElm.selected = months[i] === jdp.initDate.month;
    }
  };
  var renderDays = function renderDays(jdp) {
    var daysContainer = createElement(DAYS_ELM_QUERY, jdp.dpContainer);
    for (var i = 0; i < 7; i++) {
      createElement(DAY_NAME_ELM_QUERY + getLastWeekClassIfNessesary(i), daysContainer, null, null, toPersianDigitsIfNeeded(jdp.options.days[i], jdp.options.persianDigits));
    }
    var setDefaultOptions = function setDefaultOptions(opt) {
      if (!opt.day || opt.inBeforeMonth) {
        opt.day = 1;
      } else {
        opt.day += 1;
      }
      opt.inBeforeMonth = false;
      opt.inAfterMonth = false;
      opt.isValid = false;
      opt.isHollyDay = false;
      opt.className = "";
      opt.year = jdp.initDate.year;
      opt.month = jdp.initDate.month;
      opt.weekDay = getWeekDay(opt.year, opt.month, opt.day);
      return opt;
    };
    var dayOptions = setDefaultOptions({});
    var daysInMonth = getDaysInMonth(dayOptions.year, dayOptions.month);
    var startWeekDayInMonth = dayOptions.weekDay;
    var maxDaysInCalendar = 7 * Math.ceil((startWeekDayInMonth + daysInMonth) / 7) - 1;
    var beforeMonthNumber = dayOptions.month == 1 ? 12 : dayOptions.month - 1;
    var afterMonthNumber = dayOptions.month == 12 ? 1 : dayOptions.month + 1;
    var beforeMonthYearNumber = beforeMonthNumber == 12 ? dayOptions.year - 1 : dayOptions.year;
    var afterMonthYearNumber = afterMonthNumber == 1 ? dayOptions.year + 1 : dayOptions.year;
    var beforeMonthDays = dayOptions.month == 1 ? getDaysInMonth(dayOptions.year - 1, beforeMonthNumber) : getDaysInMonth(dayOptions.year, beforeMonthNumber);
    var beforeDayInMonth = beforeMonthDays - startWeekDayInMonth;
    var afterDayInMonth = 0;
    var _loop = function _loop() {
      dayOptions.inBeforeMonth = dayOptions.day <= startWeekDayInMonth && _i < startWeekDayInMonth;
      dayOptions.inAfterMonth = _i >= daysInMonth + startWeekDayInMonth;
      if (dayOptions.inBeforeMonth || dayOptions.inAfterMonth) {
        if (dayOptions.inBeforeMonth) {
          beforeDayInMonth++;
          dayOptions.day = beforeDayInMonth;
          dayOptions.year = beforeMonthYearNumber;
          dayOptions.month = beforeMonthNumber;
        } else {
          afterDayInMonth++;
          dayOptions.day = afterDayInMonth;
          dayOptions.year = afterMonthYearNumber;
          dayOptions.month = afterMonthNumber;
        }
      }
      dayOptions.isValid = isValidDate(jdp, dayOptions.year, dayOptions.month, dayOptions.day);
      dayOptions.className = getLastWeekClassIfNessesary(getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day));
      if (jdp.inputValue.day === dayOptions.day && jdp.inputValue.year === dayOptions.year && jdp.inputValue.month === dayOptions.month) {
        dayOptions.className += ".".concat(SELECTED_CLASS_NAME);
      }
      if (jdp.today.day === dayOptions.day && jdp.today.year === dayOptions.year && jdp.today.month === dayOptions.month) {
        dayOptions.className += ".".concat(TODAY_CLASS_NAME);
      }
      if (isFunction(jdp.options.dayRendering)) {
        _extend(dayOptions, jdp.options.dayRendering(dayOptions, jdp.input));
      }
      if (dayOptions.isHollyDay) {
        dayOptions.className += ".".concat(HOLLY_DAY_CLASS_NAME);
      }
      var query = dayOptions.isValid ? DAY_ELM_QUERY : DAY_DISABLED_ELM_QUERY;
      if (dayOptions.inBeforeMonth || dayOptions.inAfterMonth) {
        query = DAY_NOTINMONTH_ELM_QUERY;
        if (!dayOptions.isValid) {
          query = DAY_DISABLED_NOTINMONTH_ELM_QUERY;
        }
      }
      var dayContainer = createElement(query + dayOptions.className, daysContainer, null, null, toPersianDigitsIfNeeded(dayOptions.day, jdp.options.persianDigits));
      dayContainer.day = dayOptions.day;
      dayContainer.month = dayOptions.month;
      dayContainer.year = dayOptions.year;
      if (dayOptions.isValid) {
        dayContainer.addEventListener(EVENT_CLICK_STR, function () {
          jdp.setValue({
            year: dayContainer.year,
            month: dayContainer.month,
            day: dayContainer.day
          });
        });
      }
      setDefaultOptions(dayOptions);
    };
    for (var _i = 0; _i <= maxDaysInCalendar; _i++) {
      _loop();
    }
  };
  var renderDatePicker = function renderDatePicker(jdp) {
    renderYear(jdp);
    renderMonths(jdp);
    renderDays(jdp);
  };
  var renderFooter = function renderFooter(jdp) {
    var _jdp$input;
    var footerContainer = createElement(FOOTER_ELM_QUERY, jdp.dpContainer);
    if (jdp.options.showTodayBtn && jdp.options.date) {
      var isActiveToday = isValidDateToday(jdp);
      createElement(TODAY_BTN_ELM_QUERY + (isActiveToday ? "" : ".disabled-btn"), footerContainer, EVENT_CLICK_STR, function () {
        isActiveToday && jdp.setValue(jdp.today);
      }, "امروز");
    }
    if (!jdp.options.date && jdp.options.time && (!((_jdp$input = jdp.input) !== null && _jdp$input !== void 0 && _jdp$input.value) || !!jdp.options.showSelectTimeBtnAlways)) {
      createElement(TODAY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.setValue(jdp.initTime);
        jdp.hide();
      }, "انتخاب");
    }
    if (jdp.options.showEmptyBtn) {
      createElement(EMPTY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.input.value = "";
        triggerEvent(jdp.input, EVENT_CHANGE_INPUT_STR);
        if (jdp.options.hideAfterChange) jdp.hide();
      }, "خالی");
    }
    if (jdp.options.showCloseBtn) {
      createElement(CLOSE_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.hide();
      }, "بستن");
    }
  };
  var render = function render(jdp) {
    setInnerHTML(jdp.dpContainer, "");
    if (jdp.options.date) {
      renderDatePicker(jdp);
    }
    if (jdp.options.time) {
      renderTimePicker(jdp);
    }
    renderFooter(jdp);
  };
  function draw() {
    render(this);
  }
  var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test((_window$navigator = window.navigator) === null || _window$navigator === void 0 || (_window$navigator = _window$navigator.userAgent) === null || _window$navigator === void 0 ? void 0 : _window$navigator.toLowerCase());
  var defaults = clon({
    days: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
    months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
    //sample {year:1400,month:11,day:29}
    initDate: null,
    //sample {year:1400,month:11,day:29}
    today: null,
    //{hour:12,minute:11,second:10}
    initTime: null,
    hasSecond: true,
    time: false,
    date: true,
    //sample {year:1399,month:11,day:29} || today || attr
    minDate: {},
    //sample {year:1400,month:11,day:29} || today || attr
    maxDate: {},
    minTime: {},
    maxTime: {},
    separatorChars: {
      date: "/",
      between: " ",
      time: ":"
    },
    persianDigits: false,
    zIndex: 1e3,
    container: "body",
    selector: "input[data-jdp]",
    autoShow: true,
    autoHide: true,
    hideAfterChange: true,
    plusHtml: '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path></g></svg>',
    minusHtml: '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-596v-84h596v84z"></path></g></svg>',
    changeMonthRotateYear: false,
    showTodayBtn: true,
    showEmptyBtn: true,
    showCloseBtn: isMobile,
    showSelectTimeBtnAlways: false,
    autoReadOnlyInput: isMobile,
    useDropDownYears: true,
    topSpace: 0,
    bottomSpace: 0,
    overflowSpace: -10
  });
  var jalaliDatepicker = {
    isInitialized: false,
    init: function init(options) {
      this.updateOptions(options);
      addEventListenerOnResize();
      if (this.options.autoHide) addEventListenerOnBody();
      if (this.options.autoShow) addEventListenerOnInputs(this.options.selector);
      this.isInitialized = true;
    },
    updateOptions: function updateOptions(options) {
      this.options = normalizeOptions(options);
    },
    options: defaults,
    input: null,
    isTransitioning: false,
    get dpContainer() {
      if (!this._dpContainer || !this._dpContainer.isConnected) {
        this._dpContainer = createElement(CONTAINER_ELM_QUERY, this.options.container);
        this.dpContainer.style.zIndex = this.options.zIndex;
      }
      if (!this.overlayElm || !this.overlayElm.isConnected) {
        this.overlayElm = createElement(OVERLAY_ELM_QUERY, this.options.container);
        this.overlayElm.style.zIndex = this.options.zIndex - 1;
      }
      return this._dpContainer;
    },
    get today() {
      this._today = this._today || this.options.today || jalaliToday();
      return this._today;
    },
    get inputValue() {
      var inputValue = clon(this.input.value);
      if (isValidValueString(this, inputValue)) {
        inputValue = getValueObjectFromString(this, inputValue);
      } else if (isString(inputValue) && isValidDateString(this, inputValue)) {
        inputValue = getValueObjectFromString(this, inputValue);
      } else {
        inputValue = {};
      }
      return inputValue;
    },
    get initDate() {
      if (this.options.initDate) {
        return this.options.initDate;
      }
      if (this._initDate) {
        return this._initDate;
      }
      this._initDate = clon(this.input.value) || {};
      if (isPlainObject(this._initDate)) {
        this._initDate = this.options.initDate || clon(this.today);
      } else if (isString(this._initDate) && isValidDateString(this, this._initDate)) {
        this._initDate = getValueObjectFromString(this, this._initDate);
      } else {
        this._initDate = clon(this.today);
      }
      this._initDate = normalizeMinMaxDate(this, this._initDate);
      return this._initDate;
    },
    get initTime() {
      if (this._initTime) {
        return this._initTime;
      }
      var date = /* @__PURE__ */new Date();
      var defaultInit = {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: 0
      };
      this._initTime = clon(this.input.value) || this.options.initTime || defaultInit;
      if (isString(this._initTime)) {
        if (isValidTimeString(this, this._initTime)) {
          this._initTime = getValueObjectFromString(this, this._initTime);
        } else {
          this._initTime = defaultInit;
        }
      }
      this._initTime = normalizeMinMaxTime(this, this._initTime);
      return this._initTime;
    },
    _draw: draw,
    show: function show(input) {
      var _this = this;
      this._initDate = null;
      this._initTime = null;
      this._value = null;
      this.input = input;
      this._draw();
      setReadOnly(input, this.options);
      this.isTransitioning = true;
      this.dpContainer.style.visibility = STYLE_VISIBILITY_VISIBLE;
      this.dpContainer.style.display = STYLE_DISPLAY_BLOCK;
      this.overlayElm.style.display = STYLE_DISPLAY_BLOCK;
      setTimeout(function () {
        _this.dpContainer.style.visibility = STYLE_VISIBILITY_VISIBLE;
        _this.dpContainer.style.display = STYLE_DISPLAY_BLOCK;
        _this.overlayElm.style.display = STYLE_DISPLAY_BLOCK;
        _this.isShow = true;
        _this.isTransitioning = false;
      }, 300);
      this.setPosition();
      setScrollOnParent(input);
      document.addEventListener(EVENT_KEYDOWN_STR, handleEscKey);
    },
    hide: function hide() {
      this.dpContainer.style.visibility = STYLE_VISIBILITY_HIDDEN;
      this.dpContainer.style.display = STYLE_DISPLAY_HIDDEN;
      this.overlayElm.style.display = STYLE_DISPLAY_HIDDEN;
      this.isShow = false;
      document.removeEventListener(EVENT_KEYDOWN_STR, handleEscKey);
    },
    setPosition: function setPosition() {
      if (this.dpContainer.style.visibility !== STYLE_VISIBILITY_VISIBLE) {
        return;
      }
      var inputBounds = this.input.getBoundingClientRect();
      var inputHeight = inputBounds.height;
      var left = inputBounds.left;
      var top = inputBounds.top + inputHeight;
      top += this.options.topSpace;
      var windowWidth = window.document.body.offsetWidth;
      var dpContainerWidth = this.dpContainer.offsetWidth;
      var dpContainerHeight = this.dpContainer.offsetHeight;
      if (left + dpContainerWidth >= windowWidth) {
        left -= left + dpContainerWidth - (windowWidth + this.options.overflowSpace);
      }
      if (top - inputHeight >= dpContainerHeight && top + dpContainerHeight >= window.innerHeight) {
        top -= dpContainerHeight + inputHeight + this.options.bottomSpace + this.options.topSpace;
      }
      this.dpContainer.style.position = STYLE_POSITION_FIXED;
      this.dpContainer.style.left = left + "px";
      this.dpContainer.style.top = top + "px";
    },
    get getValue() {
      this._value = this._value || this.inputValue || {};
      return this._value;
    },
    setValue: function setValue(objValue) {
      this._value = _extend({
        year: this.today.year,
        month: this.today.month,
        day: this.today.day,
        hour: this.initTime.hour,
        minute: this.initTime.minute,
        second: this.initTime.second
      }, _extend(this._value, objValue));
      this._initTime = null;
      this.input.value = getValueStringFromValueObject(this, this._value);
      triggerEvent(this.input, EVENT_CHANGE_INPUT_STR);
      if (!this.options.time && this.options.hideAfterChange) {
        this.hide();
      } else {
        this._draw();
      }
    },
    increaseMonth: function increaseMonth() {
      var isLastMonth = this._initDate.month === 12;
      if (this.options.changeMonthRotateYear && isLastMonth) {
        this.increaseYear();
      }
      this.monthChange(isLastMonth ? 1 : this._initDate.month + 1);
    },
    decreaseMonth: function decreaseMonth() {
      var isFirstMonth = this._initDate.month === 1;
      if (this.options.changeMonthRotateYear && isFirstMonth) {
        this.decreaseYear();
      }
      this.monthChange(isFirstMonth ? 12 : this._initDate.month - 1);
    },
    monthChange: function monthChange(month) {
      this._initDate = normalizeMinMaxDate(this, this._initDate, {
        month: month
      });
      this._draw();
    },
    increaseYear: function increaseYear() {
      this.yearChange(this._initDate.year + 1);
    },
    decreaseYear: function decreaseYear() {
      this.yearChange(this._initDate.year - 1);
    },
    yearChange: function yearChange(year) {
      this._initDate = normalizeMinMaxDate(this, this._initDate, {
        year: year
      });
      this._draw();
    }
  };
  var getDefaultFromAttr = function getDefaultFromAttr(attrName, isTime) {
    var _jalaliDatepicker$inp;
    var attrVal = (_jalaliDatepicker$inp = jalaliDatepicker.input) === null || _jalaliDatepicker$inp === void 0 ? void 0 : _jalaliDatepicker$inp.getAttribute(attrName);
    if (!isTime && attrVal === MIN_MAX_TODAY_SETTING) return clon(jalaliDatepicker.today);
    if (!isString(attrVal)) return {};
    try {
      attrVal = document.querySelector(attrVal).value;
    } catch (_unused) {}
    if (isTime) {
      if (isValidTimeString(jalaliDatepicker, attrVal)) {
        attrVal = getValueObjectFromString(jalaliDatepicker, attrVal);
      } else {
        attrVal = {};
      }
    } else {
      if (isValidDateString(jalaliDatepicker, attrVal)) {
        attrVal = getValueObjectFromString(jalaliDatepicker, attrVal);
      } else {
        attrVal = {};
      }
    }
    return attrVal;
  };
  var normalizeOptions = function normalizeOptions(options) {
    if (!isUndefined(jalaliDatepicker.options._date) && isUndefined(options.date)) {
      options.date = jalaliDatepicker.options._date;
    }
    if (!isUndefined(jalaliDatepicker.options._time) && isUndefined(options.time)) {
      options.time = jalaliDatepicker.options._time;
    }
    options.separatorChars = _extend(jalaliDatepicker.options.separatorChars, options.separatorChars);
    options = _extend({}, jalaliDatepicker.options, options);
    if (options.minDate === MIN_MAX_TODAY_SETTING) options.minDate = clon(jalaliDatepicker.today);
    if (options.maxDate === MIN_MAX_TODAY_SETTING) options.maxDate = clon(jalaliDatepicker.today);
    if (options.initDate === MIN_MAX_ATTR_SETTING || options._initDateIsAttr) {
      delete options.initDate;
      options._initDateIsAttr = true;
      window.Object.defineProperty(options, "initDate", {
        get: function get() {
          return getDefaultFromAttr(INIT_DATE_ATTR_NAME);
        },
        enumerable: true
      });
    }
    if (options.minDate === MIN_MAX_ATTR_SETTING || options._minDateIsAttr) {
      delete options.minDate;
      options._minDateIsAttr = true;
      window.Object.defineProperty(options, "minDate", {
        get: function get() {
          return getDefaultFromAttr(MIN_DATE_ATTR_NAME);
        },
        enumerable: true
      });
    }
    if (options.maxDate === MIN_MAX_ATTR_SETTING || options._maxDateIsAttr) {
      delete options.maxDate;
      options._maxDateIsAttr = true;
      window.Object.defineProperty(options, "maxDate", {
        get: function get() {
          return getDefaultFromAttr(MAX_DATE_ATTR_NAME);
        },
        enumerable: true
      });
    }
    if (options.minTime === MIN_MAX_ATTR_SETTING || options._minTimeIsAttr) {
      delete options.minTime;
      options._minTimeIsAttr = true;
      window.Object.defineProperty(options, "minTime", {
        get: function get() {
          return getDefaultFromAttr(MIN_TIME_ATTR_NAME, true);
        },
        enumerable: true
      });
    }
    if (options.maxTime === MIN_MAX_ATTR_SETTING || options._maxTimeIsAttr) {
      delete options.maxTime;
      options._maxTimeIsAttr = true;
      window.Object.defineProperty(options, "maxTime", {
        get: function get() {
          return getDefaultFromAttr(MAX_TIME_ATTR_NAME, true);
        },
        enumerable: true
      });
    }
    options._date = options.date;
    delete options.date;
    window.Object.defineProperty(options, "date", {
      get: function get() {
        var _jalaliDatepicker$inp2, _jalaliDatepicker$inp3;
        return !((_jalaliDatepicker$inp2 = jalaliDatepicker.input) !== null && _jalaliDatepicker$inp2 !== void 0 && _jalaliDatepicker$inp2.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME)) && (options._date || ((_jalaliDatepicker$inp3 = jalaliDatepicker.input) === null || _jalaliDatepicker$inp3 === void 0 ? void 0 : _jalaliDatepicker$inp3.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME)));
      },
      enumerable: true
    });
    options._time = options.time;
    delete options.time;
    window.Object.defineProperty(options, "time", {
      get: function get() {
        var _jalaliDatepicker$inp4, _jalaliDatepicker$inp5;
        return !((_jalaliDatepicker$inp4 = jalaliDatepicker.input) !== null && _jalaliDatepicker$inp4 !== void 0 && _jalaliDatepicker$inp4.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME)) && (options._time || ((_jalaliDatepicker$inp5 = jalaliDatepicker.input) === null || _jalaliDatepicker$inp5 === void 0 ? void 0 : _jalaliDatepicker$inp5.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME)));
      },
      enumerable: true
    });
    return options;
  };
  function setScrollOnParent(input) {
    _getScrollParent(input).addEventListener("scroll", function () {
      jalaliDatepicker.setPosition();
    }, {
      passive: true
    });
  }
  function setReadOnly(input, options) {
    if (options.autoReadOnlyInput && !input.readOnly) {
      input.setAttribute("readonly", "readonly");
      input.readOnly = true;
    }
  }
  function addEventListenerOnResize() {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
    window.addEventListener("resize", function () {
      jalaliDatepicker.setPosition();
    });
  }
  function addEventListenerOnInputs(querySelector) {
    document.body.addEventListener(EVENT_FOCUS_STR, function (e) {
      if (e.target && e.target.matches(querySelector)) {
        jalaliDatepicker.show(e.target);
      }
    });
  }
  function addEventListenerOnBody() {
    document.body.addEventListener("click", function (e) {
      if (!jalaliDatepicker.isShow || containsDom(jalaliDatepicker.dpContainer, e) || getEventTarget(e) === jalaliDatepicker.input) {
        return;
      }
      jalaliDatepicker.hide();
    });
  }
  function handleEscKey(event) {
    if (event.key === "Escape") {
      if (!jalaliDatepicker.isTransitioning) {
        var _jalaliDatepicker$inp6, _jalaliDatepicker$inp7;
        (_jalaliDatepicker$inp6 = jalaliDatepicker.input) === null || _jalaliDatepicker$inp6 === void 0 || (_jalaliDatepicker$inp7 = _jalaliDatepicker$inp6.blur) === null || _jalaliDatepicker$inp7 === void 0 || _jalaliDatepicker$inp7.call(_jalaliDatepicker$inp6);
        jalaliDatepicker.hide();
      }
    }
  }
  window.jalaliDatepicker = {
    startWatch: function startWatch() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      jalaliDatepicker.init(options);
    },
    show: function show(input) {
      jalaliDatepicker.show(input);
    },
    hide: function hide() {
      jalaliDatepicker.hide();
    },
    updateOptions: function updateOptions(options) {
      jalaliDatepicker.updateOptions(options);
    }
  };
})();
