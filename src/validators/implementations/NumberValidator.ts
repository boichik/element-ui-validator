import { ElementUIValidator, ValidationResult } from '../../types';
import {
	NumberValidatorConfig,
	NumberValidatorFactory,
	NumberValidatorMessages,
} from '../interfaces/NumberValidator';
import { getValidationResult, getErrorMessage, isNumber } from '../utils';

export class NumberValidator implements ElementUIValidator {
	protected _errorMessages: NumberValidatorMessages;

	constructor(private readonly _config?: NumberValidatorConfig) {
		this._errorMessages = this._config?.messages || {};
	}

	validate(value: any): ValidationResult {
		let newValue = value;

		if (typeof newValue !== 'number' || isNaN(newValue)) {
			if (
				typeof newValue === 'string' &&
				!!this._config?.allowString &&
				!isNaN(parseFloat(newValue))
			) {
				newValue = parseFloat(value);
			} else {
				return getValidationResult(
					false,
					getErrorMessage(this._errorMessages.invalidFormat, newValue)
				);
			}
		}

		if (this._config?.type) {
			if (
				(this._config.type === 'integer' && !Number.isInteger(newValue)) ||
				(this._config.type === 'float' && Number.isInteger(newValue))
			) {
				return getValidationResult(
					false,
					getErrorMessage(
						this._errorMessages.invalidType,
						this._config.type,
						newValue
					)
				);
			}
		}

		if (
			this._config &&
			'decimalPlaces' in this._config &&
			!isNaN(Number(this._config.decimalPlaces)) &&
			this._config.decimalPlaces! >= 0
		) {
			const decimalPlaces = (newValue.toString().split('.')[1] || '').length;

			if (decimalPlaces > this._config.decimalPlaces!) {
				return getValidationResult(
					false,
					getErrorMessage(
						this._errorMessages.invalidDecimalPlaces,
						this._config.decimalPlaces,
						newValue
					)
				);
			}
		}

		if (
			!!isNumber(this._config?.min) &&
			!!isNumber(this._config?.max) &&
			(newValue < this._config!.min! || newValue > this._config!.max!)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinMax,
					this._config?.min,
					this._config?.max,
					newValue
				)
			);
		}

		if (
			!!isNumber(this._config?.min) &&
			!!isNumber(this._config?.maxStrict) &&
			(newValue < this._config!.min! || newValue >= this._config!.maxStrict!)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinMaxStrict,
					this._config?.min,
					this._config?.maxStrict,
					newValue
				)
			);
		}

		if (
			!!isNumber(this._config?.minStrict) &&
			!!isNumber(this._config?.max) &&
			(newValue <= this._config?.minStrict! || newValue > this._config?.max!)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinStrictMax,
					this._config?.minStrict,
					this._config?.max,
					newValue
				)
			);
		}

		if (
			!!isNumber(this._config?.minStrict) &&
			!!isNumber(this._config?.maxStrict) &&
			(newValue <= this._config?.minStrict! ||
				newValue >= this._config?.maxStrict!)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinStrictMaxStrict,
					this._config?.minStrict,
					this._config?.maxStrict,
					newValue
				)
			);
		}

		if (!!isNumber(this._config?.min) && newValue < this._config?.min!) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMin,
					this._config?.min,
					newValue
				)
			);
		}

		if (!!isNumber(this._config?.max) && newValue > this._config?.max!) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMax,
					this._config?.max,
					newValue
				)
			);
		}

		if (
			!!isNumber(this._config?.minStrict) &&
			newValue <= this._config?.minStrict!
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinStrict,
					this._config?.minStrict,
					newValue
				)
			);
		}

		if (
			!!isNumber(this._config?.maxStrict) &&
			newValue >= this._config?.maxStrict!
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMaxStrict,
					this._config?.maxStrict,
					newValue
				)
			);
		}

		return getValidationResult(true);
	}
}

export const createNumberValidatorFactory = ({
	messages: {
		invalidFormat: defaultInvalidFormat,
		invalidType: defaultInvalidType,
		invalidDecimalPlaces: defaultDecimalPlaces,
		invalidMin: defaultMin,
		invalidMinStrict: defaultMinStrict,
		invalidMax: defaultMax,
		invalidMaxStrict: defaultMaxStrict,
		invalidMinMax: defaultMinMax,
		invalidMinStrictMax: defaultMinStrictMax,
		invalidMinMaxStrict: defaultMinMaxStrict,
		invalidMinStrictMaxStrict: defaultMinStrictMaxStrict,
	} = {},
}: {
	messages?: NumberValidatorMessages;
} = {}): NumberValidatorFactory => {
	return ({
		type,
		decimalPlaces,
		allowString,
		min,
		max,
		minStrict,
		maxStrict,
		messages: {
			invalidFormat = defaultInvalidFormat,
			invalidType = defaultInvalidType,
			invalidDecimalPlaces = defaultDecimalPlaces,
			invalidMin = defaultMin,
			invalidMinStrict = defaultMinStrict,
			invalidMax = defaultMax,
			invalidMaxStrict = defaultMaxStrict,
			invalidMinMax = defaultMinMax,
			invalidMinStrictMax = defaultMinStrictMax,
			invalidMinMaxStrict = defaultMinMaxStrict,
			invalidMinStrictMaxStrict = defaultMinStrictMaxStrict,
		} = {},
	}: NumberValidatorConfig = {}) =>
		new NumberValidator({
			type,
			decimalPlaces,
			allowString,
			min,
			max,
			maxStrict,
			minStrict,
			messages: {
				invalidFormat,
				invalidType,
				invalidDecimalPlaces,
				invalidMin,
				invalidMinStrict,
				invalidMax,
				invalidMaxStrict,
				invalidMinMax,
				invalidMinStrictMax,
				invalidMinMaxStrict,
				invalidMinStrictMaxStrict,
			},
		});
};
