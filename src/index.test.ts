import { beforeEach, describe, expect, it, vi } from "vitest";

import { DateObject } from "./models/types";
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
});
