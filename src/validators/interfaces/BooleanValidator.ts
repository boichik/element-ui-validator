import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface BooleanValidatorMessages {
	invalidFormat?: string | ((val: any) => string);
}

export interface BooleanValidatorConfig {
	/**
	 * Allow Boolean values as string
	 * @example
	 * BooleanValidator({ allowString: true }).validate("true") // valid
	 *
	 * BooleanValidator({ allowString: false }).validate("true") // invalid
	 *
	 */
	allowString?: boolean;
	/**
	 * Object with error messages
	 */
	messages?: BooleanValidatorMessages;
}

export type BooleanValidatorFactory = ValidatorFactory<
	BooleanValidatorConfig,
	ElementUIValidator
>;
