import { EVENT_CHANGE_INPUT_STR } from "./constants";


export const isNaN = Number.isNaN || window.isNaN;

export const isNumber = (value) => {
    return typeof value === "number" && !isNaN(value);
};
export const isUndefined = (value) => {
    return typeof value === "undefined";
};
export const isFunction = (value) => {
    return typeof value === "function";
};
export const isString = (value) => {
    return typeof value === "string";
};

export const clon = (a) => {
    return JSON.parse(JSON.stringify(a));
};

export const isLeapYear = (year) => {
    return (((((year - 474) % 2820) + 512) * 682) % 2816) < 682;
};

export const getDaysInMonth = (year, month) => {
    return [
        0,
        31, 31, 31,
        31, 31, 31,
        30, 30, 30,
        30, 30, (isLeapYear(year) ? 30 : 29)
    ][month];
};

export const mod = (a, b) => {
    return window.Math.abs(a - (b * window.Math.floor(a / b)));
};

export const getDays = (month, day) => {
    if (month < 8) return (month - 1) * 31 + day;
    return 6 * 31 + (month - 7) * 30 + day;
};

export const getDiffDays = (year1, month1, day1, year2, month2, day2) => {
    let diffDays = getDays(month2, day2) - getDays(month1, day1);
    const y1 = (year1 < year2) ? year1 : year2;
    const y2 = (year1 < year2) ? year2 : year1;
    for (let y = y1; y < y2; y++) {
        if (isLeapYear(y)) diffDays += (year1 < year2) ? 366 : -366;
        else diffDays += (year1 < year2) ? 365 : -365;
    }
    return diffDays;
};

export const getWeekDay = (year, month, day) => {
    return mod(getDiffDays(1392, 3, 25, year, month, day), 7);
};

export const getYears = (month, day) => {
    return 6 * 31 + (month - 7) * 30 + day;
};

export const addLeadingZero = (value, length = 2) => {
    const str = String(Math.abs(value));
    let i = str.length;
    let result = "";

    if (value < 0) {
        result += "-";
    }

    while (i < length) {
        i += 1;
        result += "0";
    }

    return result + str;
};
export const isPlainObject = (obj) => {
    if (!obj || !obj.constructor || obj.nodeType) {
        return false;
    }

    try {
        return JSON.stringify(obj) === "{}";
    } catch (e) {
        return true;
    }
};
export const extend = (...params) => {
    let options;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = params[0] || {};
    let i = 1;
    const { length } = params;
    let deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = params[i] || {};
        i += 1;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && isFunction(target)) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i -= 1;
    }

    for (; i < length; i++) {
        options = params[i];
        // Only deal with non-null/undefined values
        if (!isUndefined(options) && options !== null) {
            // Extend the base object
            for (let j = 0; j < window.Object.keys(options).length; j++) {
                const name = window.Object.keys(options)[j];
                if (Object.prototype.hasOwnProperty.call(options, name)) {
                    copy = options[name];
                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if (name === "__proto__" || target === copy) {
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
};

export const createElement = (tag, parent, eventNames, event, content) => {
    const splits = tag.split(".");
    tag = splits.shift() || "div";
    const className = splits;
    const element = window.document.createElement(tag);

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

export const addListenerMulti = (element, eventNames, listener) => {
    const events = eventNames.split(" ");
    for (let i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
    }
};

export const setInnerHTML = (element, html) => {
    element.innerHTML = html;
};

export const normalizeMinMaxDate = (year, month, day, initDate, minDate, maxDate) => {
    if (isNaN(year) || year < 1000 || year > 1999) {
        year = initDate.year;
    } else {
        if (year < minDate.year) {
            year = minDate.year;
        } else if (year > maxDate.year) {
            year = maxDate.year;
        }
    }

    if (isNaN(month) || month < 1 || month > 12) {
        month = initDate.month;
    } else {
        if (year <= minDate.year && month < minDate.month) {
            month = minDate.month;
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

export const getValidMonths = (initDate, minDate, maxDate) => {
    const months = [];
    let start = 1;
    let finish = 12;

    if (initDate.year === minDate.year) {
        start = minDate.month;
        if (initDate.year === maxDate.year) {
            finish = maxDate.month;
        }
    }
    else if (initDate.year === maxDate.year) {
        start = 1;
        finish = maxDate.month;
    }

    for (let i = start; i <= finish; i++) {
        months.push(i);
    }

    return months;
};

export const isValidDay = (initDate, day, minDate, maxDate) => {
    if (isPlainObject(minDate) && isPlainObject(maxDate)) {
        return true;
    }
    if (minDate.year === maxDate.year && minDate.month === maxDate.month) {
        return day >= minDate.day && day <= maxDate.day;
    }
    if (initDate.year === minDate.year && initDate.month === minDate.month) {
        return day >= minDate.day;
    }
    if (initDate.year === maxDate.year && initDate.month === maxDate.month) {
        return day <= maxDate.day;
    }

    return true;
};

export const setClassName = (element, className) => {
    element.className = className;
};

export const isValidDateString = (str, sepChar) => {
    if (!str) {
        return false;
    }
    const date = str.split(sepChar);
    return date.length === 3 && date[0].length === 4 && date[1].length === 2 && date[2].length === 2;
};

export const getDateFromString = (str, sepChar) => {
    const date = str.split(sepChar);
    return {
        year: parseInt(date[0]),
        month: parseInt(date[1]),
        day: parseInt(date[2])
    };
};
export const getDateToString = (y, m, d, sepChar) => {
    return y + sepChar + addLeadingZero(m) + sepChar + addLeadingZero(d);
};

export const jalaliToday = () => {
    const date = new Date();
    let gy = parseInt(date.getFullYear());
    const gm = parseInt(date.getMonth()) + 1;
    const gd = parseInt(date.getDate());

    let jy, days;
    const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (gy > 1600) {
        jy = 979;
        gy -= 1600;
    } else {
        jy = 0;
        gy -= 621;
    }
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    days = (365 * gy) +
        parseInt((gy2 + 3) / 4) -
        parseInt((gy2 + 99) / 100) +
        parseInt((gy2 + 399) / 400) -
        80 +
        gd +
        gdm[gm - 1];
    jy += 33 * parseInt(days / 12053);
    days %= 12053;
    jy += 4 * parseInt(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += parseInt((days - 1) / 365);
        days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

    return {
        year: jy,
        month: jm,
        day: jd
    };
};

export const getScrollParent = (node) => {
    if (["html", "body", "#document"].indexOf((node.nodeName || "").toLowerCase()) >= 0) {
        return window;
    }

    if (node instanceof HTMLElement) {
        const { overflow, overflowX, overflowY } = window.getComputedStyle(node);
        if (/auto|scroll|overlay/.test(overflow + overflowY + overflowX)) {
            return node;
        }
    }

    return getScrollParent(node.parentNode);
};

export const getEventTarget=(event)=> {
    try {
        if (isFunction(event.composedPath)) {
            return event.composedPath()[0];
        }
        return event.target;
    }
    catch (error) {
        return event.target;
    }
};

export const containsDom = (parent,event) => {
    const path = event.path || (event.composedPath && event.composedPath()) || false;
    if (!path) {
        return parent.outerHTML.indexOf(event.target.outerHTML) > -1;
    }
    return path.indexOf(parent) !== -1;
};

export const createEvent = (name) => {
    const e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
};

export const triggerEvent = (elm, event) => {
    if (!elm) return;
    elm.dispatchEvent(createEvent(event));
    if (event === EVENT_CHANGE_INPUT_STR) {
        elm.dispatchEvent(createEvent("change"));
        elm.dispatchEvent(createEvent("input"));
    }
};