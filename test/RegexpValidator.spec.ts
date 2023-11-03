import { regexpValidatorMessages as messages } from './data/messages';
import { createRegexpValidatorFactory } from '../src/validators/implementations/RegexpValidator';

describe('RegexpValidator', () => {
	it.each([
		['abc', undefined, undefined, true],
		['abc', null, null, true],
		['abc', {}, {}, true],
		['abc', [], [], true],
		['abc', NaN, NaN, true],
		['abc', /abc/, undefined, true],
		['abc', /abc/, null, true],
		['abc', /abc/, {}, true],
		['abc', /abc/, [], true],
		['abc', /abc/, NaN, true],
		['abc', /abc/, NaN, true],
		['abc', /^\d{3}-\d{2}-\d{4}$/, 'i', false],
		['123-45-6789', /^\d{3}-\d{2}-\d{4}$/, 'i', true],
		[123456789, /^[+-]?([0-9]*[.])?[0-9]+$/, undefined, true],
		[12.55, /^[+-]?([0-9]*[.])?[0-9]+$/, undefined, true],
		['abc', 12, NaN, false],
	])(
		'Regexp invalid format: Iteration - %# | val: %p | regexp: %i | flags: %i | expect: %s',
		(...arg) => {
			const regexpValidatorFactory = createRegexpValidatorFactory({ messages });

			const [value, regexp, flags, validationResult] = arg;

			const { valid, message } = regexpValidatorFactory({
				regexp: regexp as string | RegExp,
				flags: flags as string,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidValue === 'function' &&
				  messages.invalidValue(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
});
