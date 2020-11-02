import {
  NAMESPACE,
  DATA_ATTR_YEAR_PICKER,
  DATA_ATTR_YEAR_PREV,
  DATA_ATTR_YEAR_CURRENT,
  DATA_ATTR_YEAR_NEXT,
  DATA_ATTR_YEARS,
  DATA_ATTR_MONTH_PICKER,
  DATA_ATTR_MONTH_PREV,
  DATA_ATTR_MONTH_CURRENT,
  DATA_ATTR_MONTH_NEXT,
  DATA_ATTR_MONTHS,
  DATA_ATTR_DAY_PICKER,
  DATA_ATTR_DAYS_TITLE,
  DATA_ATTR_DAYS,
} from './constants';

export default {
  // Show the datepicker automatically when initialized
  autoShow: false,

  // Hide the datepicker automatically when picked
  autoHide: false,

  // The date string format
  separatorChar: '/',

  // The initial view date
  initDate: null,

  // The min view date
  minDate: null,

  // The max view date
  maxDate: null,

  // Days' name of the week.
  days: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه‌', 'چهارشنبه', 'پنجشنبه‌', 'جمعه'],

  // Months' name
  months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],

  // The offset top or bottom of the datepicker from the element
  offset: 10,

  // The `z-index` of the datepicker
  zIndex: 1000,

  // The template of the datepicker
  template: `<div class="${NAMESPACE}-container">
            <div class="${NAMESPACE}-panel" ${DATA_ATTR_YEAR_PICKER}>
                <ul>
                    <li ${DATA_ATTR_YEAR_PREV}>&lsaquo;</li>
                    <li ${DATA_ATTR_YEAR_CURRENT}></li>
                    <li ${DATA_ATTR_YEAR_NEXT}>&rsaquo;</li>
                </ul>
                <ul ${DATA_ATTR_YEARS}></ul>
            </div>
            <div class="${NAMESPACE}-panel" ${DATA_ATTR_MONTH_PICKER}>
                <ul>
                    <li ${DATA_ATTR_MONTH_PREV}>&lsaquo;</li>
                    <li ${DATA_ATTR_MONTH_CURRENT}></li>
                    <li ${DATA_ATTR_MONTH_NEXT}>&rsaquo;</li>
                </ul>
                <ul ${DATA_ATTR_MONTHS}></ul>
            </div>
            <div class="${NAMESPACE}-panel" ${DATA_ATTR_DAY_PICKER}>
                <ul ${DATA_ATTR_DAYS_TITLE}></ul>
                <ul ${DATA_ATTR_DAYS}></ul>
            </div>
        </div>`,

  // The item tagname for template
  itemTagname: 'li',

  // The parent of the datepicker
  container: 'body',
};
