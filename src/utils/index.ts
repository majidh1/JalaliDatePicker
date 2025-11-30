/* eslint-disable @typescript-eslint/no-use-before-define */
import { isNotObjectOrIsEmptyObject, addLeadingZero, extend } from "./object";
import { toMiladi } from "./jalali";
import { DateObject, JalaliDatepicker, TimeObject, ValueObject } from "../models/types";

export const normalizeMinMaxDate = (jdp: JalaliDatepicker, dateObj?: DateObject | null, updateObj?: Partial<DateObject> | null) => {
	const _dateObj = extend(dateObj || {}, updateObj || {}) as DateObject;
	const initDate = jdp.initDate;
	const maxDate = jdp.options.maxDate;
	const minDate = jdp.options.minDate;
	let year = _dateObj.year;
	let month = _dateObj.month;
	let day = _dateObj.day;

	if (isNaN(year) || year < 1000 || year > 1999) {
		year = initDate.year;
	} else {
		if (minDate && year < minDate.year) {
			year = minDate.year;
			month = 1;
		} else if (maxDate && year > maxDate.year) {
			year = maxDate.year;
		}
	}

	if (isNaN(month) || month < 1 || month > 12) {
		month = initDate.month;
	} else {
		if (minDate && year <= minDate.year && month < minDate.month) {
			month = minDate.month;
			day = 1;
		} else if (maxDate && year >= maxDate.year && month > maxDate.month) {
			month = maxDate.month;
		}
	}

	if (isNaN(day) || day < 1) {
		day = initDate.day;
	} else {
		if (minDate && month <= minDate.month && day < minDate.day) {
			day = minDate.day;
		} else if (maxDate && month >= maxDate.month && day > maxDate.day) {
			day = maxDate.day;
		}
	}

	return {
		year,
		month,
		day
	};
};

export const normalizeMinMaxTime = (jdp: JalaliDatepicker, timeObj?: TimeObject | null, updateObj?: Partial<TimeObject> | null) => {
	const _timeObj = extend(timeObj || {}, updateObj || {});
	const initTime = jdp.initTime;
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

export const getValidYears = (jdp: JalaliDatepicker) => {
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

export const getValidMonths = (jdp: JalaliDatepicker) => {
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

export const isValidDate = (jdp: JalaliDatepicker, year: number, month: number, day: number) => {
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

export const isValidDateToday = (jdp: JalaliDatepicker) => isValidDate(jdp, jdp.today.year, jdp.today.month, jdp.today.day);

export const isValidValueString = (jdp: JalaliDatepicker, str: string) => {
	if (!str) {
		return false;
	}
	const sepOpt = jdp.options.separatorChars;
	const datePattern = jdp.options.date ? `\\d{4}${sepOpt.date}\\d{2}${sepOpt.date}\\d{2}` : "";
	const timePattern = jdp.options.time ? `\\d{2}${sepOpt.time}\\d{2}` + (jdp.options.hasSecond ? `${sepOpt.time}\\d{2}` : "") : "";
	const regex = new RegExp(datePattern + (datePattern && timePattern ? sepOpt.between : "") + timePattern, "g");

	return regex.test(str);
};

export const getValueObjectFromString = (jdp: JalaliDatepicker, str: string) => {
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

export const getDateValueStringFromValueObjectWithSep = (jdp: JalaliDatepicker, obj: Partial<ValueObject>, forTarget?: boolean) => {
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

export const getDateValueStringFromValueObject = (jdp: JalaliDatepicker, obj: DateObject) => getDateValueStringFromValueObjectWithSep(jdp, obj);

export const getValueStringFromValueObject = (jdp: JalaliDatepicker, obj: ValueObject) => getDateValueStringFromValueObjectWithSep(jdp, obj);

export const isValidDateString = (jdp: JalaliDatepicker, str: string) => {
	if (!str) {
		return false;
	}
	const date = str.substr(0, 10).split(jdp.options.separatorChars.date);
	return date.length === 3 && date[0].length === 4 && date[1].length === 2 && date[2].length === 2;
};

export const isValidTimeString = (jdp: JalaliDatepicker, str: string) => {
	if (!str) {
		return false;
	}

	const time = str.substr(jdp.options.date ? 11 : 0, 8).split(jdp.options.separatorChars.time);
	return time.length === (jdp.options.hasSecond ? 3 : 2) && !time.find((t) => t.toString().length !== 2);
};

export const getConvertedValue = (jdp: JalaliDatepicker) => {
	const value = jdp.input?.value;
	if (!value) {
		return "";
	}
	if (jdp.options.targetValueType) {
		const normalValue = getValueObjectFromString(jdp, value);
		if (jdp.options.targetValueType === "miladi") {
			const miladiValue = toMiladi(normalValue.year, normalValue.month, normalValue.day);
			return getDateValueStringFromValueObjectWithSep(jdp, extend(normalValue, miladiValue), true);
		}
	}

	return value;
};
