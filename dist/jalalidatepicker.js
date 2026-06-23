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
  var isObject = function isObject(value) {
    return value !== null && typeof value === "object";
  };
  var clone = function clone(value) {
    return JSON.parse(JSON.stringify(value));
  };
  var isNotObjectOrIsEmptyObject = function isNotObjectOrIsEmptyObject(obj) {
    if (!isObject(obj)) {
      return true;
    }
    try {
      return JSON.stringify(obj) === "{}";
    } catch (e) {
      return false;
    }
  };
  var _extend = function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        var sourceValue = source[key];
        var targetValue = target[key];
        if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
          target[key] = _extend(targetValue && typeof targetValue === "object" ? targetValue : {}, sourceValue);
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
  var addLeadingZero = function addLeadingZero(value, length) {
    if (length === void 0) {
      length = 2;
    }
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
  var toGregorian = function toGregorian(jy, jm, jd) {
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
  var getDateNumber = function getDateNumber(date) {
    return date.year * 1e4 + date.month * 100 + date.day;
  };
  var isValidYear = function isValidYear(year) {
    return !isNaN(year) && year >= 1e3 && year <= 1999;
  };
  var isValidMonth = function isValidMonth(month) {
    return !isNaN(month) && month >= 1 && month <= 12;
  };
  var escapeRegex = function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  var getFallbackDate = function getFallbackDate(jdp) {
    if (jdp._initDate) return jdp._initDate;
    if (jdp.options.initDate && typeof jdp.options.initDate === "object") return jdp.options.initDate;
    return jdp.today;
  };
  var getFallbackTime = function getFallbackTime(jdp) {
    if (jdp._initTime) return jdp._initTime;
    if (jdp.options.initTime && typeof jdp.options.initTime === "object") return jdp.options.initTime;
    return {
      hour: 0,
      minute: 0,
      second: 0
    };
  };
  var normalizeMinMaxDate = function normalizeMinMaxDate(jdp, dateObj, updateObj) {
    var _dateObj = _extend(dateObj || {}, updateObj || {});
    var fallbackDate = getFallbackDate(jdp);
    var maxDate = jdp.options.maxDate;
    var minDate = jdp.options.minDate;
    var year = isValidYear(_dateObj.year) ? _dateObj.year : fallbackDate.year;
    var month = isValidMonth(_dateObj.month) ? _dateObj.month : fallbackDate.month;
    var day = !isNaN(_dateObj.day) && _dateObj.day >= 1 ? _dateObj.day : fallbackDate.day;
    var daysInMonth = getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = daysInMonth;
    }
    var normalizedDate = {
      year: year,
      month: month,
      day: day
    };
    if (minDate && getDateNumber(normalizedDate) < getDateNumber(minDate)) return minDate;
    if (maxDate && getDateNumber(normalizedDate) > getDateNumber(maxDate)) return maxDate;
    return normalizedDate;
  };
  var normalizeMinMaxTime = function normalizeMinMaxTime(jdp, timeObj, updateObj) {
    var _timeObj = _extend(timeObj || {}, updateObj || {});
    var initTime = getFallbackTime(jdp);
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
    var min = ((_jdp$options$minDate = jdp.options.minDate) == null ? void 0 : _jdp$options$minDate.year) || rnd(initYear - 200);
    var max = ((_jdp$options$maxDate = jdp.options.maxDate) == null ? void 0 : _jdp$options$maxDate.year) || rnd(initYear + 200);
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
    if (initYear === (minDate == null ? void 0 : minDate.year)) {
      start = minDate.month;
      if (initYear === (maxDate == null ? void 0 : maxDate.year)) {
        finish = maxDate.month;
      }
    } else if (initYear === (maxDate == null ? void 0 : maxDate.year)) {
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
    var maxDateStr = date;
    var minDateStr = date;
    var maxDate = jdp.options.maxDate;
    var minDate = jdp.options.minDate;
    if (!isNotObjectOrIsEmptyObject(minDate)) {
      minDateStr = getDateValueStringFromValueObject(jdp, {
        year: minDate.year,
        month: minDate.month,
        day: minDate.day
      });
    }
    if (!isNotObjectOrIsEmptyObject(maxDate)) {
      maxDateStr = getDateValueStringFromValueObject(jdp, {
        year: maxDate.year,
        month: maxDate.month,
        day: maxDate.day
      });
    }
    return date <= maxDateStr && date >= minDateStr;
  };
  var isValidDateToday = function isValidDateToday(jdp) {
    return isValidDate(jdp, jdp.today.year, jdp.today.month, jdp.today.day);
  };
  var isValidValueString = function isValidValueString(jdp, str) {
    if (!str) {
      return false;
    }
    var sepOpt = jdp.options.separatorChars;
    var dateSeparator = escapeRegex(sepOpt.date);
    var timeSeparator = escapeRegex(sepOpt.time);
    var betweenSeparator = escapeRegex(sepOpt.between);
    var datePattern = jdp.options.date ? "\\d{4}" + dateSeparator + "\\d{2}" + dateSeparator + "\\d{2}" : "";
    var timePattern = jdp.options.time ? "\\d{2}" + timeSeparator + "\\d{2}" + (jdp.options.hasSecond ? timeSeparator + "\\d{2}" : "") : "";
    var regex = new RegExp("^" + datePattern + (datePattern && timePattern ? betweenSeparator : "") + timePattern + "$");
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
      hour: parseInt(time[0]) || 0,
      minute: parseInt(time[1]) || 0,
      second: parseInt(time[2]) || 0
    };
  };
  var getDateValueStringFromValueObjectWithSep = function getDateValueStringFromValueObjectWithSep(jdp, obj, forTarget) {
    var opt = jdp.options;
    var separatorChars = opt.separatorChars;
    var date = forTarget ? separatorChars.targetDate : separatorChars.date;
    var time = forTarget ? separatorChars.targetTime : separatorChars.time;
    var between = forTarget ? separatorChars.targetBetween : separatorChars.between;
    var dateStr = opt.date ? "" + obj.year + date + addLeadingZero(obj.month) + date + addLeadingZero(obj.day) : "";
    var timeStr = opt.time ? "" + addLeadingZero(obj.hour) + time + addLeadingZero(obj.minute) + (opt.hasSecond ? time + addLeadingZero(obj.second) : "") : "";
    var betweenStr = dateStr && timeStr ? between : "";
    return dateStr + betweenStr + timeStr;
  };
  var getDateValueStringFromValueObject = function getDateValueStringFromValueObject(jdp, obj) {
    return getDateValueStringFromValueObjectWithSep(jdp, obj);
  };
  var getValueStringFromValueObject = function getValueStringFromValueObject(jdp, obj) {
    return getDateValueStringFromValueObjectWithSep(jdp, obj);
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
    var value = (_jdp$input = jdp.input) == null ? void 0 : _jdp$input.value;
    if (!value) {
      return "";
    }
    if (jdp.options.targetValueType) {
      var normalValue = getValueObjectFromString(jdp, value);
      if (jdp.options.targetValueType === "gregorian") {
        var gregorianValue = toGregorian(normalValue.year, normalValue.month, normalValue.day);
        return getDateValueStringFromValueObjectWithSep(jdp, _extend(normalValue, gregorianValue), true);
      }
    }
    return value;
  };
  var NAMESPACE = "jdp";
  var DIV_NAMESPACE = "div." + NAMESPACE;
  var CONTAINER_ELEMENT_QUERY = NAMESPACE + "-container";
  var OVERLAY_ELEMENT_QUERY = NAMESPACE + "-overlay";
  var YEARS_ELEMENT_QUERY = DIV_NAMESPACE + "-years";
  var YEAR_ELEMENT_QUERY = DIV_NAMESPACE + "-year";
  var MONTHS_ELEMENT_QUERY = DIV_NAMESPACE + "-months";
  var MONTH_ELEMENT_QUERY = DIV_NAMESPACE + "-month";
  var DAYS_ELEMENT_QUERY = DIV_NAMESPACE + "-days";
  var DAYS_HEADER_ELEMENT_QUERY = DIV_NAMESPACE + "-days-header";
  var DAY_ELEMENT_QUERY = DIV_NAMESPACE + "-day";
  var DAY_NOT_IN_MONTH_ELEMENT_QUERY = DIV_NAMESPACE + "-day.not-in-month";
  var DAY_DISABLED_ELEMENT_QUERY = DIV_NAMESPACE + "-day.disabled-day";
  var DAY_DISABLED_NOT_IN_MONTH_ELEMENT_QUERY = DAY_NOT_IN_MONTH_ELEMENT_QUERY + ".disabled-day";
  var DAY_NAME_ELEMENT_QUERY = DIV_NAMESPACE + "-day-name";
  var PLUS_ICON_ELEMENT_QUERY = DIV_NAMESPACE + "-icon-plus";
  var MINUS_ICON_ELEMENT_QUERY = DIV_NAMESPACE + "-icon-minus";
  var FOOTER_ELEMENT_QUERY = DIV_NAMESPACE + "-footer";
  var TODAY_BUTTON_ELEMENT_QUERY = DIV_NAMESPACE + "-btn-today";
  var EMPTY_BUTTON_ELEMENT_QUERY = DIV_NAMESPACE + "-btn-empty";
  var CLOSE_BUTTON_ELEMENT_QUERY = DIV_NAMESPACE + "-btn-close";
  var FOOTER_TIME_ELEMENT_QUERY = DIV_NAMESPACE + "-time-container";
  var TIME_DROPDOWN_PARENT_ELEMENT_QUERY = DIV_NAMESPACE + "-time";
  var SELECTED_CLASS_NAME = "selected";
  var TODAY_CLASS_NAME = "today";
  var LAST_WEEK_CLASS_NAME = "last-week";
  var DISABLE_CLASS_NAME = "not-in-range";
  var HOLIDAY_CLASS_NAME = "holiday-day";
  var EVENT_CHANGE_INPUT_STR = NAMESPACE + ":change";
  var EVENT_CHANGE_MONTH_DROPDOWN_STR = "change";
  var EVENT_CHANGE_TIME_DROPDOWN_STR = EVENT_CHANGE_MONTH_DROPDOWN_STR;
  var EVENT_CHANGE_YEAR_INPUT_STR = "keyup change";
  var EVENT_CLICK_STR = "click";
  var EVENT_FOCUS_STR = "focusin";
  var EVENT_KEYDOWN_STR = "keydown";
  var MIN_MAX_TODAY_SETTING = "today";
  var OPTION_ATTR_SETTING = "attr";
  var DATA_JDP = "data-jdp-";
  var INIT_DATE_ATTR_NAME = DATA_JDP + "init-date";
  var MAX_DATE_ATTR_NAME = DATA_JDP + "max-date";
  var MIN_DATE_ATTR_NAME = DATA_JDP + "min-date";
  var MAX_TIME_ATTR_NAME = DATA_JDP + "max-time";
  var MIN_TIME_ATTR_NAME = DATA_JDP + "min-time";
  var TARGET_VALUE_INPUT_ATTR_NAME = DATA_JDP + "target-value-input";
  var TARGET_VALUE_TYPE_ATTR_NAME = DATA_JDP + "target-value-type";
  var ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME = DATA_JDP + "only-date";
  var ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME = DATA_JDP + "only-time";
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
    {
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
  var createElement = function createElement(tag, parent, eventNames, event, content, contentMode) {
    if (contentMode === void 0) {
      contentMode = "text";
    }
    var splits = tag.split(".");
    tag = splits.shift() || "div";
    var className = splits;
    var element = window.document.createElement(tag);
    if (isString(parent)) {
      var parentElement = window.document.querySelector(parent);
      if (!parentElement) {
        throw new Error("Parent element not found: " + parent);
      }
      parentElement.appendChild(element);
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
      if (contentMode === "html") {
        setInnerHTML(element, content);
      } else {
        element.textContent = content;
      }
    }
    return element;
  };
  var toPersianDigitsIfNeeded = function toPersianDigitsIfNeeded(data, convert) {
    if (convert) return data.toString().replace(/\d/g, function (d) {
      return "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)];
    });
    return data;
  };
  var getArrayNumbersStringTo = function getArrayNumbersStringTo(min, max, increment) {
    var items = [];
    if (!increment || increment <= 0) {
      increment = 1;
    }
    for (var i = min; i <= max; i += increment) items.push(addLeadingZero(i));
    return items;
  };
  var timeDropdownRender = function timeDropdownRender(jdp, timePickerContainer, type) {
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
        return getArrayNumbersStringTo(minTime.hour, maxTime.hour, jdp.options.hourIncrement);
      }
      if (type === "minute") {
        if (minTime.hour === maxTime.hour) {
          return getArrayNumbersStringTo(minTime.minute, maxTime.minute, jdp.options.minuteIncrement);
        }
        if (jdp.initTime.hour === minTime.hour) {
          return getArrayNumbersStringTo(minTime.minute, 59, jdp.options.minuteIncrement);
        }
        if (jdp.initTime.hour === maxTime.hour) {
          return getArrayNumbersStringTo(0, maxTime.minute, jdp.options.minuteIncrement);
        }
        return getArrayNumbersStringTo(0, 59, jdp.options.minuteIncrement);
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
    var container = createElement(TIME_DROPDOWN_PARENT_ELEMENT_QUERY, timePickerContainer);
    var dropdownContainer = createElement("select", container, EVENT_CHANGE_TIME_DROPDOWN_STR, function (e) {
      var _normalizeMinMaxTime;
      jdp.setValue(normalizeMinMaxTime(jdp, jdp.initTime, (_normalizeMinMaxTime = {}, _normalizeMinMaxTime[type] = e.target.value, _normalizeMinMaxTime)));
    });
    dropdownContainer.tabIndex = -1;
    var items = getItemForType();
    for (var i = 0; i < items.length; i++) {
      var currentItem = items[i];
      var optionElement = createElement("option", dropdownContainer);
      optionElement.value = currentItem.toString();
      optionElement.text = toPersianDigitsIfNeeded(currentItem, jdp.options.persianDigits).toString();
      optionElement.selected = parseInt(currentItem) === parseInt(jdp.getValue[type] || jdp.initTime[type]);
    }
  };
  var renderTimePicker = function renderTimePicker(jdp) {
    var elementQuery = FOOTER_TIME_ELEMENT_QUERY + (jdp.options.time && !jdp.options.date ? ".jdp-only-time" : "");
    var timePickerContainer = createElement(elementQuery, jdp.dpContainer);
    if (jdp.options.hasSecond) {
      timeDropdownRender(jdp, timePickerContainer, "second");
    }
    timeDropdownRender(jdp, timePickerContainer, "minute");
    timeDropdownRender(jdp, timePickerContainer, "hour");
  };
  var getLastWeekClassIfNecessary = function getLastWeekClassIfNecessary(dayOfWeek) {
    return dayOfWeek === 6 ? "." + LAST_WEEK_CLASS_NAME + "." + HOLIDAY_CLASS_NAME : "";
  };
  var createElementPlusMinus = function createElementPlusMinus(jdp, container, isYear, mode) {
    var _jdp$options$maxDate2, _jdp$options$maxDate3, _jdp$options$minDate2, _jdp$options$minDate3;
    var isPlus = mode === "PLUS";
    var className = "";
    var event = null;
    var elementQuery = isPlus ? PLUS_ICON_ELEMENT_QUERY : MINUS_ICON_ELEMENT_QUERY;
    var isMaxYear = isPlus && ((_jdp$options$maxDate2 = jdp.options.maxDate) == null ? void 0 : _jdp$options$maxDate2.year) === jdp.initDate.year;
    var isMaxMonth = isPlus && ((_jdp$options$maxDate3 = jdp.options.maxDate) == null ? void 0 : _jdp$options$maxDate3.month) === jdp.initDate.month;
    var isMinYear = !isPlus && ((_jdp$options$minDate2 = jdp.options.minDate) == null ? void 0 : _jdp$options$minDate2.year) === jdp.initDate.year;
    var isMinMonth = !isPlus && ((_jdp$options$minDate3 = jdp.options.minDate) == null ? void 0 : _jdp$options$minDate3.month) === jdp.initDate.month;
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
    createElement(elementQuery + "." + className, container, EVENT_CLICK_STR, event, html, "html");
  };
  var createElementPlus = function createElementPlus(jdp, container, isYear) {
    createElementPlusMinus(jdp, container, isYear, "PLUS");
  };
  var createElementMinus = function createElementMinus(jdp, container, isYear) {
    createElementPlusMinus(jdp, container, isYear, "MINUS");
  };
  var renderYear = function renderYear(jdp) {
    var _jdp$options$useDropd;
    var yearsContainer = createElement(YEARS_ELEMENT_QUERY, jdp.dpContainer);
    createElementPlus(jdp, yearsContainer, true);
    var yearContainer = createElement(YEAR_ELEMENT_QUERY, yearsContainer);
    createElementMinus(jdp, yearsContainer, true);
    var useDropdownYears = (_jdp$options$useDropd = jdp.options.useDropdownYears) != null ? _jdp$options$useDropd : jdp.options.useDropDownYears;
    var yearInputTagName = useDropdownYears ? "select" : "input";
    var yearInput = createElement(yearInputTagName, yearContainer, EVENT_CHANGE_YEAR_INPUT_STR, function (e) {
      if (e.target.value < 1e3 || e.target.value > 2e3) return;
      jdp.yearChange(e.target.value);
    });
    if (useDropdownYears) {
      yearInput.setAttribute("tabindex", "-1");
      var validYears = getValidYears(jdp);
      for (var i = validYears.min; i <= validYears.max; i++) {
        var optionElement = createElement("option", yearInput);
        optionElement.value = i.toString();
        optionElement.text = toPersianDigitsIfNeeded(i, jdp.options.persianDigits).toString();
        optionElement.selected = i === jdp.initDate.year;
      }
    } else {
      yearInput.tabIndex = -1;
      yearInput.value = jdp.initDate.year.toString();
      yearInput.type = "number";
    }
  };
  var renderMonths = function renderMonths(jdp) {
    var monthsContainer = createElement(MONTHS_ELEMENT_QUERY, jdp.dpContainer);
    createElementPlus(jdp, monthsContainer, false);
    var monthContainer = createElement(MONTH_ELEMENT_QUERY, monthsContainer);
    createElementMinus(jdp, monthsContainer, false);
    var monthDropdownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, function (e) {
      jdp.monthChange(parseFloat(e.target.value));
    });
    monthDropdownContainer.tabIndex = -1;
    var months = getValidMonths(jdp);
    var monthsName = jdp.options.months;
    for (var i = 0; i < months.length; i++) {
      var optionElement = createElement("option", monthDropdownContainer);
      optionElement.value = months[i].toString();
      optionElement.text = toPersianDigitsIfNeeded(monthsName[months[i] - 1], jdp.options.persianDigits).toString();
      optionElement.selected = months[i] === jdp.initDate.month;
    }
  };
  var renderDays = function renderDays(jdp) {
    var daysHeaderContainer = createElement(DAYS_HEADER_ELEMENT_QUERY, jdp.dpContainer);
    var daysContainer = createElement(DAYS_ELEMENT_QUERY, jdp.dpContainer);
    for (var i = 0; i < 7; i++) {
      createElement(DAY_NAME_ELEMENT_QUERY + getLastWeekClassIfNecessary(i), daysHeaderContainer, void 0, void 0, toPersianDigitsIfNeeded(jdp.options.days[i], jdp.options.persianDigits).toString());
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
      opt.isHoliday = false;
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
      dayOptions.className = getLastWeekClassIfNecessary(getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day));
      if (jdp.inputValue.day === dayOptions.day && jdp.inputValue.year === dayOptions.year && jdp.inputValue.month === dayOptions.month) {
        dayOptions.className += "." + SELECTED_CLASS_NAME;
      }
      if (jdp.today.day === dayOptions.day && jdp.today.year === dayOptions.year && jdp.today.month === dayOptions.month) {
        dayOptions.className += "." + TODAY_CLASS_NAME;
      }
      if (isFunction(jdp.options.dayRendering)) {
        _extend(dayOptions, jdp.options.dayRendering(dayOptions, jdp.input));
      }
      if (dayOptions.isHoliday || dayOptions.isHollyDay) {
        dayOptions.className += "." + HOLIDAY_CLASS_NAME;
      }
      var query = dayOptions.isValid ? DAY_ELEMENT_QUERY : DAY_DISABLED_ELEMENT_QUERY;
      if (dayOptions.inBeforeMonth || dayOptions.inAfterMonth) {
        query = DAY_NOT_IN_MONTH_ELEMENT_QUERY;
        if (!dayOptions.isValid) {
          query = DAY_DISABLED_NOT_IN_MONTH_ELEMENT_QUERY;
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
    var footerContainer = createElement(FOOTER_ELEMENT_QUERY, jdp.dpContainer, void 0, void 0, void 0);
    if (jdp.options.showTodayBtn && jdp.options.date) {
      var isActiveToday = isValidDateToday(jdp);
      createElement(TODAY_BUTTON_ELEMENT_QUERY + (isActiveToday ? "" : ".disabled-btn"), footerContainer, EVENT_CLICK_STR, function () {
        if (isActiveToday) jdp.setValue(jdp.today);
      }, "امروز");
    }
    if (!jdp.options.date && jdp.options.time && (!((_jdp$input2 = jdp.input) != null && _jdp$input2.value) || !!jdp.options.showSelectTimeBtnAlways)) {
      createElement(TODAY_BUTTON_ELEMENT_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.setValue(jdp.initTime);
        jdp.hide();
      }, "انتخاب");
    }
    if (jdp.options.showEmptyBtn) {
      createElement(EMPTY_BUTTON_ELEMENT_QUERY, footerContainer, EVENT_CLICK_STR, function () {
        jdp.cleanValue();
        if (jdp.options.hideAfterChange) jdp.hide();
      }, "خالی");
    }
    if (jdp.options.showCloseBtn) {
      createElement(CLOSE_BUTTON_ELEMENT_QUERY, footerContainer, EVENT_CLICK_STR, function () {
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
  var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test((_window$navigator = window.navigator) == null || (_window$navigator = _window$navigator.userAgent) == null ? void 0 : _window$navigator.toLowerCase());
  var normalizeOptions = function normalizeOptions(externalOptions, internalOptions, jdp) {
    var setDefaultValue = function setDefaultValue(propertyName, defaultValue) {
      var _ref;
      var extValue = externalOptions[propertyName];
      var intValue = internalOptions[propertyName];
      var descriptor = Object.getOwnPropertyDescriptor(internalOptions, propertyName);
      if (descriptor != null && descriptor.get && !descriptor.set) {
        delete internalOptions[propertyName];
      }
      internalOptions[propertyName] = (_ref = extValue != null ? extValue : intValue) != null ? _ref : defaultValue;
    };
    function setDefinePropertyFromAttr(propertyName) {
      var getDefaultFromAttr = function getDefaultFromAttr(attrName, isTime) {
        var _jdp$input3;
        var attrVal = (_jdp$input3 = jdp.input) == null ? void 0 : _jdp$input3.getAttribute(attrName);
        if (!isTime && attrVal === MIN_MAX_TODAY_SETTING) return clone(jdp.today);
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
            return (_jdp$input4 = jdp.input) == null ? void 0 : _jdp$input4.getAttribute(TARGET_VALUE_INPUT_ATTR_NAME);
          };
        } else if (propertyName === "targetValueType") {
          getterFunc = function getterFunc() {
            var _jdp$input5;
            return (_jdp$input5 = jdp.input) == null ? void 0 : _jdp$input5.getAttribute(TARGET_VALUE_TYPE_ATTR_NAME);
          };
        } else if (propertyName === "date") {
          var _externalOptions$date;
          var _date = (_externalOptions$date = externalOptions.date) != null ? _externalOptions$date : internalOptions.date;
          delete internalOptions[propertyName];
          getterFunc = function getterFunc() {
            var _jdp$input6, _jdp$input7;
            return !((_jdp$input6 = jdp.input) != null && _jdp$input6.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME)) && (_date || ((_jdp$input7 = jdp.input) == null ? void 0 : _jdp$input7.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME)));
          };
        } else if (propertyName === "time") {
          var _externalOptions$time;
          var _time = (_externalOptions$time = externalOptions.time) != null ? _externalOptions$time : internalOptions.time;
          delete internalOptions[propertyName];
          getterFunc = function getterFunc() {
            var _jdp$input8, _jdp$input9;
            return !((_jdp$input8 = jdp.input) != null && _jdp$input8.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME)) && (_time || ((_jdp$input9 = jdp.input) == null ? void 0 : _jdp$input9.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME)));
          };
        }
        window.Object.defineProperty(internalOptions, propertyName, {
          get: getterFunc,
          enumerable: true,
          configurable: true
        });
      } else {
        var _temp = internalOptions[propertyName];
        delete internalOptions[propertyName];
        setDefaultValue(propertyName, _temp);
      }
      return internalOptions;
    }
    setDefaultValue("container", "body");
    setDefaultValue("selector", "input[data-jdp]");
    setDefaultValue("zIndex", 1e3);
    setDefaultValue("autoShow", true);
    setDefaultValue("autoHide", true);
    setDefaultValue("autoReadOnlyInput", isMobile);
    setDefaultValue("topSpace", 0);
    setDefaultValue("bottomSpace", 0);
    setDefaultValue("overflowSpace", -10);
    setDefaultValue("hideAfterChange", true);
    setDefaultValue("hideAfterChangeWithTime", false);
    setDefaultValue("changeMonthRotateYear", false);
    setDefaultValue("showTodayBtn", true);
    setDefaultValue("showEmptyBtn", true);
    setDefaultValue("showCloseBtn", isMobile);
    setDefaultValue("showSelectTimeBtnAlways", false);
    setDefaultValue("hasSecond", true);
    setDefaultValue("date", true);
    setDefaultValue("time", false);
    setDefaultValue("days", ["ش", "ی", "د", "س", "چ", "پ", "ج"]);
    setDefaultValue("months", ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]);
    setDefaultValue("separatorChars", {
      date: "/",
      between: " ",
      time: ":",
      targetDate: "-",
      targetBetween: " ",
      targetTime: ":"
    });
    setDefaultValue("persianDigits", false);
    setDefaultValue("plusHtml",
    // eslint-disable-next-line @typescript-eslint/quotes, quotes
    '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path></g></svg>');
    setDefaultValue("minusHtml", '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-596v-84h596v84z"></path></g></svg>');
    if (externalOptions.useDropDownYears !== void 0 && externalOptions.useDropdownYears === void 0) {
      internalOptions.useDropdownYears = externalOptions.useDropDownYears;
    }
    setDefaultValue("useDropdownYears", true);
    internalOptions.useDropDownYears = internalOptions.useDropdownYears;
    setDefaultValue("today", jalaliToday());
    setDefaultValue("position", "left");
    setDefaultValue("minuteIncrement", 1);
    setDefaultValue("hourIncrement", 1);
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
  var JalaliDatePickerInternalOptions = /*#__PURE__*/function () {
    function JalaliDatePickerInternalOptions(externalOptions, jdp) {
      this.container = void 0;
      this.selector = void 0;
      this.zIndex = void 0;
      this.autoShow = void 0;
      this.autoHide = void 0;
      this.autoReadOnlyInput = void 0;
      this.topSpace = void 0;
      this.bottomSpace = void 0;
      this.overflowSpace = void 0;
      this.hideAfterChange = void 0;
      this.hideAfterChangeWithTime = void 0;
      this.changeMonthRotateYear = void 0;
      this.showTodayBtn = void 0;
      this.showEmptyBtn = void 0;
      this.showCloseBtn = void 0;
      this.showSelectTimeBtnAlways = void 0;
      this.dayRendering = void 0;
      this.minDate = void 0;
      this.maxDate = void 0;
      this.initDate = void 0;
      this.minTime = void 0;
      this.maxTime = void 0;
      this.initTime = void 0;
      this.date = void 0;
      this.time = void 0;
      this.today = void 0;
      this.hasSecond = void 0;
      this.targetValueInput = void 0;
      this.targetValueType = void 0;
      this.days = void 0;
      this.months = void 0;
      this.separatorChars = void 0;
      this.persianDigits = void 0;
      this.plusHtml = void 0;
      this.minusHtml = void 0;
      this.useDropdownYears = void 0;
      this.useDropDownYears = void 0;
      this.position = void 0;
      this.minuteIncrement = void 0;
      this.hourIncrement = void 0;
      normalizeOptions(externalOptions || {}, isNotObjectOrIsEmptyObject(jdp.options) ? this : jdp.options, jdp);
    }
    var _proto = JalaliDatePickerInternalOptions.prototype;
    _proto.update = function update(externalOptions, jdp) {
      normalizeOptions(externalOptions || {}, this, jdp);
    };
    return JalaliDatePickerInternalOptions;
  }();
  var jalaliDatepicker = {
    init: function init(options) {
      this.updateOptions(options);
      addEventListenerOnResize();
      addEventListenerOnBody();
      addEventListenerOnInputs(this.options.selector);
    },
    updateOptions: function updateOptions(options) {
      if (isNotObjectOrIsEmptyObject(this.options)) {
        this.options = new JalaliDatePickerInternalOptions(options, this);
      } else {
        this.options.update(options, this);
      }
      applyZIndex();
    },
    options: {},
    input: null,
    isTransitioning: false,
    get dpContainer() {
      if (!this._dpContainer || !this._dpContainer.isConnected) {
        this._dpContainer = createElement(CONTAINER_ELEMENT_QUERY, this.options.container || document.body);
        this._dpContainer.setAttribute("tabindex", "-1");
      }
      if (!this.overlayElement || !this.overlayElement.isConnected) {
        this.overlayElement = createElement(OVERLAY_ELEMENT_QUERY, this.options.container || document.body);
      }
      applyZIndex();
      return this._dpContainer;
    },
    get today() {
      this._today = this._today || this.options.today || jalaliToday();
      return this._today;
    },
    get inputValue() {
      var _this$input;
      var inputValue = ((_this$input = this.input) == null ? void 0 : _this$input.value) || "";
      if (isValidValueString(this, inputValue)) {
        return getValueObjectFromString(this, inputValue);
      }
      if (isValidDateString(this, inputValue)) {
        return getValueObjectFromString(this, inputValue);
      }
      return {};
    },
    get initDate() {
      var _this$input2;
      if (this.options.initDate) {
        return this.options.initDate;
      }
      if (this._initDate) {
        return this._initDate;
      }
      var initDate = ((_this$input2 = this.input) == null ? void 0 : _this$input2.value) || "";
      if (!initDate) {
        initDate = this.options.initDate || clone(this.today);
      } else if (isString(initDate) && isValidDateString(this, initDate)) {
        initDate = getValueObjectFromString(this, initDate);
      } else {
        initDate = clone(this.today);
      }
      this._initDate = normalizeMinMaxDate(this, initDate);
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
      var initTime = ((_this$input3 = this.input) == null ? void 0 : _this$input3.value) || this.options.initTime || defaultInit;
      if (isString(initTime)) {
        if (isValidTimeString(this, initTime)) {
          initTime = getValueObjectFromString(this, initTime);
        } else {
          initTime = defaultInit;
        }
      }
      this._initTime = normalizeMinMaxTime(this, initTime);
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
      if (this.overlayElement) this.overlayElement.style.display = STYLE_DISPLAY_BLOCK;
      setTimeout(function () {
        _this.dpContainer.style.visibility = STYLE_VISIBILITY_VISIBLE;
        _this.dpContainer.style.display = STYLE_DISPLAY_BLOCK;
        if (_this.overlayElement) _this.overlayElement.style.display = STYLE_DISPLAY_BLOCK;
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
      if (this.overlayElement) this.overlayElement.style.display = STYLE_DISPLAY_HIDDEN;
      this.isShow = false;
      removeScrollOnParent();
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
      var position = this.options.position;
      if (position === "right") {
        left = left + inputBounds.width - dpContainerWidth;
        if (left + dpContainerWidth >= windowWidth) {
          left -= left + dpContainerWidth - (windowWidth + (this.options.overflowSpace || 0));
        }
      } else if (position === "center") {
        left = left + inputBounds.width / 2 - dpContainerWidth / 2;
        if (left + dpContainerWidth >= windowWidth) {
          left -= left + dpContainerWidth - (windowWidth + (this.options.overflowSpace || 0));
        }
      }
      if (left + dpContainerWidth >= windowWidth) {
        left -= left + dpContainerWidth - (windowWidth + (this.options.overflowSpace || 0));
      }
      if (left < 0) {
        left = 0;
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
      if (this.options.hideAfterChange && (!this.options.time || this.options.hideAfterChangeWithTime)) {
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
      var targetInputList = this.options.targetValueInput instanceof HTMLElement ? [this.options.targetValueInput] : document.querySelectorAll(this.options.targetValueInput);
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
    overlayElement: void 0,
    _scrollParent: void 0,
    _scrollHandler: void 0,
    _today: void 0,
    _initDate: null,
    _initTime: null,
    _value: null,
    isShow: false
  };
  function applyZIndex() {
    var _jalaliDatepicker$_dp, _jalaliDatepicker$ove;
    var zIndex = jalaliDatepicker.options.zIndex;
    if (typeof zIndex !== "number") return;
    if ((_jalaliDatepicker$_dp = jalaliDatepicker._dpContainer) != null && _jalaliDatepicker$_dp.isConnected) {
      jalaliDatepicker._dpContainer.style.zIndex = String(zIndex);
    }
    if ((_jalaliDatepicker$ove = jalaliDatepicker.overlayElement) != null && _jalaliDatepicker$ove.isConnected) {
      jalaliDatepicker.overlayElement.style.zIndex = String(zIndex - 1);
    }
  }
  function onScrollHandler() {
    jalaliDatepicker.setPosition();
  }
  function setScrollOnParent(input) {
    removeScrollOnParent();
    jalaliDatepicker._scrollParent = _getScrollParent(input);
    jalaliDatepicker._scrollHandler = onScrollHandler;
    jalaliDatepicker._scrollParent.addEventListener("scroll", jalaliDatepicker._scrollHandler, {
      passive: true
    });
  }
  function removeScrollOnParent() {
    if (!jalaliDatepicker._scrollParent || !jalaliDatepicker._scrollHandler) return;
    jalaliDatepicker._scrollParent.removeEventListener("scroll", jalaliDatepicker._scrollHandler);
    jalaliDatepicker._scrollParent = void 0;
    jalaliDatepicker._scrollHandler = void 0;
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
  var onInputFocusCallback = function onInputFocusCallback(e) {
    if (!jalaliDatepicker.options.autoShow) {
      return;
    }
    if (e.target && e.target.matches(jalaliDatepicker.options.selector)) {
      jalaliDatepicker.show(e.target);
    }
  };
  function addEventListenerOnInputs(querySelector) {
    document.body.removeEventListener(EVENT_FOCUS_STR, onInputFocusCallback);
    if (!querySelector) return;
    document.body.addEventListener(EVENT_FOCUS_STR, onInputFocusCallback);
  }
  var onBodyClickCallback = function onBodyClickCallback(e) {
    var clickInsideDatePicker = containsDom(jalaliDatepicker.dpContainer, e);
    var clickOnInput = getEventTarget(e) === jalaliDatepicker.input;
    if (!jalaliDatepicker.options.autoHide || !jalaliDatepicker.isShow || clickInsideDatePicker || clickOnInput) {
      return;
    }
    jalaliDatepicker.hide();
  };
  function addEventListenerOnBody() {
    document.body.removeEventListener("click", onBodyClickCallback);
    document.body.addEventListener("click", onBodyClickCallback);
  }
  function handleEscKey(event) {
    if (event.key === "Escape") {
      if (!jalaliDatepicker.isTransitioning) {
        var _jalaliDatepicker$inp;
        (_jalaliDatepicker$inp = jalaliDatepicker.input) == null || _jalaliDatepicker$inp.blur == null || _jalaliDatepicker$inp.blur();
        jalaliDatepicker.hide();
      }
    }
  }
  window.jalaliDatepicker = {
    startWatch: function startWatch(options) {
      if (options === void 0) {
        options = {};
      }
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
