import { stringValidatorMessages as messages } from './data/messages';
import { createStringValidatorFactory } from '../src/validators/implementations/StringValidator';

describe('StringValidator', () => {
	it.each([
		[12, false],
		[0, false],
		[true, false],
		[false, false],
		[{}, false],
		[[], false],
		[undefined, false],
		[NaN, false],
		[null, false],
		['abc', true],
		['abc dfg', true],
		['123', true],
		['123 abc', true],
		['null', true],
		['undefined', true],
		['Abc', true],
		['ABC', true],
	])(
		'String is not in valid format: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const stringValidatorFactory = createStringValidatorFactory({ messages });

			const [value, validationResult] = arg;

			const { valid, message } = stringValidatorFactory().validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['abc', undefined, true],
		['abc', null, true],
		['abc', {}, true],
		['abc', [], true],
		['abc', '1', true],
		['abcdf', 5, true],
		['abcd', 3, true],
		['Hello word!', 15, false],
		['Abcdf', 8, false],
	])(
		'String set config minLength : Iteration - %# | val: %p | minLength: %i | expect: %s',
		(...arg) => {
			const stringValidatorFactory = createStringValidatorFactory({ messages });

			const [value, minLength, validationResult] = arg;

			const { valid, message } = stringValidatorFactory({
				minLength: minLength as number,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinLength === 'function' &&
				  messages.invalidMinLength(minLength! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['abc', undefined, true],
		['abc', null, true],
		['abc', {}, true],
		['abc', [], true],
		['abc', '1', true],
		['abcdf', 5, true],
		['Hello word!', 15, true],
		['abcd', 3, false],
		['Abcdf', 3, false],
	])(
		'String set config maxLength : Iteration - %# | val: %p | minLength: %i | expect: %s',
		(...arg) => {
			const stringValidatorFactory = createStringValidatorFactory({ messages });

			const [value, maxLength, validationResult] = arg;

			const { valid, message } = stringValidatorFactory({
				maxLength: maxLength as number,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMaxLength === 'function' &&
				  messages.invalidMaxLength(maxLength! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['abc', undefined, undefined, true],
		['abc', null, null, true],
		['abc', {}, {}, true],
		['abc', [], [], true],
		['abc', '1', '2', true],
		['abcdf', 5, 10, true],
		['Hello word!', 5, 16, true],
		['', 1, 5, false],
		['abs', 0, 2, false],
	])(
		'String set config minLength & maxLength : Iteration - %# | val: %p | minLength: %i | maxLength: %i  | expect: %s',
		(...arg) => {
			const stringValidatorFactory = createStringValidatorFactory({ messages });

			const [value, minLength, maxLength, validationResult] = arg;

			const { valid, message } = stringValidatorFactory({
				minLength: minLength as number,
				maxLength: maxLength as number,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidRange === 'function' &&
				  messages.invalidRange(
						minLength! as number,
						maxLength! as number,
						value
				  )
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['abc', undefined, true],
		['abc', null, true],
		['abc', {}, true],
		['abc', [], true],
		['abc', false, true],
		['ABCD', true, true],
		['abcdf', true, false],
		['Hello WORLD!', true, false],
		['ABc', true, false],
	])(
		'String set config onlyUppercase : Iteration - %# | val: %p | onlyUppercase: %i | expect: %s',
		(...arg) => {
			const stringValidatorFactory = createStringValidatorFactory({ messages });

			const [value, onlyUppercase, validationResult] = arg;

			const { valid, message } = stringValidatorFactory({
				onlyUppercase: onlyUppercase as boolean,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidUppercase === 'function' &&
				  messages.invalidUppercase(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
});
