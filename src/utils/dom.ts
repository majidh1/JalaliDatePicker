import { EVENT_CHANGE_INPUT_STR } from "../constants";
import { isUndefined, isFunction, isString } from "./object";

export const getScrollParent = (node: Node): Window | HTMLElement => {
	if (["html", "body", "#document"].indexOf((node.nodeName || "").toLowerCase()) >= 0) {
		return window;
	}

	if (node instanceof HTMLElement) {
		const { overflow, overflowX, overflowY } = window.getComputedStyle(node);
		if (/auto|scroll|overlay/.test(overflow + overflowY + overflowX)) {
			return node;
		}
	}

	return getScrollParent(node.parentNode as Node);
};

export const getEventTarget = (event: Event): EventTarget | null => {
	try {
		if (isFunction(event.composedPath)) {
			return event.composedPath()[0];
		}
		return event.target;
	} catch (error) {
		return event.target;
	}
};

export const containsDom = (parent: HTMLElement, event: Event): boolean => {
	const path = (event as any).path || (event.composedPath && event.composedPath()) || false;
	if (!path) {
		return parent.outerHTML.indexOf((event.target as HTMLElement).outerHTML) > -1;
	}
	return path.indexOf(parent) !== -1;
};
const createEvent = (name: string): Event => {
	const e = document.createEvent("Event");
	e.initEvent(name, true, true);
	return e;
};
export const triggerEvent = (elm: HTMLElement, event: string): void => {
	if (!elm) return;
	elm.dispatchEvent(createEvent(event));
	if (event === EVENT_CHANGE_INPUT_STR) {
		elm.dispatchEvent(createEvent("change"));
		elm.dispatchEvent(createEvent("input"));
	}
};
const addListenerMulti = (element: HTMLElement, eventNames: string, listener: EventListener): void => {
	const events = eventNames.split(" ");
	for (let i = 0, iLen = events.length; i < iLen; i++) {
		element.addEventListener(events[i], listener, false);
	}
};

export const setInnerHTML = (element: HTMLElement, html: string): void => {
	element.innerHTML = html;
};

export const createElement = (
	tag: string,
	parent: string | HTMLElement,
	eventNames?: string,
	event?: EventListener,
	content?: string,
	contentMode: "text" | "html" = "text"
): HTMLElement => {
	const splits = tag.split(".");
	tag = splits.shift() || "div";
	const className = splits;
	const element = window.document.createElement(tag);

	if (isString(parent)) {
		const parentElement = window.document.querySelector(parent);
		if (!parentElement) {
			throw new Error(`Parent element not found: ${parent}`);
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
			setInnerHTML(element, content as string);
		} else {
			element.textContent = content as string;
		}
	}
	return element;
};

export const toPersianDigitsIfNeeded = (data: string | number, convert: boolean): string | number => {
	if (convert) return data.toString().replace(/\d/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
	return data;
};
