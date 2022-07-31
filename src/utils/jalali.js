import {
    mod
} from "./object";

const isLeapYear = (jy) => {
    function div(a, b) {
        return ~~(a / b);
    }
    const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178],
        bl = breaks.length;
    let jump = 0,
        leapJ = -14,
        jp = breaks[0],
        leap;
    for (let i = 1; i < bl; i += 1) {
        const jm = breaks[i];
        jump = jm - jp;
        if (jy < jm)
            break;
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
    }
    let n = jy - jp;
    if (jump - n < 6)
        n = n - jump + div(jump + 4, 33) * 33;
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;
    return leap === 0;
};

export const jalaliToday = () => {
    const date = new Date();
    let gy = parseInt(date.getFullYear());
    const gm = parseInt(date.getMonth()) + 1;
    const gd = parseInt(date.getDate());

    let jy, days;
    const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (gy > 1600) {
        jy = 979;
        gy -= 1600;
    } else {
        jy = 0;
        gy -= 621;
    }
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    days = (365 * gy) +
        parseInt((gy2 + 3) / 4) -
        parseInt((gy2 + 99) / 100) +
        parseInt((gy2 + 399) / 400) -
        80 +
        gd +
        gdm[gm - 1];
    jy += 33 * parseInt(days / 12053);
    days %= 12053;
    jy += 4 * parseInt(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += parseInt((days - 1) / 365);
        days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

    return {
        year: jy,
        month: jm,
        day: jd
    };
};

export const getWeekDay = (year, month, day) => {
    const getDays = (month, day) => {
        if (month < 8) return (month - 1) * 31 + day;
        return 6 * 31 + (month - 7) * 30 + day;
    };
    const getDiffDays = (year1, month1, day1, year2, month2, day2) => {
        let diffDays = getDays(month2, day2) - getDays(month1, day1);
        const y1 = (year1 < year2) ? year1 : year2;
        const y2 = (year1 < year2) ? year2 : year1;
        for (let y = y1; y < y2; y++) {
            if (isLeapYear(y)) diffDays += (year1 < year2) ? 366 : -366;
            else diffDays += (year1 < year2) ? 365 : -365;
        }
        return diffDays;
    };
    return mod(getDiffDays(1392, 3, 25, year, month, day), 7);
};

export const getDaysInMonth = (year, month) => {
    return [
        0,
        31, 31, 31,
        31, 31, 31,
        30, 30, 30,
        30, 30, (isLeapYear(year) ? 30 : 29)
    ][month];
};