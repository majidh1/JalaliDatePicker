import {
    EVENT_CLICK_STR,
    FOOTER_ELM_QUERY,
    TODAY_BTN_ELM_QUERY,
    EMPTY_BTN_ELM_QUERY,
    CLOSE_BTN_ELM_QUERY,
    EVENT_CHANGE_INPUT_STR
} from "./constants";

import {
    isValidDateToday
} from "./utils";

import {
    createElement,
    setInnerHTML,
    triggerEvent
} from "./utils/dom";

import {
    renderTimePicker
} from "./timePickerDraw";
import {
    renderDatePicker
} from "./datePickerDraw";

const renderFooter = (jdp) => {
    const footerContainer = createElement(FOOTER_ELM_QUERY, jdp.dpContainer);
    if (jdp.options.showTodayBtn && jdp.options.date) {
        const isActiveToday = isValidDateToday(jdp);
        createElement(TODAY_BTN_ELM_QUERY + (isActiveToday ? "" : ".disabled-btn"), footerContainer, EVENT_CLICK_STR, () => {
            isActiveToday && jdp.setValue(jdp.today);
        }, "امروز");
    }
    if(!jdp.options.date && jdp.options.time && !jdp.input?.value){
        createElement(TODAY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => {
            jdp.setValue(jdp.initTime);
            jdp.hide();
        }, "انتخاب");
    }
    if (jdp.options.showEmptyBtn) {
        createElement(EMPTY_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => {
            jdp.input.value = "";
            triggerEvent(jdp.input, EVENT_CHANGE_INPUT_STR);
            if(jdp.options.hideAfterChange) jdp.hide();
        }, "خالی");
    }

    if (jdp.options.showCloseBtn) {
        createElement(CLOSE_BTN_ELM_QUERY, footerContainer, EVENT_CLICK_STR, () => {
            jdp.hide();
        }, "بستن");
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
    renderFooter(jdp);
};

export default function () {
    render(this);
}
