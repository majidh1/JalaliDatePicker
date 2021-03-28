import {
    YEARS_ELM_QUERY,
    YEAR_ELM_QUERY,
    MONTHS_ELM_QUERY,
    MONTH_ELM_QUERY,
    DAYS_ELM_QUERY,
    DAY_ELM_QUERY,
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
    getValidMonths,
    isValidDay
} from "./utils";

const getLastWeekClassIfNessesary = (dayOfWeek) => {
    return dayOfWeek === 6 ? `.${LAST_WEEK_CLASS_NAME}` : "";
};
const createElementPlus = (container, isYear) => {
    createElement(PLUS_ICON_ELM_QUERY + (isYear ? (jdp.options.maxDate.year === jdp.initDate.year ? `.${DISABLE_CLASS_NAME}` : "") : (jdp.options.maxDate.year === jdp.initDate.year && jdp.options.maxDate.month === jdp.initDate.month ? `.${DISABLE_CLASS_NAME}` : "")), container, EVENT_CLICK_STR, isYear ? () => { jdp.increaseYear(); } : () => { jdp.increaseMonth(); }, jdp.options.plusHtml);
};
const createElementMinus = (container, isYear) => {
    createElement(MINUS_ICON_ELM_QUERY + (isYear ? (jdp.options.minDate.year === jdp.initDate.year ? `.${DISABLE_CLASS_NAME}` : "") : (jdp.options.minDate.year === jdp.initDate.year && jdp.options.minDate.month === jdp.initDate.month ? `.${DISABLE_CLASS_NAME}` : "")), container, EVENT_CLICK_STR, isYear ? () => { jdp.decreaseYear(); } : () => { jdp.decreaseMonth(); }, jdp.options.minusHtml);
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

    const yearInputContainer = createElement("input", yearContainer, EVENT_CHANGE_YEAR_INPUT_STR, (e) => { jdp.yearChange(e.target.value); });
    yearInputContainer.tabIndex = -1;
    yearInputContainer.value = jdp.initDate.year;
    yearInputContainer.type = "number";
};

const renderMonths = () => {
    const monthsContainer = createElement(MONTHS_ELM_QUERY, jdp.dpContainer);
    createElementPlus(monthsContainer, false);
    const monthContainer = createElement(MONTH_ELM_QUERY, monthsContainer);
    createElementMinus(monthsContainer, false);

    const monthDropDownContainer = createElement("select", monthContainer, EVENT_CHANGE_MONTH_DROPDOWN_STR, (e) => { jdp.monthChange(e.target.value); });
    monthDropDownContainer.tabIndex = -1;

    const months = getValidMonths(jdp.initDate, jdp.options.minDate, jdp.options.maxDate);
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
    for (let i = 0; i < 7; i++) {
        createElement(DAY_NAME_ELM_QUERY + getLastWeekClassIfNessesary(i), daysContainer, null, null, jdp.options.days[i]);
    }

    const daysInMonth = getDaysInMonth(jdp.initDate.year, jdp.initDate.month);
    const firstWeekDay = getWeekDay(jdp.initDate.year, jdp.initDate.month, 1);
    const maxDaysInCalendar = 7 * (Math.ceil((firstWeekDay + daysInMonth) / 7)) - 1;
    let dayInMonth = 1;

    for (let i = 0; i <= maxDaysInCalendar; i++) {
        const weekDay = getWeekDay(jdp.initDate.year, jdp.initDate.month, dayInMonth);
        const validDay = isValidDay(jdp.initDate, dayInMonth, jdp.options.minDate, jdp.options.maxDate);

        if ((dayInMonth <= weekDay && i < weekDay) || dayInMonth > daysInMonth) {
            createElement(DAY_ELM_QUERY, daysContainer);
            continue;
        }
        if (!validDay) {
            createElement(DAY_ELM_QUERY, daysContainer);
            dayInMonth += 1;
            continue;
        }

        let className = getLastWeekClassIfNessesary(weekDay);

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
        createElement(TODAY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => { jdp.setValue(jdp.today.year, jdp.today.month, jdp.today.day); },"امروز");
    }
    if (jdp.options.showEmptyBtn) {
        createElement(EMPTY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => { jdp.setValue(); }, "خالی");
    }
};

let jdp = null;
export default function () {
    jdp = this;

    render();
}