import { createBooleanValidatorFactory } from '../src/validators/implementations/BooleanValidator';
import { booleanValidatorMessages as messages } from './data/messages';

describe('BooleanValidator', () => {
	it.each([
		[12, false],
		[0, false],
		['abc', false],
		['ab!!', false],
		[{}, false],
		[[], false],
		[undefined, false],
		[NaN, false],
		[null, false],
		['true', false],
		['false', false],
		['true true', false],
		[true, true],
		[false, true],
	])(
		'Value is not in valid format: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const booleanValidatorFactory = createBooleanValidatorFactory({
				messages,
			});

			const [value, validationResult] = arg;

			const { valid, message } = booleanValidatorFactory().validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[true, null, true],
		[true, undefined, true],
		[false, 0, true],
		[true, '', true],
		[true, true, true],
		[false, true, true],
		['true', true, true],
		['false', true, true],
		['true', false, false],
		['false', false, false],
	])(
		'Boolean set config allowString: Iteration - %# | val: %p | allowString: %i | expect: %s',
		(...arg) => {
			const booleanValidatorFactory = createBooleanValidatorFactory({
				messages,
			});

			const [value, allowString, validationResult] = arg;

			const { valid, message } = booleanValidatorFactory({
				allowString: allowString as boolean,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
});
