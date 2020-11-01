import { WINDOW } from './constants';

export const isNaN = Number.isNaN || WINDOW.isNaN;
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
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
  return WINDOW.Math.abs(a - (b * WINDOW.Math.floor(a / b)));
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

const formatParts = /(y|m|d)+/g;
export function parseFormat(format) {
  const source = String(format).toLowerCase();
  const parts = source.match(formatParts);

  if (!parts || parts.length === 0) {
    throw new Error('Invalid date format.');
  }

  format = {
    source,
    parts,
  };

  for (let i = 0; i < parts.length; i++) {
    switch (parts[i]) {
      case 'dd':
      case 'd':
        format.hasDay = true;
        break;

      case 'mm':
      case 'm':
        format.hasMonth = true;
        break;

      case 'yyyy':
      case 'yy':
        format.hasYear = true;
        break;

      default:
    }
  }

  return format;
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

  const proto = WINDOW.Object.getPrototypeOf(obj);

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
  if (typeof target !== 'object' && typeof target !== 'function') {
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
      for (let j = 0; j < WINDOW.Object.keys(options).length; j++) {
        const name = WINDOW.Object.keys(options)[j];
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
          } else if (copy !== undefined) {
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
  const element = WINDOW.document.createElement(tag);
  parent.appendChild(element);
  return element;
}
