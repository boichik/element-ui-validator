import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface StringValidatorMessages {
	invalidFormat?: string | ((val: any) => string);
	invalidMinLength?: string | ((min: number, val: any) => string);
	invalidMaxLength?: string | ((max: number, val: any) => string);
	invalidRange?: string | ((min: number, max: number, val: any) => string);
	invalidUppercase?: string | ((val: any) => string);
	invalidLowercase?: string | ((val: any) => string);
	hasDisallowedSymbols?:
		| string
		| ((notAllowedSymbols: string[], val: any) => string);
}

export interface StringValidatorConfig {
	/**
	 * Parameter responsible for the minimum length of the string.
	 * @example
	 * StringValidator({ minLength: 5 }).validate("Hello world!") // invalid
	 *
	 * StringValidator({ minLength: 12 }).validate("Hello world!") // valid
	 */
	minLength?: number;
	/**
	 * Parameter responsible for the maximum length of the string.
	 * @example
	 * StringValidator({ maxLength: 5 }).validate("Hello world!") // invalid
	 *
	 * StringValidator({ maxLength: 15 }).validate("Hello world!") // valid
	 */
	maxLength?: number;
	/**
	 * Parameter responsible for checking if the string is in uppercase.
	 * @example
	 * StringValidator({ onlyUppercase: true }).validate("Hello world!") // invalid
	 *
	 * StringValidator({ onlyUppercase: true }).validate("Hello WORLD!") // invalid
	 *
	 * StringValidator({ onlyUppercase: true }).validate("HELLO WORLD!") // valid
	 */
	onlyUppercase?: boolean;
	/**
	 * Parameter responsible for checking if the string is in lowercase.
	 * @example
	 * StringValidator({ onlyLowercase: true }).validate("Hello world!") // invalid
	 *
	 * StringValidator({ onlyLowercase: true }).validate("hello world!") // valid
	 */
	onlyLowercase?: boolean;
	/**
	 * The parameter responsible for checking the tape whether it contains forbidden characters
	 * @example
	 * StringValidator({ disallowedSymbols: ["-"] }).validate("hello-world") // invalid
	 *
	 * StringValidator({ disallowedSymbols: ["-"] }).validate("hello world") // valid
	 */
	disallowedSymbols?: string[];
	/**
	 * Object with error messages
	 */
	messages?: StringValidatorMessages;
}

export type StringValidatorFactory = ValidatorFactory<
	StringValidatorConfig,
	ElementUIValidator
>;
