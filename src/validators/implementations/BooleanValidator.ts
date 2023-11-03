import { ElementUIValidator, ValidationResult } from '../../types';
import {
	BooleanValidatorConfig,
	BooleanValidatorFactory,
	BooleanValidatorMessages,
} from '../interfaces/BooleanValidator';
import { getValidationResult, getErrorMessage } from '../utils';

export class BooleanValidator implements ElementUIValidator {
	protected _errorMessages: BooleanValidatorMessages;

	constructor(private readonly _config?: BooleanValidatorConfig) {
		const { messages } = this._config || {};

		this._errorMessages = messages || {};
	}

	validate(value: any): ValidationResult {
		if (!!this._config?.allowString && typeof value === 'string') {
			if (!['true', 'false'].includes(value)) {
				return getValidationResult(
					false,
					getErrorMessage(this._errorMessages.invalidFormat, value)
				);
			} else {
				return getValidationResult(true);
			}
		}

		if (![true, false].includes(value)) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidFormat, value)
			);
		}

		return getValidationResult(true);
	}
}

export const createBooleanValidatorFactory = ({
	messages: { invalidFormat: defaultInvalidFormat } = {},
}: {
	messages?: BooleanValidatorMessages;
}): BooleanValidatorFactory => {
	return ({
		allowString,
		messages: { invalidFormat = defaultInvalidFormat } = {},
	}: BooleanValidatorConfig = {}) =>
		new BooleanValidator({
			allowString,
			messages: {
				invalidFormat,
			},
		});
};
