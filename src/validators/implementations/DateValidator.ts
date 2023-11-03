import { ElementUIValidator, ValidationResult } from '../../types';
import {
	DateValidatorConfig,
	DateValidatorFactory,
	DateValidatorMessages,
} from '../interfaces/DateValidator';
import { isDate, getValidationResult, getErrorMessage } from '../utils';

export class DateValidator implements ElementUIValidator {
	protected _errorMessages: DateValidatorMessages;

	constructor(private readonly _config?: DateValidatorConfig) {
		const { messages } = this._config || {};

		this._errorMessages = messages || {};
	}

	validate(value: any): ValidationResult {
		if (!isDate(value)) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidFormat, value)
			);
		}

		if (
			!!isDate(this._config?.minDate) &&
			!!isDate(this._config?.maxDate) &&
			(+new Date(this._config?.minDate!) > +new Date(value) ||
				+new Date(value) > +new Date(this._config?.maxDate!))
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidRange,
					this._config?.minDate!,
					this._config?.maxDate!,
					value
				)
			);
		}

		if (
			!!isDate(this._config?.minDate) &&
			+new Date(this._config?.minDate!) > +new Date(value)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMinDate,
					this._config?.minDate!,
					value
				)
			);
		}

		if (
			!!isDate(this._config?.maxDate) &&
			+new Date(value) > +new Date(this._config?.maxDate!)
		) {
			return getValidationResult(
				false,
				getErrorMessage(
					this._errorMessages.invalidMaxDate,
					this._config?.maxDate!,
					value
				)
			);
		}

		return getValidationResult(true);
	}
}

export const createDateValidatorFactory = ({
	messages: {
		invalidFormat: defaultInvalidFormat,
		invalidMinDate: defaultInvalidMinDate,
		invalidMaxDate: defaultInvalidMaxDate,
		invalidRange: defaultInvalidRange,
	} = {},
}: { messages?: DateValidatorMessages } = {}): DateValidatorFactory => {
	return ({
		minDate,
		maxDate,
		messages: {
			invalidFormat = defaultInvalidFormat,
			invalidMinDate = defaultInvalidMinDate,
			invalidMaxDate = defaultInvalidMaxDate,
			invalidRange = defaultInvalidRange,
		} = {},
	}: DateValidatorConfig = {}) =>
		new DateValidator({
			minDate,
			maxDate,
			messages: {
				invalidFormat,
				invalidMinDate,
				invalidMaxDate,
				invalidRange,
			},
		});
};
