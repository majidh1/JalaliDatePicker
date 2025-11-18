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
import { DateObject, IJalaliDatepickerExternalOptions, TimeObject, SeparatorChars, JalaliDatepicker, ValueObject, DayOptions } from "./types";
import { getValueObjectFromString, isValidDateString, isValidTimeString } from "../utils";
import { jalaliToday } from "../utils/jalali";
import { clon, isPlainObject, isString, isFunction } from "../utils/object";

const isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(window.navigator?.userAgent?.toLowerCase());

const normalizeOptions = (
	externalOptions: Partial<IJalaliDatepickerExternalOptions>,
	internalOptions: JalaliDatepickerInternalOptions,
	jdp: JalaliDatepicker
): JalaliDatepickerInternalOptions => {
	const setDefaultValue = <K extends keyof IJalaliDatepickerExternalOptions>(propertyName: K, defaultValue: NonNullable<JalaliDatepickerInternalOptions[K]>) => {
		const extValue = externalOptions[propertyName];
		const intValue = internalOptions[propertyName];

		internalOptions[propertyName] = (extValue ?? intValue ?? defaultValue) as JalaliDatepickerInternalOptions[K];
	};
	function setDefinePropertyFromAttr(
		propertyName: keyof Pick<
			IJalaliDatepickerExternalOptions,
			"date" | "time" | "minDate" | "maxDate" | "minTime" | "maxTime" | "initDate" | "targetValueInput" | "targetValueType"
		>
	) {
		const getDefaultFromAttr = (attrName: string, isTime?: boolean): any => {
			let attrVal: ValueObject | string | null | undefined = jdp.input?.getAttribute(attrName);

			if (!isTime && attrVal === MIN_MAX_TODAY_SETTING) return clon(jdp.today);

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
					attrVal = {};
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
				delete (internalOptions as Partial<JalaliDatepickerInternalOptions>)[propertyName];

				getterFunc = () =>
					!jdp.input?.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME) && (_date || jdp.input?.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME));
			} else if (propertyName === "time") {
				const _time = externalOptions.time ?? internalOptions.time;
				delete (internalOptions as Partial<JalaliDatepickerInternalOptions>)[propertyName];

				getterFunc = () =>
					!jdp.input?.hasAttribute(ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME) && (_time || jdp.input?.hasAttribute(ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME));
			}

			window.Object.defineProperty(internalOptions, propertyName, {
				get: getterFunc,
				enumerable: true,
				configurable: true
			});
		} else {
			setDefaultValue(propertyName, undefined as any);
		}
		return internalOptions;
	}
	setDefaultValue("container", "body");
	setDefaultValue("selector", "input[data-jdp]");
	setDefaultValue("zIndex", 1000);
	setDefaultValue("autoShow", true);
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
	setDefaultValue("days", ["ش", "ی", "د", "س", "چ", "پ", "ج"]);
	setDefaultValue("months", ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]);
	setDefaultValue("separatorChars", {
		date: "/",
		between: " ",
		time: ":",
		targetDate: "-",
		targetBetween: " ",
		targetTime: ":"
	});
	setDefaultValue("persianDigits", false);
	setDefaultValue(
		"plusHtml",
		// eslint-disable-next-line @typescript-eslint/quotes, quotes
		'<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path></g></svg>'
	);
	// eslint-disable-next-line @typescript-eslint/quotes, quotes
	setDefaultValue("minusHtml", '<svg viewBox="0 0 1024 1024"><g><path d="M810 554h-596v-84h596v84z"></path></g></svg>');
	setDefaultValue("useDropDownYears", true);
	setDefaultValue("today", jalaliToday());
	setDefaultValue("position", "left");

	if (isFunction(externalOptions.dayRendering)) internalOptions.dayRendering = externalOptions.dayRendering;
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

export class JalaliDatepickerInternalOptions implements IJalaliDatepickerExternalOptions {
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
	targetValueType?: "miladi" | "attr";
	days: string[];
	months: string[];
	separatorChars: SeparatorChars;
	persianDigits: boolean;
	plusHtml: string;
	minusHtml: string;
	useDropDownYears: boolean;
	position: "left" | "right" | "center";

	constructor(externalOptions: Partial<IJalaliDatepickerExternalOptions>, jdp: JalaliDatepicker) {
		normalizeOptions(externalOptions || {}, isPlainObject(jdp.options) ? this : jdp.options, jdp);
	}
}
