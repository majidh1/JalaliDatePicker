import { describe, expect, it } from "vitest";

import { JalaliDatePicker, TimeObject } from "../models/types";
import {
	getConvertedValue,
	getValueObjectFromString,
	getValueStringFromValueObject,
	isValidDate,
	isValidTimeString,
	isValidValueString,
	normalizeMinMaxDate,
	normalizeMinMaxTime
} from ".";
import { getDaysInMonth, toJalali, toGregorian } from "./jalali";

const createOptions = (overrides: Partial<JalaliDatePicker["options"]> = {}): JalaliDatePicker["options"] =>
	({
		date: true,
		time: true,
		hasSecond: true,
		separatorChars: {
			date: "/",
			between: " ",
			time: ":",
			targetDate: "-",
			targetBetween: " ",
			targetTime: ":"
		},
		today: {
			year: 1403,
			month: 1,
			day: 1
		},
		update: () => {
			//
		},
		...overrides
	}) as JalaliDatePicker["options"];

const createJdp = (overrides: Partial<JalaliDatePicker> = {}): JalaliDatePicker =>
	({
		options: createOptions(),
		today: {
			year: 1403,
			month: 1,
			day: 1
		},
		_initDate: {
			year: 1403,
			month: 1,
			day: 1
		},
		_initTime: {
			hour: 8,
			minute: 30,
			second: 0
		},
		input: null,
		...overrides
	}) as JalaliDatePicker;

describe("jalali date utilities", () => {
	it("converts between Gregorian and Jalali dates", () => {
		expect(toJalali(2024, 3, 20)).toEqual({
			year: 1403,
			month: 1,
			day: 1
		});
		expect(toGregorian(1403, 1, 1)).toEqual({
			year: 2024,
			month: 3,
			day: 20
		});
	});

	it("calculates leap-month day counts", () => {
		expect(getDaysInMonth(1403, 12)).toBe(30);
		expect(getDaysInMonth(1404, 12)).toBe(29);
	});
});

describe("value parsing and formatting", () => {
	it("parses and formats date-time values using configured separators", () => {
		const jdp = createJdp();

		expect(isValidValueString(jdp, "1403/01/09 08:05:03")).toBe(true);
		expect(isValidValueString(jdp, "x1403/01/09 08:05:03")).toBe(false);
		expect(isValidValueString(jdp, "1403/1/9 08:05:03")).toBe(false);
		expect(isValidValueString(jdp, "")).toBe(false);
		expect(isValidTimeString(jdp, "1403/01/09 08:05:03")).toBe(true);
		expect(getValueObjectFromString(jdp, "1403/01/09 08:05:03")).toEqual({
			year: 1403,
			month: 1,
			day: 9,
			hour: 8,
			minute: 5,
			second: 3
		});
		expect(
			getValueStringFromValueObject(jdp, {
				year: 1403,
				month: 1,
				day: 9,
				hour: 8,
				minute: 5,
				second: 3
			})
		).toBe("1403/01/09 08:05:03");
	});

	it("validates and parses values with regex-special separator characters", () => {
		const jdp = createJdp({
			options: createOptions({
				separatorChars: {
					date: "+",
					between: "-",
					time: ":",
					targetDate: "-",
					targetBetween: " ",
					targetTime: ":"
				}
			})
		});

		expect(isValidValueString(jdp, "1403+01+09-08:05:03")).toBe(true);
		expect(isValidValueString(jdp, "1403/01/09 08:05:03")).toBe(false);
		expect(getValueObjectFromString(jdp, "1403+01+09-08:05:03")).toEqual({
			year: 1403,
			month: 1,
			day: 9,
			hour: 8,
			minute: 5,
			second: 3
		});
		expect(
			getValueStringFromValueObject(jdp, {
				year: 1403,
				month: 1,
				day: 9,
				hour: 8,
				minute: 5,
				second: 3
			})
		).toBe("1403+01+09-08:05:03");
	});

	it("parses values when date and between separators are the same", () => {
		const jdp = createJdp({
			options: createOptions({
				separatorChars: {
					date: "-",
					between: "-",
					time: ":",
					targetDate: "-",
					targetBetween: " ",
					targetTime: ":"
				}
			})
		});

		expect(isValidValueString(jdp, "1403-01-09-08:05:03")).toBe(true);
		expect(isValidTimeString(jdp, "1403-01-09-08:05:03")).toBe(true);
		expect(getValueObjectFromString(jdp, "1403-01-09-08:05:03")).toEqual({
			year: 1403,
			month: 1,
			day: 9,
			hour: 8,
			minute: 5,
			second: 3
		});
	});

	it("converts target values to Gregorian when requested", () => {
		const input = document.createElement("input");
		input.value = "1403/01/01 08:05:03";
		const jdp = createJdp({
			input,
			options: createOptions({
				targetValueType: "gregorian"
			})
		});

		expect(getConvertedValue(jdp)).toBe("2024-03-20 08:05:03");
	});
});

describe("min/max normalization", () => {
	it("clamps dates by full year-month-day value", () => {
		const jdp = createJdp({
			options: createOptions({
				minDate: {
					year: 1403,
					month: 2,
					day: 10
				},
				maxDate: {
					year: 1403,
					month: 4,
					day: 20
				}
			})
		});

		expect(normalizeMinMaxDate(jdp, { year: 1403, month: 1, day: 29 })).toEqual(jdp.options.minDate);
		expect(normalizeMinMaxDate(jdp, { year: 1403, month: 5, day: 1 })).toEqual(jdp.options.maxDate);
		expect(normalizeMinMaxDate(jdp, { year: 1403, month: 3, day: 15 })).toEqual({
			year: 1403,
			month: 3,
			day: 15
		});
	});

	it("clamps invalid days to the selected month length", () => {
		const jdp = createJdp();

		expect(normalizeMinMaxDate(jdp, { year: 1404, month: 12, day: 30 })).toEqual({
			year: 1404,
			month: 12,
			day: 29
		});
	});

	it("validates dates against configured boundaries", () => {
		const jdp = createJdp({
			options: createOptions({
				minDate: {
					year: 1403,
					month: 1,
					day: 10
				},
				maxDate: {
					year: 1403,
					month: 1,
					day: 20
				}
			})
		});

		expect(isValidDate(jdp, 1403, 1, 9)).toBe(false);
		expect(isValidDate(jdp, 1403, 1, 10)).toBe(true);
		expect(isValidDate(jdp, 1403, 1, 20)).toBe(true);
		expect(isValidDate(jdp, 1403, 1, 21)).toBe(false);
	});

	it("clamps times by min and max time", () => {
		const jdp = createJdp({
			options: createOptions({
				minTime: {
					hour: 9,
					minute: 15,
					second: 10
				},
				maxTime: {
					hour: 17,
					minute: 45,
					second: 50
				}
			})
		});

		expect(normalizeMinMaxTime(jdp, { hour: 8, minute: 30, second: 0 } as TimeObject)).toEqual({
			hour: 9,
			minute: 30,
			second: 0
		});
		expect(normalizeMinMaxTime(jdp, { hour: 18, minute: 50, second: 59 } as TimeObject)).toEqual({
			hour: 17,
			minute: 45,
			second: 50
		});
	});
});
