import { JalaliDatePicker } from "./models/types";
import { EVENT_CLICK_STR, FOOTER_ELEMENT_QUERY, TODAY_BUTTON_ELEMENT_QUERY, EMPTY_BUTTON_ELEMENT_QUERY, CLOSE_BUTTON_ELEMENT_QUERY } from "./constants";

import { isValidDateToday } from "./utils";

import { createElement, setInnerHTML } from "./utils/dom";

import { renderTimePicker } from "./timePickerDraw";
import { renderDatePicker } from "./datePickerDraw";

const renderFooter = (jdp: JalaliDatePicker) => {
	const footerContainer = createElement(FOOTER_ELEMENT_QUERY, jdp.dpContainer, undefined, undefined, undefined);
	if (jdp.options.showTodayBtn && jdp.options.date) {
		const isActiveToday = isValidDateToday(jdp);
		createElement(
			TODAY_BUTTON_ELEMENT_QUERY + (isActiveToday ? "" : ".disabled-btn"),
			footerContainer,
			EVENT_CLICK_STR,
			() => {
				if (isActiveToday) jdp.setValue(jdp.today);
			},
			"امروز"
		);
	}
	if (!jdp.options.date && jdp.options.time && (!jdp.input?.value || !!jdp.options.showSelectTimeBtnAlways)) {
		createElement(
			TODAY_BUTTON_ELEMENT_QUERY,
			footerContainer,
			EVENT_CLICK_STR,
			() => {
				jdp.setValue(jdp.initTime);
				jdp.hide();
			},
			"انتخاب"
		);
	}
	if (jdp.options.showEmptyBtn) {
		createElement(
			EMPTY_BUTTON_ELEMENT_QUERY,
			footerContainer,
			EVENT_CLICK_STR,
			() => {
				jdp.cleanValue();
				if (jdp.options.hideAfterChange) jdp.hide();
			},
			"خالی"
		);
	}

	if (jdp.options.showCloseBtn) {
		createElement(
			CLOSE_BUTTON_ELEMENT_QUERY,
			footerContainer,
			EVENT_CLICK_STR,
			() => {
				jdp.hide();
			},
			"بستن"
		);
	}
};
export const render = (jdp: JalaliDatePicker) => {
	setInnerHTML(jdp.dpContainer, "");
	if (jdp.options.date) {
		renderDatePicker(jdp);
	}
	if (jdp.options.time) {
		renderTimePicker(jdp);
	}
	renderFooter(jdp);
};

export default function (this: JalaliDatePicker) {
	render(this);
}
