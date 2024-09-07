const isMobile=(/iphone|ipod|android|ie|blackberry|fennec/).test(window.navigator?.userAgent?.toLowerCase());
import {clon} from "./utils/object";

export default clon({
    days: ["ش", "ی", "د", "س", "چ", "پ", "ج"],

    months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],

    //sample {year:1400,month:11,day:29}
    initDate: null,
    //sample {year:1400,month:11,day:29}
    today:null,
    //{hour:12,minute:11,second:10}
    initTime: null,
    
    hasSecond: true,

    time:false,
    date:true,
    //sample {year:1399,month:11,day:29} || today || attr
    minDate: {},

    //sample {year:1400,month:11,day:29} || today || attr
    maxDate: {},

    minTime: {},

    maxTime: {},

    separatorChars: {
        date:"/",
        between:" ",
        time:":"
    },

    persianDigits: false,

    zIndex: 1000,

    container: "body",

    selector: "input[data-jdp]",

    autoShow:true,
    autoHide: true,
    hideAfterChange: true,

    plusHtml: "<svg viewBox=\"0 0 1024 1024\"><g><path d=\"M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z\"></path></g></svg>",
    minusHtml: "<svg viewBox=\"0 0 1024 1024\"><g><path d=\"M810 554h-596v-84h596v84z\"></path></g></svg>",

    changeMonthRotateYear: false,

    showTodayBtn: true,
    showEmptyBtn: true,
    showCloseBtn: isMobile,

    autoReadOnlyInput: isMobile,
    useDropDownYears: true,
    
    topSpace: 0,
    bottomSpace: 0,

    overflowSpace: -10
});
