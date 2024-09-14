import {
    FOOTER_TIME_ELM_QUERY,
    TIME_DROPDOWN_PARENT_ELM_QUERY,
    EVENT_CHANGE_TIME_DROPDOWN_STR
} from "./constants";

import {
    addLeadingZero,
    extend
} from "./utils/object";

import {
    createElement, toPersianDigitsIfNeeded
} from "./utils/dom";

import {
    normalizeMinMaxTime
} from "./utils";

const getArrayNumbersStringTo = (min,max) => {
    const items = [];
    for (let i = min; i <= max; i++) items.push(addLeadingZero(i));
    return items;
};

const timeDropDownRender = (jdp, timePickerContainer, type) => {

    const getItemForType = () => {
        const minTime=extend({hour:0,minute:0,second:0},jdp.options.minTime);
        const maxTime=extend({hour:23,minute:59,second:59},jdp.options.maxTime);
        if(type == "hour"){
            return getArrayNumbersStringTo(minTime.hour,maxTime.hour);
        }
        if(type == "minute"){
            if(minTime.hour==maxTime.hour){
                return getArrayNumbersStringTo(minTime.minute,maxTime.minute);
            }
            if(jdp.initTime.hour==minTime.hour){
                return getArrayNumbersStringTo(minTime.minute,59);
            }
            if(jdp.initTime.hour==maxTime.hour){
                return getArrayNumbersStringTo(0,maxTime.minute);
            }
            return getArrayNumbersStringTo(0,59);
        }

        if(type == "second"){
            if(minTime.hour==maxTime.hour && minTime.minute==maxTime.minute){
                return getArrayNumbersStringTo(minTime.second,maxTime.second);
            }
            if(jdp.initTime.hour==minTime.hour && jdp.initTime.minute==minTime.minute){
                return getArrayNumbersStringTo(minTime.second,59);
            }
            if(jdp.initTime.hour==maxTime.hour && jdp.initTime.minute==maxTime.minute){
                return getArrayNumbersStringTo(0,maxTime.second);
            }
            return getArrayNumbersStringTo(0,59);
        } 

        return getArrayNumbersStringTo(minTime.second,maxTime.second);
    };
    const container = createElement(TIME_DROPDOWN_PARENT_ELM_QUERY, timePickerContainer);

    const dropDownContainer = createElement("select", container, EVENT_CHANGE_TIME_DROPDOWN_STR, (e) => {
        jdp.setValue(normalizeMinMaxTime(jdp,jdp.initTime,{
            [type]: e.target.value
        }));
    });
    dropDownContainer.tabIndex = -1;

    const items = getItemForType();

    for (let i = 0; i < items.length; i++) {
        const optionElm = createElement("option", dropDownContainer);
        optionElm.value = `'${items[i]}'`;
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