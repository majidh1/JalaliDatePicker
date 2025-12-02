/* eslint-disable @typescript-eslint/no-use-before-define */
import { JalaliDatepicker, IJalaliDatepickerExternalOptions } from "./models/types";
import {
	isValidValueString,
	getValueObjectFromString,
	getValueStringFromValueObject,
	normalizeMinMaxDate,
	normalizeMinMaxTime,
	isValidDateString,
	isValidTimeString,
	getConvertedValue
} from "./utils";
import { extend, clon, isString } from "./utils/object";
import { getScrollParent, getEventTarget, containsDom, triggerEvent, createElement } from "./utils/dom";
import { jalaliToday } from "./utils/jalali";
import {
	CONTAINER_ELM_QUERY,
	OVERLAY_ELM_QUERY,
	EVENT_FOCUS_STR,
	EVENT_KEYDOWN_STR,
	EVENT_CHANGE_INPUT_STR,
	STYLE_VISIBILITY_VISIBLE,
	STYLE_VISIBILITY_HIDDEN,
	STYLE_DISPLAY_BLOCK,
	STYLE_DISPLAY_HIDDEN,
	STYLE_POSITION_FIXED
} from "./constants";
import draw from "./draw";
import "./styles/index.scss";
import { JalaliDatepickerInternalOptions } from "./models/internalOption.model";

const jalaliDatepicker: JalaliDatepicker = {
	init(options: Partial<IJalaliDatepickerExternalOptions>) {
		this.updateOptions(options);
		addEventListenerOnResize();
		if (this.options.autoHide) addEventListenerOnBody();
		if (this.options.autoShow) addEventListenerOnInputs(this.options.selector);
	},
	updateOptions(options: Partial<IJalaliDatepickerExternalOptions>) {
		this.options = new JalaliDatepickerInternalOptions(options, this);
	},
	options: {} as any,
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

		return this._dpContainer as HTMLElement;
	},
	get today() {
		this._today = this._today || this.options.today || jalaliToday();
		return this._today;
	},
	get inputValue() {
		let inputValue = clon(this.input?.value || "");

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
		this._initDate = clon(this.input?.value || "");

		if (!this._initDate) {
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
		const date = new Date();
		const defaultInit = {
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: 0
		};
		this._initTime = clon(this.input?.value || "") || this.options.initTime || defaultInit;

		if (isString(this._initTime)) {
			if (isValidTimeString(this, this._initTime)) {
				this._initTime = getValueObjectFromString(this, this._initTime as string);
			} else {
				this._initTime = defaultInit;
			}
		}
		this._initTime = normalizeMinMaxTime(this, this._initTime);
		return this._initTime;
	},
	_draw: draw,
	show(input: HTMLInputElement) {
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
		setTimeout(() => {
			this.dpContainer.style.visibility = STYLE_VISIBILITY_VISIBLE;
			this.dpContainer.style.display = STYLE_DISPLAY_BLOCK;
			if (this.overlayElm) this.overlayElm.style.display = STYLE_DISPLAY_BLOCK;
			this.isShow = true;
			this.isTransitioning = false;
		}, 300);
		this.setPosition();
		setScrollOnParent(input);
		document.addEventListener(EVENT_KEYDOWN_STR, handleEscKey);
	},
	hide() {
		this.dpContainer.style.visibility = STYLE_VISIBILITY_HIDDEN;
		this.dpContainer.style.display = STYLE_DISPLAY_HIDDEN;
		if (this.overlayElm) this.overlayElm.style.display = STYLE_DISPLAY_HIDDEN;
		this.isShow = false;
		document.removeEventListener(EVENT_KEYDOWN_STR, handleEscKey);
	},
	setPosition() {
		if (!this.input || this.dpContainer.style.visibility !== STYLE_VISIBILITY_VISIBLE) {
			return;
		}
		const inputBounds = this.input.getBoundingClientRect();
		const inputHeight = inputBounds.height;
		let left = inputBounds.left;
		let top = inputBounds.top + inputHeight;
		if (this.options.topSpace) top += this.options.topSpace;
		const windowWidth = window.document.body.offsetWidth;
		const dpContainerWidth = this.dpContainer.offsetWidth;
		const dpContainerHeight = this.dpContainer.offsetHeight;
		const position = this.options.position;

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
	setValue(objValue) {
		this._value = extend(
			{
				year: this.today.year,
				month: this.today.month,
				day: this.today.day,
				hour: this.initTime.hour,
				minute: this.initTime.minute,
				second: this.initTime.second
			},
			extend(this._value || {}, objValue)
		);
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
	cleanValue() {
		if (this.input) {
			this.input.value = "";
			triggerEvent(this.input, EVENT_CHANGE_INPUT_STR);
		}
		this.setTargetValue();
	},
	setTargetValue() {
		if (!this.options.targetValueInput) return;
		const targetInputList = document.querySelectorAll(this.options.targetValueInput as string);
		if (!targetInputList || !targetInputList.length) return;
		targetInputList.forEach((targetInput) => {
			(targetInput as HTMLInputElement).value = getConvertedValue(this);
		});
	},
	increaseMonth() {
		if (!this._initDate) return;
		const isLastMonth = this._initDate.month === 12;
		if (this.options.changeMonthRotateYear && isLastMonth) {
			this.increaseYear();
		}
		this.monthChange(isLastMonth ? 1 : this._initDate.month + 1);
	},
	decreaseMonth() {
		if (!this._initDate) return;
		const isFirstMonth = this._initDate.month === 1;
		if (this.options.changeMonthRotateYear && isFirstMonth) {
			this.decreaseYear();
		}
		this.monthChange(isFirstMonth ? 12 : this._initDate.month - 1);
	},
	monthChange(month: number) {
		if (!this._initDate) return;
		this._initDate = normalizeMinMaxDate(this, this._initDate, {
			month
		});
		this._draw();
	},
	increaseYear() {
		if (!this._initDate) return;
		this.yearChange(this._initDate.year + 1);
	},
	decreaseYear() {
		if (!this._initDate) return;
		this.yearChange(this._initDate.year - 1);
	},
	yearChange(year: number) {
		if (!this._initDate) return;
		this._initDate = normalizeMinMaxDate(this, this._initDate, {
			year
		});
		this._draw();
	},
	_dpContainer: undefined,
	overlayElm: undefined,
	_today: undefined,
	_initDate: null,
	_initTime: null,
	_value: null,
	isShow: false
};

function setScrollOnParent(input: HTMLInputElement) {
	getScrollParent(input).addEventListener(
		"scroll",
		function () {
			jalaliDatepicker.setPosition();
		},
		{
			passive: true
		}
	);
}

function setReadOnly(input: HTMLInputElement, options: JalaliDatepickerInternalOptions) {
	if (options.autoReadOnlyInput && !input.readOnly) {
		input.setAttribute("readonly", "readonly");
		input.readOnly = true;
	}
}

function onResizeHandler() {
	jalaliDatepicker.setPosition();
}

function addEventListenerOnResize() {
	Element.prototype.matches =
		Element.prototype.matches ||
		(Element.prototype as any).matchesSelector ||
		(Element.prototype as any).mozMatchesSelector ||
		(Element.prototype as any).msMatchesSelector ||
		(Element.prototype as any).oMatchesSelector ||
		(Element.prototype as any).webkitMatchesSelector;
	window.removeEventListener("resize", onResizeHandler);
	window.addEventListener("resize", onResizeHandler);
}

const onInputFocusCallback = (e: FocusEvent) => {
	if (e.target && (e.target as Element).matches(jalaliDatepicker.options.selector)) {
		jalaliDatepicker.show(e.target as HTMLInputElement);
	}
};

function addEventListenerOnInputs(querySelector?: string) {
	document.body.removeEventListener(EVENT_FOCUS_STR, onInputFocusCallback);
	if (!querySelector) return;
	document.body.addEventListener(EVENT_FOCUS_STR, onInputFocusCallback);
}

const onBodyClickCallback = (e: PointerEvent) => {
	if (!jalaliDatepicker.isShow || containsDom(jalaliDatepicker.dpContainer, e) || getEventTarget(e) === jalaliDatepicker.input) {
		return;
	}
	jalaliDatepicker.hide();
};

function addEventListenerOnBody() {
	document.body.removeEventListener("click", onBodyClickCallback);
	document.body.addEventListener("click", onBodyClickCallback);
}

function handleEscKey(event: KeyboardEvent) {
	if (event.key === "Escape") {
		if (!jalaliDatepicker.isTransitioning) {
			jalaliDatepicker.input?.blur?.();
			jalaliDatepicker.hide();
		}
	}
}

(window as any).jalaliDatepicker = {
	startWatch(options: Partial<IJalaliDatepickerExternalOptions> = {}) {
		jalaliDatepicker.init(options);
	},
	show(input: HTMLInputElement) {
		jalaliDatepicker.show(input);
	},
	hide() {
		jalaliDatepicker.hide();
	},
	updateOptions(options: Partial<IJalaliDatepickerExternalOptions>) {
		jalaliDatepicker.updateOptions(options);
	}
};
