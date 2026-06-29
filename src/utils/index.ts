/* eslint-disable @typescript-eslint/no-use-before-define */
import { isNotObjectOrIsEmptyObject, addLeadingZero, extend } from "./object";
import { getDaysInMonth, toGregorian } from "./jalali";
import { DateObject, JalaliDatePicker, TimeObject, ValueObject } from "../models/types";

export const getDateNumber = (date: DateObject) => date.year * 10000 + date.month * 100 + date.day;

const isValidYear = (year: number) => !isNaN(year) && year >= 1000 && year <= 1999;
const isValidMonth = (month: number) => !isNaN(month) && month >= 1 && month <= 12;
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const getDateStringLength = (jdp: JalaliDatePicker) => 8 + jdp.options.separatorChars.date.length * 2;
const hasValidPartLengths = (parts: string[], lengths: number[]) => {
	if (parts.length !== lengths.length) return false;
	for (let i = 0; i < parts.length; i++) {
		if (parts[i].length !== lengths[i]) return false;
	}
	return true;
};

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
	const date = getDateNumber({
		year,
		month,
		day
	});
	let maxDateNumber = date;
	let minDateNumber = date;
	const maxDate = jdp.options.maxDate;
	const minDate = jdp.options.minDate;

	if (!isNotObjectOrIsEmptyObject(minDate)) {
		minDateNumber = getDateNumber(minDate);
	}
	if (!isNotObjectOrIsEmptyObject(maxDate)) {
		maxDateNumber = getDateNumber(maxDate);
	}

	return date <= maxDateNumber && date >= minDateNumber;
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

export const getDatePartsFromString = (jdp: JalaliDatePicker, str: string) => {
	if (!jdp.options.date) return [];
	return str.substr(0, getDateStringLength(jdp)).split(jdp.options.separatorChars.date);
};

export const getTimePartsFromString = (jdp: JalaliDatePicker, str: string) => {
	const sepOpt = jdp.options.separatorChars;
	if (jdp.options.date) {
		const timeStart = getDateStringLength(jdp) + sepOpt.between.length;
		return jdp.options.time && str.length > timeStart ? str.substr(timeStart).split(sepOpt.time) : [];
	}
	return str.split(sepOpt.time);
};

export const isValidTimeParts = (parts: string[], hasSecond: boolean) => hasValidPartLengths(parts, hasSecond ? [2, 2, 2] : [2, 2]);

export const getValueObjectFromString = (jdp: JalaliDatePicker, str: string) => {
	const date = getDatePartsFromString(jdp, str);
	const time = getTimePartsFromString(jdp, str);

	return {
		year: parseInt(date[0], 10),
		month: parseInt(date[1], 10),
		day: parseInt(date[2], 10),
		hour: parseInt(time[0], 10) || 0,
		minute: parseInt(time[1], 10) || 0,
		second: parseInt(time[2], 10) || 0
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

const getDateOnlyValueStringWithSep = (jdp: JalaliDatePicker, obj: DateObject, forTarget?: boolean) => {
	const dateSeparator = forTarget ? jdp.options.separatorChars.targetDate : jdp.options.separatorChars.date;
	return `${obj.year}${dateSeparator}${addLeadingZero(obj.month)}${dateSeparator}${addLeadingZero(obj.day)}`;
};

export const getDateValueStringFromValueObject = (jdp: JalaliDatePicker, obj: DateObject) => getDateValueStringFromValueObjectWithSep(jdp, obj);

export const getValueStringFromValueObject = (jdp: JalaliDatePicker, obj: ValueObject) => getDateValueStringFromValueObjectWithSep(jdp, obj);

export const areSameDates = (firstDate: DateObject, secondDate: DateObject) => getDateNumber(firstDate) === getDateNumber(secondDate);

export const sortDates = (dates: DateObject[]) =>
	dates.slice().sort((firstDate, secondDate) => {
		const firstDateNumber = getDateNumber(firstDate);
		const secondDateNumber = getDateNumber(secondDate);
		if (firstDateNumber < secondDateNumber) return -1;
		if (firstDateNumber > secondDateNumber) return 1;
		return 0;
	});

export const isDateInRange = (date: DateObject, startDate: DateObject, endDate: DateObject) => {
	const dateNumber = getDateNumber(date);
	const sortedDates = sortDates([startDate, endDate]);
	return dateNumber > getDateNumber(sortedDates[0]) && dateNumber < getDateNumber(sortedDates[1]);
};

export const getDateSelectionValueString = (jdp: JalaliDatePicker, selectedDates: DateObject[], forTarget?: boolean) => {
	if (!selectedDates.length) return "";
	const mode = jdp.options.mode || "single";
	const dates = mode === "range" ? sortDates(selectedDates).slice(0, 2) : selectedDates;
	const separator = mode === "range" ? jdp.options.rangeSeparator : jdp.options.multipleSeparator;
	return dates.map((date) => getDateOnlyValueStringWithSep(jdp, date, forTarget)).join(separator);
};

export const getSelectedDatesFromString = (jdp: JalaliDatePicker, value: string): DateObject[] => {
	const mode = jdp.options.mode || "single";
	if (!value || mode === "single") return [];
	const separator = mode === "range" ? jdp.options.rangeSeparator : jdp.options.multipleSeparator;
	const dateParts = value.split(separator);
	const selectedDates: DateObject[] = [];

	for (let i = 0; i < dateParts.length; i++) {
		const dateValue = dateParts[i].trim();
		if (isValidDateString(jdp, dateValue)) {
			const dateObject = getValueObjectFromString(jdp, dateValue);
			selectedDates.push({
				year: dateObject.year as number,
				month: dateObject.month as number,
				day: dateObject.day as number
			});
		}
	}

	return mode === "range" ? sortDates(selectedDates).slice(0, 2) : selectedDates;
};

export const isValidDateString = (jdp: JalaliDatePicker, str: string) => {
	if (!str) {
		return false;
	}
	return hasValidPartLengths(getDatePartsFromString(jdp, str), [4, 2, 2]);
};

export const isValidTimeString = (jdp: JalaliDatePicker, str: string) => {
	if (!str) {
		return false;
	}

	return isValidTimeParts(getTimePartsFromString(jdp, str), jdp.options.hasSecond);
};

export const getConvertedValue = (jdp: JalaliDatePicker) => {
	const value = jdp.input?.value;
	if (!value) {
		return "";
	}
	if (jdp.options.targetValueType) {
		if ((jdp.options.mode || "single") !== "single") {
			const selectedDates = getSelectedDatesFromString(jdp, value);
			if (jdp.options.targetValueType === "gregorian") {
				const gregorianDates = selectedDates.map((date) => extend(date, toGregorian(date.year, date.month, date.day)));
				return getDateSelectionValueString(jdp, gregorianDates, true);
			}
			return value;
		}
		const normalValue = getValueObjectFromString(jdp, value);
		if (jdp.options.targetValueType === "gregorian") {
			const gregorianValue = toGregorian(normalValue.year, normalValue.month, normalValue.day);
			return getDateValueStringFromValueObjectWithSep(jdp, extend(normalValue, gregorianValue), true);
		}
	}

	return value;
};
