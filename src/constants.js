export const NAMESPACE = "jdp";
export const CONTAINER_ELM_QUERY = `${NAMESPACE}-container`;
export const OVERLAY_ELM_QUERY = `${NAMESPACE}-overlay`;
export const YEARS_ELM_QUERY = `div.${NAMESPACE}-years`;
export const YEAR_ELM_QUERY = `div.${NAMESPACE}-year`;
export const MONTHS_ELM_QUERY = `div.${NAMESPACE}-months`;
export const MONTH_ELM_QUERY = `div.${NAMESPACE}-month`;
export const DAYS_ELM_QUERY = `div.${NAMESPACE}-days`;
export const DAY_ELM_QUERY = `div.${NAMESPACE}-day`;
export const DAY_NOTINMONTH_ELM_QUERY = `div.${NAMESPACE}-day.not-in-month`;
export const DAY_DISABLED_ELM_QUERY = `div.${NAMESPACE}-day.disabled-day`;
export const DAY_DISABLED_NOTINMONTH_ELM_QUERY = `${DAY_NOTINMONTH_ELM_QUERY}.disabled-day`;
export const DAY_NAME_ELM_QUERY = `div.${NAMESPACE}-day-name`;
export const PLUS_ICON_ELM_QUERY = `div.${NAMESPACE}-icon-plus`;
export const MINUS_ICON_ELM_QUERY = `div.${NAMESPACE}-icon-minus`;
export const FOOTER_ELM_QUERY = `div.${NAMESPACE}-footer`;
export const TODAY_BTN_ELM_QUERY = `div.${NAMESPACE}-btn-today`;
export const EMPTY_BTN_ELM_QUERY = `div.${NAMESPACE}-btn-empty`;
export const CLOSE_BTN_ELM_QUERY = `div.${NAMESPACE}-btn-close`;
export const FOOTER_TIME_ELM_QUERY = `div.${NAMESPACE}-time-container`;
export const TIME_DROPDOWN_PARENT_ELM_QUERY = `div.${NAMESPACE}-time`;

export const SELECTED_CLASS_NAME = "selected";
export const TODAY_CLASS_NAME = "today";
export const LAST_WEEK_CLASS_NAME = "last-week";
export const DISABLE_CLASS_NAME = "not-in-range";
export const HOLLY_DAY_CLASS_NAME = "holly-day";

export const EVENT_CHANGE_INPUT_STR = `${NAMESPACE}:change`;
export const EVENT_CHANGE_MONTH_DROPDOWN_STR = "change";
export const EVENT_CHANGE_YEAR_INPUT_STR = "keyup change";
export const EVENT_CHANGE_TIME_DROPDOWN_STR = "change";
export const EVENT_CLICK_STR = "click";
export const EVENT_FOCUS_STR = "focusin";

export const MIN_MAX_TODAY_SETTING = "today";
export const MIN_MAX_ATTR_SETTING = "attr";
export const INIT_DATE_ATTR_NAME = "data-jdp-init-date";
export const MAX_DATE_ATTR_NAME = "data-jdp-max-date";
export const MIN_DATE_ATTR_NAME = "data-jdp-min-date";
export const MAX_TIME_ATTR_NAME = "data-jdp-max-time";
export const MIN_TIME_ATTR_NAME = "data-jdp-min-time";
export const ONLY_DATE_ATTR_SETTING_MAX_ATTR_NAME = "data-jdp-only-date";
export const ONLY_TIME_ATTR_SETTING_MAX_ATTR_NAME = "data-jdp-only-time";

export const DATA_ATTR = `data-${NAMESPACE}`;

export const STYLE_VISIBILITY_VISIBLE = "visible";
export const STYLE_VISIBILITY_HIDDEN = "hidden";
export const STYLE_DISPLAY_BLOCK = "block";
export const STYLE_DISPLAY_HIDDEN = "none";
export const STYLE_POSITION_FIXED = "fixed";