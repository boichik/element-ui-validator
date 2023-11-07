import { ElementUIValidator, ValidationResult } from '../../types';
import { getErrorMessage, getValidationResult } from '../utils';
import {
	EmailValidatorConfig,
	EmailValidatorFactory,
	EmailValidatorMessages,
} from '../interfaces/EmailValidator';

const regexpEmailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export class EmailValidator implements ElementUIValidator {
	protected _errorMessages: EmailValidatorMessages;

	constructor(private readonly _config?: EmailValidatorConfig) {
		const { messages } = this._config || {};

		this._errorMessages = messages || {};
	}

	validate(value: any): ValidationResult {
		if (
			typeof value !== 'string' ||
			(typeof value === 'string' && !regexpEmailFormat.test(value))
		) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidFormat, value)
			);
		}

		const domain = value.split('@')[1].toLowerCase();

		if (
			!!this._config?.allowedDomainList &&
			this._config.allowedDomainList.length &&
			!this._config.allowedDomainList.includes(domain)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.notAllowedDomain,
					this._config.allowedDomainList,
					value
				)
			);
		}

		if (
			!!this._config?.blackListDomain &&
			this._config.blackListDomain.length &&
			!!this._config.blackListDomain.includes(domain)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.domainFromBlackList,
					this._config.blackListDomain,
					value
				)
			);
		}

		return getValidationResult(true);
	}
}

export const createEmailValidatorFactory = ({
	allowedDomainList: defaultAllowedDomainList,
	blackListDomain: defaultBlackListDomain,
	messages: {
		invalidFormat: defaultInvalidFormat,
		notAllowedDomain: defaultNotAllowedDomain,
		domainFromBlackList: defaultDomainFromBlackList,
	} = {},
}: EmailValidatorConfig = {}): EmailValidatorFactory => {
	return ({
		allowedDomainList = defaultAllowedDomainList,
		blackListDomain = defaultBlackListDomain,
		messages: {
			invalidFormat = defaultInvalidFormat,
			notAllowedDomain = defaultNotAllowedDomain,
			domainFromBlackList = defaultDomainFromBlackList,
		} = {},
	}: EmailValidatorConfig = {}) =>
		new EmailValidator({
			allowedDomainList,
			blackListDomain,
			messages: {
				invalidFormat,
				notAllowedDomain,
				domainFromBlackList,
			},
		});
};
