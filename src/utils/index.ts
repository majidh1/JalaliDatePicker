/* eslint-disable @typescript-eslint/no-use-before-define */
import { isNotObjectOrIsEmptyObject, addLeadingZero, extend } from "./object";
import { getDaysInMonth, toGregorian } from "./jalali";
import { DateObject, JalaliDatePicker, TimeObject, ValueObject } from "../models/types";

const getDateNumber = (date: DateObject) => date.year * 10000 + date.month * 100 + date.day;

const isValidYear = (year: number) => !isNaN(year) && year >= 1000 && year <= 1999;
const isValidMonth = (month: number) => !isNaN(month) && month >= 1 && month <= 12;
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getFallbackDate = (jdp: JalaliDatePicker): DateObject => {
	if (jdp._initDate) return jdp._initDate;
	if (jdp.options.initDate && typeof jdp.options.initDate === "object") return jdp.options.initDate;
	return jdp.today;
};

const getFallbackTime = (jdp: JalaliDatePicker): TimeObject => {
	if (jdp._initTime) return jdp._initTime;
	if (jdp.options.initTime && typeof jdp.options.initTime === "object") return jdp.options.initTime;
	return {
		hour: 0,
		minute: 0,
		second: 0
	};
};

export const normalizeMinMaxDate = (jdp: JalaliDatePicker, dateObj?: DateObject | null, updateObj?: Partial<DateObject> | null) => {
	const _dateObj = extend(dateObj || {}, updateObj || {}) as DateObject;
	const fallbackDate = getFallbackDate(jdp);
	const maxDate = jdp.options.maxDate;
	const minDate = jdp.options.minDate;
	const year = isValidYear(_dateObj.year) ? _dateObj.year : fallbackDate.year;
	const month = isValidMonth(_dateObj.month) ? _dateObj.month : fallbackDate.month;
	let day = !isNaN(_dateObj.day) && _dateObj.day >= 1 ? _dateObj.day : fallbackDate.day;
	const daysInMonth = getDaysInMonth(year, month);

	if (day > daysInMonth) {
		day = daysInMonth;
	}

	const normalizedDate = {
		year,
		month,
		day
	};

	if (minDate && getDateNumber(normalizedDate) < getDateNumber(minDate)) return minDate;
	if (maxDate && getDateNumber(normalizedDate) > getDateNumber(maxDate)) return maxDate;
	return normalizedDate;
};

export const normalizeMinMaxTime = (jdp: JalaliDatePicker, timeObj?: TimeObject | null, updateObj?: Partial<TimeObject> | null) => {
	const _timeObj = extend(timeObj || {}, updateObj || {});
	const initTime = getFallbackTime(jdp);
	const maxTime = jdp.options.maxTime;
	const minTime = jdp.options.minTime;
	let hour = _timeObj.hour as number;
	let minute = _timeObj.minute as number;
	let second = _timeObj.second as number;

	if (isNaN(hour) || hour < 0 || hour > 23) {
		hour = initTime.hour;
	} else {
		if (minTime && hour < minTime.hour) {
			hour = minTime.hour;
		} else if (maxTime && hour > maxTime.hour) {
			hour = maxTime.hour;
		}
	}

	if (isNaN(minute) || minute < 0 || minute > 59) {
		minute = initTime.minute;
	} else {
		if (minTime && hour <= minTime.hour && minute < minTime.minute) {
			minute = minTime.minute;
		} else if (maxTime && hour >= maxTime.hour && minute > maxTime.minute) {
			minute = maxTime.minute;
		}
	}

	if (isNaN(second) || second < 0 || second > 59) {
		second = initTime.second;
	} else {
		if (minTime && hour <= minTime.hour && minute <= minTime.minute && second < minTime.second) {
			second = minTime.second;
		} else if (maxTime && hour >= maxTime.hour && minute >= maxTime.minute && second > maxTime.second) {
			second = maxTime.second;
		}
	}

	return {
		hour,
		minute,
		second
	};
};

export const getValidYears = (jdp: JalaliDatePicker) => {
	function rnd(val: number) {
		return Math.round(val / 100) * 100;
	}

	const initYear = jdp.initDate.year;
	const min = jdp.options.minDate?.year || rnd(initYear - 200);
	const max = jdp.options.maxDate?.year || rnd(initYear + 200);
	return {
		min,
		max
	};
};

export const getValidMonths = (jdp: JalaliDatePicker) => {
	const initYear = jdp.initDate.year;
	const minDate = jdp.options.minDate;
	const maxDate = jdp.options.maxDate;
	const months = [];
	let start = 1;
	let finish = 12;

	if (initYear === minDate?.year) {
		start = minDate.month;
		if (initYear === maxDate?.year) {
			finish = maxDate.month;
		}
	} else if (initYear === maxDate?.year) {
		start = 1;
		finish = maxDate.month;
	}

	for (let i = start; i <= finish; i++) {
		months.push(i);
	}

	return months;
};

export const isValidDate = (jdp: JalaliDatePicker, year: number, month: number, day: number) => {
	const date = getDateValueStringFromValueObject(jdp, {
		year,
		month,
		day
	});
	let maxDateStr = date;
	let minDateStr = date;
	const maxDate = jdp.options.maxDate;
	const minDate = jdp.options.minDate;

	if (!isNotObjectOrIsEmptyObject(minDate)) {
		minDateStr = getDateValueStringFromValueObject(jdp, {
			year: minDate.year,
			month: minDate.month,
			day: minDate.day
		});
	}
	if (!isNotObjectOrIsEmptyObject(maxDate)) {
		maxDateStr = getDateValueStringFromValueObject(jdp, {
			year: maxDate.year,
			month: maxDate.month,
			day: maxDate.day
		});
	}

	return date <= maxDateStr && date >= minDateStr;
};

export const isValidDateToday = (jdp: JalaliDatePicker) => isValidDate(jdp, jdp.today.year, jdp.today.month, jdp.today.day);

export const isValidValueString = (jdp: JalaliDatePicker, str: string) => {
	if (!str) {
		return false;
	}
	const sepOpt = jdp.options.separatorChars;
	const dateSeparator = escapeRegex(sepOpt.date);
	const timeSeparator = escapeRegex(sepOpt.time);
	const betweenSeparator = escapeRegex(sepOpt.between);
	const datePattern = jdp.options.date ? `\\d{4}${dateSeparator}\\d{2}${dateSeparator}\\d{2}` : "";
	const timePattern = jdp.options.time ? `\\d{2}${timeSeparator}\\d{2}` + (jdp.options.hasSecond ? `${timeSeparator}\\d{2}` : "") : "";
	const regex = new RegExp(`^${datePattern}${datePattern && timePattern ? betweenSeparator : ""}${timePattern}$`);

	return regex.test(str);
};

export const getValueObjectFromString = (jdp: JalaliDatePicker, str: string) => {
	const sepOpt = jdp.options.separatorChars;

	const sep = str.split(sepOpt.between);
	const date = jdp.options.date ? sep[0].split(sepOpt.date) : [];
	const time = jdp.options.date ? (jdp.options.time && sep[1] ? sep[1].split(sepOpt.time) : []) : sep[0].split(sepOpt.time);

	return {
		year: parseInt(date[0]),
		month: parseInt(date[1]),
		day: parseInt(date[2]),
		hour: parseInt(time[0]) || 0,
		minute: parseInt(time[1]) || 0,
		second: parseInt(time[2]) || 0
	};
};

export const getDateValueStringFromValueObjectWithSep = (jdp: JalaliDatePicker, obj: Partial<ValueObject>, forTarget?: boolean) => {
	const opt = jdp.options;
	const separatorChars = opt.separatorChars;
	const date = forTarget ? separatorChars.targetDate : separatorChars.date;
	const time = forTarget ? separatorChars.targetTime : separatorChars.time;
	const between = forTarget ? separatorChars.targetBetween : separatorChars.between;

	const dateStr = opt.date ? `${obj.year}${date}${addLeadingZero(obj.month)}${date}${addLeadingZero(obj.day)}` : "";
	const timeStr = opt.time ? `${addLeadingZero(obj.hour)}${time}${addLeadingZero(obj.minute)}` + (opt.hasSecond ? time + addLeadingZero(obj.second) : "") : "";
	const betweenStr = dateStr && timeStr ? between : "";
	return dateStr + betweenStr + timeStr;
};

export const getDateValueStringFromValueObject = (jdp: JalaliDatePicker, obj: DateObject) => getDateValueStringFromValueObjectWithSep(jdp, obj);

export const getValueStringFromValueObject = (jdp: JalaliDatePicker, obj: ValueObject) => getDateValueStringFromValueObjectWithSep(jdp, obj);

export const isValidDateString = (jdp: JalaliDatePicker, str: string) => {
	if (!str) {
		return false;
	}
	const date = str.substr(0, 10).split(jdp.options.separatorChars.date);
	return date.length === 3 && date[0].length === 4 && date[1].length === 2 && date[2].length === 2;
};

export const isValidTimeString = (jdp: JalaliDatePicker, str: string) => {
	if (!str) {
		return false;
	}

	const time = str.substr(jdp.options.date ? 11 : 0, 8).split(jdp.options.separatorChars.time);
	return time.length === (jdp.options.hasSecond ? 3 : 2) && !time.find((t) => t.toString().length !== 2);
};

export const getConvertedValue = (jdp: JalaliDatePicker) => {
	const value = jdp.input?.value;
	if (!value) {
		return "";
	}
	if (jdp.options.targetValueType) {
		const normalValue = getValueObjectFromString(jdp, value);
		if (jdp.options.targetValueType === "gregorian") {
			const gregorianValue = toGregorian(normalValue.year, normalValue.month, normalValue.day);
			return getDateValueStringFromValueObjectWithSep(jdp, extend(normalValue, gregorianValue), true);
		}
	}

	return value;
};
