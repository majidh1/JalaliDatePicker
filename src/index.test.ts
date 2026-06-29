import { beforeEach, describe, expect, it, vi } from "vitest";

import { DateObject, DayOptions } from "./models/types";
import { EVENT_CHANGE_INPUT_STR } from "./constants";

declare global {
	interface Window {
		jalaliDatepicker: {
			startWatch(options?: Record<string, unknown>): void;
			show(input: HTMLInputElement): void;
			hide(): void;
			updateOptions(options: Record<string, unknown>): void;
		};
	}
}

const loadDatepicker = async () => {
	vi.resetModules();
	await import("./index");
	return window.jalaliDatepicker;
};

const findDay = (day: number, month: number, year: number) =>
	Array.from(document.querySelectorAll<HTMLElement>(".jdp-day")).find(
		(element) => (element as unknown as DateObject).day === day && (element as unknown as DateObject).month === month && (element as unknown as DateObject).year === year
	);

beforeEach(() => {
	document.body.replaceWith(document.createElement("body"));
	delete (window as Partial<Window>).jalaliDatepicker;
});

describe("jalaliDatepicker public API", () => {
	it("shows and hides the datepicker for a manual input", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		jdp.show(input);

		const container = document.querySelector<HTMLElement>("jdp-container");
		expect(container).not.toBeNull();
		expect(container?.style.display).toBe("block");

		jdp.hide();

		expect(container?.style.display).toBe("none");
	});

	it("updates z-index on existing datepicker elements", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			zIndex: 1000
		});
		jdp.show(input);

		const container = document.querySelector<HTMLElement>("jdp-container");
		const overlay = document.querySelector<HTMLElement>("jdp-overlay");
		expect(container?.style.zIndex).toBe("1000");
		expect(overlay?.style.zIndex).toBe("999");

		jdp.updateOptions({
			zIndex: 2000
		});

		expect(container?.style.zIndex).toBe("2000");
		expect(overlay?.style.zIndex).toBe("1999");
	});

	it("auto-shows on focus and writes the selected date to the input", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		input.setAttribute("data-jdp", "");
		input.value = "1403/01/01";
		document.body.appendChild(input);
		const changeHandler = vi.fn();
		input.addEventListener(EVENT_CHANGE_INPUT_STR, changeHandler);

		jdp.startWatch({
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
		findDay(10, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/10");
		expect(changeHandler).toHaveBeenCalledTimes(1);
		expect(document.querySelector<HTMLElement>("jdp-container")?.style.display).toBe("none");
	});

	it("keeps min-date days disabled when boundaries come from attributes", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		input.setAttribute("data-jdp", "");
		input.setAttribute("data-jdp-min-date", "1403/01/10");
		input.value = "1403/01/01";
		document.body.appendChild(input);

		jdp.startWatch({
			minDate: "attr",
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
		findDay(5, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/01");
		expect(findDay(5, 1, 1403)?.classList.contains("disabled-day")).toBe(true);
	});

	it("selects valid 31-day Jalali dates without JavaScript Date autocorrection", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			today: {
				year: 1405,
				month: 2,
				day: 1
			}
		});
		jdp.show(input);
		findDay(31, 2, 1405)?.click();

		expect(input.value).toBe("1405/02/31");
	});

	it("uses dayRendering to disable a specific day", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		input.value = "1403/01/01";
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			today: {
				year: 1403,
				month: 1,
				day: 1
			},
			dayRendering(dayOptions: DayOptions) {
				if (dayOptions.year === 1403 && dayOptions.month === 1 && dayOptions.day === 10) {
					return {
						...dayOptions,
						isValid: false
					};
				}
				return dayOptions;
			}
		});
		jdp.show(input);
		findDay(10, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/01");
		expect(findDay(10, 1, 1403)?.classList.contains("disabled-day")).toBe(true);
	});

	it("uses today as the initial date when initDate is today", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			initDate: "today",
			today: {
				year: 1405,
				month: 6,
				day: 31
			}
		});
		jdp.show(input);
		findDay(30, 6, 1405)?.click();

		expect(input.value).toBe("1405/06/30");
	});

	it("selects time-only values without seconds when hasSecond is false", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			date: false,
			time: true,
			hasSecond: false,
			initTime: {
				hour: 9,
				minute: 5,
				second: 0
			}
		});
		jdp.show(input);
		document.querySelector<HTMLElement>(".jdp-btn-today")?.click();

		expect(input.value).toBe("09:05");
	});

	it("uses min time from attributes as a time-only value", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		input.setAttribute("data-jdp-min-time", "09:15:00");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			date: false,
			time: true,
			minTime: "attr",
			initTime: {
				hour: 8,
				minute: 0,
				second: 0
			}
		});
		jdp.show(input);
		document.querySelector<HTMLElement>(".jdp-btn-today")?.click();

		expect(input.value).toBe("09:15:00");
	});

	it("updates a target HTMLElement with a Gregorian value", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		const target = document.createElement("input");
		input.value = "1403/01/01";
		document.body.append(input, target);

		jdp.startWatch({
			autoShow: false,
			targetValueInput: target,
			targetValueType: "gregorian",
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		jdp.show(input);
		findDay(2, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/02");
		expect(target.value).toBe("2024-03-21");
	});

	it("reads target value input and type from attributes", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		const target = document.createElement("input");
		target.id = "gregorian-date-attr";
		input.value = "1403/01/01";
		input.setAttribute("data-jdp-target-value-input", "#gregorian-date-attr");
		input.setAttribute("data-jdp-target-value-type", "gregorian");
		document.body.append(input, target);

		jdp.startWatch({
			autoShow: false,
			targetValueInput: "attr",
			targetValueType: "attr",
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		jdp.show(input);
		findDay(2, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/02");
		expect(target.value).toBe("2024-03-21");
	});

	it("selects a date range and highlights the days inside it", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			hideAfterChange: false,
			mode: "range",
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		jdp.show(input);
		findDay(10, 1, 1403)?.click();
		findDay(12, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/10 - 1403/01/12");
		expect(findDay(10, 1, 1403)?.classList.contains("range-start")).toBe(true);
		expect(findDay(11, 1, 1403)?.classList.contains("in-range")).toBe(true);
		expect(findDay(12, 1, 1403)?.classList.contains("range-end")).toBe(true);
	});

	it("selects and toggles multiple dates", async () => {
		const jdp = await loadDatepicker();
		const input = document.createElement("input");
		document.body.appendChild(input);

		jdp.startWatch({
			autoShow: false,
			mode: "multiple",
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});
		jdp.show(input);
		findDay(12, 1, 1403)?.click();
		findDay(10, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/10, 1403/01/12");
		expect(findDay(10, 1, 1403)?.classList.contains("selected")).toBe(true);
		expect(findDay(12, 1, 1403)?.classList.contains("selected")).toBe(true);

		findDay(10, 1, 1403)?.click();

		expect(input.value).toBe("1403/01/12");
		expect(findDay(10, 1, 1403)?.classList.contains("selected")).toBe(false);
		expect(findDay(12, 1, 1403)?.classList.contains("selected")).toBe(true);
	});

	it("reads selection mode from each input attribute", async () => {
		const jdp = await loadDatepicker();
		const rangeInput = document.createElement("input");
		const multipleInput = document.createElement("input");
		rangeInput.setAttribute("data-jdp-mode", "range");
		multipleInput.setAttribute("data-jdp-mode", "multiple");
		document.body.append(rangeInput, multipleInput);

		jdp.startWatch({
			autoShow: false,
			hideAfterChange: false,
			mode: "attr",
			today: {
				year: 1403,
				month: 1,
				day: 1
			}
		});

		jdp.show(rangeInput);
		findDay(3, 1, 1403)?.click();
		findDay(5, 1, 1403)?.click();

		expect(rangeInput.value).toBe("1403/01/03 - 1403/01/05");

		jdp.show(multipleInput);
		findDay(7, 1, 1403)?.click();
		findDay(9, 1, 1403)?.click();

		expect(multipleInput.value).toBe("1403/01/07, 1403/01/09");
	});
});

