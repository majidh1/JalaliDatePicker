import {
    EVENT_CHANGE_INPUT_STR
} from "../constants";
import {
    isUndefined,
    isFunction,
    isString
} from "./object";

export const getScrollParent = (node) => {
    if (["html", "body", "#document"].indexOf((node.nodeName || "").toLowerCase()) >= 0) {
        return window;
    }

    if (node instanceof HTMLElement) {
        const {
            overflow,
            overflowX,
            overflowY
        } = window.getComputedStyle(node);
        if (/auto|scroll|overlay/.test(overflow + overflowY + overflowX)) {
            return node;
        }
    }

    return getScrollParent(node.parentNode);
};

export const getEventTarget = (event) => {
    try {
        if (isFunction(event.composedPath)) {
            return event.composedPath()[0];
        }
        return event.target;
    } catch (error) {
        return event.target;
    }
};

export const containsDom = (parent, event) => {
    const path = event.path || (event.composedPath && event.composedPath()) || false;
    if (!path) {
        return parent.outerHTML.indexOf(event.target.outerHTML) > -1;
    }
    return path.indexOf(parent) !== -1;
};
const createEvent = (name) => {
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
const addListenerMulti = (element, eventNames, listener) => {
    const events = eventNames.split(" ");
    for (let i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
    }
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

export const setInnerHTML = (element, html) => {
    element.innerHTML = html;
};

export const toPersianDigitsIfNeeded = (data, convert) => {
    if (convert)
        return data.toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
    return data;
};