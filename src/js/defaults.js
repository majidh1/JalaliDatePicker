export default {
  // Show the datepicker automatically when initialized
  autoShow: false,

  // Hide the datepicker automatically when picked
  autoHide: false,

  // The date string format
  format: 'mm/dd/yyyy',

  // The start view date
  startDate: null,

  // The end view date
  endDate: null,

  // Days' name of the week.
  days: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه‌', 'چهارشنبه', 'پنجشنبه‌', 'جمعه'],

  // Months' name
  months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],

  // The offset top or bottom of the datepicker from the element
  offset: 10,

  // The `z-index` of the datepicker
  zIndex: 1000,

  // The template of the datepicker
  template:
        `<div class="jdp-container">
            <div class="jdp-panel" data-view="years picker">
                <ul>
                    <li data-view="years prev">&lsaquo;</li>
                    <li data-view="years current"></li>
                    <li data-view="years next">&rsaquo;</li>
                </ul>
                <ul data-view="years"></ul>
            </div>
            <div class="jdp-panel" data-view="months picker">
                <ul>
                    <li data-view="year prev">&lsaquo;</li>
                    <li data-view="year current"></li>
                    <li data-view="year next">&rsaquo;</li>
                </ul>
                <ul data-view="months"></ul>
            </div>
            <div class="jdp-panel" data-view="days picker">
                <ul>
                    <li data-view="month prev">&lsaquo;</li>
                    <li data-view="month current"></li>
                    <li data-view="month next">&rsaquo;</li>
                </ul>
                <ul data-view="week"></ul>
                <ul data-view="days"></ul>
            </div>
        </div>`,

  // The parent of the datepicker
  container: 'body',
};
