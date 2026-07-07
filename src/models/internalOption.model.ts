import {
	ATTR_OPTION_NAMES,
	DEFAULT_DAYS,
	DEFAULT_MINUS_HTML,
	DEFAULT_MONTHS,
	DEFAULT_MULTIPLE_SEPARATOR,
	DEFAULT_PLUS_HTML,
	DEFAULT_RANGE_SEPARATOR,
	DEFAULT_SEPARATOR_CHARS,
	MIN_MAX_TODAY_SETTING,
	MODE_ATTR_NAME,
	ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME,
	ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME,
	OPTION_ATTR_SETTING,
	SELECTION_MODE_NAMES,
	TARGET_VALUE_INPUT_ATTR_NAME,
	TARGET_VALUE_TYPE_ATTR_NAME,
	TIME_ATTR_OPTION_NAMES,
	TODAY_DATE_OPTION_NAMES
} from "../constants";
import { DateObject, JalaliDatePickerOptions, TimeObject, SeparatorChars, JalaliDatePicker, ValueObject, DayOptions } from "./types";
import { getValueObjectFromString, isValidDateString, isValidTimeParts, isValidTimeString } from "../utils";
import { jalaliToday } from "../utils/jalali";
import { clone, isNotObjectOrIsEmptyObject, isString, isFunction } from "../utils/object";

const isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(window.navigator?.userAgent?.toLowerCase());

const getTimeValueObjectFromParts = (parts: string[], hasSecond: boolean): ValueObject | null => {
	if (!isValidTimeParts(parts, hasSecond)) {
		return null;
	}
	return {
		hour: parseInt(parts[0], 10),
		minute: parseInt(parts[1], 10),
		second: parseInt(parts[2], 10) || 0
	};
};

const getTimeValueObjectFromTimeOnlyString = (jdp: JalaliDatePicker, timeString: string) =>
	getTimeValueObjectFromParts(timeString.split(jdp.options.separatorChars.time), jdp.options.hasSecond);

const normalizeSelectionMode = (mode: string | null | undefined) => (mode && SELECTION_MODE_NAMES.indexOf(mode) > -1 ? mode : "single");
const normalizeBooleanAttr = (value: string | null | undefined, defaultValue: boolean) => {
	if (value === null || value === undefined || value === "") return defaultValue;
	return value !== "false";
};

const normalizeOptions = (
	externalOptions: Partial<JalaliDatePickerOptions>,
	internalOptions: JalaliDatePickerInternalOptions,
	jdp: JalaliDatePicker
): JalaliDatePickerInternalOptions => {
	const setDefaultValue = <K extends keyof JalaliDatePickerOptions>(propertyName: K, defaultValue: NonNullable<JalaliDatePickerInternalOptions[K]>) => {
		const extValue = externalOptions[propertyName];
		const intValue = internalOptions[propertyName];
		const externalValue = TODAY_DATE_OPTION_NAMES.indexOf(propertyName as string) > -1 && extValue === MIN_MAX_TODAY_SETTING ? internalOptions.today : extValue;
		const descriptor = Object.getOwnPropertyDescriptor(internalOptions, propertyName);
		if (descriptor?.get && !descriptor.set) {
			delete internalOptions[propertyName];
		}
		internalOptions[propertyName] = (externalValue ?? intValue ?? defaultValue) as JalaliDatePickerInternalOptions[K];
	};
	const getDateOrTimeDefaultFromAttr = (attrName: string, isTime?: boolean): ValueObject | {} => {
		let attrVal: ValueObject | string | null | undefined = jdp.input?.getAttribute(attrName);

		if (!isTime && attrVal === MIN_MAX_TODAY_SETTING) return clone(jdp.today);
		if (!isString(attrVal)) return {};

		try {
			attrVal = (document.querySelector(attrVal) as HTMLInputElement).value;
		} catch {
			//
		}

		if (isTime) {
			if (isValidTimeString(jdp, attrVal)) return getValueObjectFromString(jdp, attrVal);
			return getTimeValueObjectFromTimeOnlyString(jdp, attrVal) || {};
		}

		if (isValidDateString(jdp, attrVal)) return getValueObjectFromString(jdp, attrVal);
		return {};
	};
	const getAttrGetter = (
		propertyName: keyof Pick<
			JalaliDatePickerOptions,
			"date" | "time" | "minDate" | "maxDate" | "minTime" | "maxTime" | "initDate" | "targetValueInput" | "targetValueType" | "mode" | "hasSecond"
		>
	) => {
		if (propertyName === "targetValueInput") return () => jdp.input?.getAttribute(TARGET_VALUE_INPUT_ATTR_NAME);
		if (propertyName === "targetValueType") return () => jdp.input?.getAttribute(TARGET_VALUE_TYPE_ATTR_NAME);
		if (propertyName === "mode") return () => normalizeSelectionMode(jdp.input?.getAttribute(MODE_ATTR_NAME));
		if (propertyName === "hasSecond") return () => normalizeBooleanAttr(jdp.input?.getAttribute(ATTR_OPTION_NAMES.hasSecond), true);
		const attrName = ATTR_OPTION_NAMES[propertyName as keyof typeof ATTR_OPTION_NAMES];
		const isTime = TIME_ATTR_OPTION_NAMES.indexOf(propertyName) > -1;
		return () => getDateOrTimeDefaultFromAttr(attrName, isTime);
	};
	function setDefinePropertyFromAttr(
		propertyName: keyof Pick<
			JalaliDatePickerOptions,
			"date" | "time" | "minDate" | "maxDate" | "minTime" | "maxTime" | "initDate" | "targetValueInput" | "targetValueType" | "mode" | "hasSecond"
		>
	) {
		if (externalOptions[propertyName] === OPTION_ATTR_SETTING || propertyName === "date" || propertyName === "time") {
			if (propertyName !== "date" && propertyName !== "time") {
				delete internalOptions[propertyName];
			}

			let getterFunc: () => unknown = () => ({});

			if (propertyName === "date") {
				const _date = externalOptions.date ?? internalOptions.date;
				delete (internalOptions as Partial<JalaliDatePickerInternalOptions>)[propertyName];

				getterFunc = () =>
					!jdp.input?.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME) && (_date || jdp.input?.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME));
			} else if (propertyName === "time") {
				const _time = externalOptions.time ?? internalOptions.time;
				delete (internalOptions as Partial<JalaliDatePickerInternalOptions>)[propertyName];

				getterFunc = () =>
					!jdp.input?.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME) && (_time || jdp.input?.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME));
			} else {
				getterFunc = getAttrGetter(propertyName);
			}

			window.Object.defineProperty(internalOptions, propertyName, {
				get: getterFunc,
				enumerable: true,
				configurable: true
			});
		} else {
			const _temp = internalOptions[propertyName];
			delete internalOptions[propertyName];
			setDefaultValue(propertyName, _temp as any);
		}
		return internalOptions;
	}
	setDefaultValue("container", "body");
	setDefaultValue("selector", "input[data-jdp]");
	setDefaultValue("zIndex", 1000);
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
	setDefaultValue("days", DEFAULT_DAYS);
	setDefaultValue("months", DEFAULT_MONTHS);
	setDefaultValue("separatorChars", DEFAULT_SEPARATOR_CHARS);
	setDefaultValue("persianDigits", false);
	setDefaultValue("plusHtml", DEFAULT_PLUS_HTML);
	setDefaultValue("minusHtml", DEFAULT_MINUS_HTML);
	if (externalOptions.useDropDownYears !== undefined && externalOptions.useDropdownYears === undefined) {
		internalOptions.useDropdownYears = externalOptions.useDropDownYears;
	}
	setDefaultValue("useDropdownYears", true);
	internalOptions.useDropDownYears = internalOptions.useDropdownYears;
	setDefaultValue("today", jalaliToday());
	setDefaultValue("position", "left");
	setDefaultValue("minuteIncrement", 1);
	setDefaultValue("hourIncrement", 1);
	setDefaultValue("mode", "single");
	setDefaultValue("rangeSeparator", DEFAULT_RANGE_SEPARATOR);
	setDefaultValue("multipleSeparator", DEFAULT_MULTIPLE_SEPARATOR);

	if (isFunction(externalOptions.dayRendering)) internalOptions.dayRendering = externalOptions.dayRendering;
	if (externalOptions.initTime && externalOptions.initTime !== MIN_MAX_TODAY_SETTING && externalOptions.initTime !== OPTION_ATTR_SETTING) {
		internalOptions.initTime = externalOptions.initTime;
	}
	if (externalOptions.initDate === MIN_MAX_TODAY_SETTING) internalOptions.initDate = internalOptions.today;
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
	internalOptions = setDefinePropertyFromAttr("mode");
	internalOptions = setDefinePropertyFromAttr("hasSecond");

	return internalOptions;
};

export class JalaliDatePickerInternalOptions implements JalaliDatePickerOptions {
	container: string | HTMLElement;
	selector: string;
	zIndex: number;
	autoShow: boolean;
	autoHide: boolean;
	autoReadOnlyInput: boolean;
	topSpace: number;
	bottomSpace: number;
	overflowSpace: number;
	hideAfterChange: boolean;
	hideAfterChangeWithTime: boolean;
	changeMonthRotateYear: boolean;
	showTodayBtn: boolean;
	showEmptyBtn: boolean;
	showCloseBtn: boolean;
	showSelectTimeBtnAlways: boolean;
	dayRendering?: (day: DayOptions, input: HTMLInputElement | null) => DayOptions;
	minDate?: DateObject;
	maxDate?: DateObject;
	initDate?: DateObject;
	minTime?: TimeObject;
	maxTime?: TimeObject;
	initTime?: TimeObject;
	date: boolean;
	time: boolean;
	today: DateObject;
	hasSecond: boolean;
	targetValueInput?: string | HTMLInputElement | "attr";
	targetValueType?: "gregorian" | "attr";
	days: string[];
	months: string[];
	separatorChars: SeparatorChars;
	persianDigits: boolean;
	plusHtml: string;
	minusHtml: string;
	useDropdownYears: boolean;
	/**
	 * @deprecated change to useDropdownYears
	 */
	useDropDownYears?: boolean;
	position: "left" | "right" | "center";
	minuteIncrement: number;
	hourIncrement: number;
	mode: "single" | "range" | "multiple";
	rangeSeparator: string;
	multipleSeparator: string;

	constructor(externalOptions: Partial<JalaliDatePickerOptions>, jdp: JalaliDatePicker) {
		normalizeOptions(externalOptions || {}, isNotObjectOrIsEmptyObject(jdp.options) ? this : jdp.options, jdp);
	}

	update(externalOptions: Partial<JalaliDatePickerOptions>, jdp: JalaliDatePicker) {
		normalizeOptions(externalOptions || {}, this, jdp);
	}
}
