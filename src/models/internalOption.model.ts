import {
	INIT_DATE_ATTR_NAME,
	MAX_DATE_ATTR_NAME,
	MAX_TIME_ATTR_NAME,
	MIN_DATE_ATTR_NAME,
	MIN_MAX_TODAY_SETTING,
	MIN_TIME_ATTR_NAME,
	ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME,
	ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME,
	OPTION_ATTR_SETTING,
	TARGET_VALUE_INPUT_ATTR_NAME,
	TARGET_VALUE_TYPE_ATTR_NAME
} from "../constants";
import { DateObject, JalaliDatePickerOptions, TimeObject, SeparatorChars, JalaliDatePicker, ValueObject, DayOptions } from "./types";
import { getValueObjectFromString, isValidDateString, isValidTimeString } from "../utils";
import { jalaliToday } from "../utils/jalali";
import { clone, isNotObjectOrIsEmptyObject, isString, isFunction } from "../utils/object";

const isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(window.navigator?.userAgent?.toLowerCase());
const DEFAULT_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const DEFAULT_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const DEFAULT_SEPARATOR_CHARS = {
	date: "/",
	between: " ",
	time: ":",
	targetDate: "-",
	targetBetween: " ",
	targetTime: ":"
};
const TODAY_DATE_OPTION_NAMES = ["initDate", "minDate", "maxDate"];
// eslint-disable-next-line @typescript-eslint/quotes, quotes
const DEFAULT_PLUS_HTML = '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path></g></svg>';
// eslint-disable-next-line @typescript-eslint/quotes, quotes
const DEFAULT_MINUS_HTML = '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-596v-84h596v84z"></path></g></svg>';

const getTimeValueObjectFromTimeString = (timeString: string, separator: string, hasSecond: boolean): ValueObject | null => {
	const parts = timeString.split(separator);
	const expectedLength = hasSecond ? 3 : 2;
	if (parts.length !== expectedLength || parts.some((part) => part.length !== 2)) {
		return null;
	}
	return {
		hour: parseInt(parts[0]),
		minute: parseInt(parts[1]),
		second: parseInt(parts[2]) || 0
	};
};

const normalizeOptions = (
	externalOptions: Partial<JalaliDatePickerOptions>,
	internalOptions: JalaliDatePickerInternalOptions,
	jdp: JalaliDatePicker
): JalaliDatePickerInternalOptions => {
	const setDefaultValue = <K extends keyof JalaliDatePickerOptions>(propertyName: K, defaultValue: NonNullable<JalaliDatePickerInternalOptions[K]>) => {
		const extValue = externalOptions[propertyName];
		const intValue = internalOptions[propertyName];
		const externalValue = TODAY_DATE_OPTION_NAMES.includes(propertyName) && extValue === MIN_MAX_TODAY_SETTING ? internalOptions.today : extValue;
		const descriptor = Object.getOwnPropertyDescriptor(internalOptions, propertyName);
		if (descriptor?.get && !descriptor.set) {
			delete internalOptions[propertyName];
		}
		internalOptions[propertyName] = (externalValue ?? intValue ?? defaultValue) as JalaliDatePickerInternalOptions[K];
	};
	function setDefinePropertyFromAttr(
		propertyName: keyof Pick<
			JalaliDatePickerOptions,
			"date" | "time" | "minDate" | "maxDate" | "minTime" | "maxTime" | "initDate" | "targetValueInput" | "targetValueType"
		>
	) {
		const getDefaultFromAttr = (attrName: string, isTime?: boolean): any => {
			let attrVal: ValueObject | string | null | undefined = jdp.input?.getAttribute(attrName);

			if (!isTime && attrVal === MIN_MAX_TODAY_SETTING) return clone(jdp.today);

			if (!isString(attrVal)) return {};

			try {
				attrVal = (document.querySelector(attrVal) as HTMLInputElement).value;
			} catch {
				//
			}

			if (isTime) {
				if (isValidTimeString(jdp, attrVal)) {
					attrVal = getValueObjectFromString(jdp, attrVal);
				} else {
					attrVal = getTimeValueObjectFromTimeString(attrVal, jdp.options.separatorChars.time, jdp.options.hasSecond) || {};
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

			let getterFunc = () => {
				//
			};

			if (propertyName === "initDate") {
				getterFunc = () => getDefaultFromAttr(INIT_DATE_ATTR_NAME);
			} else if (propertyName === "minDate") {
				getterFunc = () => getDefaultFromAttr(MIN_DATE_ATTR_NAME);
			} else if (propertyName === "maxDate") {
				getterFunc = () => getDefaultFromAttr(MAX_DATE_ATTR_NAME);
			} else if (propertyName === "minTime") {
				getterFunc = () => getDefaultFromAttr(MIN_TIME_ATTR_NAME, true);
			} else if (propertyName === "maxTime") {
				getterFunc = () => getDefaultFromAttr(MAX_TIME_ATTR_NAME, true);
			} else if (propertyName === "targetValueInput") {
				getterFunc = () => jdp.input?.getAttribute(TARGET_VALUE_INPUT_ATTR_NAME);
			} else if (propertyName === "targetValueType") {
				getterFunc = () => jdp.input?.getAttribute(TARGET_VALUE_TYPE_ATTR_NAME);
			} else if (propertyName === "date") {
				const _date = externalOptions.date ?? internalOptions.date;
				delete (internalOptions as Partial<JalaliDatePickerInternalOptions>)[propertyName];

				getterFunc = () =>
					!jdp.input?.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME) && (_date || jdp.input?.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME));
			} else if (propertyName === "time") {
				const _time = externalOptions.time ?? internalOptions.time;
				delete (internalOptions as Partial<JalaliDatePickerInternalOptions>)[propertyName];

				getterFunc = () =>
					!jdp.input?.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME) && (_time || jdp.input?.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME));
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
	useDropDownYears: boolean;
	position: "left" | "right" | "center";
	minuteIncrement: number;
	hourIncrement: number;

	constructor(externalOptions: Partial<JalaliDatePickerOptions>, jdp: JalaliDatePicker) {
		normalizeOptions(externalOptions || {}, isNotObjectOrIsEmptyObject(jdp.options) ? this : jdp.options, jdp);
	}

	update(externalOptions: Partial<JalaliDatePickerOptions>, jdp: JalaliDatePicker) {
		normalizeOptions(externalOptions || {}, this, jdp);
	}
}
