/* eslint-disable @typescript-eslint/member-ordering */
import { JalaliDatepickerInternalOptions } from "./internalOption.model";

export interface DateObject {
	year: number;
	month: number;
	day: number;
}

export interface TimeObject {
	hour: number;
	minute: number;
	second: number;
}

export interface SeparatorChars {
	date: string;
	between: string;
	time: string;
	targetDate: string;
	targetBetween: string;
	targetTime: string;
}

export interface ValueObject extends Partial<DateObject>, Partial<TimeObject> {}

export interface DayOptions {
	inBeforeMonth: boolean;
	inAfterMonth: boolean;
	isValid: boolean;
	isHollyDay: boolean;
	className: string;
	day: number;
	month: number;
	year: number;
	weekDay: number;
}

export class IJalaliDatepickerExternalOptions {
	dayRendering?(day: DayOptions, input: HTMLInputElement | null): DayOptions; // Will refine later
	minDate?: DateObject | "today" | "attr";
	maxDate?: DateObject | "today" | "attr";
	initDate?: DateObject | "today" | "attr";
	minTime?: TimeObject | "today" | "attr";
	maxTime?: TimeObject | "today" | "attr";
	initTime?: TimeObject | "today" | "attr";
	container: string | HTMLElement;
	selector: string;
	zIndex: number;
	autoShow: boolean;
	autoHide: boolean;
	autoReadOnlyInput: boolean;
	topSpace: number;
	bottomSpace: number;
	overflowSpace: number;
	hideAfterChange: boolean;
	changeMonthRotateYear: boolean;
	showTodayBtn: boolean;
	showEmptyBtn: boolean;
	showCloseBtn: boolean;
	showSelectTimeBtnAlways: boolean;
	date: boolean;
	time: boolean;
	today: DateObject;
	hasSecond: boolean;
	targetValueInput?: string | HTMLInputElement | "attr";
	targetValueType?: "miladi" | "attr";
	days: string[];
	months: string[];
	separatorChars: SeparatorChars;
	persianDigits: boolean;
	plusHtml: string;
	minusHtml: string;
	useDropDownYears: boolean;
	position: "left" | "right" | "center";
}

export interface JalaliDatepicker {
	init(options: Partial<IJalaliDatepickerExternalOptions>): void;
	updateOptions(options: Partial<IJalaliDatepickerExternalOptions>): void;
	options: JalaliDatepickerInternalOptions;
	input: HTMLInputElement | null;
	isTransitioning: boolean;
	dpContainer: HTMLElement;
	_dpContainer: HTMLElement | undefined;
	overlayElm: HTMLElement | undefined;
	today: DateObject;
	_today: DateObject | undefined;
	inputValue: ValueObject;
	initDate: DateObject;
	_initDate: DateObject | null;
	initTime: TimeObject;
	_initTime: TimeObject | null;
	_draw(): void;
	show(input: HTMLInputElement): void;
	hide(): void;
	setPosition(): void;
	getValue: ValueObject;
	_value: ValueObject | null;
	setValue(objValue: ValueObject): void;
	cleanValue(): void;
	setTargetValue(): void;
	increaseMonth(): void;
	decreaseMonth(): void;
	monthChange(month: number): void;
	increaseYear(): void;
	decreaseYear(): void;
	yearChange(year: number): void;
	isShow: boolean;
}
