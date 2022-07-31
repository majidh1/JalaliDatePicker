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
    const {
        length
    } = params;
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

export const mod = (a, b) => {
    return window.Math.abs(a - (b * window.Math.floor(a / b)));
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