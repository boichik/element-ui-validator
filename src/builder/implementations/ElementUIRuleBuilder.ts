import {
	ElementUIRule,
	ElementUIValidator,
	ValidateTrigger,
	ValidationResult,
	ValidatorsContext,
} from '../../types';
import {
	ElementUIRuleBuilder,
	ElementUIRuleBuilderConfig,
	ElementUIRuleBuilderFactory,
	ElementUIRuleBuilderMessages,
} from '../interfaces/ElementUIRuleBuilder';

/**
 * Default validator, which is responsible if there is a value in the field.
 * @param {String | Null} message - The argument accepts a message that will be output if the value is invalid. If the argument is null, then the default message will be used.
 */
const requiredValidator = (message: string | null) => {
	const _defaultMessage = 'Field is required!';

	return {
		validate(val: any) {
			if (!val && ![false, 0].includes(val)) {
				return {
					valid: false,
					message: message || _defaultMessage,
				};
			} else {
				return {
					valid: true,
					message: null,
				};
			}
		},
	};
};

export class ElementUIRuleBuilderImpl<T extends ValidatorsContext>
	implements ElementUIRuleBuilder<T>
{
	constructor(private readonly _config?: ElementUIRuleBuilderConfig) {
		const { validators } = this._config || {};
		this._validators = this._parseValidators(validators);
	}

	/**
	 * Variable that stores the validators that were passed in the settings
	 */
	protected _validators: ValidatorsContext;

	/**
	 * Variable that stores the validators used to generate the validation rule
	 */
	private _useValidators: ElementUIValidator[] = [];

	/**
	 * Variable responsible for whether the field is mandatory
	 */
	private _required: boolean = false;

	/**
	 * Variable responsible for trigger type
	 */
	private _trigger: ValidateTrigger = 'blur';

	useValidator(name: keyof T, ...args: any) {
		if ((name as string) in this._validators) {
			this._useValidators.push(this._validators[name as string](...args));
		} else {
			throw new Error(
				`ElementUIRuleBuilder: Validator "${name as string}" not found!`
			);
		}

		return this;
	}

	setRequired(value?: boolean): ElementUIRuleBuilder<T> {
		this._required = !!value;
		return this;
	}

	getRule(): ElementUIRule {
		return {
			...this._ruleGeneration(),
			trigger: this._trigger,
			required: this._required,
		};
	}

	setTrigger(value: ValidateTrigger): ElementUIRuleBuilder<T> {
		this._trigger = value;
		return this;
	}

	/**
	 * Method responsible for combining all validators to form a validation rule
	 */
	private _assemblyOfValidators() {
		const validate = (value: any) => {
			let validationResult: ValidationResult = {
				valid: true,
				message: null,
			};

			if (!this._required && ![0, false].includes(value) && !value) {
				return validationResult;
			}

			const { messages: { isRequiredValue = null } = {} } = this._config || {};

			const _validator = [requiredValidator(isRequiredValue)]
				.concat(this._useValidators)
				.find(validator => !validator.validate(value).valid);

			if (_validator) {
				validationResult = _validator.validate(value);
			}

			return validationResult;
		};

		return {
			validate,
		};
	}

	/**
	 * Method forming validation method to ElementUI format.
	 */
	private _ruleGeneration() {
		const validator = this._assemblyOfValidators();

		return {
			validator(rule: any, value: any, cb: Function) {
				const { valid, message } = validator.validate(value);

				if (valid) {
					cb();
				} else {
					cb(new Error(message!));
				}
			},
		};
	}

	/**
	 * Method of checking the object for the presence of valid validators
	 * @param {Object} obj
	 */
	private _parseValidators(obj: any) {
		let newObj: ValidatorsContext = {};

		if (typeof obj === 'object') {
			for (const key in obj) {
				if (typeof obj[key] === 'function' && !!obj[key]().validate) {
					newObj[key] = obj[key];
				}
			}
		}

		if (!Object.keys(newObj).length) {
			throw new Error(
				'ElementUIRuleBuilder: No validator of type ElementUIValidator found!'
			);
		}

		return newObj;
	}
}

/**
 * This function allows you to create a factory of the "ElementUIRuleBuilder" class, with the default configuration set.
 * If some configuration parameters need to be changed, this can be done without compromising other parameters.
 * @param {ElementUIRuleBuilderConfig} config
 * @example
 * const builder = createElementUIRuleBuilder({
 * 	validators: { numberValidator: numberValidator({ min: 4 }) }},
 * 	messages: { isRequiredValue: "Is required field!" }
 * });
 *
 * // During validation of the "test1" rule, an error will be received - "Is required field!"
 * const test1 = builder()
 *	.useValidator('numberValidator')
 *	.setRequired(true)
 *	.getRule();
 *
 * // During validation of the "test2" rule, an error will be received - "Field is required!"
 * const test2 = builder({ messages: { isRequiredValue: "Field is required!" } })
 *	.useValidator('numberValidator')
 *	.setRequired(true)
 *	.getRule();
 */
export const createElementUIRuleBuilderFactory = <
	T extends ValidatorsContext = {}
>({
	validators,
	messages: { isRequiredValue: defaultIsRequiredValue },
}: {
	validators: T;
	messages: ElementUIRuleBuilderMessages;
}): ElementUIRuleBuilderFactory<T> => {
	return ({
		messages: { isRequiredValue = defaultIsRequiredValue } = {},
	}: ElementUIRuleBuilderConfig = {}) =>
		new ElementUIRuleBuilderImpl<T>({
			validators,
			messages: {
				isRequiredValue,
			},
		});
};
