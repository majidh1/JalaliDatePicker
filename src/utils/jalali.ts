import { mod } from "./object";

const isLeapYear = (jy: number) => {
	function div(a: number, b: number) {
		return ~~(a / b);
	}
	const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
	const bl = breaks.length;
	let jump = 0;
	let leapJ = -14;
	let jp = breaks[0];
	let leap;
	for (let i = 1; i < bl; i += 1) {
		const jm = breaks[i];
		jump = jm - jp;
		if (jy < jm) break;
		leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
		jp = jm;
	}
	let n = jy - jp;
	if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
	leap = mod(mod(n + 1, 33) - 1, 4);
	if (leap === -1) leap = 4;
	return leap === 0;
};

export const toJalali = (gy: number, gm: number, gd: number) => {
	let jy;
	let days;
	const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	if (gy > 1600) {
		jy = 979;
		gy -= 1600;
	} else {
		jy = 0;
		gy -= 621;
	}
	const gy2 = gm > 2 ? gy + 1 : gy;
	days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + gdm[gm - 1];
	jy += 33 * Math.floor(days / 12053);
	days %= 12053;
	jy += 4 * Math.floor(days / 1461);
	days %= 1461;
	if (days > 365) {
		jy += Math.floor((days - 1) / 365);
		days = (days - 1) % 365;
	}
	const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
	const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

	return {
		year: jy,
		month: jm,
		day: jd
	};
};

export const jalaliToday = () => {
	const date = new Date();
	const gy = date.getFullYear();
	const gm = date.getMonth() + 1;
	const gd = date.getDate();
	return toJalali(gy, gm, gd);
};

export const getWeekDay = (year: number, month: number, day: number) => {
	const getDays = (_month: number, _day: number) => {
		if (_month < 8) return (_month - 1) * 31 + _day;
		return 6 * 31 + (_month - 7) * 30 + _day;
	};
	const getDiffDays = (year1: number, month1: number, day1: number, year2: number, month2: number, day2: number) => {
		let diffDays = getDays(month2, day2) - getDays(month1, day1);
		const y1 = year1 < year2 ? year1 : year2;
		const y2 = year1 < year2 ? year2 : year1;
		for (let y = y1; y < y2; y++) {
			if (isLeapYear(y)) diffDays += year1 < year2 ? 366 : -366;
			else diffDays += year1 < year2 ? 365 : -365;
		}
		return diffDays;
	};
	return mod(getDiffDays(1392, 3, 25, year, month, day), 7);
};

export const getDaysInMonth = (year: number, month: number) => [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, isLeapYear(year) ? 30 : 29][month];

export const toGregorian = (jy: number, jm: number, jd: number) => {
	let gy = jy <= 979 ? 621 : 1600;
	jy -= jy <= 979 ? 0 : 979;
	let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
	gy += 400 * Math.floor(days / 146097);
	days %= 146097;
	if (days > 36524) {
		gy += 100 * Math.floor(--days / 36524);
		days %= 36524;
		if (days >= 365) days++;
	}
	gy += 4 * Math.floor(days / 1461);
	days %= 1461;
	if (days > 365) {
		gy += Math.floor((days - 1) / 365);
		days = (days - 1) % 365;
	}
	let gd = days + 1;
	const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	let gm;
	for (gm = 0; gm < 13; gm++) {
		const v = sal_a[gm];
		if (gd <= v) break;
		gd -= v;
	}

	return {
		year: gy,
		month: gm,
		day: gd
	};
};
