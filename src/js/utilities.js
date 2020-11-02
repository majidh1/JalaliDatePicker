export const isNaN = Number.isNaN || window.isNaN;
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}
export function isObject(value) {
  return typeof value === 'object';
}
export function isUndefined(value) {
  return typeof value === 'undefined';
}
export function isString(value) {
  return typeof value === 'string';
}
export function isLeapYear(year) {
  return (((((year - 474) % 2820) + 512) * 682) % 2816) < 682;
}

export function getDaysInMonth(year, month) {
  return [
    31, 31, 31,
    31, 31, 31,
    30, 30, 30,
    30, 30, (isLeapYear(year) ? 30 : 29)][month];
}

export function mod(a, b) {
  return window.Math.abs(a - (b * window.Math.floor(a / b)));
}

export function getDays(month, day) {
  if (month < 8) return (month - 1) * 31 + day;
  return 6 * 31 + (month - 7) * 30 + day;
}

export function getDiffDays(year1, month1, day1, year2, month2, day2) {
  let diffDays = getDays(year1, month1, day1) - getDays(year2, month2, day2);
  const y1 = (year1 < year2) ? year1 : year2;
  const y2 = (year1 < year2) ? year2 : year1;
  for (let y = y1; y < y2; y++) {
    if (isLeapYear(y)) diffDays += (year1 < year2) ? 366 : -366;
    else diffDays += (year1 < year2) ? 365 : -365;
  }
  return diffDays;
}

export function getWeekDay(year, month, day) {
  return mod(getDiffDays(1392, 3, 25, year, month, day), 7);
}

export function getYears(month, day) {
  return 6 * 31 + (month - 7) * 30 + day;
}

export function addLeadingZero(value, length = 1) {
  const str = String(Math.abs(value));
  let i = str.length;
  let result = '';

  if (value < 0) {
    result += '-';
  }

  while (i < length) {
    i += 1;
    result += '0';
  }

  return result + str;
}

function isPlainObject(obj) {
  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  const proto = window.Object.getPrototypeOf(obj);

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true;
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  const ctor = {}.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof ctor === 'function';
}

export function extend() {
  let options; let src; let copy; let copyIsArray; let clone;
  let target = arguments[0] || {};
  let i = 1;
  const { length } = arguments;
  let deep = false;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i += 1;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (!isObject(target) && typeof target !== 'function') {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i -= 1;
  }

  for (; i < length; i++) {
    options = arguments[i];
    // Only deal with non-null/undefined values
    if (options !== null) {
      // Extend the base object
      for (let j = 0; j < window.Object.keys(options).length; j++) {
        const name = window.Object.keys(options)[j];
        if (Object.prototype.hasOwnProperty.call(options, name)) {
          copy = options[name];
          // Prevent Object.prototype pollution
          // Prevent never-ending loop
          if (name === '__proto__' || target === copy) {
            return true;
          }
          copyIsArray = Array.isArray(copy);
          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
            src = target[name];

            // Ensure proper type for the source value
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }

            // Never move original objects, clone them
            target[name] = extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (!isUndefined(copy)) {
            target[name] = copy;
          }
        }
      }
    }
  }

  // Return the modified object
  return target;
}

export function createElement(tag, parent) {
  const element = window.document.createElement(tag);
  if (isString(parent)) {
    window.document.querySelector(parent).appendChild(element);
  } else {
    parent.appendChild(element);
  }
  return element;
}

export function findElement(element, querySelector) {
  if (querySelector.indexOf('=') > -1 && querySelector.indexOf('[') == -1) {
    querySelector = `[${querySelector}]`;
  }
  return element.querySelector(querySelector);
}

export function jalaliToday(sepChar) {
  const date = new Date();
  let gy = date.getFullYear();
  const gm = date.getMonth();
  const gd = date.getDay();

  let jy; let
    days;
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  days = (365 * gy) + window.parent((gy2 + 3) / 4, true) - window.parent((gy2 + 99) / 100, true) + window.parent((gy2 + 399) / 400, true) - 80 + gd + gdm[gm - 1];
  jy += 33 * window.parent(days / 12053, true);
  days %= 12053;
  jy += 4 * window.parent(days / 1461, true);
  days %= 1461;
  if (days > 365) {
    jy += window.parent((days - 1) / 365, true);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? 1 + window.parent(days / 31, true) : 7 + window.parent((days - 186) / 30, true);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  const result = [jy, jm, jd];
  return sepChar ? result.join(sepChar) : result;
}

export function createItems(parent, min, max, itemTagname, current, stringList) {
  for (let item = min; item <= max; item++) {
    const itemEl = createElement(itemTagname, parent);
    itemEl.innerHTML = stringList ? stringList[item - 1] : item;
    if (item === current) {
      itemEl.className = 'current';
    }
  }
}
