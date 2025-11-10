"use strict";

function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
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
    if (!obj || !obj.constructor || Object.prototype.toString.call(obj) !== "[object Object]") {
      return false;
    }
    try {
      return JSON.stringify(obj) === "{}";
    } catch (e) {
      return true;
    }
  };
  var _extend = function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        var sourceValue = source[key];
        var targetValue = target[key];
        if (sourceValue && _typeof(sourceValue) === "object" && !Array.isArray(sourceValue)) {
          target[key] = _extend(targetValue && _typeof(targetValue) === "object" ? targetValue : {}, sourceValue);
        } else {
          target[key] = sourceValue;
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
    if (isUndefined(value)) {
      return value;
    }
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
  var isLeapYear = function isLeapYear(jy) {
    function div(a, b) {
      return ~~(a / b);
    }
    var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    var bl = breaks.length;
    var jump = 0;
    var jp = breaks[0];
    var leap;
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
  var toJalali = function toJalali(gy, gm, gd) {
    var jy;
    var days;
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
  var jalaliToday = function jalaliToday() {
    var date = /* @__PURE__ */new Date();
    var gy = date.getFullYear();
    var gm = date.getMonth() + 1;
    var gd = date.getDate();
    return toJalali(gy, gm, gd);
  };
  var getWeekDay = function getWeekDay(year, month, day) {
    var getDays = function getDays(_month, _day) {
      if (_month < 8) return (_month - 1) * 31 + _day;
      return 6 * 31 + (_month - 7) * 30 + _day;
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
  var toMiladi = function toMiladi(jy, jm, jd) {
    var gy = jy <= 979 ? 621 : 1600;
    jy -= jy <= 979 ? 0 : 979;
    var days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4) + 78 + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
    gy += 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gy += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      gy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    var gd = days + 1;
    var sal_a = [0, 31, gy % 4 === 0 && gy % 100 !== 0 || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var gm;
    for (gm = 0; gm < 13; gm++) {
      var v = sal_a[gm];
      if (gd <= v) break;
      gd -= v;
    }
    return {
      year: gy,
      month: gm,
      day: gd
    };
  };
  var normalizeMinMaxDate = function normalizeMinMaxDate(jdp, dateObj, updateObj) {
    var _dateObj = _extend(dateObj || {}, updateObj || {});
    var initDate = jdp.initDate;
    var maxDate = jdp.options.maxDate;
    var minDate = jdp.options.minDate;
    var year = _dateObj.year;
    var month = _dateObj.month;
    var day = _dateObj.day;
    if (isNaN(year) || year < 1e3 || year > 1999) {
      year = initDate.year;
    } else {
      if (minDate && year < minDate.year) {
        year = minDate.year;
        month = 1;
      } else if (maxDate && year > maxDate.year) {
        year = maxDate.year;
      }
    }
    if (isNaN(month) || month < 1 || month > 12) {
      month = initDate.month;
    } else {
      if (minDate && year <= minDate.year && month < minDate.month) {
        month = minDate.month;
        day = 1;
      } else if (maxDate && year >= maxDate.year && month > maxDate.month) {
        month = maxDate.month;
      }
    }
    if (isNaN(day) || day < 1) {
      day = initDate.day;
    } else {
      if (minDate && month <= minDate.month && day < minDate.day) {
        day = minDate.day;
      } else if (maxDate && month >= maxDate.month && day > maxDate.day) {
        day = maxDate.day;
      }
    }
    return {
      year: year,
      month: month,
      day: day
    };
  };
  var normalizeMinMaxTime = function normalizeMinMaxTime(jdp, timeObj, updateObj) {
    var _timeObj = _extend(timeObj || {}, updateObj || {});
    var initTime = jdp.initTime;
    var maxTime = jdp.options.maxTime;
    var minTime = jdp.options.minTime;
    var hour = _timeObj.hour;
    var minute = _timeObj.minute;
    var second = _timeObj.second;
    if (isNaN(hour) || hour < 0 || hour > 23) {
      hour = initTime.hour;
    } else {
      if (minTime && hour < minTime.hour) {
        hour = minTime.hour;
      } else if (maxTime && hour > maxTime.hour) {
        hour = maxTime.hour;
      }
    }
    if (isNaN(minute) || minute < 0 || minute > 59) {
      minute = initTime.minute;
    } else {
      if (minTime && hour <= minTime.hour && minute < minTime.minute) {
        minute = minTime.minute;
      } else if (maxTime && hour >= maxTime.hour && minute > maxTime.minute) {
        minute = maxTime.minute;
      }
    }
    if (isNaN(second) || second < 0 || second > 59) {
      second = initTime.second;
    } else {
      if (minTime && hour <= minTime.hour && minute <= minTime.minute && second < minTime.second) {
        second = minTime.second;
      } else if (maxTime && hour >= maxTime.hour && minute >= maxTime.minute && second > maxTime.second) {
        second = maxTime.second;
      }
    }
    return {
      hour: hour,
      minute: minute,
      second: second
    };
  };
  var getValidYears = function getValidYears(jdp) {
    var _jdp$options$minDate, _jdp$options$maxDate;
    function rnd(val) {
      return Math.round(val / 100) * 100;
    }
    var initYear = jdp.initDate.year;
    var min = ((_jdp$options$minDate = jdp.options.minDate) === null || _jdp$options$minDate === void 0 ? void 0 : _jdp$options$minDate.year) || rnd(initYear - 200);
    var max = ((_jdp$options$maxDate = jdp.options.maxDate) === null || _jdp$options$maxDate === void 0 ? void 0 : _jdp$options$maxDate.year) || rnd(initYear + 200);
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
    if (initYear === (minDate === null || minDate === void 0 ? void 0 : minDate.year)) {
      start = minDate.month;
      if (initYear === (maxDate === null || maxDate === void 0 ? void 0 : maxDate.year)) {
        finish = maxDate.month;
      }
    } else if (initYear === (maxDate === null || maxDate === void 0 ? void 0 : maxDate.year)) {
      start = 1;
      finish = maxDate.month;
    }
    for (var i = start; i <= finish; i++) {
      months.push(i);
    }
    return months;
  };
  var isValidDate = function isValidDate(jdp, year, month, day) {
    var date = getDateValueStringFromValueObject(jdp, {
      year: year,
      month: month,
      day: day
    });
    var maxDate = jdp.options.maxDate;
    var minDate = jdp.options.minDate;
    if (!isPlainObject(minDate)) {
      minDate = getDateValueStringFromValueObject(jdp, {
        year: minDate.year,
        month: minDate.month,
        day: minDate.day
      });
    }
    if (!isPlainObject(maxDate)) {
      maxDate = getDateValueStringFromValueObject(jdp, {
        year: maxDate.year,
        month: maxDate.month,
        day: maxDate.day
      });
    }
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
    var regex = new RegExp(datePattern + (datePattern && timePattern ? sepOpt.between : "") + timePattern, "g");
    return regex.test(str);
  };
  var getValueObjectFromString = function getValueObjectFromString(jdp, str) {
    var sepOpt = jdp.options.separatorChars;
    var sep = str.split(sepOpt.between);
    var date = jdp.options.date ? sep[0].split(sepOpt.date) : [];
    var time = jdp.options.date ? jdp.options.time && sep[1] ? sep[1].split(sepOpt.time) : [] : sep[0].split(sepOpt.time);
    return {
      year: parseInt(date[0]),
      month: parseInt(date[1]),
      day: parseInt(date[2]),
      hour: parseInt(time[0]),
      minute: parseInt(time[1]),
      second: parseInt(time[2])
    };
  };
  var getDateValueStringFromValueObject = function getDateValueStringFromValueObject(jdp, obj) {
    var sepChar = jdp.options.separatorChars;
    return "".concat(obj.year).concat(sepChar.date).concat(addLeadingZero(obj.month)).concat(sepChar.date).concat(addLeadingZero(obj.day));
  };
  var getValueStringFromValueObject = function getValueStringFromValueObject(jdp, obj) {
    var sepChar = jdp.options.separatorChars;
    var dateStr = jdp.options.date ? "".concat(obj.year).concat(sepChar.date).concat(addLeadingZero(obj.month)).concat(sepChar.date).concat(addLeadingZero(obj.day)) : "";
    var timeStr = jdp.options.time ? "".concat(addLeadingZero(obj.hour)).concat(sepChar.time).concat(addLeadingZero(obj.minute)) + (jdp.options.hasSecond ? sepChar.time + addLeadingZero(obj.second) : "") : "";
    var betweenStr = dateStr && timeStr ? sepChar.between : "";
    return dateStr + betweenStr + timeStr;
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
  var getConvertedValue = function getConvertedValue(jdp) {
    var _jdp$input;
    var value = (_jdp$input = jdp.input) === null || _jdp$input === void 0 ? void 0 : _jdp$input.value;
    if (!value) {
      return "";
    }
    if (jdp.options.targetValueType === "miladi") {
      var normalValue = getValueObjectFromString(jdp, value);
      var miladiValue = toMiladi(normalValue.year, normalValue.month, normalValue.day);
      return "".concat(addLeadingZero(miladiValue.year), "-").concat(addLeadingZero(miladiValue.month), "-").concat(addLeadingZero(miladiValue.day));
    }
    return value;
  };
  var NAMESPACE = "jdp";
  var CONTAINER_ELM_QUERY = "".concat(NAMESPACE, "-container");
  var OVERLAY_ELM_QUERY = "".concat(NAMESPACE, "-overlay");
  var YEARS_ELM_QUERY = "div.".concat(NAMESPACE, "-years");
  var YEAR_ELM_QUERY = "div.".concat(NAMESPACE, "-year");
  var MONTHS_ELM_QUERY = "div.".concat(NAMESPACE, "-months");
  var MONTH_ELM_QUERY = "div.".concat(NAMESPACE, "-month");
  var DAYS_ELM_QUERY = "div.".concat(NAMESPACE, "-days");
  var DAYS_HEADER_ELM_QUERY = "div.".concat(NAMESPACE, "-days-header");
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
  var OPTION_ATTR_SETTING = "attr";
  var INIT_DATE_ATTR_NAME = "data-jdp-init-date";
  var MAX_DATE_ATTR_NAME = "data-jdp-max-date";
  var MIN_DATE_ATTR_NAME = "data-jdp-min-date";
  var MAX_TIME_ATTR_NAME = "data-jdp-max-time";
  var MIN_TIME_ATTR_NAME = "data-jdp-min-time";
  var TARGET_VALUE_INPUT_ATTR_NAME = "data-jdp-target-value-input";
  var TARGET_VALUE_TYPE_ATTR_NAME = "data-jdp-target-value-type";
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
  var setInnerHTML = function setInnerHTML(element, html) {
    element.innerHTML = html;
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
  var toPersianDigitsIfNeeded = function toPersianDigitsIfNeeded(data, convert) {
    if (convert) return data.toString().replace(/\d/g, function (d) {
      return "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)];
    });
    return data;
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
      }, jdp.options.minTime || {});
      var maxTime = _extend({
        hour: 23,
        minute: 59,
        second: 59
      }, jdp.options.maxTime || {});
      if (type === "hour") {
        return getArrayNumbersStringTo(minTime.hour, maxTime.hour);
      }
      if (type === "minute") {
        if (minTime.hour === maxTime.hour) {
          return getArrayNumbersStringTo(minTime.minute, maxTime.minute);
        }
        if (jdp.initTime.hour === minTime.hour) {
          return getArrayNumbersStringTo(minTime.minute, 59);
        }
        if (jdp.initTime.hour === maxTime.hour) {
          return getArrayNumbersStringTo(0, maxTime.minute);
        }
        return getArrayNumbersStringTo(0, 59);
      }
      if (type === "second") {
        if (minTime.hour === maxTime.hour && minTime.minute === maxTime.minute) {
          return getArrayNumbersStringTo(minTime.second, maxTime.second);
        }
        if (jdp.initTime.hour === minTime.hour && jdp.initTime.minute === minTime.minute) {
          return getArrayNumbersStringTo(minTime.second, 59);
        }
        if (jdp.initTime.hour === maxTime.hour && jdp.initTime.minute === maxTime.minute) {
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
      var currentItem = items[i];
      var optionElm = createElement("option", dropDownContainer);
      optionElm.value = currentItem.toString();
      optionElm.text = toPersianDigitsIfNeeded(currentItem, jdp.options.persianDigits).toString();
      optionElm.selected = parseInt(currentItem) === parseInt(jdp.getValue[type] || jdp.initTime[type]);
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
  var createElementPlusMinus = function createElementPlusMinus(jdp, container, isYear, mode) {
    var _jdp$options$maxDate2, _jdp$options$maxDate3, _jdp$options$minDate2, _jdp$options$minDate3;
    var isPlus = mode === "PLUS";
    var className = "";
    var event = null;
    var elmQuery = isPlus ? PLUS_ICON_ELM_QUERY : MINUS_ICON_ELM_QUERY;
    var isMaxYear = isPlus && ((_jdp$options$maxDate2 = jdp.options.maxDate) === null || _jdp$options$maxDate2 === void 0 ? void 0 : _jdp$options$maxDate2.year) === jdp.initDate.year;
    var isMaxMonth = isPlus && ((_jdp$options$maxDate3 = jdp.options.maxDate) === null || _jdp$options$maxDate3 === void 0 ? void 0 : _jdp$options$maxDate3.month) === jdp.initDate.month;
    var isMinYear = !isPlus && ((_jdp$options$minDate2 = jdp.options.minDate) === null || _jdp$options$minDate2 === void 0 ? void 0 : _jdp$options$minDate2.year) === jdp.initDate.year;
    var isMinMonth = !isPlus && ((_jdp$options$minDate3 = jdp.options.minDate) === null || _jdp$options$minDate3 === void 0 ? void 0 : _jdp$options$minDate3.month) === jdp.initDate.month;
    var html = isPlus ? jdp.options.plusHtml : jdp.options.minusHtml;
    if (isYear) {
      if (isPlus) event = function event() {
        jdp.increaseYear();
      };else event = function event() {
        jdp.decreaseYear();
      };
      if (isMaxYear || isMinYear) {
        className = DISABLE_CLASS_NAME;
      }
    } else {
      if (isPlus) event = function event() {
        jdp.increaseMonth();
      };else event = function event() {
        jdp.decreaseMonth();
      };
      if (isMaxYear && isMaxMonth || isMinYear && isMinMonth) {
        className = DISABLE_CLASS_NAME;
      }
    }
    createElement(elmQuery + "." + className, container, EVENT_CLICK_STR, event, html);
  };
  var createElementPlus = function createElementPlus(jdp, container, isYear) {
    createElementPlusMinus(jdp, container, isYear, "PLUS");
  };
  var createElementMinus = function createElementMinus(jdp, container, isYear) {
    createElementPlusMinus(jdp, container, isYear, "MINUS");
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
      yearInput.setAttribute("tabindex", "-1");
      var validYears = getValidYears(jdp);
      for (var i = validYears.min; i <= validYears.max; i++) {
        var optionElm = createElement("option", yearInput);
        optionElm.value = i.toString();
        optionElm.text = toPersianDigitsIfNeeded(i, jdp.options.persianDigits).toString();
        optionElm.selected = i === jdp.initDate.year;
      }
    } else {
      yearInput.tabIndex = -1;
      yearInput.value = jdp.initDate.year.toString();
      yearInput.type = "number";
    }
  };
  var renderMonths = function renderMonths(jdp) {
    var monthsContainer = createElement(MONTHS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(jdp, monthsContainer, false);
    var monthContainer = createElement(MONTH_ELM_QUERY, monthsContainer);
    createElementMinus(jdp, monthsContainer, false);
    var monthDropDownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, function (e) {
      jdp.monthChange(parseFloat(e.target.value));
    });
    monthDropDownContainer.tabIndex = -1;
    var months = getValidMonths(jdp);
    var monthsName = jdp.options.months;
    for (var i = 0; i < months.length; i++) {
      var optionElm = createElement("option", monthDropDownContainer);
      optionElm.value = months[i].toString();
      optionElm.text = toPersianDigitsIfNeeded(monthsName[months[i] - 1], jdp.options.persianDigits).toString();
      optionElm.selected = months[i] === jdp.initDate.month;
    }
  };
  var renderDays = function renderDays(jdp) {
    var daysHeaderContainer = createElement(DAYS_HEADER_ELM_QUERY, jdp.dpContainer);
    var daysContainer = createElement(DAYS_ELM_QUERY, jdp.dpContainer);
    for (var i = 0; i < 7; i++) {
      createElement(DAY_NAME_ELM_QUERY + getLastWeekClassIfNessesary(i), daysHeaderContainer, void 0, void 0, toPersianDigitsIfNeeded(jdp.options.days[i], jdp.options.persianDigits).toString());
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
    var beforeMonthNumber = dayOptions.month === 1 ? 12 : dayOptions.month - 1;
    var afterMonthNumber = dayOptions.month === 12 ? 1 : dayOptions.month + 1;
    var beforeMonthYearNumber = beforeMonthNumber === 12 ? dayOptions.year - 1 : dayOptions.year;
    var afterMonthYearNumber = afterMonthNumber === 1 ? dayOptions.year + 1 : dayOptions.year;
    var beforeMonthDays = dayOptions.month === 1 ? getDaysInMonth(dayOptions.year - 1, beforeMonthNumber) : getDaysInMonth(dayOptions.year, beforeMonthNumber);
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
        dayOptions.weekDay = getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day);
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
      var dayContainer = createElement(query + dayOptions.className, daysContainer, void 0, void 0, toPersianDigitsIfNeeded(dayOptions.day, jdp.options.persianDigits).toString());
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
    var _jdp$input2;
    var footerContainer = createElement(FOOTER_ELM_QUERY, jdp.dpContainer, void 0, void 0, void 0);
    if (jdp.options.showTodayBtn && jdp.options.date) {
      var isActiveToday = isValidDateToday(jdp);
      createElement(TODAY_BTN_ELM_QUERY + (isActiveToday ? "" : ".disabled-btn"), footerContainer, EVENT_CLICK_STR, function () {
        if (isActiveToday) jdp.setValue(jdp.today);
      }, "امروز");
    }
    if (!jdp.options.date && jdp.options.time && (!((_jdp$input2 = jdp.input) !== null && _jdp$input2 !== void 0 && _jdp$input2.value) || !!jdp.options.showSelectTimeBtnAlways)) {
      createElement(TODAY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.setValue(jdp.initTime);
        jdp.hide();
      }, "انتخاب");
    }
    if (jdp.options.showEmptyBtn) {
      createElement(EMPTY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.cleanValue();
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
  var normalizeOptions = function normalizeOptions(externalOptions, internalOptions, jdp) {
    var setDefaultValue = function setDefaultValue(propertyName, defaultValue) {
      var _ref;
      var extValue = externalOptions[propertyName];
      var intValue = internalOptions[propertyName];
      internalOptions[propertyName] = (_ref = extValue !== null && extValue !== void 0 ? extValue : intValue) !== null && _ref !== void 0 ? _ref : defaultValue;
    };
    function setDefinePropertyFromAttr(propertyName) {
      var getDefaultFromAttr = function getDefaultFromAttr(attrName, isTime) {
        var _jdp$input3;
        var attrVal = (_jdp$input3 = jdp.input) === null || _jdp$input3 === void 0 ? void 0 : _jdp$input3.getAttribute(attrName);
        if (!isTime && attrVal === MIN_MAX_TODAY_SETTING) return clon(jdp.today);
        if (!isString(attrVal)) return {};
        try {
          attrVal = document.querySelector(attrVal).value;
        } catch (_unused) {}
        if (isTime) {
          if (isValidTimeString(jdp, attrVal)) {
            attrVal = getValueObjectFromString(jdp, attrVal);
          } else {
            attrVal = {};
          }
        } else {
          if (isValidDateString(jdp, attrVal)) {
            attrVal = getValueObjectFromString(jdp, attrVal);
          } else {
            attrVal = {};
          }
        }
        return attrVal;
      };
      if (externalOptions[propertyName] === OPTION_ATTR_SETTING || propertyName === "date" || propertyName === "time") {
        if (propertyName !== "date" && propertyName !== "time") {
          delete internalOptions[propertyName];
        }
        var getterFunc = function getterFunc() {};
        if (propertyName === "initDate") {
          getterFunc = function getterFunc() {
            return getDefaultFromAttr(INIT_DATE_ATTR_NAME);
          };
        } else if (propertyName === "minDate") {
          getterFunc = function getterFunc() {
            return getDefaultFromAttr(MIN_DATE_ATTR_NAME);
          };
        } else if (propertyName === "maxDate") {
          getterFunc = function getterFunc() {
            return getDefaultFromAttr(MAX_DATE_ATTR_NAME);
          };
        } else if (propertyName === "minTime") {
          getterFunc = function getterFunc() {
            return getDefaultFromAttr(MIN_TIME_ATTR_NAME, true);
          };
        } else if (propertyName === "maxTime") {
          getterFunc = function getterFunc() {
            return getDefaultFromAttr(MAX_TIME_ATTR_NAME, true);
          };
        } else if (propertyName === "targetValueInput") {
          getterFunc = function getterFunc() {
            var _jdp$input4;
            return (_jdp$input4 = jdp.input) === null || _jdp$input4 === void 0 ? void 0 : _jdp$input4.getAttribute(TARGET_VALUE_INPUT_ATTR_NAME);
          };
        } else if (propertyName === "targetValueType") {
          getterFunc = function getterFunc() {
            var _jdp$input5;
            return (_jdp$input5 = jdp.input) === null || _jdp$input5 === void 0 ? void 0 : _jdp$input5.getAttribute(TARGET_VALUE_TYPE_ATTR_NAME);
          };
        } else if (propertyName === "date") {
          var _externalOptions$date;
          var _date = (_externalOptions$date = externalOptions.date) !== null && _externalOptions$date !== void 0 ? _externalOptions$date : internalOptions.date;
          delete internalOptions[propertyName];
          getterFunc = function getterFunc() {
            var _jdp$input6, _jdp$input7;
            return !((_jdp$input6 = jdp.input) !== null && _jdp$input6 !== void 0 && _jdp$input6.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME)) && (_date || ((_jdp$input7 = jdp.input) === null || _jdp$input7 === void 0 ? void 0 : _jdp$input7.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME)));
          };
        } else if (propertyName === "time") {
          var _externalOptions$time;
          var _time = (_externalOptions$time = externalOptions.time) !== null && _externalOptions$time !== void 0 ? _externalOptions$time : internalOptions.time;
          delete internalOptions[propertyName];
          getterFunc = function getterFunc() {
            var _jdp$input8, _jdp$input9;
            return !((_jdp$input8 = jdp.input) !== null && _jdp$input8 !== void 0 && _jdp$input8.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME)) && (_time || ((_jdp$input9 = jdp.input) === null || _jdp$input9 === void 0 ? void 0 : _jdp$input9.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME)));
          };
        }
        window.Object.defineProperty(internalOptions, propertyName, {
          get: getterFunc,
          enumerable: true,
          configurable: true
        });
      } else {
        setDefaultValue(propertyName, void 0);
      }
      return internalOptions;
    }
    setDefaultValue("container", "body");
    setDefaultValue("selector", "input[data-jdp]");
    setDefaultValue("zIndex", 1e3);
    setDefaultValue("autoShow", true);
    setDefaultValue("autoShow", true);
    setDefaultValue("autoHide", true);
    setDefaultValue("autoReadOnlyInput", isMobile);
    setDefaultValue("topSpace", 0);
    setDefaultValue("bottomSpace", 0);
    setDefaultValue("overflowSpace", -10);
    setDefaultValue("hideAfterChange", true);
    setDefaultValue("changeMonthRotateYear", false);
    setDefaultValue("showTodayBtn", true);
    setDefaultValue("showEmptyBtn", true);
    setDefaultValue("showCloseBtn", isMobile);
    setDefaultValue("showSelectTimeBtnAlways", false);
    setDefaultValue("hasSecond", true);
    setDefaultValue("days", ["ش", "ی", "د", "س", "چ", "پ", "ج"]);
    setDefaultValue("months", ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]);
    setDefaultValue("separatorChars", {
      date: "/",
      between: " ",
      time: ":"
    });
    setDefaultValue("persianDigits", false);
    setDefaultValue("plusHtml",
    // eslint-disable-next-line @typescript-eslint/quotes, quotes
    '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path></g></svg>');
    setDefaultValue("minusHtml", '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-596v-84h596v84z"></path></g></svg>');
    setDefaultValue("useDropDownYears", true);
    setDefaultValue("today", jalaliToday());
    if (isFunction(externalOptions.dayRendering)) internalOptions.dayRendering = externalOptions.dayRendering;
    if (externalOptions.minDate === MIN_MAX_TODAY_SETTING) internalOptions.minDate = internalOptions.today;
    if (externalOptions.maxDate === MIN_MAX_TODAY_SETTING) internalOptions.maxDate = internalOptions.today;
    internalOptions = setDefinePropertyFromAttr("time");
    internalOptions = setDefinePropertyFromAttr("date");
    internalOptions = setDefinePropertyFromAttr("initDate");
    internalOptions = setDefinePropertyFromAttr("minDate");
    internalOptions = setDefinePropertyFromAttr("maxDate");
    internalOptions = setDefinePropertyFromAttr("minTime");
    internalOptions = setDefinePropertyFromAttr("maxTime");
    internalOptions = setDefinePropertyFromAttr("targetValueInput");
    internalOptions = setDefinePropertyFromAttr("targetValueType");
    return internalOptions;
  };
  var JalaliDatepickerInternalOptions = /*#__PURE__*/_createClass(function JalaliDatepickerInternalOptions(externalOptions, jdp) {
    _classCallCheck(this, JalaliDatepickerInternalOptions);
    _defineProperty(this, "container", void 0);
    _defineProperty(this, "selector", void 0);
    _defineProperty(this, "zIndex", void 0);
    _defineProperty(this, "autoShow", void 0);
    _defineProperty(this, "autoHide", void 0);
    _defineProperty(this, "autoReadOnlyInput", void 0);
    _defineProperty(this, "topSpace", void 0);
    _defineProperty(this, "bottomSpace", void 0);
    _defineProperty(this, "overflowSpace", void 0);
    _defineProperty(this, "hideAfterChange", void 0);
    _defineProperty(this, "changeMonthRotateYear", void 0);
    _defineProperty(this, "showTodayBtn", void 0);
    _defineProperty(this, "showEmptyBtn", void 0);
    _defineProperty(this, "showCloseBtn", void 0);
    _defineProperty(this, "showSelectTimeBtnAlways", void 0);
    _defineProperty(this, "dayRendering", void 0);
    _defineProperty(this, "minDate", void 0);
    _defineProperty(this, "maxDate", void 0);
    _defineProperty(this, "initDate", void 0);
    _defineProperty(this, "minTime", void 0);
    _defineProperty(this, "maxTime", void 0);
    _defineProperty(this, "initTime", void 0);
    _defineProperty(this, "date", void 0);
    _defineProperty(this, "time", void 0);
    _defineProperty(this, "today", void 0);
    _defineProperty(this, "hasSecond", void 0);
    _defineProperty(this, "targetValueInput", void 0);
    _defineProperty(this, "targetValueType", void 0);
    _defineProperty(this, "days", void 0);
    _defineProperty(this, "months", void 0);
    _defineProperty(this, "separatorChars", void 0);
    _defineProperty(this, "persianDigits", void 0);
    _defineProperty(this, "plusHtml", void 0);
    _defineProperty(this, "minusHtml", void 0);
    _defineProperty(this, "useDropDownYears", void 0);
    normalizeOptions(externalOptions || {}, isPlainObject(jdp.options) ? this : jdp.options, jdp);
  });
  var jalaliDatepicker = {
    init: function init(options) {
      this.updateOptions(options);
      addEventListenerOnResize();
      if (this.options.autoHide) addEventListenerOnBody();
      if (this.options.autoShow) addEventListenerOnInputs(this.options.selector);
    },
    updateOptions: function updateOptions(options) {
      this.options = new JalaliDatepickerInternalOptions(options, this);
    },
    options: {},
    input: null,
    isTransitioning: false,
    get dpContainer() {
      if (!this._dpContainer || !this._dpContainer.isConnected) {
        this._dpContainer = createElement(CONTAINER_ELM_QUERY, this.options.container || document.body);
        this._dpContainer.setAttribute("tabindex", "-1");
        if (this.options.zIndex) this.dpContainer.style.zIndex = String(this.options.zIndex);
      }
      if (!this.overlayElm || !this.overlayElm.isConnected) {
        this.overlayElm = createElement(OVERLAY_ELM_QUERY, this.options.container || document.body);
        if (this.options.zIndex) this.overlayElm.style.zIndex = String(this.options.zIndex - 1);
      }
      return this._dpContainer;
    },
    get today() {
      this._today = this._today || this.options.today || jalaliToday();
      return this._today;
    },
    get inputValue() {
      var _this$input;
      var inputValue = clon(((_this$input = this.input) === null || _this$input === void 0 ? void 0 : _this$input.value) || "");
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
      var _this$input2;
      if (this.options.initDate) {
        return this.options.initDate;
      }
      if (this._initDate) {
        return this._initDate;
      }
      this._initDate = clon(((_this$input2 = this.input) === null || _this$input2 === void 0 ? void 0 : _this$input2.value) || "") || {};
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
      var _this$input3;
      if (this._initTime) {
        return this._initTime;
      }
      var date = /* @__PURE__ */new Date();
      var defaultInit = {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: 0
      };
      this._initTime = clon(((_this$input3 = this.input) === null || _this$input3 === void 0 ? void 0 : _this$input3.value) || "") || this.options.initTime || defaultInit;
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
      if (this.overlayElm) this.overlayElm.style.display = STYLE_DISPLAY_BLOCK;
      setTimeout(function () {
        _this.dpContainer.style.visibility = STYLE_VISIBILITY_VISIBLE;
        _this.dpContainer.style.display = STYLE_DISPLAY_BLOCK;
        if (_this.overlayElm) _this.overlayElm.style.display = STYLE_DISPLAY_BLOCK;
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
      if (this.overlayElm) this.overlayElm.style.display = STYLE_DISPLAY_HIDDEN;
      this.isShow = false;
      document.removeEventListener(EVENT_KEYDOWN_STR, handleEscKey);
    },
    setPosition: function setPosition() {
      if (!this.input || this.dpContainer.style.visibility !== STYLE_VISIBILITY_VISIBLE) {
        return;
      }
      var inputBounds = this.input.getBoundingClientRect();
      var inputHeight = inputBounds.height;
      var left = inputBounds.left;
      var top = inputBounds.top + inputHeight;
      if (this.options.topSpace) top += this.options.topSpace;
      var windowWidth = window.document.body.offsetWidth;
      var dpContainerWidth = this.dpContainer.offsetWidth;
      var dpContainerHeight = this.dpContainer.offsetHeight;
      if (left + dpContainerWidth >= windowWidth) {
        left -= left + dpContainerWidth - (windowWidth + (this.options.overflowSpace || 0));
      }
      if (top - inputHeight >= dpContainerHeight && top + dpContainerHeight >= window.innerHeight) {
        top -= dpContainerHeight + inputHeight + (this.options.bottomSpace || 0) + (this.options.topSpace || 0);
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
      }, _extend(this._value || {}, objValue));
      this._initTime = null;
      if (this.input) {
        this.input.value = getValueStringFromValueObject(this, this._value);
        triggerEvent(this.input, EVENT_CHANGE_INPUT_STR);
      }
      this.setTargetValue();
      if (!this.options.time && this.options.hideAfterChange) {
        this.hide();
      } else {
        this._draw();
      }
    },
    cleanValue: function cleanValue() {
      if (this.input) {
        this.input.value = "";
        triggerEvent(this.input, EVENT_CHANGE_INPUT_STR);
      }
      this.setTargetValue();
    },
    setTargetValue: function setTargetValue() {
      var _this2 = this;
      if (!this.options.targetValueInput) return;
      var targetInputList = document.querySelectorAll(this.options.targetValueInput);
      if (!targetInputList || !targetInputList.length) return;
      targetInputList.forEach(function (targetInput) {
        targetInput.value = getConvertedValue(_this2);
      });
    },
    increaseMonth: function increaseMonth() {
      if (!this._initDate) return;
      var isLastMonth = this._initDate.month === 12;
      if (this.options.changeMonthRotateYear && isLastMonth) {
        this.increaseYear();
      }
      this.monthChange(isLastMonth ? 1 : this._initDate.month + 1);
    },
    decreaseMonth: function decreaseMonth() {
      if (!this._initDate) return;
      var isFirstMonth = this._initDate.month === 1;
      if (this.options.changeMonthRotateYear && isFirstMonth) {
        this.decreaseYear();
      }
      this.monthChange(isFirstMonth ? 12 : this._initDate.month - 1);
    },
    monthChange: function monthChange(month) {
      if (!this._initDate) return;
      this._initDate = normalizeMinMaxDate(this, this._initDate, {
        month: month
      });
      this._draw();
    },
    increaseYear: function increaseYear() {
      if (!this._initDate) return;
      this.yearChange(this._initDate.year + 1);
    },
    decreaseYear: function decreaseYear() {
      if (!this._initDate) return;
      this.yearChange(this._initDate.year - 1);
    },
    yearChange: function yearChange(year) {
      if (!this._initDate) return;
      this._initDate = normalizeMinMaxDate(this, this._initDate, {
        year: year
      });
      this._draw();
    },
    _dpContainer: void 0,
    overlayElm: void 0,
    _today: void 0,
    _initDate: null,
    _initTime: null,
    _value: null,
    isShow: false
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
  function onResizeHandler() {
    jalaliDatepicker.setPosition();
  }
  function addEventListenerOnResize() {
    Element.prototype.matches = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
    window.removeEventListener("resize", onResizeHandler);
    window.addEventListener("resize", onResizeHandler);
  }
  function addEventListenerOnInputs(querySelector) {
    if (!querySelector) return;
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
        var _jalaliDatepicker$inp, _jalaliDatepicker$inp2;
        (_jalaliDatepicker$inp = jalaliDatepicker.input) === null || _jalaliDatepicker$inp === void 0 || (_jalaliDatepicker$inp2 = _jalaliDatepicker$inp.blur) === null || _jalaliDatepicker$inp2 === void 0 || _jalaliDatepicker$inp2.call(_jalaliDatepicker$inp);
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
