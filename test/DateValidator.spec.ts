import { dateValidatorMessages as messages } from './data/messages';
import { createDateValidatorFactory } from '../src/validators/implementations/DateValidator';

describe('DateValidator', () => {
	it.each([
		[true, false],
		[false, false],
		[{}, false],
		[[], false],
		[undefined, false],
		[NaN, false],
		[null, false],
		['abc', false],
		['19/12/2023', false],
		['19-12-2023', false],
		['2023-19-12', false],
		[12, true],
		[0, true],
		['12.08.2023', true],
		['12.12.2023 14:33:12', true],
		[
			'Tue Dec 12 2023 14:33:12 GMT+0200 (Eastern European Standard Time)',
			true,
		],
		[1702384392000, true],
	])(
		'Date is not in valid format: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const dateValidatorFactory = createDateValidatorFactory({ messages });

			const [value, validationResult] = arg;

			const { valid, message } = dateValidatorFactory().validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['2023.08.19', null, true],
		['2023.08.19', undefined, true],
		['2023.08.19', false, true],
		['2023.08.19', true, true],
		['2023.08.19', NaN, true],
		['2023.08.19', '', true],
		['2023.08.19', 'abc', true],
		['2023.08.19', 0, true],
		[new Date(), '2023.08.19', true],
		['2023.08.19', new Date(), false],
		[1692392400000, 1692442800000, false],
		[1692392400000, '2023.08.19 14:00', false],
		[
			'Sat Aug 19 2023 00:00:00 GMT+0300 (Eastern European Summer Time)',
			'Sat Aug 19 2023 15:00:00 GMT+0300 (Eastern European Summer Time)',
			false,
		],
	])(
		'Date set config parameter minDate: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const dateValidatorFactory = createDateValidatorFactory({ messages });

			const [value, minDate, validationResult] = arg;

			const { valid, message } = dateValidatorFactory({
				minDate: minDate as any,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMinDate === 'function' &&
				  messages.invalidMinDate(minDate! as any, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['2023.08.19', null, true],
		['2023.08.19', undefined, true],
		['2023.08.19', false, true],
		['2023.08.19', true, true],
		['2023.08.19', NaN, true],
		['2023.08.19', '', true],
		['2023.08.19', 'abc', true],
		['2023.08.19', '2023.09.10', true],
		[1692392400000, 1692442800000, true],
		['2023.08.19', new Date(), true],
		[
			'Sat Aug 19 2023 00:00:00 GMT+0300 (Eastern European Summer Time)',
			'Sat Aug 19 2023 15:00:00 GMT+0300 (Eastern European Summer Time)',
			true,
		],
		['2023.08.19', 0, false],
		[new Date(), '2023.08.19', false],
		[1692442800000, 1692392400000, false],
		['2023.08.19 14:00', 1692392400000, false],
	])(
		'Date set config parameter maxDate: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const dateValidatorFactory = createDateValidatorFactory({ messages });

			const [value, maxDate, validationResult] = arg;

			const { valid, message } = dateValidatorFactory({
				maxDate: maxDate as any,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidMaxDate === 'function' &&
				  messages.invalidMaxDate(maxDate! as any, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['2023.08.19', null, null, true],
		['2023.08.19', undefined, undefined, true],
		['2023.08.19', false, false, true],
		['2023.08.19', true, true, true],
		['2023.08.19', NaN, NaN, true],
		['2023.08.19', '', '', true],
		['2023.08.19', 'abc', 'abc', true],
		['2023.08.19', '2023.07.15', '2023.09.10', true],
		[1692392400000, 1682392400000, 1692442800000, true],
		['2023.08.19', new Date('2022.08.20'), new Date(), true],
		[
			'Sat Aug 19 2023 00:00:00 GMT+0300 (Eastern European Summer Time)',
			'Wed Jul 12 2023 00:00:00 GMT+0300 (Eastern European Summer Time)',
			'Sat Aug 19 2023 15:00:00 GMT+0300 (Eastern European Summer Time)',
			true,
		],
		['2023.08.19', 15, 0, false],
		[new Date(), '2022.12.12', '2023.08.19', false],
	])(
		'Date set config parameters minDate & maxDate: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const dateValidatorFactory = createDateValidatorFactory({ messages });

			const [value, minDate, maxDate, validationResult] = arg;

			const { valid, message } = dateValidatorFactory({
				minDate: minDate as any,
				maxDate: maxDate as any,
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidRange === 'function' &&
				  messages.invalidRange(minDate! as any, maxDate! as any, value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
});
