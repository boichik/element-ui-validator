import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface NumberValidatorMessages {
	invalidFormat?: string | ((value: any) => string);
	invalidType?: string | ((type: 'integer' | 'float', value: any) => string);
	invalidDecimalPlaces?: string | ((decimal: number, value: any) => string);
	invalidMin?: string | ((min: number, value: any) => string);
	invalidMinStrict?: string | ((min: number, value: any) => string);
	invalidMax?: string | ((max: number, value: any) => string);
	invalidMaxStrict?: string | ((max: number, value: any) => string);
	invalidMinMax?: string | ((min: number, max: number, value: any) => string);
	invalidMinStrictMax?:
		| string
		| ((min: number, max: number, value: any) => string);
	invalidMinMaxStrict?:
		| string
		| ((min: number, max: number, value: any) => string);
	invalidMinStrictMaxStrict?:
		| string
		| ((min: number, max: number, value: any) => string);
}

export interface NumberValidatorConfig {
	/**
	 * Minimum number. This parameter is responsible for the fact that the value entered must be greater than this.
	 * @example
	 * NumberValidator({ min: 5 }).validate(4) // not valid
	 *
	 * NumberValidator({ min: 5 }).validate(5) // valid
	 *
	 */
	min?: number;
	/**
	 * Maximum number. This parameter is responsible for the fact that the entered value should be less than this.
	 * @example
	 * NumberValidator({ max: 5 }).validate(5) // valid
	 *
	 * NumberValidator({ max: 10 }).validate(15) // not valid
	 *
	 */
	max?: number;
	/**
	 * Minimum strict number. This parameter is responsible for the fact that the value entered must be greater than and not equal to it.
	 * @example
	 * NumberValidator({ minStrict: 5 }).validate(5) // not valid
	 *
	 * NumberValidator({ minStrict: 5 }).validate(6) // valid
	 *
	 */
	minStrict?: number;
	/**
	 * Maximum strict number. This parameter is responsible for the fact that the value entered must be less than and not equal to it.
	 * @example
	 * NumberValidator({ maxStrict: 10 }).validate(6) // valid
	 *
	 * NumberValidator({ maxStrict: 10 }).validate(10) // not valid
	 *
	 */
	maxStrict?: number;
	/**
	 * Allow numbers with string type.
	 * @example
	 * NumberValidator({ allowString: true }).validate(10) // valid
	 *
	 * NumberValidator({ allowString: true }).validate("15") // valid
	 *
	 * NumberValidator({ allowString: false }).validate("34") // not valid
	 *
	 */
	allowString?: boolean;
	/**
	 * Type of number. Using this parameter, you can validate values   by type of number (integer or floating point).All types are accepted by default.
	 * @example
	 * NumberValidator({ type: 'integer' }).validate(10) // valid
	 *
	 * NumberValidator({ type: 'integer' }).validate(10.5) // not valid
	 *
	 * NumberValidator({ type: 'float' }).validate(3.14) // valid
	 *
	 * NumberValidator({ type: 'float' }).validate(3) // not valid
	 *
	 */
	type?: 'integer' | 'float';
	/**
	 * Number of decimal places
	 * @example
	 * NumberValidator({ decimalPlaces: 2 }).validate(3) // valid
	 *
	 * NumberValidator({ decimalPlaces: 2 }).validate(3.14) // valid
	 *
	 * NumberValidator({ decimalPlaces: 2 }).validate(3.1415) // not valid
	 *
	 */
	decimalPlaces?: number;
	/**
	 * Object with error messages
	 */
	messages?: NumberValidatorMessages;
}

export type NumberValidatorFactory = ValidatorFactory<
	NumberValidatorConfig,
	ElementUIValidator
>;
