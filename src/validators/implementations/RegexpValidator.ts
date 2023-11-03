import { ElementUIValidator, ValidationResult } from '../../types';
import {
	RegexpValidatorConfig,
	RegexpValidatorFactory,
	RegexpValidatorMessages,
} from '../interfaces/RegexpValidator';
import { getValidationResult, getErrorMessage } from '../utils';

export class RegexpValidator implements ElementUIValidator {
	protected _errorMessages: RegexpValidatorMessages;

	constructor(private readonly _config?: RegexpValidatorConfig) {
		const { messages } = this._config || {};

		this._errorMessages = messages || {};
	}

	validate(value: any): ValidationResult {
		if (
			this._config?.regexp &&
			!new RegExp(
				this._config.regexp,
				typeof this._config.flags === 'string' ? this._config.flags : undefined
			).test(value)
		) {
			return getValidationResult(
				false,
				getErrorMessage(this._errorMessages.invalidValue, value)
			);
		}

		return getValidationResult(true);
	}
}

export const createRegexpValidatorFactory = ({
	messages: { invalidValue: defaultInvalidValue } = {},
}: { messages?: RegexpValidatorMessages } = {}): RegexpValidatorFactory => {
	return ({
		regexp,
		flags,
		messages: { invalidValue = defaultInvalidValue } = {},
	}: RegexpValidatorConfig = {}) =>
		new RegexpValidator({
			regexp,
			flags,
			messages: {
				invalidValue,
			},
		});
};
