import { ElementUIValidator, ValidationResult } from '../../types';
import {
	ArrayValidatorConfig,
	ArrayValidatorFactory,
	ArrayValidatorMessages,
} from '../interfaces/ArrayValidator';
import { getErrorMessage, getValidationResult, isNumber } from '../utils';

export class ArrayValidator implements ElementUIValidator {
	protected _errorMessages: ArrayValidatorMessages;

	constructor(private readonly _config?: ArrayValidatorConfig) {
		const { messages } = this._config || {};

		this._errorMessages = messages || {};
	}

	validate(value: any): ValidationResult {
		if (!Array.isArray(value)) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidFormat, value)
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
					this._config?.minLength!,
					this._config?.maxLength!,
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
			this._config?.itemValidator &&
			typeof this._config.itemValidator === 'function' &&
			!!this._config.itemValidator().validate!
		) {
			let result: ValidationResult | null = null;
			for (const el of value) {
				result = this._config.itemValidator().validate(el);

				if (result && !result.valid) {
					break;
				}
			}

			if (result && !result.valid) {
				return getValidationResult(false, result.message || undefined);
			}
		}

		return getValidationResult(true);
	}
}

export const createArrayValidatorFactory = ({
	messages: {
		invalidFormat: defaultInvalidFormat,
		invalidMinLength: defaultInvalidMinLength,
		invalidMaxLength: defaultInvalidMaxLength,
		invalidRange: defaultInvalidRange,
	} = {},
}: { messages?: ArrayValidatorMessages } = {}): ArrayValidatorFactory => {
	return ({
		itemValidator,
		minLength,
		maxLength,
		messages: {
			invalidFormat = defaultInvalidFormat,
			invalidMinLength = defaultInvalidMinLength,
			invalidMaxLength = defaultInvalidMaxLength,
			invalidRange = defaultInvalidRange,
		} = {},
	}: ArrayValidatorConfig = {}) =>
		new ArrayValidator({
			itemValidator,
			minLength,
			maxLength,
			messages: {
				invalidFormat,
				invalidMinLength,
				invalidMaxLength,
				invalidRange,
			},
		});
};
