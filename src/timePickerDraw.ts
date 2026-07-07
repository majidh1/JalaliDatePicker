import { FOOTER_TIME_ELEMENT_QUERY, TIME_DROPDOWN_PARENT_ELEMENT_QUERY, EVENT_CHANGE_TIME_DROPDOWN_STR } from "./constants";

import { addLeadingZero, extend } from "./utils/object";

import { createElement, toPersianDigitsIfNeeded } from "./utils/dom";

import { normalizeMinMaxTime } from "./utils";
import { JalaliDatePicker, TimeObject } from "./models/types";

const getArrayNumbersStringTo = (min: number, max: number, increment?: number) => {
	const items = [];
	if (!increment || increment <= 0) {
		increment = 1;
	}
	for (let i = min; i <= max; i += increment) items.push(addLeadingZero(i));
	return items;
};

const getSelectedTimePart = (event: Event) => Number((event.target as HTMLSelectElement).value);
const getMinTime = (jdp: JalaliDatePicker) => extend({ hour: 0, minute: 0, second: 0 } as TimeObject, jdp.options.minTime || {});
const getMaxTime = (jdp: JalaliDatePicker) => extend({ hour: 23, minute: 59, second: 59 } as TimeObject, jdp.options.maxTime || {});

const getMinuteItems = (jdp: JalaliDatePicker, minTime: TimeObject, maxTime: TimeObject) => {
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
};

const getSecondItems = (jdp: JalaliDatePicker, minTime: TimeObject, maxTime: TimeObject) => {
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
};

const timeDropdownRender = (jdp: JalaliDatePicker, timePickerContainer: HTMLElement, type: "hour" | "minute" | "second") => {
	const getItemForType = () => {
		const minTime = getMinTime(jdp);
		const maxTime = getMaxTime(jdp);
		if (type === "hour") {
			return getArrayNumbersStringTo(minTime.hour, maxTime.hour, jdp.options.hourIncrement);
		}
		if (type === "minute") {
			return getMinuteItems(jdp, minTime, maxTime);
		}
		return getSecondItems(jdp, minTime, maxTime);
	};
	const container = createElement(TIME_DROPDOWN_PARENT_ELEMENT_QUERY, timePickerContainer);

	const dropdownContainer = createElement("select", container, EVENT_CHANGE_TIME_DROPDOWN_STR, (event) => {
		jdp.setValue(
			normalizeMinMaxTime(jdp, jdp.initTime, {
				[type]: getSelectedTimePart(event)
			})
		);
	});
	dropdownContainer.tabIndex = -1;

	const items = getItemForType();

	for (let i = 0; i < items.length; i++) {
		const currentItem = items[i] as string;
		const optionElement = createElement("option", dropdownContainer) as HTMLOptionElement;
		optionElement.value = currentItem.toString();
		optionElement.text = toPersianDigitsIfNeeded(currentItem, jdp.options.persianDigits).toString();
		optionElement.selected = parseInt(currentItem) === Number(jdp.getValue[type] || jdp.initTime[type]);
	}
};

export const renderTimePicker = (jdp: JalaliDatePicker) => {
	const elementQuery = FOOTER_TIME_ELEMENT_QUERY + (jdp.options.time && !jdp.options.date ? ".jdp-only-time" : "");
	const timePickerContainer = createElement(elementQuery, jdp.dpContainer);
	if (jdp.options.hasSecond) {
		timeDropdownRender(jdp, timePickerContainer, "second");
	}
	timeDropdownRender(jdp, timePickerContainer, "minute");
	timeDropdownRender(jdp, timePickerContainer, "hour");
};
