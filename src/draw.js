import {
    EVENT_CLICK_STR,
    FOOTER_ELM_QUERY,
    TODAY_BTN_ELM_QUERY,
    EMPTY_BTN_ELM_QUERY
} from "./constants";

import {
    isValidDateToday
} from "./utils";

import {
    createElement,
    setInnerHTML
} from "./utils/dom";

import {
    renderTimePicker
} from "./timePickerDraw";
import {
    renderDatePicker
} from "./datePickerDraw";

const renderFooter = (jdp) => {
    const footerContainer = createElement(FOOTER_ELM_QUERY, jdp.dpContainer);
    if (jdp.options.showTodayBtn) {
        const isActiveToday = isValidDateToday(jdp);
        createElement(TODAY_BTN_ELM_QUERY + (isActiveToday ? "" : ".disabled-btn"), footerContainer, EVENT_CLICK_STR, () => {
            isActiveToday && jdp.setValue(jdp.today);
        }, "امروز");
    }
    if (jdp.options.showEmptyBtn) {
        createElement(EMPTY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => {
            jdp.input.value = "";
        }, "خالی");
    }
};
export const render = (jdp) => {
    setInnerHTML(jdp.dpContainer, "");
    if (jdp.options.date) {
        renderDatePicker(jdp);
    }
    if (jdp.options.time) {
        renderTimePicker(jdp);
    }
    if (jdp.options.date) {
        renderFooter(jdp);
    }
};

export default function () {
    render(this);
}