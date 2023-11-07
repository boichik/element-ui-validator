// src/builder/interfaces/ElementUIRuleBuilder.ts
import {
	ElementUIRule,
	ValidateTrigger,
	ValidatorFactory,
	ValidatorsContext,
} from '../../types';

export interface ElementUIRuleBuilderMessages {
	isRequiredValue: string;
}

export interface ElementUIRuleBuilderConfig {
	/**
	 * An object containing validators that can be used to create validation rules.
	 * @example
	 * validators: {
	 * 	numberValidator: numberValidator(config)
	 * 	stringValidator: (config) => new StringValidator(config)
	 * 	websiteValidator: () => new WebsiteValidator()
	 * 	...
	 * }
	 */
	validators?: ValidatorsContext;
	/**
	 * An object that can include custom error messages, such as `isRequiredValue`.
	 * @example
	 * messages: {
	 * 	isRequiredValue: "Field is required!"
	 * }
	 */
	messages?: Partial<ElementUIRuleBuilderMessages>;
}

export interface ElementUIRuleBuilder<T extends ValidatorsContext = {}> {
	/**
	 * Method responsible for adding the validator to the validation rule. Return "this"
	 * @param {String} name - Name of the validator that is required (e.g. "numberValidator")
	 * @param {...} [args] - The arguments to invoke func with.
	 * @example
	 * ElementUIRuleBuilder.useValidator("numberValidator", { min: 5, max: 10 });
	 * // or combining
	 * ElementUIRuleBuilder
	 * 	.useValidator("stringValidator", { minLength: 1, maxLength: 3 })
	 * 	.useValidator("stringValidator", { minLength: 1, maxLength: 999 });
	 */
	useValidator<K extends keyof T>(
		name: K,
		...args: Parameters<T[K]>
	): ElementUIRuleBuilder<T>;
	/**
	 * Method by which you can set the mandatory field. Default is "false", return "this"
	 * @param {Boolean} value - Argument corresponding to whether the field is a required field or not
	 * @example
	 * ElementUIRuleBuilder.useValidator("numberValidator", { min: 5, max: 10 }).setRequired(true);
	 * // or
	 * ElementUIRuleBuilder.setRequired(false).useValidator("numberValidator", { min: 5, max: 10 });
	 */
	setRequired(value?: boolean): ElementUIRuleBuilder<T>;
	/**
	 * Method responsible for setting the trigger value required to determine when to validate the field. (e.g., 'blur', 'change').
	 * @default 'blur'
	 */
	setTrigger(value: ValidateTrigger): ElementUIRuleBuilder<T>;
	/**
	 * Method that returns the generated validation rule
	 */
	getRule(): ElementUIRule;
}

export type ElementUIRuleBuilderFactory<T extends ValidatorsContext> =
	ValidatorFactory<ElementUIRuleBuilderConfig, ElementUIRuleBuilder<T>>;
