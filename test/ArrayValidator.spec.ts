import { createArrayValidatorFactory } from '../src/validators/implementations/ArrayValidator';
import { ElementUIValidator } from '../src/types/index';
import { createNumberValidatorFactory } from '../src/validators/implementations/NumberValidator';

import {
	arrayValidatorMessages as messages,
	numberValidatorMessages,
} from './data/messages';

const numberValidatorFactory = createNumberValidatorFactory({
	messages: numberValidatorMessages,
});

describe('ArrayValidator', () => {
	it.each([
		[12, false],
		[0, false],
		[true, false],
		[false, false],
		[{}, false],
		[undefined, false],
		[NaN, false],
		[null, false],
		['abc', false],
		['abc dfg', false],
		[[], true],
		[[1, 2], true],
		[[undefined, undefined], true],
		[[null], true],
		[[NaN], true],
		[['a', 'b'], true],
		[[{}], true],
		[[[]], true],
	])(
		'Array is not in valid format: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const arrayValidatorFactory = createArrayValidatorFactory({ messages });

			const [value, validationResult] = arg;

			const { valid, message } = arrayValidatorFactory().validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[[], undefined, true],
		[[], null, true],
		[[], {}, true],
		[[], [], true],
		[[], '1', true],
		[[0, 1, 2], 3, true],
		[[0, 1, 2, 3], 3, true],
		[[], 1, false],
		[[{}, {}, {}], 4, false],
	])(
		'Array set config minLength : Iteration - %# | val: %p | minLength: %i | expect: %s',
		(...arg) => {
			const arrayValidatorFactory = createArrayValidatorFactory({ messages });

			const [value, minLength, validationResult] = arg;

			const { valid, message } = arrayValidatorFactory({
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
		[[], undefined, true],
		[[], null, true],
		[[], {}, true],
		[[], [], true],
		[[], '1', true],
		[[0, 1, 2], 3, true],
		[[0, 1, 2, 3], 3, false],
		[[], 1, true],
		[[{}, {}, {}, {}], 3, false],
	])(
		'Array set config maxLength : Iteration - %# | val: %p | maxLength: %i | expect: %s',
		(...arg) => {
			const arrayValidatorFactory = createArrayValidatorFactory({ messages });

			const [value, maxLength, validationResult] = arg;

			const { valid, message } = arrayValidatorFactory({
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
		[[], undefined, undefined, true],
		[[], null, null, true],
		[[], {}, {}, true],
		[[], [], [], true],
		[[], '1', '2', true],
		[[0, 1, 2], 3, 5, true],
		[[0, 1, 2, 3], 1, 4, true],
		[[], 1, 5, false],
		[[{}, {}, {}], 4, 9, false],
	])(
		'Array set config minLength & maxLength : Iteration - %# | val: %p | minLength: %i | maxLength: %i | expect: %s',
		(...arg) => {
			const arrayValidatorFactory = createArrayValidatorFactory({ messages });

			const [value, minLength, maxLength, validationResult] = arg;

			const { valid, message } = arrayValidatorFactory({
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
		[[], undefined, null, true],
		[[], null, null, true],
		[[], [], null, true],
		[[], {}, null, true],
		[[], NaN, null, true],
		[[], 'a', null, true],
		[[], 0, null, true],
		[[], numberValidatorFactory, null, true],
		[
			[1, 2, 3, '4'],
			numberValidatorFactory,
			typeof numberValidatorMessages.invalidFormat === 'function' &&
				numberValidatorMessages.invalidFormat(4),
			false,
		],
		[
			[100, 55, 33, 99, -20],
			() => numberValidatorFactory({ min: 10 }),
			typeof numberValidatorMessages.invalidMin === 'function' &&
				numberValidatorMessages.invalidMin(10, -20),
			false,
		],
	])(
		'Array set config itemValidator : Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const arrayValidatorFactory = createArrayValidatorFactory({ messages });

			const [value, itemValidator, validationMessages, validationResult] = arg;

			const { valid, message } = arrayValidatorFactory({
				itemValidator: itemValidator as () => ElementUIValidator,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			expect(message).toEqual(validationMessages);
		}
	);
});
