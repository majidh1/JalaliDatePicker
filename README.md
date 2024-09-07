<div  align="center">

# JalaliDatePicker
[![npm version](https://badge.fury.io/js/%40majidh1%2Fjalalidatepicker.svg?v=new)](https://www.npmjs.com/package/@majidh1/jalalidatepicker)
<img src="res/filesizegzip.svg" width="102px"/>
<img src="res/filesize.svg" width="87px"/>
<img src="https://shields.io/badge/build-passing-blue"/>
<img src="https://shields.io/badge/analyze-passing-blue"/>
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/majidh1/JalaliDatePicker/main/LICENSE)

</div>

<div dir="rtl">
 
<img src="res/sample1.png" width="32%"/>
<img src="res/sample5.png" width="32%"/>
<img src="res/sample2.png" width="32%"/>
<img src="res/jdp-time-min.png" width="32%"/>
<img src="res/jdp-datetime-min.png" width="32%"/>
<img src="res/jdp-minmax-min.png" width="32%"/>
 
 <br/>
 
 <br/>
 
 <br/>
 
 ## The English version of the documentation may be available [Here](/README-en.md).

 <br />
 <br />

[نصب و استفاده](#نصب-و-استفاده)

[تنظیمات](#options)

[تاریخچه تغییرات نسخه](https://github.com/majidh1/JalaliDatePicker/blob/main/ChangeLog.md)
 
[نمونه پیاده سازی](https://github.com/majidh1/JalaliDatePicker/blob/main/Sample.md)
 
## نصب و استفاده
 1- با استفاده از npm یا فولدر dist در همین مخزن آخرین نسخه را دریافت کنید

```shell
npm i @majidh1/jalalidatepicker
```
OR
```html
https://github.com/majidh1/JalaliDatePicker => /dist/
```
 2- دوفایل زیر را به پروژه اضافه کنید
  <br/><br/>
 <div dir="ltr">

```html
<link type="text/css" rel="stylesheet" href="jalalidatepicker.min.css" />
<script type="text/javascript" src="jalalidatepicker.min.js"></script>
```
یا استفاده از CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@majidh1/jalalidatepicker/dist/jalalidatepicker.min.css">
<script type="text/javascript" src="https://unpkg.com/@majidh1/jalalidatepicker/dist/jalalidatepicker.min.js"></script>
```

 </div>
 3- به inputهای مورد نیاز Attribute زیر را  اضافه کنید.
 <br/>
&nbsp&nbsp &nbsp <b>data-jdp</b><br/>
 <div dir="ltr">

```html
<input data-jdp>
```

 </div>
 4- برای شروع کارکرد از تکه کد زیر استفاده کنید
 <div dir="ltr">

```javascript
jalaliDatepicker.startWatch();
```

 </div>

## تنظیمات

#### Info & Methods

بعد از لود فایل js یک object به نام jalaliDatepicker به صورت global  که شامل 4 متد زیر است.ایجاد می‌شود

 <div dir="ltr">

``` javascript
jalaliDatepicker.startWatch(options);
jalaliDatepicker.show(input);
jalaliDatepicker.hide();
jalaliDatepicker.updateOptions(options);
```

 </div>
 
1. `startWatch(options)` شروع کار و پردازش روی input ها
2. `show(input)` نمایش روی یک input
3. `hide` مخفی شدن
4. `updateOptions` آپدیت تنظیمات بعد از startWatch

### Options

key | default | description
----|---------|------------
`date` | true | امکان انتخاب تاریخ
`time` | false | امکان انتخاب زمان
`hasSecond` | true | امکان ثانیه در انتخاب زمان
`initTime` | null | زمان پیشفرض
`autoShow` | true | نمایش خودکار
`autoHide` | true | مخفی شدن خودکار هنگام کلیک خارج دیتپیکر یا اینپوت
`hideAfterChange` | true | مخفی شدن بعد از انتخاب تاریخ
`useDropDownYears` | true | انتخاب سال به صورت DropDown
`separatorChars(object)` | date: `'/'` <br/> between: `' '` <br/> time: `':'` |  جداکننده بین سال، ماه و روز<br/>جداکننده بین تاریخ و زمان<br/>جداکننده بین ساعت، دقیقه و ثانیه
`persianDigits` | false | استفاده از کارکترهای یونیکد فارسی به جای کارکترهای انگلیسی
`minDate` | null | مشخص کننده حداقل تاریخ. در صورتی که برابر با `today` باشد `روز جاری` است. در صورتی که برابر با `attr` باشد برابر با مقدار `data-jdp-min-date` attrubute  است
`maxDate` | null | مشخص کننده حداکثر تاریخ. در صورتی که برابر با `today` باشد `روز جاری` است. در صورتی که برابر با `attr` باشد برابر با مقدار `data-jdp-max-date` attrubute  است
`initDate` | null | برابر با آبجکت تاریخی که به صورت پیشفرض نمایش داده می‌شود در صورتی که تنظیم نشود برابر است با `روز جاری`.
`today` | null | برابر با آبجکت تاریخ برای تعیین روز جاری به صورت پیشفرض از تاریخ سیستم محاسبه میشود
`plusHtml` | `"svg"` | html مربوط به دکمه افزایش سال و ماه
`minusHtml` | `"svg"` | html مربوط به دکمه کاهش سال و ماه
`container` | "body" | datepicker در کجا ساخته شود
`selector` | "input[data-jdp]" | selector مربوط به autoShow
`zIndex` | 1000 | zIndex مربوط به datepicker
`days` | ["ش", "ی", "د", "س", "چ", "پ", "ج"] | نام روزهای هفته
`months` | ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"] | نام ماه‌های موجود
`changeMonthRotateYear` | false | با تغییر ماه سال نیز کم یا زیاد شود
`showTodayBtn` | true | نمایش دکمه امروز
`showEmptyBtn` | true | نمایش دکمه پاکسازی
`showCloseBtn` | dynamic | نمایش دکمه بستن دیتپیکر
`autoReadOnlyInput` | `dynamic` | فقط خواندنی شدن input دارای datePicker
`topSpace` | 0 | فضای خالی بین بالای datePicker و input (زمانی که دیتپیکر در پایین اینپوت هست)
`bottomSpace` | 0 | فضای خالی بین پایین datePicker و input (زمانی که دیتپیکر در بالای اینپوت هست)
`overflowSpace` | -10 | فضای خالی بین گوشه صفحه (window) و datePicker (زمانی که دیتپیکر بیرون از صفحه میرود)
`dayRendering` | - | متد رندر یک روز خروجی یک آبجکت از تنظیمات روز است

#### نمونه‌های codepen:
[لینک کالکشن](https://codepen.io/collection/wajWMo)

#### مثال dayRendering:
برای نمایش تعطیلی 4 روز ابتدایی سال
<div dir="ltr">
 
```javascript
jalaliDatepicker.startWatch({
  dayRendering:function(dayOptions,input){
    return {
     isHollyDay: dayOptions.month==1 && dayOptions.day<=4,
     // isValid = false, امکان غیر فعال کردن روز
     // className = "nowruz" امکان افزودن کلاس برای درج استایل به روز
    }
  }
})
```

## ATTR On Input:

```shell
data-jdp
data-jdp-min-date
data-jdp-max-date
data-jdp-only-date
data-jdp-only-time
```
              
          
</div>

</div>
