import { FOOTER_TIME_ELM_QUERY, TIME_DROPDOWN_PARENT_ELM_QUERY, EVENT_CHANGE_TIME_DROPDOWN_STR } from "./constants";

import { addLeadingZero, extend } from "./utils/object";

import { createElement, toPersianDigitsIfNeeded } from "./utils/dom";

import { normalizeMinMaxTime } from "./utils";
import { JalaliDatepicker, TimeObject } from "./models/types";

const getArrayNumbersStringTo = (min: number, max: number, increment?: number) => {
	const items = [];
	if (!increment || increment <= 0) {
		increment = 1;
	}
	for (let i = min; i <= max; i += increment) items.push(addLeadingZero(i));
	return items;
};

const timeDropDownRender = (jdp: JalaliDatepicker, timePickerContainer: HTMLElement, type: "hour" | "minute" | "second") => {
	const getItemForType = () => {
		const minTime = extend({ hour: 0, minute: 0, second: 0 } as TimeObject, jdp.options.minTime || {});
		const maxTime = extend({ hour: 23, minute: 59, second: 59 } as TimeObject, jdp.options.maxTime || {});
		if (type === "hour") {
			return getArrayNumbersStringTo(minTime.hour, maxTime.hour, jdp.options.hourIncrement);
		}
		if (type === "minute") {
			if (minTime.hour === maxTime.hour) {
				return getArrayNumbersStringTo(minTime.minute, maxTime.minute, jdp.options.minuteIncrement);
			}
			if (jdp.initTime.hour === minTime.hour) {
				return getArrayNumbersStringTo(minTime.minute, 59, jdp.options.minuteIncrement);
			}
			if (jdp.initTime.hour === maxTime.hour) {
				return getArrayNumbersStringTo(0, maxTime.minute, jdp.options.minuteIncrement);
			}
			return getArrayNumbersStringTo(0, 59, jdp.options.minuteIncrement);
		}

		if (type === "second") {
			if (minTime.hour === maxTime.hour && minTime.minute === maxTime.minute) {
				return getArrayNumbersStringTo(minTime.second, maxTime.second);
			}
			if (jdp.initTime.hour === minTime.hour && jdp.initTime.minute === minTime.minute) {
				return getArrayNumbersStringTo(minTime.second, 59);
			}
			if (jdp.initTime.hour === maxTime.hour && jdp.initTime.minute === maxTime.minute) {
				return getArrayNumbersStringTo(0, maxTime.second);
			}
			return getArrayNumbersStringTo(0, 59);
		}

		return getArrayNumbersStringTo(minTime.second, maxTime.second);
	};
	const container = createElement(TIME_DROPDOWN_PARENT_ELM_QUERY, timePickerContainer);

	const dropDownContainer = createElement("select", container, EVENT_CHANGE_TIME_DROPDOWN_STR, (e: any) => {
		jdp.setValue(
			normalizeMinMaxTime(jdp, jdp.initTime, {
				[type]: e.target.value
			})
		);
	});
	dropDownContainer.tabIndex = -1;

	const items = getItemForType();

	for (let i = 0; i < items.length; i++) {
		const currentItem = items[i] as string;
		const optionElm = createElement("option", dropDownContainer) as HTMLOptionElement;
		optionElm.value = currentItem.toString();
		optionElm.text = toPersianDigitsIfNeeded(currentItem, jdp.options.persianDigits).toString();
		optionElm.selected = parseInt(currentItem) === parseInt((jdp.getValue[type] || jdp.initTime[type]) as any);
	}
};

export const renderTimePicker = (jdp: JalaliDatepicker) => {
	const elmQuery = FOOTER_TIME_ELM_QUERY + (jdp.options.time && !jdp.options.date ? ".jdp-only-time" : "");
	const timePickerContainer = createElement(elmQuery, jdp.dpContainer);
	if (jdp.options.hasSecond) {
		timeDropDownRender(jdp, timePickerContainer, "second");
	}
	timeDropDownRender(jdp, timePickerContainer, "minute");
	timeDropDownRender(jdp, timePickerContainer, "hour");
};
