import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface DateValidatorMessages {
	invalidFormat?: string | ((val: any) => string);
	invalidMinDate?: string | ((min: Date, val: any) => string);
	invalidMaxDate?: string | ((max: Date, val: any) => string);
	invalidRange?: string | ((min: Date, max: Date, val: any) => string);
}

export interface DateValidatorConfig {
	/**
	 * Minimum date
	 * @example
	 * DateValidator({ minDate: '14.08.18' }).validate('15.09.19') // valid
	 *
	 * DateValidator({ minDate: '14.08.18' }).validate('05.12.16') // invalid
	 *
	 */
	minDate?: Date | string | number;
	/**
	 * Maximum date
	 * @example
	 * DateValidator({ maxDate: '14.08.18' }).validate('15.09.19') // invalid
	 *
	 * DateValidator({ maxDate: '14.08.18' }).validate('05.12.16') // valid
	 *
	 */
	maxDate?: Date | string | number;
	/**
	 * Object with error messages
	 */
	messages?: DateValidatorMessages;
}

export type DateValidatorFactory = ValidatorFactory<
	DateValidatorConfig,
	ElementUIValidator
>;
