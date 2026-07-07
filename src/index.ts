/* eslint-disable @typescript-eslint/no-use-before-define */
import { DateObject, JalaliDatePicker, JalaliDatePickerOptions, TimeObject } from "./models/types";
import {
	isValidValueString,
	getValueObjectFromString,
	getValueStringFromValueObject,
	normalizeMinMaxDate,
	normalizeMinMaxTime,
	isValidDateString,
	isValidTimeString,
	getConvertedValue,
	getDateSelectionValueString,
	getSelectedDatesFromString,
	sortDates,
	areSameDates
} from "./utils";
import { extend, clone, isString, isNotObjectOrIsEmptyObject } from "./utils/object";
import { getScrollParent, getEventTarget, containsDom, triggerEvent, createElement } from "./utils/dom";
import { jalaliToday } from "./utils/jalali";
import {
	CONTAINER_ELEMENT_QUERY,
	OVERLAY_ELEMENT_QUERY,
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
import { JalaliDatePickerInternalOptions } from "./models/internalOption.model";

const jalaliDatepicker: JalaliDatePicker = {
	init(options: Partial<JalaliDatePickerOptions>) {
		this.updateOptions(options);
		addEventListenerOnResize();
		addEventListenerOnBody();
		addEventListenerOnInputs(this.options.selector);
	},
	updateOptions(options: Partial<JalaliDatePickerOptions>) {
		if (isNotObjectOrIsEmptyObject(this.options)) {
			this.options = new JalaliDatePickerInternalOptions(options, this);
		} else {
			this.options.update(options, this);
		}
		applyZIndex();
	},
	options: {} as JalaliDatePickerInternalOptions,
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

		return this._dpContainer as HTMLElement;
	},
	get today() {
		this._today = this._today || this.options.today || jalaliToday();
		return this._today;
	},
	get inputValue() {
		const inputValue = this.input?.value || "";

		if (isValidValueString(this, inputValue)) {
			return getValueObjectFromString(this, inputValue);
		}
		if (isValidDateString(this, inputValue)) {
			return getValueObjectFromString(this, inputValue);
		}

		return {};
	},
	get initDate() {
		if (this.options.initDate) {
			return this.options.initDate;
		}
		if (this._initDate) {
			return this._initDate;
		}
		this._initDate = normalizeMinMaxDate(this, getInitialDate(this));
		return this._initDate;
	},
	get initTime() {
		if (this._initTime) {
			return this._initTime;
		}
		this._initTime = normalizeMinMaxTime(this, getInitialTime(this));
		return this._initTime;
	},
	_draw: draw,
	show(input: HTMLInputElement) {
		resetCurrentInputState(this);
		this.input = input;
		setSelectedDatesFromInput(this);
		this._draw();
		setReadOnly(input, this.options);
		this.isTransitioning = true;
		setPickerVisibility(this, true);
		setTimeout(() => {
			setPickerVisibility(this, true);
			this.isShow = true;
			this.isTransitioning = false;
		}, 300);
		this.setPosition();
		setScrollOnParent(input);
		document.addEventListener(EVENT_KEYDOWN_STR, handleEscKey);
	},
	hide() {
		setPickerVisibility(this, false);
		this.isShow = false;
		removeScrollOnParent();
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
		if (this.options.date && (this.options.mode || "single") !== "single" && isDateValue(objValue)) {
			setDateSelectionValue(this, objValue);
			return;
		}
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
		this.selectedDates = [];
		if (this.input) {
			this.input.value = "";
			triggerEvent(this.input, EVENT_CHANGE_INPUT_STR);
		}
		this.setTargetValue();
	},
	setTargetValue() {
		if (!this.options.targetValueInput) return;
		const targetInputList =
			this.options.targetValueInput instanceof HTMLElement ? [this.options.targetValueInput] : document.querySelectorAll(this.options.targetValueInput as string);
		if (!targetInputList || !targetInputList.length) return;
		for (let i = 0; i < targetInputList.length; i++) {
			const targetInput = targetInputList[i];
			(targetInput as HTMLInputElement).value = getConvertedValue(this);
		}
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
	overlayElement: undefined,
	_scrollParent: undefined,
	_scrollHandler: undefined,
	_today: undefined,
	_initDate: null,
	_initTime: null,
	_value: null,
	selectedDates: [],
	isShow: false
};

function getCurrentTime(): TimeObject {
	const date = new Date();
	return {
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: 0
	};
}

function getInitialDate(jdp: JalaliDatePicker): DateObject {
	const inputValue = jdp.input?.value || "";

	if (!inputValue) {
		return jdp.options.initDate || clone(jdp.today);
	}
	if (isValidDateString(jdp, inputValue)) {
		return getValueObjectFromString(jdp, inputValue) as DateObject;
	}
	return clone(jdp.today);
}

function getInitialTime(jdp: JalaliDatePicker): TimeObject {
	const defaultInit = getCurrentTime();
	const initTime: string | TimeObject = jdp.input?.value || jdp.options.initTime || defaultInit;

	if (!isString(initTime)) {
		return initTime;
	}
	if (isValidTimeString(jdp, initTime)) {
		return getValueObjectFromString(jdp, initTime) as TimeObject;
	}
	return defaultInit;
}

function resetCurrentInputState(jdp: JalaliDatePicker) {
	jdp._initDate = null;
	jdp._initTime = null;
	jdp._value = null;
	jdp.selectedDates = [];
}

function isDateValue(value: Partial<DateObject>): value is DateObject {
	return typeof value.year === "number" && typeof value.month === "number" && typeof value.day === "number";
}

function setSelectedDatesFromInput(jdp: JalaliDatePicker) {
	if ((jdp.options.mode || "single") === "single") return;
	jdp.selectedDates = getSelectedDatesFromString(jdp, jdp.input?.value || "");
}

function setDateSelectionValue(jdp: JalaliDatePicker, date: DateObject) {
	if ((jdp.options.mode || "single") === "range") {
		setRangeDateSelection(jdp, date);
	} else {
		setMultipleDateSelection(jdp, date);
	}
	writeDateSelectionValue(jdp);
}

function setRangeDateSelection(jdp: JalaliDatePicker, date: DateObject) {
	if (!jdp.selectedDates.length || jdp.selectedDates.length === 2) {
		jdp.selectedDates = [date];
		return;
	}
	jdp.selectedDates = sortDates([jdp.selectedDates[0], date]);
}

function setMultipleDateSelection(jdp: JalaliDatePicker, date: DateObject) {
	const selectedDates: DateObject[] = [];
	let shouldAddDate = true;

	for (let i = 0; i < jdp.selectedDates.length; i++) {
		if (areSameDates(jdp.selectedDates[i], date)) {
			shouldAddDate = false;
		} else {
			selectedDates.push(jdp.selectedDates[i]);
		}
	}

	if (shouldAddDate) {
		selectedDates.push(date);
	}
	jdp.selectedDates = sortDates(selectedDates);
}

function writeDateSelectionValue(jdp: JalaliDatePicker) {
	if (jdp.input) {
		jdp.input.value = getDateSelectionValueString(jdp, jdp.selectedDates);
		triggerEvent(jdp.input, EVENT_CHANGE_INPUT_STR);
	}
	jdp.setTargetValue();
	if ((jdp.options.mode || "single") === "range" && jdp.selectedDates.length === 2 && jdp.options.hideAfterChange) {
		jdp.hide();
	} else {
		jdp._draw();
	}
}

function setPickerVisibility(jdp: JalaliDatePicker, isVisible: boolean) {
	jdp.dpContainer.style.visibility = isVisible ? STYLE_VISIBILITY_VISIBLE : STYLE_VISIBILITY_HIDDEN;
	jdp.dpContainer.style.display = isVisible ? STYLE_DISPLAY_BLOCK : STYLE_DISPLAY_HIDDEN;
	if (jdp.overlayElement) {
		jdp.overlayElement.style.display = isVisible ? STYLE_DISPLAY_BLOCK : STYLE_DISPLAY_HIDDEN;
	}
}

function applyZIndex() {
	const zIndex = jalaliDatepicker.options.zIndex;
	if (typeof zIndex !== "number") return;
	if (jalaliDatepicker._dpContainer?.isConnected) {
		jalaliDatepicker._dpContainer.style.zIndex = String(zIndex);
	}
	if (jalaliDatepicker.overlayElement?.isConnected) {
		jalaliDatepicker.overlayElement.style.zIndex = String(zIndex - 1);
	}
}

function onScrollHandler() {
	jalaliDatepicker.setPosition();
}

function setScrollOnParent(input: HTMLInputElement) {
	removeScrollOnParent();
	jalaliDatepicker._scrollParent = getScrollParent(input);
	jalaliDatepicker._scrollHandler = onScrollHandler;
	jalaliDatepicker._scrollParent.addEventListener("scroll", jalaliDatepicker._scrollHandler, false);
}

function removeScrollOnParent() {
	if (!jalaliDatepicker._scrollParent || !jalaliDatepicker._scrollHandler) return;
	jalaliDatepicker._scrollParent.removeEventListener("scroll", jalaliDatepicker._scrollHandler);
	jalaliDatepicker._scrollParent = undefined;
	jalaliDatepicker._scrollHandler = undefined;
}

function setReadOnly(input: HTMLInputElement, options: JalaliDatePickerInternalOptions) {
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
	if (!jalaliDatepicker.options.autoShow) {
		return;
	}
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
	const clickInsideDatePicker = containsDom(jalaliDatepicker.dpContainer, e);
	const clickOnInput = getEventTarget(e) === jalaliDatepicker.input;

	if (!jalaliDatepicker.options.autoHide || !jalaliDatepicker.isShow || clickInsideDatePicker || clickOnInput) {
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
	startWatch(options: Partial<JalaliDatePickerOptions> = {}) {
		jalaliDatepicker.init(options);
	},
	show(input: HTMLInputElement) {
		jalaliDatepicker.show(input);
	},
	hide() {
		jalaliDatepicker.hide();
	},
	updateOptions(options: Partial<JalaliDatePickerOptions>) {
		jalaliDatepicker.updateOptions(options);
	}
};
