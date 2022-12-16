import {
    FOOTER_TIME_ELM_QUERY,
    TIME_DROPDOWN_PARENT_ELM_QUERY,
    EVENT_CHANGE_TIME_DROPDOWN_STR
} from "./constants";

import {
    addLeadingZero
} from "./utils/object";

import {
    createElement, toPersianDigitsIfNeeded
} from "./utils/dom";

const getArrayNumbersStringTo = (count) => {
    const items = [];
    for (let i = 0; i < count; i++) items.push(addLeadingZero(i));
    return items;
};

const timeDropDownRender = (jdp, timePickerContainer, type) => {

    const getItemForType = () => {
        return type == "hour" ? getArrayNumbersStringTo(24) : getArrayNumbersStringTo(60);
    };
    const container = createElement(TIME_DROPDOWN_PARENT_ELM_QUERY, timePickerContainer);

    const dropDownContainer = createElement("select", container, EVENT_CHANGE_TIME_DROPDOWN_STR, (e) => {
        jdp.setValue({
            [type]: e.target.value
        });
    });
    dropDownContainer.tabIndex = -1;

    const items = getItemForType();
    for (let i = 0; i < items.length; i++) {
        const optionElm = createElement("option", dropDownContainer);
        optionElm.value = items[i];
        optionElm.text = toPersianDigitsIfNeeded(items[i], jdp.options.persianDigits);
        optionElm.selected = parseInt(items[i]) === parseInt(jdp.getValue[type] || jdp.initTime[type]);
    }
};

export const renderTimePicker = (jdp) => {
    const elmQuery=FOOTER_TIME_ELM_QUERY+((jdp.options.time && !jdp.options.date) ? ".jdp-only-time" : "");
    const timePickerContainer = createElement(elmQuery, jdp.dpContainer);
    if (jdp.options.hasSecond) {
        timeDropDownRender(jdp, timePickerContainer, "second");
    }
    timeDropDownRender(jdp, timePickerContainer, "minute");
    timeDropDownRender(jdp, timePickerContainer, "hour");
};