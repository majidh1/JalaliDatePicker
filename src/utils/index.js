import {
    isPlainObject,
    addLeadingZero,
    extend
} from "./object";

export const normalizeMinMaxDate = (jdp, dateObj, updateObj) => {
    const _dateObj = extend(dateObj, updateObj);
    const initDate = jdp.initDate;
    const maxDate = jdp.options.maxDate;
    const minDate = jdp.options.minDate;
    let year = _dateObj.year;
    let month = _dateObj.month;
    let day = _dateObj.day;

    if (isNaN(year) || year < 1000 || year > 1999) {
        year = initDate.year;
    } else {
        if (year < minDate.year) {
            year = minDate.year;
        } else if (year > maxDate.year) {
            year = maxDate.year;
        }
    }

    if (isNaN(month) || month < 1 || month > 12) {
        month = initDate.month;
    } else {
        if (year <= minDate.year && month < minDate.month) {
            month = minDate.month;
        } else if (year >= maxDate.year && month > maxDate.month) {
            month = maxDate.month;
        }
    }

    if (isNaN(day) || day < 1) {
        day = initDate.day;
    } else {
        if (month <= minDate.month && day < minDate.day) {
            day = minDate.day;
        } else if (month >= maxDate.month && day > maxDate.day) {
            day = maxDate.day;
        }
    }

    return {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day)
    };
};

export const normalizeMinMaxTime = (jdp, timeObj, updateObj) => {
    const _timeObj = extend(timeObj, updateObj);
    const initTime = jdp.initTime;
    const maxTime = jdp.options.maxTime;
    const minTime = jdp.options.minTime;
    let hour = _timeObj.hour;
    let minute = _timeObj.minute;
    let second = _timeObj.second;

    if (isNaN(hour) || hour < 0 || hour > 23) {
        hour = initTime.hour;
    } else {
        if (hour < minTime.hour) {
            hour = minTime.hour;
        } else if (hour > maxTime.hour) {
            hour = maxTime.hour;
        }
    }

    if (isNaN(minute) || minute < 0 || minute > 59) {
        minute = initTime.minute;
    } else {
        if (hour <= minTime.hour && minute < minTime.minute) {
            minute = minTime.minute;
        } else if (hour >= maxTime.hour && minute > maxTime.minute) {
            minute = maxTime.minute;
        }
    }

    if (isNaN(second) || second < 0 || second > 59) {
        second = initTime.second;
    } else {
        if (hour <= minTime.hour && minute <= minTime.minute && second < minTime.second) {
            second = minTime.second;
        } else if (hour >= maxTime.hour && minute >= maxTime.minute && second > maxTime.second) {
            second = maxTime.second;
        }
    }

    return {
        hour: parseInt(hour),
        minute: parseInt(minute),
        second: parseInt(second)
    };
};

export const getValidYears = (jdp) => {
    function rnd(val) {
        return Math.round(val / 100) * 100;
    }

    const initYear = jdp.initDate.year;
    const min = jdp.options.minDate.year || rnd(initYear - 200);
    const max = jdp.options.maxDate.year || rnd(initYear + 200);
    return {
        min,
        max
    };
};

export const getValidMonths = (jdp) => {
    const initYear = jdp.initDate.year;
    const minDate = jdp.options.minDate;
    const maxDate = jdp.options.maxDate;
    const months = [];
    let start = 1;
    let finish = 12;

    if (initYear === minDate.year) {
        start = minDate.month;
        if (initYear === maxDate.year) {
            finish = maxDate.month;
        }
    } else if (initYear === maxDate.year) {
        start = 1;
        finish = maxDate.month;
    }

    for (let i = start; i <= finish; i++) {
        months.push(i);
    }

    return months;
};

export const isValidDate = (jdp, year, month, day) => {
    let minDate = jdp.options.minDate;
    let maxDate = jdp.options.maxDate;

    const date = getDateValueStringFromValueObject(jdp, {
        year,
        month,
        day
    });
    minDate = isPlainObject(minDate) ? date : getDateValueStringFromValueObject(jdp, {
        year: minDate.year,
        month: minDate.month,
        day: minDate.day
    });
    maxDate = isPlainObject(maxDate) ? date : getDateValueStringFromValueObject(jdp, {
        year: maxDate.year,
        month: maxDate.month,
        day: maxDate.day
    });
    
    return date <= maxDate && date >= minDate;
};

export const isValidDateToday = (jdp) => isValidDate(jdp, jdp.today.year, jdp.today.month, jdp.today.day);

export const isValidValueString = (jdp, str) => {
    if (!str) {
        return false;
    }
    const sepOpt = jdp.options.separatorChars;
    const datePattern = jdp.options.date ? `\\d{4}${sepOpt.date}\\d{2}${sepOpt.date}\\d{2}` : "";
    const timePattern = jdp.options.time ? `\\d{2}${sepOpt.time}\\d{2}` + (jdp.options.hasSecond ? `${sepOpt.time}\\d{2}` : "") : "";
    const regex = new RegExp(datePattern + (datePattern && timePattern ? sepOpt.between : "") + timePattern);

    return regex.test(str, "g");
};

export const getValueObjectFromString = (jdp, str) => {
    const sepOpt = jdp.options.separatorChars;

    const sep = str.split(sepOpt.between);
    const date = jdp.options.date ? sep[0].split(sepOpt.date) : {};
    const time = jdp.options.date ? (jdp.options.time && sep[1]) ? sep[1].split(sepOpt.time) : {} : sep[0].split(sepOpt.time);
    return {
        year: parseInt(date[0]),
        month: parseInt(date[1]),
        day: parseInt(date[2]),
        hour: parseInt(time[0]),
        minute: parseInt(time[1]),
        second: parseInt(time[2])
    };
};

export const getValueStringFromValueObject = (jdp, obj) => {
    const sepChar = jdp.options.separatorChars;
    const dateStr = jdp.options.date ? `${obj.year}${sepChar.date}${addLeadingZero(obj.month)}${sepChar.date}${addLeadingZero(obj.day)}` : "";
    const timeStr = jdp.options.time ? `${addLeadingZero(obj.hour)}${sepChar.time}${addLeadingZero(obj.minute)}` + (jdp.options.hasSecond ? sepChar.time + addLeadingZero(obj.second) : "") : "";
    const betweenStr = dateStr && timeStr ? sepChar.between : "";
    return dateStr + betweenStr + timeStr;
};

export const getDateValueStringFromValueObject = (jdp, obj) => {
    const sepChar = jdp.options.separatorChars;
    return `${obj.year}${sepChar.date}${addLeadingZero(obj.month)}${sepChar.date}${addLeadingZero(obj.day)}`;
};

export const isValidDateString = (jdp, str) => {
    if (!str) {
        return false;
    }
    const date = str.substr(0, 10).split(jdp.options.separatorChars.date);
    return date.length === 3 && date[0].length === 4 && date[1].length === 2 && date[2].length === 2;
};

export const isValidTimeString = (jdp, str) => {
    if (!str) {
        return false;
    }

    const time = str.substr(jdp.options.date ? 11 : 0, 8).split(jdp.options.separatorChars.time);
    return time.length === (jdp.options.hasSecond ? 3 : 2) && !time.find(t => t.toString().length !== 2);
};