export const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
export const isFunction = (value: unknown): value is Function => typeof value === "function";
export const isString = (value: unknown): value is string => typeof value === "string";
export const isObject = (value: unknown): value is object => typeof value === "object";

export const clon = (a: Object | string) => JSON.parse(JSON.stringify(a));

export const isNotObjectOrIsEmptyObject = (obj: Object | null | undefined): obj is undefined => {
	if (!isObject(obj)) {
		return false;
	}

	try {
		return JSON.stringify(obj) === "{}";
	} catch (e) {
		return false;
	}
};

export const extend = <T extends object, U extends object>(target: T, source: U): T & U => {
	for (const key in source) {
		// eslint-disable-next-line no-prototype-builtins
		if (source.hasOwnProperty(key)) {
			const sourceValue = source[key];
			const targetValue = (target as any)[key];

			if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
				(target as any)[key] = extend(targetValue && typeof targetValue === "object" ? targetValue : {}, sourceValue);
			} else {
				(target as any)[key] = sourceValue;
			}
		}
	}

	return target as T & U;
};

export const mod = (a: number, b: number) => window.Math.abs(a - b * window.Math.floor(a / b));

export const addLeadingZero = (value: number | undefined, length = 2) => {
	if (isUndefined(value)) {
		return value;
	}
	const str = String(Math.abs(value));
	let i = str.length;
	let result = "";

	if (value < 0) {
		result += "-";
	}

	while (i < length) {
		i += 1;
		result += "0";
	}

	return result + str;
};
