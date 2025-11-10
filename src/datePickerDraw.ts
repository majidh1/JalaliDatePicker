import {
	YEARS_ELM_QUERY,
	YEAR_ELM_QUERY,
	MONTHS_ELM_QUERY,
	MONTH_ELM_QUERY,
	DAYS_ELM_QUERY,
	DAYS_HEADER_ELM_QUERY,
	DAY_ELM_QUERY,
	DAY_NOTINMONTH_ELM_QUERY,
	DAY_DISABLED_ELM_QUERY,
	DAY_DISABLED_NOTINMONTH_ELM_QUERY,
	DAY_NAME_ELM_QUERY,
	PLUS_ICON_ELM_QUERY,
	MINUS_ICON_ELM_QUERY,
	EVENT_CHANGE_MONTH_DROPDOWN_STR,
	EVENT_CLICK_STR,
	EVENT_CHANGE_YEAR_INPUT_STR,
	TODAY_CLASS_NAME,
	SELECTED_CLASS_NAME,
	LAST_WEEK_CLASS_NAME,
	HOLLY_DAY_CLASS_NAME,
	DISABLE_CLASS_NAME
} from "./constants";

import { getValidYears, getValidMonths, isValidDate } from "./utils";

import { extend, isFunction } from "./utils/object";

import { getDaysInMonth, getWeekDay } from "./utils/jalali";

import { createElement, toPersianDigitsIfNeeded } from "./utils/dom";
import { DayOptions, JalaliDatepicker } from "./models/types";

const getLastWeekClassIfNessesary = (dayOfWeek: number) =>
	dayOfWeek === 6 ? `.${LAST_WEEK_CLASS_NAME}.${HOLLY_DAY_CLASS_NAME}` : "";

const createElementPlusMinus = (
	jdp: JalaliDatepicker,
	container: string | HTMLElement,
	isYear: boolean,
	mode: "PLUS" | "MINUS"
) => {
	const isPlus = mode === "PLUS";
	let className = "";
	let event = null;
	const elmQuery = isPlus ? PLUS_ICON_ELM_QUERY : MINUS_ICON_ELM_QUERY;
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
	createElement(elmQuery + "." + className, container, EVENT_CLICK_STR, event, html);
};

const createElementPlus = (jdp: JalaliDatepicker, container: string | HTMLElement, isYear: boolean) => {
	createElementPlusMinus(jdp, container, isYear, "PLUS");
};
const createElementMinus = (jdp: JalaliDatepicker, container: string | HTMLElement, isYear: boolean) => {
	createElementPlusMinus(jdp, container, isYear, "MINUS");
};

const renderYear = (jdp: JalaliDatepicker) => {
	const yearsContainer = createElement(YEARS_ELM_QUERY, jdp.dpContainer);
	createElementPlus(jdp, yearsContainer, true);
	const yearContainer = createElement(YEAR_ELM_QUERY, yearsContainer);
	createElementMinus(jdp, yearsContainer, true);

	const useDropDownYears = jdp.options.useDropDownYears;
	const yearInputTagName = useDropDownYears ? "select" : "input";
	const yearInput = createElement(yearInputTagName, yearContainer, EVENT_CHANGE_YEAR_INPUT_STR, (e: any) => {
		if (e.target.value < 1000 || e.target.value > 2000) return;
		jdp.yearChange(e.target.value);
	}) as HTMLInputElement;
	if (useDropDownYears) {
		yearInput.setAttribute("tabindex", "-1");
		const validYears = getValidYears(jdp);
		for (let i = validYears.min; i <= validYears.max; i++) {
			const optionElm = createElement("option", yearInput) as HTMLOptionElement;
			optionElm.value = i.toString();
			optionElm.text = toPersianDigitsIfNeeded(i, jdp.options.persianDigits).toString();
			optionElm.selected = i === jdp.initDate.year;
		}
	} else {
		yearInput.tabIndex = -1;
		yearInput.value = jdp.initDate.year.toString();
		yearInput.type = "number";
	}
};

const renderMonths = (jdp: JalaliDatepicker) => {
	const monthsContainer = createElement(MONTHS_ELM_QUERY, jdp.dpContainer);
	createElementPlus(jdp, monthsContainer, false);
	const monthContainer = createElement(MONTH_ELM_QUERY, monthsContainer);
	createElementMinus(jdp, monthsContainer, false);

	const monthDropDownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, (e: any) => {
		jdp.monthChange(parseFloat(e.target.value));
	});
	monthDropDownContainer.tabIndex = -1;

	const months = getValidMonths(jdp);
	const monthsName = jdp.options.months;
	for (let i = 0; i < months.length; i++) {
		const optionElm = createElement("option", monthDropDownContainer) as HTMLOptionElement;
		optionElm.value = months[i].toString();
		optionElm.text = toPersianDigitsIfNeeded(monthsName[months[i] - 1], jdp.options.persianDigits).toString();
		optionElm.selected = months[i] === jdp.initDate.month;
	}
};

const renderDays = (jdp: JalaliDatepicker) => {
	const daysHeaderContainer = createElement(DAYS_HEADER_ELM_QUERY, jdp.dpContainer);
	const daysContainer = createElement(DAYS_ELM_QUERY, jdp.dpContainer);
	for (let i = 0; i < 7; i++) {
		//nameOfDay
		createElement(
			DAY_NAME_ELM_QUERY + getLastWeekClassIfNessesary(i),
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
	const beforeMonthDays =
		dayOptions.month === 1
			? getDaysInMonth(dayOptions.year - 1, beforeMonthNumber)
			: getDaysInMonth(dayOptions.year, beforeMonthNumber);
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
		dayOptions.className = getLastWeekClassIfNessesary(getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day));

		if (
			jdp.inputValue.day === dayOptions.day &&
			jdp.inputValue.year === dayOptions.year &&
			jdp.inputValue.month === dayOptions.month
		) {
			dayOptions.className += `.${SELECTED_CLASS_NAME}`;
		}
		if (
			jdp.today.day === dayOptions.day &&
			jdp.today.year === dayOptions.year &&
			jdp.today.month === dayOptions.month
		) {
			dayOptions.className += `.${TODAY_CLASS_NAME}`;
		}

		if (isFunction(jdp.options.dayRendering)) {
			extend(dayOptions, jdp.options.dayRendering(dayOptions, jdp.input));
		}
		if (dayOptions.isHollyDay) {
			dayOptions.className += `.${HOLLY_DAY_CLASS_NAME}`;
		}

		let query = dayOptions.isValid ? DAY_ELM_QUERY : DAY_DISABLED_ELM_QUERY;

		if (dayOptions.inBeforeMonth || dayOptions.inAfterMonth) {
			query = DAY_NOTINMONTH_ELM_QUERY;

			if (!dayOptions.isValid) {
				query = DAY_DISABLED_NOTINMONTH_ELM_QUERY;
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

export const renderDatePicker = (jdp: JalaliDatepicker) => {
	renderYear(jdp);
	renderMonths(jdp);
	renderDays(jdp);
};
