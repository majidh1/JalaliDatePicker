export const IS_TOUCH_DEVICE = 'ontouchstart' in window.document.documentElement;
export const NAMESPACE = 'jalalidatepicker';
export const EVENT_HIDE = new Event(`hide.${NAMESPACE}`);
export const EVENT_SHOW = new Event(`show.${NAMESPACE}`);

export const DATA_ATTR = `data-${NAMESPACE}`;
export const DATA_ATTR_YEARS = `${DATA_ATTR}="years"`;
export const DATA_ATTR_YEAR_PICKER = `${DATA_ATTR}="year-picker"`;
export const DATA_ATTR_YEAR_PREV = `${DATA_ATTR}="year-prev"`;
export const DATA_ATTR_YEAR_CURRENT = `${DATA_ATTR}="year-current"`;
export const DATA_ATTR_YEAR_NEXT = `${DATA_ATTR}="year-next"`;

export const DATA_ATTR_MONTHS = `${DATA_ATTR}="months"`;
export const DATA_ATTR_MONTH_PICKER = `${DATA_ATTR}="month-picker"`;
export const DATA_ATTR_MONTH_PREV = `${DATA_ATTR}="month-prev"`;
export const DATA_ATTR_MONTH_CURRENT = `${DATA_ATTR}="month-current"`;
export const DATA_ATTR_MONTH_NEXT = `${DATA_ATTR}="month-next"`;

export const DATA_ATTR_DAYS = `${DATA_ATTR}="days"`;
export const DATA_ATTR_DAYS_TITLE = `${DATA_ATTR}="days-title"`;
export const DATA_ATTR_DAY_PICKER = `${DATA_ATTR}="day-picker"`;
