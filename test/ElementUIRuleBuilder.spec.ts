import {
	ElementUIRuleBuilderImpl,
	createElementUIRuleBuilderFactory,
} from '../src/builder/implementations/ElementUIRuleBuilder';
import { createArrayValidatorFactory } from '../src/validators/implementations/ArrayValidator';
import { createBooleanValidatorFactory } from '../src/validators/implementations/BooleanValidator';
import { createDateValidatorFactory } from '../src/validators/implementations/DateValidator';
import { createNumberValidatorFactory } from '../src/validators/implementations/NumberValidator';
import { createRegexpValidatorFactory } from '../src/validators/implementations/RegexpValidator';
import { createStringValidatorFactory } from '../src/validators/implementations/StringValidator';
import {
	arrayValidatorMessages,
	booleanValidatorMessages,
	dateValidatorMessages,
	numberValidatorMessages,
	regexpValidatorMessages,
	stringValidatorMessages,
} from './data/messages';
import { ElementUIValidator } from '../src/types/index';

const validators = {
	arrayValidator: createArrayValidatorFactory({
		messages: arrayValidatorMessages,
	}),
	booleanValidator: createBooleanValidatorFactory({
		messages: booleanValidatorMessages,
	}),
	dateValidator: createDateValidatorFactory({
		messages: dateValidatorMessages,
	}),
	numberValidator: createNumberValidatorFactory({
		messages: numberValidatorMessages,
	}),
	regexpValidator: createRegexpValidatorFactory({
		messages: regexpValidatorMessages,
	}),
	stringValidator: createStringValidatorFactory({
		messages: stringValidatorMessages,
	}),
};

const requiredValueMessage = 'Field is required!';

describe('ElementUIRuleBuilder', () => {
	it('Validating return of values after calling the useValidator setTrigger setRequired functions', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const insctanceOne =
			builder().useValidator('numberValidator') instanceof
			ElementUIRuleBuilderImpl;
		const insctanceTwo =
			builder().setRequired(true) instanceof ElementUIRuleBuilderImpl;
		const insctanceThree =
			builder().setTrigger('change') instanceof ElementUIRuleBuilderImpl;

		expect(insctanceOne).toBe(true);
		expect(insctanceTwo).toBe(true);
		expect(insctanceThree).toBe(true);
	});

	it('Return normal rule', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const rule = builder().getRule();

		const expected = {
			trigger: 'blur',
			required: false,
			validator: expect.any(Function),
		};

		expect(rule).toMatchObject(expected);
	});

	it('Set required', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const rule = builder().setRequired(true).getRule();

		const expected = {
			trigger: 'blur',
			required: true,
			validator: expect.any(Function),
		};

		expect(rule).toMatchObject(expected);
	});

	it('Set required not boolean value', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const rule = builder()
			.setRequired(0 as unknown as boolean)
			.getRule();

		const expected = {
			trigger: 'blur',
			required: false,
			validator: expect.any(Function),
		};

		expect(rule).toMatchObject(expected);
	});

	it('Set trigger', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const rule = builder().setTrigger('change').getRule();

		const expected = {
			trigger: 'change',
			required: false,
			validator: expect.any(Function),
		};

		expect(rule).toMatchObject(expected);
	});

	it('Set invalid trigger', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const rule = builder()
			.setTrigger('test' as any)
			.getRule();

		const expected = {
			trigger: 'test',
			required: false,
			validator: expect.any(Function),
		};

		expect(rule).toMatchObject(expected);
	});

	it('Set invalid validator', () => {
		const customValidator = () => {
			return {
				test() {
					console.log('test');
				},
			};
		};

		expect(
			createElementUIRuleBuilderFactory({
				validators: {
					test: () => customValidator as unknown as ElementUIValidator,
				},
				messages: { isRequiredValue: requiredValueMessage },
			})
		).toThrowError(
			'ElementUIRuleBuilder: No validator of type ElementUIValidator found!'
		);
	});

	it('Use of non-existing validator', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		try {
			builder().useValidator('test' as any);
		} catch (e) {
			expect(e).toEqual(
				new Error('ElementUIRuleBuilder: Validator "test" not found!')
			);
		}
	});

	it('Validation of empty value, without require filling!', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const { validator } = builder().useValidator('numberValidator').getRule();

		let message: any = null;

		validator('', '', e => {
			message = e;
		});

		expect(message).toEqual(undefined);
	});

	it('Validation of empty value, with require filling!', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const { validator } = builder()
			.useValidator('numberValidator')
			.setRequired(true)
			.getRule();

		let message: any = null;

		validator('', '', e => {
			message = e;
		});

		expect(message).toEqual(new Error(requiredValueMessage));
	});

	it('Validation of empty value, with require filling and change required message', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const { validator } = builder({
			messages: { isRequiredValue: 'Please enter value!' },
		})
			.useValidator('numberValidator')
			.setRequired(true)
			.getRule();

		let message: any = null;

		validator('', '', e => {
			message = e;
		});

		expect(message).toEqual(new Error('Please enter value!'));
	});

	it('StringValidator & RegexpValidator combination using valid value', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const { validator } = builder()
			.useValidator('stringValidator', { minLength: 2, maxLength: 5 })
			.useValidator('regexpValidator', {
				regexp: /test/,
			})
			.setRequired(true)
			.getRule();

		let message: any = null;

		validator('', 'test', e => {
			message = e;
		});

		expect(message).toEqual(undefined);
	});

	it('StringValidator & RegexpValidator combination using invalid value', () => {
		const builder = createElementUIRuleBuilderFactory({
			validators: validators,
			messages: { isRequiredValue: requiredValueMessage },
		});

		const { validator } = builder()
			.useValidator('stringValidator', { minLength: 2, maxLength: 5 })
			.useValidator('regexpValidator', {
				regexp: /test/,
			})
			.setRequired(true)
			.getRule();

		let message: any = null;

		validator('', 'test-test', e => {
			message = e;
		});

		const expectedMessageOne =
			typeof stringValidatorMessages.invalidRange === 'function' &&
			stringValidatorMessages.invalidRange(2, 5, 'test-test');

		expect(message).toEqual(new Error(expectedMessageOne as string));

		validator('', 'teet', e => {
			message = e;
		});

		const expectedMessageSecond =
			typeof regexpValidatorMessages.invalidValue === 'function' &&
			regexpValidatorMessages.invalidValue('teet');

		expect(message).toEqual(new Error(expectedMessageSecond as string));
	});
});
