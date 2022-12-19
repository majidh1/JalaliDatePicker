import {
    YEARS_ELM_QUERY,
    YEAR_ELM_QUERY,
    MONTHS_ELM_QUERY,
    MONTH_ELM_QUERY,
    DAYS_ELM_QUERY,
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

import {
    getValidYears,
    getValidMonths,
    isValidDate
} from "./utils";

import {
    extend,
    isFunction
} from "./utils/object";

import {
    getDaysInMonth,
    getWeekDay
} from "./utils/jalali";

import {
    createElement, toPersianDigitsIfNeeded
} from "./utils/dom";

const getLastWeekClassIfNessesary = (dayOfWeek) => {
    return dayOfWeek === 6 ? `.${LAST_WEEK_CLASS_NAME}.${HOLLY_DAY_CLASS_NAME}` : "";
};
const createElementPlus = (jdp, container, isYear) => {
    createElement(PLUS_ICON_ELM_QUERY + (isYear ? (jdp.options.maxDate.year === jdp.initDate.year ? `.${DISABLE_CLASS_NAME}` : "") : (jdp.options.maxDate.year === jdp.initDate.year && jdp.options.maxDate.month === jdp.initDate.month ? `.${DISABLE_CLASS_NAME}` : "")), container, EVENT_CLICK_STR, isYear ? () => {
        jdp.increaseYear();
    } : () => {
        jdp.increaseMonth();
    }, jdp.options.plusHtml);
};
const createElementMinus = (jdp, container, isYear) => {
    createElement(MINUS_ICON_ELM_QUERY + (isYear ? (jdp.options.minDate.year === jdp.initDate.year ? `.${DISABLE_CLASS_NAME}` : "") : (jdp.options.minDate.year === jdp.initDate.year && jdp.options.minDate.month === jdp.initDate.month ? `.${DISABLE_CLASS_NAME}` : "")), container, EVENT_CLICK_STR, isYear ? () => {
        jdp.decreaseYear();
    } : () => {
        jdp.decreaseMonth();
    }, jdp.options.minusHtml);
};

const renderYear = (jdp) => {
    const yearsContainer = createElement(YEARS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(jdp, yearsContainer, true);
    const yearContainer = createElement(YEAR_ELM_QUERY, yearsContainer);
    createElementMinus(jdp, yearsContainer, true);

    const useDropDownYears = jdp.options.useDropDownYears;
    const yearInputTagName = useDropDownYears ? "select" : "input";
    const yearInput = createElement(yearInputTagName, yearContainer, EVENT_CHANGE_YEAR_INPUT_STR, (e) => {
        if (e.target.value < 1000 || e.target.value > 2000) return;
        jdp.yearChange(e.target.value);
    });
    if (useDropDownYears) {
        const validYears = getValidYears(jdp);
        for (let i = validYears.min; i <= validYears.max; i++) {
            const optionElm = createElement("option", yearInput);
            optionElm.value = i;
            optionElm.text = toPersianDigitsIfNeeded(i, jdp.options.persianDigits);
            optionElm.selected = i === jdp.initDate.year;
        }
    } else {
        yearInput.tabIndex = -1;
        yearInput.value = jdp.initDate.year;
        yearInput.type = "number";
    }
};

const renderMonths = (jdp) => {
    const monthsContainer = createElement(MONTHS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(jdp, monthsContainer, false);
    const monthContainer = createElement(MONTH_ELM_QUERY, monthsContainer);
    createElementMinus(jdp, monthsContainer, false);

    const monthDropDownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, (e) => {
        jdp.monthChange(e.target.value);
    });
    monthDropDownContainer.tabIndex = -1;

    const months = getValidMonths(jdp);
    const monthsName = jdp.options.months;
    for (let i = 0; i < months.length; i++) {
        const optionElm = createElement("option", monthDropDownContainer);
        optionElm.value = months[i];
        optionElm.text = toPersianDigitsIfNeeded(monthsName[months[i] - 1], jdp.options.persianDigits);
        optionElm.selected = months[i] === jdp.initDate.month;
    }
};

const renderDays = (jdp) => {
    const daysContainer = createElement(DAYS_ELM_QUERY, jdp.dpContainer);
    for (let i = 0; i < 7; i++) { //nameOfDay
        createElement(DAY_NAME_ELM_QUERY + getLastWeekClassIfNessesary(i), daysContainer, null, null, toPersianDigitsIfNeeded(jdp.options.days[i], jdp.options.persianDigits));
    }
    const setDefaultOptions = (opt) => {
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

        return opt;
    };

    const dayOptions = setDefaultOptions({});

    const daysInMonth = getDaysInMonth(dayOptions.year, dayOptions.month);
    const firstWeekDay = getWeekDay(dayOptions.year, dayOptions.month, 1);
    const maxDaysInCalendar = 7 * (Math.ceil((firstWeekDay + daysInMonth) / 7)) - 1;
    const beforeMonthNumber = dayOptions.month == 1 ? 12 : dayOptions.month - 1;
    const afterMonthNumber = dayOptions.month == 12 ? 1 : dayOptions.month + 1;
    const beforeMonthYearNumber = beforeMonthNumber == 12 ? dayOptions.year - 1 : dayOptions.year;
    const afterMonthYearNumber = afterMonthNumber == 1 ? dayOptions.year + 1 : dayOptions.year;
    const beforeMonthDays = dayOptions.month == 1 ? getDaysInMonth(dayOptions.year - 1, beforeMonthNumber) : getDaysInMonth(dayOptions.year, beforeMonthNumber);
    const startWeekDayInMonth = getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day);
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
        }

        dayOptions.isValid = isValidDate(jdp, dayOptions.year, dayOptions.month, dayOptions.day);
        dayOptions.className = getLastWeekClassIfNessesary(getWeekDay(dayOptions.year, dayOptions.month, dayOptions.day));
        
        if (jdp.inputValue.day === dayOptions.day &&
            jdp.inputValue.year === dayOptions.year &&
            jdp.inputValue.month === dayOptions.month) {
            dayOptions.className += `.${SELECTED_CLASS_NAME}`;
        }
        if (jdp.today.day === dayOptions.day &&
            jdp.today.year === dayOptions.year &&
            jdp.today.month === dayOptions.month) {
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

        const dayContainer = createElement(query + dayOptions.className, daysContainer, null, null, toPersianDigitsIfNeeded(dayOptions.day, jdp.options.persianDigits));
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

export const renderDatePicker = (jdp) => {
    renderYear(jdp);
    renderMonths(jdp);
    renderDays(jdp);
};