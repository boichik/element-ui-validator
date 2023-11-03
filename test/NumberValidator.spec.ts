import { createNumberValidatorFactory } from '../src/validators/implementations/NumberValidator';
import { numberValidatorMessages as messages } from './data/messages';

describe('NumberValidator', () => {
	it.each([
		['0', false],
		['-5', false],
		['abc', false],
		[null, false],
		[undefined, false],
		[NaN, false],
		[{}, false],
		[{ 1: true }, false],
		[[], false],
		[[1, 2, 3, 4], false],
		[() => 'string', false],
		[true, false],
		[false, false],
		[0, true],
		[-50, true],
		[10050, true],
		[10 ** 5, true],
	])(
		'Number is not in valid format: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, validationResult] = arg;

			const { valid, message } = numberValidatorFactory().validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['0', true],
		['-5', true],
		['abc', false],
		[null, false],
		[undefined, false],
		[NaN, false],
		[{}, false],
		[{ 1: true }, false],
		[[], false],
		[[1, 2, 3, 4], false],
		[() => 'string', false],
		[true, false],
		[false, false],
		[0, true],
		[-50, true],
		[10050, true],
		[10 ** 5, true],
	])(
		'Number allow string value: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				allowString: true,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[0, undefined, true],
		[5, undefined, true],
		[1.13, undefined, true],
		[0.123452, undefined, true],
		[3.141592, undefined, true],
		[3, 'integer', true],
		[100, 'integer', true],
		[1.5, 'integer', false],
		[0.15, 'integer', false],
		[0.153, 'float', true],
		[123.123, 'float', true],
		[100, 'float', false],
		[5000, 'float', false],
		[10.01, 'float', true],
	])(
		'Number type value: Iteration - %# | val: %p | type: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, type, validationResult] = arg as [
				number,
				'integer' | 'float' | undefined,
				boolean
			];

			const { valid, message } = numberValidatorFactory({
				type,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidType === 'function' &&
				  messages.invalidType(type!, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, true],
		[12, {}, true],
		[100, [], true],
		[33, null, true],
		[12, NaN, true],
		[2, 1, true],
		[3, 0, true],
		[5.12, 2, true],
		[0.10000012, 8, true],
		[5.11, 0, false],
		[100.2, 0, false],
		[333.333, 2, false],
		[-10, 2, true],
		[10.15, -2, true],
		[10.165, -1, true],
	])(
		'Number decimal places: Iteration - %# | val: %p | decimalPlaces: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, decimalPlaces, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				decimalPlaces: decimalPlaces as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidDecimalPlaces === 'function' &&
				  messages.invalidDecimalPlaces(decimalPlaces! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, true],
		[100, {}, true],
		[12, { l: true }, true],
		[33, [], true],
		[43.54, [1, 2, 3], true],
		[100, [undefined, undefined], true],
		[10.5, '', true],
		[100, 'asb', true],
		[100, null, true],
		[99, NaN, true],
		[5, 10, false],
		[5, 0, true],
		[0, -10, true],
		[20, 2, true],
		[100, 100, true],
		[5, 5, true],
	])(
		'Number set config min property: Iteration - %# | val: %p | min: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, min, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				min: min as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMin === 'function' &&
				  messages.invalidMin(min! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, true],
		[100, {}, true],
		[12, { l: true }, true],
		[33, [], true],
		[43.54, [1, 2, 3], true],
		[100, [undefined, undefined], true],
		[10.5, '', true],
		[100, 'asb', true],
		[100, null, true],
		[99, NaN, true],
		[5, 10, false],
		[5, 0, true],
		[0, -10, true],
		[20, 2, true],
		[100, 100, false],
		[5, 5, false],
	])(
		'Number set config minStrict property: Iteration - %# | val: %p | minStrict: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, minStrict, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				minStrict: minStrict as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinStrict === 'function' &&
				  messages.invalidMinStrict(minStrict! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, true],
		[100, {}, true],
		[12, { l: true }, true],
		[33, [], true],
		[43.54, [1, 2, 3], true],
		[100, [undefined, undefined], true],
		[10.5, '', true],
		[100, 'asb', true],
		[100, null, true],
		[99, NaN, true],
		[5, 10, true],
		[100, 100, true],
		[5, 5, true],
		[5, 0, false],
		[0, -10, false],
		[20, 2, false],
		[100.5, 100, false],
		[1.1, 1, false],
	])(
		'Number set config max property: Iteration - %# | val: %p | max: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, max, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				max: max as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMax === 'function' &&
				  messages.invalidMax(max! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, true],
		[100, {}, true],
		[12, { l: true }, true],
		[33, [], true],
		[43.54, [1, 2, 3], true],
		[100, [undefined, undefined], true],
		[10.5, '', true],
		[100, 'asb', true],
		[100, null, true],
		[99, NaN, true],
		[5, 10, true],
		[0.9, 1, true],
		[5, 5, false],
		[100, 100, false],
		[5, 0, false],
		[0, -10, false],
		[20, 2, false],
		[100.5, 100, false],
		[1.1, 1, false],
		[99.99, 100, true],
	])(
		'Number set config maxStrict property: Iteration - %# | val: %p | maxStrict: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, maxStrict, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				maxStrict: maxStrict as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMaxStrict === 'function' &&
				  messages.invalidMaxStrict(maxStrict! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, undefined, true],
		[2, undefined, {}, true],
		[3, {}, {}, true],
		[4.5, [], [], true],
		[5.5, null, null, true],
		[6, NaN, NaN, true],
		[7, 'NaN', 'NaN', true],
		[8, 'abc', 'abc', true],
		[9.5, '123', '123', true],
		[10, 2, 10, true],
		[100, 10, 1000, true],
		[0, -10, 10, true],
		[0, -10, 10, true],
		[5, 10, 15, false],
		[100, 0, 70, false],
		[1.5, 1.6, 2, false],
		[-50.12, -20, 2, false],
	])(
		'Number set config minMax property: Iteration - %# | val: %p | min: %i | max: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, min, max, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				min: min as number | undefined,
				max: max as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinMax === 'function' &&
				  messages.invalidMinMax(min! as number, max! as number, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, undefined, true],
		[2, undefined, {}, true],
		[3, {}, {}, true],
		[4.5, [], [], true],
		[5.5, null, null, true],
		[6, NaN, NaN, true],
		[7, 'NaN', 'NaN', true],
		[8, 'abc', 'abc', true],
		[9.5, '123', '123', true],
		[100, 10, 1000, true],
		[0, -10, 10, true],
		[0, -10, 10, true],
		[-10, -10, 10, true],
		[10, 2, 10, false],
		[10, 0, 10, false],
		[-1, 0, 10, false],
	])(
		'Number set config minMaxStrict property: Iteration - %# | val: %p | min: %i | maxStrict: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, min, maxStrict, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				min: min as number | undefined,
				maxStrict: maxStrict as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinMaxStrict === 'function' &&
				  messages.invalidMinMaxStrict(
						min! as number,
						maxStrict! as number,
						value
				  )
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, undefined, true],
		[2, undefined, {}, true],
		[3, {}, {}, true],
		[4.5, [], [], true],
		[5.5, null, null, true],
		[6, NaN, NaN, true],
		[7, 'NaN', 'NaN', true],
		[8, 'abc', 'abc', true],
		[9.5, '123', '123', true],
		[100, 10, 1000, true],
		[0, -10, 10, true],
		[0, -10, 10, true],
		[10, 2, 10, true],
		[10, 0, 10, true],
		[-10, -10, 10, false],
		[-1, 0, 10, false],
		[5, 5, 15, false],
	])(
		'Number set config minStrictMax property: Iteration - %# | val: %p | minStrict: %i | max: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, minStrict, max, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				minStrict: minStrict as number | undefined,
				max: max as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinStrictMax === 'function' &&
				  messages.invalidMinStrictMax(
						minStrict! as number,
						max! as number,
						value
				  )
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		[1, undefined, undefined, true],
		[2, undefined, {}, true],
		[3, {}, {}, true],
		[4.5, [], [], true],
		[5.5, null, null, true],
		[6, NaN, NaN, true],
		[7, 'NaN', 'NaN', true],
		[8, 'abc', 'abc', true],
		[9.5, '123', '123', true],
		[100, 10, 1000, true],
		[0, -10, 10, true],
		[0, -10, 10, true],
		[10, 2, 10, false],
		[10, 0, 10, false],
		[-10, -10, 10, false],
		[-1, 0, 10, false],
		[5, 5, 15, false],
	])(
		'Number set config minStrictMaxStrict property: Iteration - %# | val: %p | minStrict: %i | maxStrict: %i | expect: %s',
		(...arg) => {
			const numberValidatorFactory = createNumberValidatorFactory({ messages });

			const [value, minStrict, maxStrict, validationResult] = arg;

			const { valid, message } = numberValidatorFactory({
				minStrict: minStrict as number | undefined,
				maxStrict: maxStrict as number | undefined,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinStrictMaxStrict === 'function' &&
				  messages.invalidMinStrictMaxStrict(
						minStrict! as number,
						maxStrict! as number,
						value
				  )
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
});
