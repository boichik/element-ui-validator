import { createEmailValidatorFactory } from '../src/validators/implementations/EmailValidator';
import { emailValidatorMessages as messages } from './data/messages';

describe('EmailValidator', () => {
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
		['abc', false],
		['test-domain$example.com', false],
		['test-example.com', false],
		['test@example.comer', false],
		['@example.com', false],
		['example.com', false],
		['test@example.com', true],
		['test-test@example.com', true],
		['test-test12@example.com', true],
		['test.test@example.com', true],
		['test.test@example.com.com', true],
		['test@example-domain.com', true],
	])(
		'Email is not in valid format: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const emailValidatorFactory = createEmailValidatorFactory({ messages });

			const [value, validationResult] = arg;

			const { valid, message } = emailValidatorFactory().validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.invalidFormat === 'function' &&
				  messages.invalidFormat(value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
	it.each([
		['test@example.com', undefined, true],
		['test@example.com', null, true],
		['test@example.com', 0, true],
		['test@example.com', '', true],
		['test@example.com', {}, true],
		['test@example.com', [], true],
		['test@example.com', [''], false],
		['test@example.com', ['test.com'], false],
		['test@example.com', ['test.com', 'test1.com'], false],
		['test@test.com', ['test.com', 'test1.com'], true],
		['test@test.com', ['test.com'], true],
	])(
		'Email is not in valid domain: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const emailValidatorFactory = createEmailValidatorFactory({ messages });

			const [value, allowedDomainList, validationResult] = arg;

			const { valid, message } = emailValidatorFactory({
				allowedDomainList: allowedDomainList as string[],
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.notAllowedDomain === 'function' &&
				  messages.notAllowedDomain(allowedDomainList as string[], value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);

	it.each([
		['test@example.com', undefined, true],
		['test@example.com', null, true],
		['test@example.com', 0, true],
		['test@example.com', '', true],
		['test@example.com', {}, true],
		['test@example.com', [], true],
		['test@example.com', [''], true],
		['test@example.com', ['test.com'], true],
		['test@example.com', ['test.com', 'test1.com'], true],
		['test@test.com', ['test.com', 'test1.com'], false],
		['test@test.com', ['test.com'], false],
		['test@TEST.com', ['test.com'], false],
	])(
		'Email has a blacklisted domain: Iteration - %# | val: %p | expect: %s',
		(...arg) => {
			const emailValidatorFactory = createEmailValidatorFactory({ messages });

			const [value, blackListDomain, validationResult] = arg;
			const { valid, message } = emailValidatorFactory({
				blackListDomain: blackListDomain as string[],
			}).validate(value);

			expect(valid).toEqual(validationResult);

			let expectedMessage = !validationResult
				? typeof messages.domainFromBlackList === 'function' &&
				  messages.domainFromBlackList(blackListDomain as string[], value)
				: null;

			expect(message).toEqual(expectedMessage);
		}
	);
});
