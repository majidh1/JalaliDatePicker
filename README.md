<div align="center">

# JalaliDatePicker

[![npm version](https://badge.fury.io/js/%40majidh1%2Fjalalidatepicker.svg?v=new)](https://www.npmjs.com/package/@majidh1/jalalidatepicker)
<img src="res/filesizegzip.svg" width="102px"/>
<img src="res/filesize.svg" width="87px"/>
<img src="https://shields.io/badge/build-passing-blue"/>
<img src="https://shields.io/badge/analyze-passing-blue"/>
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/majidh1/JalaliDatePicker/main/LICENSE)

</div>

<div dir="rtl">

یک datepicker سبک و بدون وابستگی برای انتخاب تاریخ جلالی، زمان، یا تاریخ و زمان در صفحات وب.

<p align="center">
 <img src="res/sample1.png" width="32%"/>
 <img src="res/sample5.png" width="32%"/>
 <img src="res/sample2.png" width="32%"/>
 <img src="res/jdp-time-min.png" width="32%"/>
 <img src="res/jdp-datetime-min.png" width="32%"/>
 <img src="res/jdp-minmax-min.png" width="32%"/>
</p>

## فهرست

- [نصب](#نصب)
- [شروع سریع](#شروع-سریع)
- [API عمومی](#api-عمومی)
- [مثال‌ها](#مثال‌ها)
- [Options](#options)
- [Attributeهای input](#attributeهای-input)
- [Eventها](#eventها)
- [فرمت مقدارها](#فرمت-مقدارها)
- [توسعه و build](#توسعه-و-build)

## نصب

### نصب با npm

```shell
npm i @majidh1/jalalidatepicker
```

سپس فایل‌های CSS و JS خروجی را در صفحه اضافه کنید:

```html
<link rel="stylesheet" href="jalalidatepicker.min.css">
<script src="jalalidatepicker.min.js"></script>
```

### استفاده از CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@majidh1/jalalidatepicker/dist/jalalidatepicker.min.css">
<script src="https://unpkg.com/@majidh1/jalalidatepicker/dist/jalalidatepicker.min.js"></script>
```

### استفاده دستی از dist

می‌توانید فایل‌های آماده را از پوشه `dist` بردارید:

```text
dist/jalalidatepicker.min.css
dist/jalalidatepicker.min.js
```

## شروع سریع

به input مورد نظر attribute زیر را اضافه کنید:

```html
<input data-jdp>
```

بعد از load شدن فایل JS، datepicker را فعال کنید:

```html
<script>
 jalaliDatepicker.startWatch();
</script>
```

از این لحظه هر input که با selector پیش‌فرض `input[data-jdp]` match شود، هنگام focus شدن datepicker را نمایش می‌دهد.

## API عمومی

بعد از اضافه کردن فایل JS، یک object سراسری به نام `jalaliDatepicker` ساخته می‌شود:

```js
jalaliDatepicker.startWatch(options);
jalaliDatepicker.show(input);
jalaliDatepicker.hide();
jalaliDatepicker.updateOptions(options);
```

| متد | توضیح |
| --- | --- |
| `startWatch(options)` | فعال‌سازی datepicker روی inputهای مطابق `selector` |
| `show(input)` | نمایش دستی datepicker برای یک `HTMLInputElement` |
| `hide()` | بستن datepicker فعلی |
| `updateOptions(options)` | به‌روزرسانی تنظیمات بعد از `startWatch` |

## مثال‌ها

### انتخاب تاریخ

```html
<input data-jdp>

<script>
 jalaliDatepicker.startWatch();
</script>
```

### انتخاب تاریخ و زمان

```html
<input data-jdp>

<script>
 jalaliDatepicker.startWatch({
  date: true,
  time: true,
  hasSecond: true
 });
</script>
```

### فقط زمان

```html
<input data-jdp data-jdp-only-time>

<script>
 jalaliDatepicker.startWatch({
  time: true
 });
</script>
```

### محدود کردن بازه تاریخ

```html
<input data-jdp>

<script>
 jalaliDatepicker.startWatch({
  minDate: {
   year: 1403,
   month: 1,
   day: 10
  },
  maxDate: {
   year: 1403,
   month: 12,
   day: 29
  }
 });
</script>
```

### خواندن محدودیت‌ها از attribute

```html
<input
 data-jdp
 data-jdp-min-date="1403/01/10"
 data-jdp-max-date="1403/12/29"
>

<script>
 jalaliDatepicker.startWatch({
  minDate: "attr",
  maxDate: "attr"
 });
</script>
```

### ذخیره مقدار میلادی در input دیگر

```html
<input data-jdp>
<input id="gregorian-date">

<script>
 jalaliDatepicker.startWatch({
  targetValueInput: "#gregorian-date",
  targetValueType: "gregorian"
 });
</script>
```

اگر کاربر `1403/01/01` را انتخاب کند، مقدار target به صورت `2024-03-20` نوشته می‌شود.

### انتخاب بازه تاریخ

```html
<input data-jdp>

<script>
 jalaliDatepicker.startWatch({
  mode: "range",
  rangeSeparator: " - "
 });
</script>
```

با انتخاب `1403/01/01` و `1403/01/05` مقدار input برابر `1403/01/01 - 1403/01/05` می‌شود.
حالت‌های `range` و `multiple` خروجی را به صورت فقط تاریخ می‌نویسند.

### انتخاب چند تاریخ

```html
<input data-jdp>

<script>
 jalaliDatepicker.startWatch({
  mode: "multiple",
  multipleSeparator: ", "
 });
</script>
```

تاریخ‌های انتخاب‌شده مرتب می‌شوند و به صورت لیست جداشده نوشته می‌شوند، مثلا `1403/01/01, 1403/01/05`.
حالت‌های `range` و `multiple` خروجی را به صورت فقط تاریخ می‌نویسند.

### تعیین حالت انتخاب برای هر input

```html
<input data-jdp data-jdp-mode="range">
<input data-jdp data-jdp-mode="multiple">

<script>
 jalaliDatepicker.startWatch({
  mode: "attr"
 });
</script>
```

وقتی `mode` برابر `"attr"` باشد، هر input حالت انتخاب خودش را از `data-jdp-mode` می‌خواند. مقدارهای معتبر: `single`، `range` و `multiple`.

### سفارشی‌سازی روزها با `dayRendering`

```js
jalaliDatepicker.startWatch({
 dayRendering(dayOptions, input) {
  return {
   isHoliday: dayOptions.month === 1 && dayOptions.day <= 4,
   className: dayOptions.month === 1 && dayOptions.day <= 4 ? "nowruz" : "",
   isValid: dayOptions.isValid
  };
 }
});
```

با `dayRendering` می‌توانید روزها را disabled کنید، class اضافه کنید، یا روز را به عنوان تعطیل نمایش دهید.

## Options

| کلید | مقدار پیش‌فرض | توضیح |
| --- | --- | --- |
| `date` | `true` | فعال بودن انتخاب تاریخ |
| `time` | `false` | فعال بودن انتخاب زمان |
| `hasSecond` | `true` | نمایش dropdown ثانیه در حالت زمان |
| `initDate` | تاریخ امروز یا مقدار input | تاریخ اولیه نمایش داده‌شده |
| `initTime` | زمان فعلی سیستم | زمان اولیه نمایش داده‌شده |
| `minDate` | `undefined` | حداقل تاریخ مجاز. می‌تواند object، مقدار `"today"` یا `"attr"` باشد |
| `maxDate` | `undefined` | حداکثر تاریخ مجاز. می‌تواند object، مقدار `"today"` یا `"attr"` باشد |
| `minTime` | `undefined` | حداقل زمان مجاز. می‌تواند object یا `"attr"` باشد |
| `maxTime` | `undefined` | حداکثر زمان مجاز. می‌تواند object یا `"attr"` باشد |
| `today` | تاریخ سیستم | تاریخ امروز برای highlight و دکمه امروز |
| `selector` | `"input[data-jdp]"` | selector مربوط به نمایش خودکار |
| `container` | `"body"` | محل ساخته شدن datepicker و overlay |
| `zIndex` | `1000` | z-index datepicker |
| `autoShow` | `true` | نمایش خودکار هنگام focus روی inputهای مطابق selector |
| `autoHide` | `true` | بستن خودکار هنگام کلیک بیرون از datepicker و input |
| `autoReadOnlyInput` | وابسته به موبایل بودن مرورگر | readonly شدن input هنگام نمایش datepicker |
| `hideAfterChange` | `true` | بستن datepicker بعد از تغییر مقدار |
| `hideAfterChangeWithTime` | `false` | بستن datepicker بعد از تغییر مقدار حتی وقتی time فعال است |
| `changeMonthRotateYear` | `false` | چرخش سال هنگام رفتن از ماه ۱۲ به ۱ یا برعکس |
| `showTodayBtn` | `true` | نمایش دکمه امروز |
| `showEmptyBtn` | `true` | نمایش دکمه خالی/پاک کردن |
| `showCloseBtn` | وابسته به موبایل بودن مرورگر | نمایش دکمه بستن |
| `showSelectTimeBtnAlways` | `false` | نمایش همیشگی دکمه انتخاب در حالت فقط زمان |
| `useDropdownYears` | `true` | استفاده از dropdown برای سال. نام قدیمی `useDropDownYears` هم برای سازگاری پشتیبانی می‌شود |
| `position` | `"left"` | محل قرارگیری نسبت به input. مقدارهای مجاز: `"left"`, `"right"`, `"center"` |
| `topSpace` | `0` | فاصله datepicker از input وقتی زیر input است |
| `bottomSpace` | `0` | فاصله datepicker از input وقتی بالای input است |
| `overflowSpace` | `-10` | فاصله مجاز از لبه پنجره هنگام جلوگیری از خروج از صفحه |
| `minuteIncrement` | `1` | گام دقیقه‌ها در dropdown زمان |
| `hourIncrement` | `1` | گام ساعت‌ها در dropdown زمان |
| `mode` | `"single"` | حالت انتخاب تاریخ. مقدارهای مجاز: `"single"`, `"range"`, `"multiple"`, `"attr"` |
| `rangeSeparator` | `" - "` | جداکننده تاریخ شروع و پایان در حالت range |
| `multipleSeparator` | `", "` | جداکننده تاریخ‌ها در حالت multiple |
| `persianDigits` | `false` | نمایش ارقام فارسی به جای ارقام انگلیسی |
| `days` | `["ش", "ی", "د", "س", "چ", "پ", "ج"]` | نام روزهای هفته |
| `months` | نام ماه‌های فارسی | نام ماه‌ها در dropdown ماه |
| `separatorChars` | object | جداکننده‌های تاریخ/زمان و target |
| `targetValueInput` | `undefined` | selector یا `HTMLInputElement` برای نوشتن مقدار تبدیل‌شده. با `"attr"` از `data-jdp-target-value-input` خوانده می‌شود |
| `targetValueType` | `undefined` | اگر `"gregorian"` باشد مقدار target به میلادی تبدیل می‌شود. با `"attr"` از `data-jdp-target-value-type` خوانده می‌شود |
| `plusHtml` | SVG داخلی | HTML دکمه افزایش سال/ماه |
| `minusHtml` | SVG داخلی | HTML دکمه کاهش سال/ماه |
| `dayRendering` | `undefined` | callback برای تغییر وضعیت یا ظاهر روزها |

### ساختار object تاریخ و زمان

```js
const date = {
 year: 1403,
 month: 1,
 day: 1
};

const time = {
 hour: 13,
 minute: 45,
 second: 0
};
```

### تنظیم `separatorChars`

```js
jalaliDatepicker.startWatch({
 separatorChars: {
  date: "/",
  between: " ",
  time: ":",
  targetDate: "-",
  targetBetween: " ",
  targetTime: ":"
 }
});
```

## Attributeهای input

این attributeها روی هر input قابل استفاده‌اند:

| Attribute | توضیح |
| --- | --- |
| `data-jdp` | فعال کردن datepicker برای input |
| `data-jdp-init-date` | تاریخ اولیه input |
| `data-jdp-min-date` | حداقل تاریخ مجاز |
| `data-jdp-max-date` | حداکثر تاریخ مجاز |
| `data-jdp-min-time` | حداقل زمان مجاز |
| `data-jdp-max-time` | حداکثر زمان مجاز |
| `data-jdp-only-date` | فقط انتخاب تاریخ برای این input |
| `data-jdp-only-time` | فقط انتخاب زمان برای این input |
| `data-jdp-mode` | حالت انتخاب برای این input وقتی `mode: "attr"` باشد. مقدارهای معتبر: `single`، `range`، `multiple` |
| `data-jdp-target-value-input` | selector مربوط به input مقصد |
| `data-jdp-target-value-type` | نوع مقدار مقصد، مثل `gregorian` |

مثال با attributeهای هر input:

```html
<input
 data-jdp
 data-jdp-init-date="1403/01/01"
 data-jdp-min-date="1403/01/10"
 data-jdp-max-date="1403/12/29"
 data-jdp-target-value-input="#gregorian-date"
 data-jdp-target-value-type="gregorian"
>
<input id="gregorian-date">

<script>
 jalaliDatepicker.startWatch({
  initDate: "attr",
  minDate: "attr",
  maxDate: "attr",
  targetValueInput: "attr",
  targetValueType: "attr"
 });
</script>
```

## Eventها

بعد از تغییر مقدار input، این eventها روی همان input dispatch می‌شوند:

- `jdp:change`
- `change`
- `input`

مثال:

```js
document.querySelector("input[data-jdp]").addEventListener("jdp:change", function (event) {
 console.log(event.target.value);
});
```

## فرمت مقدارها

فرمت پیش‌فرض تاریخ:

```text
1403/01/09
```

فرمت پیش‌فرض زمان:

```text
13:05:00
```

فرمت پیش‌فرض تاریخ و زمان:

```text
1403/01/09 13:05:00
```

اگر `hasSecond: false` باشد، زمان بدون ثانیه نوشته می‌شود:

```text
13:05
```

## نمونه‌ها

- [نمونه html-js](https://codesandbox.io/p/sandbox/jalalidatepicker-js-753tph)
- [نمونه Modulejs](https://codesandbox.io/p/sandbox/jalalidatepicker-js-module-r8jxyj)
- [نمونه React](https://codesandbox.io/p/sandbox/jalalidatepicker-react-s9tsrk)
- [نمونه Angular](https://codesandbox.io/p/devbox/jalalidatepicker-angular-2hzzg9)
- [نمونه Vue](https://codesandbox.io/p/devbox/jalalidatepicker-vue-x2gpj7)
- [نمونه Modal](https://codesandbox.io/p/sandbox/2spjyv)
- [CodePen collection](https://codepen.io/collection/wajWMo)

## توسعه و build

نصب وابستگی‌ها:

```shell
npm install
```

اجرای محیط توسعه:

```shell
npm run dev
```

اجرای تست‌ها:

```shell
npm test
```

بررسی lint:

```shell
npm run lint
```

ساخت خروجی production:

```shell
npm run build
```

خروجی‌های اصلی در پوشه `dist` ساخته می‌شوند:

```text
dist/jalalidatepicker.css
dist/jalalidatepicker.js
dist/jalalidatepicker.min.css
dist/jalalidatepicker.min.js
```

## لینک‌ها

- [English documentation](/README-en.md)
- [تاریخچه تغییرات](/ChangeLog.md)
- [نمونه‌ها](/Sample.md)
- [راهنمای مشارکت](/CONTRIBUTING.md)

</div>

