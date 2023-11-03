import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface ArrayValidatorMessages {
	invalidFormat?: string | ((val: any) => string);
	invalidMinLength?: string | ((min: number, val: any) => string);
	invalidMaxLength?: string | ((max: number, val: any) => string);
	invalidRange?: string | ((min: number, max: number, val: any) => string);
}

export interface ArrayValidatorConfig {
	/**
	 * A validator that will validate each element of the array
	 */
	itemValidator?: () => ElementUIValidator;
	/**
	 * Minimum array length
	 * @example
	 * ArrayValidator({ minLength: 2 }).validate(["a"]) // invalid
	 *
	 * ArrayValidator({ minLength: 2 }).validate(["a", "b"]) // valid
	 *
	 */
	minLength?: number;
	/**
	 * Miximum array length
	 * @example
	 * ArrayValidator({ maxLength: 2 }).validate(["a"]) // valid
	 *
	 * ArrayValidator({ maxLength: 2 }).validate(["a", "b", "c"]) // invalid
	 *
	 */
	maxLength?: number;
	/**
	 * Object with error messages
	 */
	messages?: ArrayValidatorMessages;
}

export type ArrayValidatorFactory = ValidatorFactory<
	ArrayValidatorConfig,
	ElementUIValidator
>;
