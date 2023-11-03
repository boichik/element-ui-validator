export interface ValidatorFactory<C, I> {
	(config?: C): I;
}

/**
 * Result after value validation
 */
export interface ValidationResult {
	message: string | null;
	valid: boolean;
}

/**
 * Validator - responsible for validation of a specific value
 */
export interface ElementUIValidator {
	validate(value: any): ValidationResult;
}

/**
 * Validation rule object format for ElementUI form
 */
export interface ElementUIRule {
	trigger?: ValidateTrigger;
	type?: string;
	required?: boolean;
	validator: (rule: any, value: any, callback: (err?: Error) => void) => void;
}

/**
 * Event - to be followed by field validation
 */
export type ValidateTrigger = 'blur' | 'change';

export type ValidatorsContext = {
	[key: string]: (...args: any) => ElementUIValidator;
};
