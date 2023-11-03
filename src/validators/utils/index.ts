export const getErrorMessage = (
	val: undefined | string | Function,
	...args: any
) => {
	if (!val) {
		return undefined;
	}
	return typeof val === 'string' ? val : val(...args);
};

export const getValidationResult = (valid: boolean, message?: string) => {
	return {
		valid,
		message: message || null,
	};
};

export const isNumber = (value: any) => {
	return typeof value === 'number' && !isNaN(value);
};

export const isDate = (val: any) => {
	return typeof val === 'number'
		? !isNaN(Date.parse(new Date(val).toString()))
		: !isNaN(Date.parse(val));
};
