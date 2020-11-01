export const IS_BROWSER = typeof window !== 'undefined';
export const WINDOW = IS_BROWSER ? window : {};
export const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
export const NAMESPACE = 'jalalidatepicker';
export const EVENT_HIDE = new Event(`hide.${NAMESPACE}`);
export const EVENT_SHOW = new Event(`show.${NAMESPACE}`);
