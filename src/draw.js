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
    DISABLE_CLASS_NAME,
    FOOTER_ELM_QUERY,
    TODAY_BTN_ELM_QUERY,
    EMPTY_BTN_ELM_QUERY
} from "./constants";

import {
    createElement,
    setInnerHTML,
    getDaysInMonth,
    getWeekDay,
    getValidYears,
    getValidMonths,
    isValidDate,
    isValidDateToday
} from "./utils";

const getLastWeekClassIfNessesary = (dayOfWeek) => {
    return dayOfWeek === 6 ? `.${LAST_WEEK_CLASS_NAME}` : "";
};
const createElementPlus = (container, isYear) => {
    createElement(PLUS_ICON_ELM_QUERY + (isYear ? (jdp.options.maxDate.year === jdp.initDate.year ? `.${DISABLE_CLASS_NAME}` : "") : (jdp.options.maxDate.year === jdp.initDate.year && jdp.options.maxDate.month === jdp.initDate.month ? `.${DISABLE_CLASS_NAME}` : "")), container, EVENT_CLICK_STR, isYear ? () => {
        jdp.increaseYear();
    } : () => {
        jdp.increaseMonth();
    }, jdp.options.plusHtml);
};
const createElementMinus = (container, isYear) => {
    createElement(MINUS_ICON_ELM_QUERY + (isYear ? (jdp.options.minDate.year === jdp.initDate.year ? `.${DISABLE_CLASS_NAME}` : "") : (jdp.options.minDate.year === jdp.initDate.year && jdp.options.minDate.month === jdp.initDate.month ? `.${DISABLE_CLASS_NAME}` : "")), container, EVENT_CLICK_STR, isYear ? () => {
        jdp.decreaseYear();
    } : () => {
        jdp.decreaseMonth();
    }, jdp.options.minusHtml);
};

const render = () => {
    setInnerHTML(jdp.dpContainer, "");
    renderYear();
    renderMonths();
    renderDays();
    renderFooterBtns();
};

const renderYear = () => {
    const yearsContainer = createElement(YEARS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(yearsContainer, true);
    const yearContainer = createElement(YEAR_ELM_QUERY, yearsContainer);
    createElementMinus(yearsContainer, true);

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
            optionElm.text = i;
            optionElm.selected = i === jdp.initDate.year;
        }
    } else {
        yearInput.tabIndex = -1;
        yearInput.value = jdp.initDate.year;
        yearInput.type = "number";
    }
};

const renderMonths = () => {
    const monthsContainer = createElement(MONTHS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(monthsContainer, false);
    const monthContainer = createElement(MONTH_ELM_QUERY, monthsContainer);
    createElementMinus(monthsContainer, false);

    const monthDropDownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, (e) => {
        jdp.monthChange(e.target.value);
    });
    monthDropDownContainer.tabIndex = -1;

    const months = getValidMonths(jdp);
    const monthsName = jdp.options.months;
    for (let i = 0; i < months.length; i++) {
        const optionElm = createElement("option", monthDropDownContainer);
        optionElm.value = months[i];
        optionElm.text = monthsName[months[i] - 1];
        optionElm.selected = months[i] === jdp.initDate.month;
    }
};

const renderDays = () => {
    const daysContainer = createElement(DAYS_ELM_QUERY, jdp.dpContainer);
    for (let i = 0; i < 7; i++) { //nameOfDay
        createElement(DAY_NAME_ELM_QUERY + getLastWeekClassIfNessesary(i), daysContainer, null, null, jdp.options.days[i]);
    }
    let dayInMonth = 1;

    const daysInMonth = getDaysInMonth(jdp.initDate.year, jdp.initDate.month);
    const firstWeekDay = getWeekDay(jdp.initDate.year, jdp.initDate.month, 1);
    const maxDaysInCalendar = 7 * (Math.ceil((firstWeekDay + daysInMonth) / 7)) - 1;
    const beforeMonthNumber = jdp.initDate.month == 1 ? 12 : jdp.initDate.month - 1;
    const afterMonthNumber = jdp.initDate.month == 12 ? 1 : jdp.initDate.month + 1;
    const beforeMonthYearNumber = beforeMonthNumber == 12 ? jdp.initDate.year - 1 : jdp.initDate.year;
    const afterMonthYearNumber = afterMonthNumber == 1 ? jdp.initDate.year + 1 : jdp.initDate.year;
    const beforeMonthDays = jdp.initDate.month == 1 ? getDaysInMonth(jdp.initDate.year - 1, beforeMonthNumber) : getDaysInMonth(jdp.initDate.year, beforeMonthNumber);
    const startWeekDayInMonth = getWeekDay(jdp.initDate.year, jdp.initDate.month, dayInMonth);
    let beforeDayInMonth = beforeMonthDays - startWeekDayInMonth;
    let afterDayInMonth = 0;

    for (let i = 0; i <= maxDaysInCalendar; i++) {
        const isBeforeDayInMonth = dayInMonth <= startWeekDayInMonth && i < startWeekDayInMonth;
        const isAfterDayInMonth = dayInMonth > daysInMonth;
        let weekDay = getWeekDay(jdp.initDate.year, jdp.initDate.month, dayInMonth);
        let className = getLastWeekClassIfNessesary(weekDay);
        
        if (isBeforeDayInMonth || isAfterDayInMonth) {
            const yearNumber=isBeforeDayInMonth ? beforeMonthYearNumber : afterMonthYearNumber;
            const monthNumber=isBeforeDayInMonth ? beforeMonthNumber : afterMonthNumber;
            let dayValue = 0;
            if (isBeforeDayInMonth) {
                beforeDayInMonth++;
                dayValue = beforeDayInMonth;
            } else {
                afterDayInMonth++;
                dayValue = afterDayInMonth;
            }
            weekDay = getWeekDay(yearNumber, monthNumber, dayValue);
            className = getLastWeekClassIfNessesary(weekDay);
            const validDay = isValidDate(jdp, yearNumber, monthNumber,dayValue);

            const dayContainer = createElement(validDay ? DAY_NOTINMONTH_ELM_QUERY+className : DAY_DISABLED_NOTINMONTH_ELM_QUERY+className, daysContainer, null, null, dayValue);
            if (validDay) {
                dayContainer.addEventListener(EVENT_CLICK_STR, () => {
                    jdp.setValue(yearNumber, monthNumber, dayValue);
                });
            }
            continue;
        }
        if (!isValidDate(jdp, jdp.initDate.year, jdp.initDate.month,dayInMonth)) {
            createElement(DAY_DISABLED_ELM_QUERY+className, daysContainer, null, null, dayInMonth);
            dayInMonth += 1;
            continue;
        }

        if (jdp.valueDate.day === dayInMonth &&
            jdp.valueDate.year === jdp.initDate.year &&
            jdp.valueDate.month === jdp.initDate.month) {
            className += `.${SELECTED_CLASS_NAME}`;
        }
        if (jdp.today.day === dayInMonth &&
            jdp.today.year === jdp.initDate.year &&
            jdp.today.month === jdp.initDate.month) {
            className += `.${TODAY_CLASS_NAME}`;
        }
        const dayContainer = createElement(DAY_ELM_QUERY + className, daysContainer, null, null, dayInMonth);
        dayContainer.day = dayInMonth;
        dayContainer.addEventListener(EVENT_CLICK_STR, () => {
            jdp.setValue(jdp.initDate.year, jdp.initDate.month, dayContainer.day);
        });

        dayInMonth += 1;
    }
};

const renderFooterBtns = () => {
    const footerContainer = createElement(FOOTER_ELM_QUERY, jdp.dpContainer);
    if (jdp.options.showTodayBtn) {
        const isActiveToday=isValidDateToday(jdp);
        createElement(TODAY_BTN_ELM_QUERY +(isActiveToday ? "":".disabled-btn"), footerContainer, EVENT_CLICK_STR, () => {
            isActiveToday&&jdp.setValue(jdp.today.year, jdp.today.month, jdp.today.day);
        }, "امروز");
    }
    if (jdp.options.showEmptyBtn) {
        createElement(EMPTY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => {
            jdp.setValue();
        }, "خالی");
    }
};

let jdp = null;
export default function () {
    jdp = this;

    render();
}