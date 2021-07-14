export default {
    days: ["ش", "ی", "د", "س", "چ", "پ", "ج"],

    months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],

    initDate: null,

    //sample {year:1399,month:11,day:29} || today || attr
    minDate: {},

    //sample {year:1400,month:11,day:29} || today || attr
    maxDate: {},

    separatorChar: "/",

    zIndex: 1000,

    container: "body",

    dpContainer: null,

    selector: "input[data-jdp]",

    autoShow:true,
    autoHide: true,

    plusHtml: "<svg viewBox=\"0 0 1024 1024\"><g><path d=\"M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z\"></path></g></svg>",
    minusHtml: "<svg viewBox=\"0 0 1024 1024\"><g><path d=\"M810 554h-596v-84h596v84z\"></path></g></svg>",

    changeMonthRotateYear: false,

    showTodayBtn: true,
    showEmptyBtn: true,

    autoReadOnlyInput: ((window.innerWidth <= 800) && (window.innerHeight <= 600))
};