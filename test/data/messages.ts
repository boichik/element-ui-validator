import { ArrayValidatorMessages } from '../../src/validators/interfaces/ArrayValidator';
import { BooleanValidatorMessages } from '../../src/validators/interfaces/BooleanValidator';
import { DateValidatorMessages } from '../../src/validators/interfaces/DateValidator';
import { NumberValidatorMessages } from '../../src/validators/interfaces/NumberValidator';
import { RegexpValidatorMessages } from '../../src/validators/interfaces/RegexpValidator';
import { StringValidatorMessages } from '../../src/validators/interfaces/StringValidator';
import { EmailValidatorMessages } from '../../src/validators/interfaces/EmailValidator';

export const arrayValidatorMessages: Required<ArrayValidatorMessages> = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
	invalidMinLength: (min, val) =>
		`Value "${val}" must be greater than or equal to ${min}!`,
	invalidMaxLength: (max, val) =>
		`Value "${val}" must be less than or equal to ${max}!`,
	invalidRange: (min, max, val) =>
		`Value "${val}" must be greater than or equal to ${min} and less than or equal to ${max}!`,
};

export const booleanValidatorMessages: Required<BooleanValidatorMessages> = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
};

export const dateValidatorMessages: Required<DateValidatorMessages> = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
	invalidMinDate: (min, val) =>
		`Value "${val}" must be greater than or equal to ${min}!`,
	invalidMaxDate: (max, val) =>
		`Value "${val}" must be less than or equal to ${max}!`,
	invalidRange: (min, max, val) =>
		`Value "${val}" must be greater than or equal to ${min} and less than or equal to ${max}!`,
};

export const numberValidatorMessages: Required<NumberValidatorMessages> = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
	invalidType: (type, val) => `Value "${val}" must be of type "${type}"!`,
	invalidDecimalPlaces: (decimal, value) =>
		`Value "${value}" must have ${decimal} decimal places!`,
	invalidMin: (min, value) =>
		`Value "${value}" must be greater than or equal to ${min}`,
	invalidMinStrict: (min, value) =>
		`Value "${value}" must be greater than ${min}`,
	invalidMax: (max, value) =>
		`Value "${value}" must be less than or equal to ${max}`,
	invalidMaxStrict: (max, value) => `Value "${value}" must be less than ${max}`,
	invalidMinMax: (min, max, value) =>
		`Value of "${value}" must be greater than or equal to ${min} and less than or equal to ${max}`,
	invalidMinMaxStrict: (min, max, value) =>
		`Value of "${value}" must be greater than or equal to ${min} and less than ${max}`,
	invalidMinStrictMax: (min, max, value) =>
		`Value of "${value}" must be greater than ${min} and less than or equal to ${max}`,
	invalidMinStrictMaxStrict: (min, max, value) =>
		`Value of "${value}" must be greater than ${min} and less than ${max}`,
};

export const regexpValidatorMessages: Required<RegexpValidatorMessages> = {
	invalidValue: val => `Value ${val} is invalid!`,
};

export const stringValidatorMessages: Required<StringValidatorMessages> = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
	invalidMinLength: (min, val) =>
		`Value "${val}" must be greater than or equal to ${min}!`,
	invalidMaxLength: (max, val) =>
		`Value "${val}" must be less than or equal to ${max}!`,
	invalidRange: (min, max, val) =>
		`Value "${val}" must be greater than or equal to ${min} and less than or equal to ${max}!`,
	invalidUppercase: val => `Value "${val}" must be uppercase!`,
	invalidLowercase: val => `Value "${val}" must be lowercase!`,
};

export const emailValidatorMessages: Required<EmailValidatorMessages> = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
	notAllowedDomain: (domains, val) =>
		`Domain value "${val}" should be one of the permissible: ${domains.join(
			', '
		)}`,
	domainFromBlackList: (domains, val) =>
		`The domain value "${val}" should not include the following domains: ${domains.join(
			', '
		)}`,
};
