import { ElementUIValidator, ValidatorFactory } from '../../types';

export interface EmailValidatorMessages {
	invalidFormat?: string | ((val: any) => string);
	notAllowedDomain?: string | ((domains: string[], val: any) => string);
	domainFromBlackList?: string | ((domains: string[], val: any) => string);
}

export interface EmailValidatorConfig {
	/**
	 * Array of domains that are valid for email
	 * @example
	 * EmailValidator({ allowedDomainList: ["example.com"] }).validate("test@test.com") // invalid
	 *
	 * EmailValidator({ allowedDomainList: ["example.com"] }).validate("test@example.com") // valid
	 *
	 */
	allowedDomainList?: string[];
	/**
	 * Array of domains that are not valid for email
	 */
	blackListDomain?: string[];
	/**
	 * Object with error messages
	 */
	messages?: EmailValidatorMessages;
}

export type EmailValidatorFactory = ValidatorFactory<
	EmailValidatorConfig,
	ElementUIValidator
>;
