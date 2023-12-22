import { ElementUIValidator, ValidationResult } from '../../types';
import {
	StringValidatorConfig,
	StringValidatorFactory,
	StringValidatorMessages,
} from '../interfaces/StringValidator';
import { getValidationResult, getErrorMessage, isNumber } from '../utils';

const _hasDisallowedSymbols = (value: string, disallowedSymbols: string[]) => {
	return disallowedSymbols.some(symbol => value.includes(symbol));
};

export class StringValidator implements ElementUIValidator {
	protected _errorMessages: StringValidatorMessages;

	constructor(private _config?: StringValidatorConfig) {
		this._errorMessages = this._config?.messages || {};
	}

	validate(value: any): ValidationResult {
		if (typeof value !== 'string') {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidFormat, value)
			);
		}

		if (
			!!this._config?.disallowedSymbols &&
			!!Array.isArray(this._config.disallowedSymbols) &&
			!!this._config.disallowedSymbols.length &&
			!!_hasDisallowedSymbols(value, this._config.disallowedSymbols)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.hasDisallowedSymbols,
					this._config.disallowedSymbols,
					value
				)
			);
		}

		if (
			!!isNumber(this._config?.minLength) &&
			!!isNumber(this._config?.maxLength) &&
			(this._config?.minLength! > value.length ||
				value.length > this._config?.maxLength!)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidRange,
					this._config?.minLength,
					this._config?.maxLength,
					value
				)
			);
		}

		if (
			!!isNumber(this._config?.minLength) &&
			this._config?.minLength! > value.length
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinLength,
					this._config?.minLength,
					value
				)
			);
		}

		if (
			!!isNumber(this._config?.maxLength) &&
			value.length > this._config?.maxLength!
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMaxLength,
					this._config?.maxLength,
					value
				)
			);
		}

		if (
			!!this._config?.onlyUppercase &&
			typeof this._config?.onlyUppercase === 'boolean' &&
			value !== value.toUpperCase()
		) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidUppercase, value)
			);
		}

		if (
			!!this._config?.onlyLowercase &&
			typeof this._config?.onlyLowercase === 'boolean' &&
			value !== value.toLowerCase()
		) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidLowercase, value)
			);
		}

		return getValidationResult(true);
	}
}

export const createStringValidatorFactory = ({
	messages: {
		invalidFormat: defaultInvalidFormat,
		invalidMinLength: defaultInvalidMinLength,
		invalidMaxLength: defaultInvalidMaxLength,
		invalidRange: defaultInvalidRange,
		invalidUppercase: defaultInvalidUppercase,
		invalidLowercase: defaultInvalidLowercase,
		hasDisallowedSymbols: defaultHasDisallowedSymbols,
	} = {},
}: {
	messages?: StringValidatorMessages;
} = {}): StringValidatorFactory => {
	return ({
		minLength,
		maxLength,
		onlyLowercase,
		onlyUppercase,
		disallowedSymbols,
		messages: {
			invalidFormat = defaultInvalidFormat,
			invalidMinLength = defaultInvalidMinLength,
			invalidMaxLength = defaultInvalidMaxLength,
			invalidRange = defaultInvalidRange,
			invalidLowercase = defaultInvalidLowercase,
			invalidUppercase = defaultInvalidUppercase,
			hasDisallowedSymbols = defaultHasDisallowedSymbols,
		} = {},
	}: StringValidatorConfig = {}) =>
		new StringValidator({
			minLength,
			maxLength,
			onlyLowercase,
			onlyUppercase,
			disallowedSymbols,
			messages: {
				invalidFormat,
				invalidMinLength,
				invalidMaxLength,
				invalidRange,
				invalidLowercase,
				invalidUppercase,
				hasDisallowedSymbols,
			},
		});
};
