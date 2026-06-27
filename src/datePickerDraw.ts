import {
	YEARS_ELEMENT_QUERY,
	YEAR_ELEMENT_QUERY,
	MONTHS_ELEMENT_QUERY,
	MONTH_ELEMENT_QUERY,
	DAYS_ELEMENT_QUERY,
	DAYS_HEADER_ELEMENT_QUERY,
	DAY_ELEMENT_QUERY,
	DAY_NOT_IN_MONTH_ELEMENT_QUERY,
	DAY_DISABLED_ELEMENT_QUERY,
	DAY_DISABLED_NOT_IN_MONTH_ELEMENT_QUERY,
	DAY_NAME_ELEMENT_QUERY,
	PLUS_ICON_ELEMENT_QUERY,
	MINUS_ICON_ELEMENT_QUERY,
	EVENT_CHANGE_MONTH_DROPDOWN_STR,
	EVENT_CLICK_STR,
	EVENT_CHANGE_YEAR_INPUT_STR,
	TODAY_CLASS_NAME,
	SELECTED_CLASS_NAME,
	LAST_WEEK_CLASS_NAME,
	HOLIDAY_CLASS_NAME,
	DISABLE_CLASS_NAME
} from "./constants";

import { getValidYears, getValidMonths, isValidDate } from "./utils";

import { extend, isFunction } from "./utils/object";

import { getDaysInMonth, getWeekDay } from "./utils/jalali";

import { createElement, toPersianDigitsIfNeeded } from "./utils/dom";
import { DayOptions, JalaliDatePicker } from "./models/types";

const getLastWeekClassIfNecessary = (dayOfWeek: number) => (dayOfWeek === 6 ? `.${LAST_WEEK_CLASS_NAME}.${HOLIDAY_CLASS_NAME}` : "");

const createElementPlusMinus = (jdp: JalaliDatePicker, container: string | HTMLElement, isYear: boolean, mode: "PLUS" | "MINUS") => {
	const isPlus = mode === "PLUS";
	let className = "";
	let event = null;
	const elementQuery = isPlus ? PLUS_ICON_ELEMENT_QUERY : MINUS_ICON_ELEMENT_QUERY;
	const isMaxYear = isPlus && jdp.options.maxDate?.year === jdp.initDate.year;
	const isMaxMonth = isPlus && jdp.options.maxDate?.month === jdp.initDate.month;
	const isMinYear = !isPlus && jdp.options.minDate?.year === jdp.initDate.year;
	const isMinMonth = !isPlus && jdp.options.minDate?.month === jdp.initDate.month;
	const html = isPlus ? jdp.options.plusHtml : jdp.options.minusHtml;

	if (isYear) {
		if (isPlus)
			event = () => {
				jdp.increaseYear();
			};
		else
			event = () => {
				jdp.decreaseYear();
			};
		if (isMaxYear || isMinYear) {
			className = DISABLE_CLASS_NAME;
		}
	} else {
		if (isPlus)
			event = () => {
				jdp.increaseMonth();
			};
		else
			event = () => {
				jdp.decreaseMonth();
			};
		if ((isMaxYear && isMaxMonth) || (isMinYear && isMinMonth)) {
			className = DISABLE_CLASS_NAME;
		}
	}
	createElement(elementQuery + "." + className, container, EVENT_CLICK_STR, event, html, "html");
};

const createElementPlus = (jdp: JalaliDatePicker, container: string | HTMLElement, isYear: boolean) => {
	createElementPlusMinus(jdp, container, isYear, "PLUS");
};
const createElementMinus = (jdp: JalaliDatePicker, container: string | HTMLElement, isYear: boolean) => {
	createElementPlusMinus(jdp, container, isYear, "MINUS");
};

const getInputValue = (event: Event) => (event.target as HTMLInputElement | HTMLSelectElement).value;

const renderYear = (jdp: JalaliDatePicker) => {
	const yearsContainer = createElement(YEARS_ELEMENT_QUERY, jdp.dpContainer);
	createElementPlus(jdp, yearsContainer, true);
	const yearContainer = createElement(YEAR_ELEMENT_QUERY, yearsContainer);
	createElementMinus(jdp, yearsContainer, true);

	const useDropdownYears = jdp.options.useDropdownYears ?? jdp.options.useDropDownYears;
	const yearInputTagName = useDropdownYears ? "select" : "input";
	const yearInput = createElement(yearInputTagName, yearContainer, EVENT_CHANGE_YEAR_INPUT_STR, (event) => {
		const year = Number(getInputValue(event));
		if (year < 1000 || year > 2000) return;
		jdp.yearChange(year);
	}) as HTMLInputElement;
	if (useDropdownYears) {
		yearInput.setAttribute("tabindex", "-1");
		const validYears = getValidYears(jdp);
		for (let i = validYears.min; i <= validYears.max; i++) {
			const optionElement = createElement("option", yearInput) as HTMLOptionElement;
			optionElement.value = i.toString();
			optionElement.text = toPersianDigitsIfNeeded(i, jdp.options.persianDigits).toString();
			optionElement.selected = i === jdp.initDate.year;
		}
	} else {
		yearInput.tabIndex = -1;
		yearInput.value = jdp.initDate.year.toString();
		yearInput.type = "number";
	}
};

const renderMonths = (jdp: JalaliDatePicker) => {
	const monthsContainer = createElement(MONTHS_ELEMENT_QUERY, jdp.dpContainer);
	createElementPlus(jdp, monthsContainer, false);
	const monthContainer = createElement(MONTH_ELEMENT_QUERY, monthsContainer);
	createElementMinus(jdp, monthsContainer, false);

	const monthDropdownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, (event) => {
		jdp.monthChange(Number(getInputValue(event)));
	});
	monthDropdownContainer.tabIndex = -1;

	const months = getValidMonths(jdp);
	const monthsName = jdp.options.months;
	for (let i = 0; i < months.length; i++) {
		const optionElement = createElement("option", monthDropdownContainer) as HTMLOptionElement;
		optionElement.value = months[i].toString();
		optionElement.text = toPersianDigitsIfNeeded(monthsName[months[i] - 1], jdp.options.persianDigits).toString();
		optionElement.selected = months[i] === jdp.initDate.month;
	}
};

const renderDays = (jdp: JalaliDatePicker) => {
	const daysHeaderContainer = createElement(DAYS_HEADER_ELEMENT_QUERY, jdp.dpContainer);
	const daysContainer = createElement(DAYS_ELEMENT_QUERY, jdp.dpContainer);
	for (let i = 0; i < 7; i++) {
		//nameOfDay
		createElement(
			DAY_NAME_ELEMENT_QUERY + getLastWeekClassIfNecessary(i),
			daysHeaderContainer,
			undefined,
			undefined,
			toPersianDigitsIfNeeded(jdp.options.days[i], jdp.options.persianDigits).toString()
		);
	}
	const setDefaultOptions = (opt: Partial<DayOptions>) => {
		if (!opt.day || opt.inBeforeMonth) {
			opt.day = 1;
		} else {
			opt.day += 1;
		}
		opt.inBeforeMonth = false;
		opt.inAfterMonth = false;
		opt.isValid = false;
		opt.isHoliday = false;
		opt.isHollyDay = false;
		opt.className = "";
		opt.year = jdp.initDate.year;
		opt.month = jdp.initDate.month;
		opt.weekDay = getWeekDay(opt.year, opt.month, opt.day);

		return opt as DayOptions;
	};

	const dayOptions = setDefaultOptions({});

	const daysInMonth = getDaysInMonth(dayOptions.year, dayOptions.month);
	const startWeekDayInMonth = dayOptions.weekDay;
	const maxDaysInCalendar = 7 * Math.ceil((startWeekDayInMonth + daysInMonth) / 7) - 1;
	const beforeMonthNumber = dayOptions.month === 1 ? 12 : dayOptions.month - 1;
	const afterMonthNumber = dayOptions.month === 12 ? 1 : dayOptions.month + 1;
	const beforeMonthYearNumber = beforeMonthNumber === 12 ? dayOptions.year - 1 : dayOptions.year;
	const afterMonthYearNumber = afterMonthNumber === 1 ? dayOptions.year + 1 : dayOptions.year;
	const beforeMonthDays = dayOptions.month === 1 ? getDaysInMonth(dayOptions.year - 1, beforeMonthNumber) : getDaysInMonth(dayOptions.year, beforeMonthNumber);
	let beforeDayInMonth = beforeMonthDays - startWeekDayInMonth;
	let afterDayInMonth = 0;

	for (let i = 0; i <= maxDaysInCalendar; i++) {
		dayOptions.inBeforeMonth = dayOptions.day <= startWeekDayInMonth && i < startWeekDayInMonth;
		dayOptions.inAfterMonth = i >= daysInMonth + startWeekDayInMonth;
		if (dayOptions.inBeforeMonth || dayOptions.inAfterMonth) {
			if (dayOptions.inBeforeMonth) {
				beforeDayInMonth++;
				dayOptions.day = beforeDayInMonth;
				dayOptions.year = beforeMonthYearNumber;
				dayOptions.month = beforeMonthNumber;
			} else {
				afterDayInMonth++;
				dayOptions.day = afterDayInMonth;
				dayOptions.year = afterMonthYearNumber;
				dayOptions.month = afterMonthNumber;
			}
			dayOptions.weekDay = getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day);
		}

		dayOptions.isValid = isValidDate(jdp, dayOptions.year, dayOptions.month, dayOptions.day);
		dayOptions.className = getLastWeekClassIfNecessary(getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day));

		if (jdp.inputValue.day === dayOptions.day && jdp.inputValue.year === dayOptions.year && jdp.inputValue.month === dayOptions.month) {
			dayOptions.className += `.${SELECTED_CLASS_NAME}`;
		}
		if (jdp.today.day === dayOptions.day && jdp.today.year === dayOptions.year && jdp.today.month === dayOptions.month) {
			dayOptions.className += `.${TODAY_CLASS_NAME}`;
		}

		if (isFunction(jdp.options.dayRendering)) {
			extend(dayOptions, jdp.options.dayRendering(dayOptions, jdp.input));
		}
		if (dayOptions.isHoliday || dayOptions.isHollyDay) {
			dayOptions.className += `.${HOLIDAY_CLASS_NAME}`;
		}

		let query = dayOptions.isValid ? DAY_ELEMENT_QUERY : DAY_DISABLED_ELEMENT_QUERY;

		if (dayOptions.inBeforeMonth || dayOptions.inAfterMonth) {
			query = DAY_NOT_IN_MONTH_ELEMENT_QUERY;

			if (!dayOptions.isValid) {
				query = DAY_DISABLED_NOT_IN_MONTH_ELEMENT_QUERY;
			}
		}

		const dayContainer = createElement(
			query + dayOptions.className,
			daysContainer,
			undefined,
			undefined,
			toPersianDigitsIfNeeded(dayOptions.day, jdp.options.persianDigits).toString()
		) as HTMLElement & { day: number; month: number; year: number };
		dayContainer.day = dayOptions.day;
		dayContainer.month = dayOptions.month;
		dayContainer.year = dayOptions.year;

		if (dayOptions.isValid) {
			dayContainer.addEventListener(EVENT_CLICK_STR, () => {
				jdp.setValue({
					year: dayContainer.year,
					month: dayContainer.month,
					day: dayContainer.day
				});
			});
		}

		setDefaultOptions(dayOptions);
	}
};

export const renderDatePicker = (jdp: JalaliDatePicker) => {
	renderYear(jdp);
	renderMonths(jdp);
	renderDays(jdp);
};
