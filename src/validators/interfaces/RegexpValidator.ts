import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface RegexpValidatorMessages {
	invalidValue?: string | ((val: any) => string);
}

export interface RegexpValidatorConfig {
	/**
	 * Regular expression
	 */
	regexp?: string | RegExp;
	/**
	 * Flag to regular expression
	 */
	flags?: string;
	/**
	 * Object with error messages
	 */
	messages?: RegexpValidatorMessages;
}

export type RegexpValidatorFactory = ValidatorFactory<
	RegexpValidatorConfig,
	ElementUIValidator
>;
