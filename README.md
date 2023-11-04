# element-ui-validator

This package is intended to simplify the construction of validation rules for form fields for the [ElementUI](https://www.npmjs.com/package/element-ui) library

## Links

- [ElementUIRuleBuilder](#elementuirulebuilder)
  - [Config](#config)
  - [Error messages](#error-messages)
  - [Methods](#methods)
- Validators
  - [StringValidator](#stringvalidator)
    - [Config](#stringvalidator-config)
    - [Error messages](#stringvalidator-error-messages)
  - [NumberValidator](#numbervalidator)
    - [Config](#numbervalidator-config)
    - [Error messages](#numbervalidator-error-messages)
  - [DateValidator](#datevalidator)
    - [Config](#datevalidator-config)
    - [Error messages](#datevalidator-error-messages)
  - [BooleanValidator](#booleanvalidator)
    - [Config](#booleanvalidator-config)
    - [Error messages](#booleanvalidator-error-messages)
  - [RegexpValidator](#regexpvalidator)
    - [Config](#regexpvalidator-config)
    - [Error messages](#regexpvalidator-error-messages)
  - [ArrayValidator](#arrayvalidator)
    - [Config](#arrayvalidator-config)
    - [Error messages](#arrayvalidator-error-messages)
  - [EmailValidator](#emailvalidator)
    - [Config](#emailvalidator-config)
    - [Error messages](#emailvalidator-error-messages)
  - [Custom](#custom)

## Installation

Using npm or yarn

```bash
npm install element-ui-validator
// or
yarn add element-ui-validator
```

Using CDN

```js
<script src="https://unpkg.com/element-ui-validator@latest/lib/index.umd.js"></script>
```

## Usage

### ES6

```ts
import { createElementUIRuleBuilderFactory } from 'element-ui-validator'

createElementUIRuleBuilderFactory(...)
```

### No ES6

```js
const elementUIValidator = require('element-ui-validator')

elementUIValidator.createElementUIRuleBuilderFactory(...)
```

### CDN

```js
...
<script>
const validator = ElementUIValidator.createElementUIRuleBuilderFactory(....)
</script>
```

## ElementUIRuleBuilder

**ElementUIRuleBuilder** is a constructor of the validation rule of a certain field, with which you can configure the mandatory field, the validation trigger, as well as a certain set of validators.
This constructor can be used as a class or use the method of creating a factory, which makes it possible to pass the default settings, which can be changed in the future.

### Example of using a class

Creating a builder with specific settings

```ts
// file validator.js
import {
	ElementUIRuleBuilderImpl,
	createRegexpValidatorFactory,
} from 'element-ui-validator';

export const validatorBuilder = new ElementUIRuleBuilderImpl({
	validators: {
		websiteValidator: createRegexpValidatorFactory({
			messages: { invalidValue: 'Invalid value!' },
		}),
	},
	messages: {
		isRequiredValue: 'Required field!',
	},
});
```

Example of using a builder in a vue file.
_If the "website" field is not filled in, we will receive the error "Required field!," Which was transmitted to the builder settings._

```js
// file form.vue
<template>
<ElForm :model="form" :rules="rules">
	<ElFormItem  label="website"  prop="website">
		<input  v-model="form.website">
	</ElFormItem>
	...
</ElForm>
</template>
<script>
import {validatorBuilder} from  './validator'
...
export  default{
	...
	computed: {
		rules(){
			return {
				website:  validatorBuilder.useValidator("websiteValidator").setRequired(true).getRule()
			}
		}
	}
	...
}
</script>
```

### Example of using a factory

Creating a builder with specific settings

```js
// file validator.js
import {
	createElementUIRuleBuilderFactory,
	createRegexpValidatorFactory,
} from 'element-ui-validator';

export const validatorBuilder = createElementUIRuleBuilderFactory({
	validators: {
		websiteValidator: createRegexpValidatorFactory({
			messages: { invalidValue: 'Invalid value!' },
		}),
	},
	messages: {
		isRequiredValue: 'Required field!',
	},
});
```

Example of using a builder in a vue file.
_In the case where the "website" field is not filled in, we will get the error "Required field!," And in the case of the "website 2" field, we will get another "'website2' is a required field," since the default value was redefined new._

```js
// file form.vue
<template>
<ElForm :model="form" :rules="rules">
	<ElFormItem  label="website"  prop="website">
		<input  v-model="form.website">
	</ElFormItem>
	<ElFormItem  label="website 2"  prop="website2">
		<input  v-model="form.website2">
	</ElFormItem>
	...
</ElForm>
</template>
<script>
import {validatorBuilder} from  './validator'
...
export  default {
	...
	computed: {
		rules(){
			return {
				website:  validatorBuilder().useValidator("websiteValidator").setRequired(true).getRule(),
				website2: validatorBuilder({
					messages: {
						isRequiredValue: "'website2' is a required field"
					}).setRequired(true).getRule()
			}
		}
	}
	...
}
</script>
```

### Using a Factory in Dependency Inversion

Also, if you use the dependency inversion library, the option with the factory is suitable for you. InversifyJS Library Implementation Example

```ts
// file types.ts
export const TYPES = {
	ElementRuleBuilder: Symbol.for("ElementRuleBuilder"),
	...
}
```

```ts
// file container.ts
import { createElementUIRuleBuilderFactory, createRegexpValidatorFactory, ElementUIRuleBuilder } from 'element-ui-validator';
import { Container } from  'inversify';
import { TYPES } from './types';

const container = new Container();

container.bind<ElementUIRuleBuilder>(TYPES.ElementRuleBuilder).toDynamicValue(()=> {
	return createElementUIRuleBuilderFactory({
		validators: {
			regexpValidator:  createRegexpValidatorFactory({
				messages: { invalidValue:  'Invalid value!' },
			}),
		},
		messages: {
			isRequiredValue:  'Required field!',
		},
	})
});
...
```

### Config

| Name       | Description                                                                                                                                                                  | Type     | Required  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| validators | This parameter is a validator object that must be a function. It can accept both ready-made validators and custom ones. If no validator is transmitted, an error will occur. | `object` | **false** |
| messages   | This parameter is an error message object. If the parameter is empty, errors will not be displayed!                                                                          | `object` | **false** |

Example of validator object

```js
import { createNumberValidatorFactory, createStringValidatorFactory, RegexpValidator } from 'element-ui-validator';

const validatorsForConfig = {
	numberValidator: createNumberValidatorFactory(...),
	stringValidator: (config) => createStringValidatorFactory(config),
	regexpValidator: () => new RegexpValidator(...)
};
....
```

### Error Messages

| Name            | Description                          | Format   |
| --------------- | ------------------------------------ | -------- |
| isRequiredValue | Error message when field is required | `string` |

### Methods

| Name           | Arguments       | Description                                                                                                                                                                                                                                                                                                                            | Return   |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| useValidator() | name, arguments | The method is designed to add a specific validator to the validation rule. `name` - represents the name of the validator to be used and which was added to the configuration.`arguments` are parameters that must be passed additionally to the validator (in most cases, this is the transfer of the configuration for the validator) | `this`   |
| setRequired()  | value           | The method is used to determine whether a field is mandatory. Takes the parameter a `boolean` value. **By default, the field is optional.**                                                                                                                                                                                            | `this`   |
| setTrigger()   | value           | The method is designed to determine at which event the field must be validated. Takes the value "blur" or "change." **By default, the value is "blur"**                                                                                                                                                                                | `this`   |
| getRule()      | `none`          | The method is designed to obtain a validation rule given in the format required for the **ElForm** component.                                                                                                                                                                                                                          | `object` |

## Validators

This package includes ready-made validators, and also makes it possible to use your custom

### StringValidator

This validator is designed to validate all string values based on the transferred configurations.
_The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages_
Example of using a validator:

```js
// file stringValidator.js
import { createStringValidatorFactory } from 'element-ui-validator';

const defaultErrorMessages = {
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

const validator = createStringValidatorFactory({
	messages: defaultErrorMessages,
});

validator().validate('123'); // output => { valid: true, message: null }

validator().validate(123); // output => { valid: false, message: "Value "123" is not in the correct format!" }

validator({ minLength: 5 }).validate('test'); // { valid: false, message: "Value "test" must be greater than or equal to 5!" }

validator({ maxLength: 3 }).validate('test'); // { valid: false, message: "Value "test" must be less than or equal to 3!" }

validator({ minLength: 1, maxLength: 3 }).validate('test'); // { valid: false, message: "Value "test" must be greater than or equal to 1 and less than or equal to 3!" }

validator({ onlyUppercase: true }).validate('test'); // { valid: false, message: "Value "test" must be uppercase!" }

validator({ onlyLowercase: true }).validate('Test'); // { valid: false, message: "Value "test" must be lowercase!" }
```

Example of using a validator with a builder:

```js
// file exampleString.js
import { createStringValidatorFactory, createElementUIRuleBuilderFactory } from 'element-ui-validator';

const ruleBuilder = createElementUIRuleBuilderFactory({
	validators: {
		stringValidator: createStringValidatorFactory(...),
	},
	messages: {...}
});

const stringRule = ruleBuilder().useValidator("stringValidator", { minLength: 1, maxLength: 10 }).setRequired(true).getRule();
```

#### StringValidator Config

| Name          | Description                                                                                         | Type      |
| ------------- | --------------------------------------------------------------------------------------------------- | --------- |
| minLength     | Parameter responsible for the minimum length of the string.                                         | `number`  |
| maxLength     | Parameter responsible for the maximum length of the string.                                         | `number`  |
| onlyUppercase | Parameter responsible for checking if the string is in uppercase.                                   | `boolean` |
| onlyLowercase | Parameter responsible for checking if the string is in lowercase.                                   | `boolean` |
| messages      | This parameter is an error message object. If the parameter is empty, errors will not be displayed! | `object`  |

#### StringValidator Error Messages

| Name             | Description                                                                                                 | Type                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| invalidFormat    | Error message when value is not a string (null, boolean, number...)                                         | `string` or `((val: any) => string)`                           |
| invalidMinLength | Error message when length is less than specified **minLength**                                              | `string` or `((min: number, val: any) => string)`              |
| invalidMaxLength | Error message when value length is greater than specified **maxLength**                                     | `string` or `((max: number, val: any) => string)`              |
| invalidRange     | Error message when value length is less than or greater than specified **minLength & maxLength** parameters | `string` or `((min: number, max: number, val: any) => string)` |
| invalidUppercase | Error message when value is not uppercase                                                                   | `string` or `((val: any) => string)`                           |
| invalidLowercase | Error message when value is not in lowercase                                                                | `string` or `((val: any) => string)`                           |

### NumberValidator

This validator is designed to validate all number values based on the transferred configurations.
The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages
Example of using a validator:

```js
// file numberValidator.js
import { createNumberValidatorFactory } from 'element-ui-validator';

const defaultErrorMessages = {
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

const validator = createNumberValidatorFactory({
	messages: defaultErrorMessages,
});

validator().validate(1); // output => { valid: true, message: null }

validator().validate('1'); // output => { valid: false, message: "Value "1" is not in the correct format!"}

validator({ allowString: true }).validate('1'); // output => { valid: true, message: null }

validator({ decimalPlaces: 2 }).validate(3.145); // output => { valid: false, message: "Value "3.145" must have 2 decimal places!" }

validator({ integer: true }).validate(3.145); // output => { valid: false, message: "Value "3.145" must be of type 'integer'!" }

validator({ min: 2 }).validate(1); // output => { valid: false, message: "Value "1" must be greater than or equal to 2" }

validator({ max: 3 }).validate(4); // output => { valid: false, message: "Value "4" must be less than or equal to 3" }

validator({ minStrict: 2 }).validate(2); // output => { valid: false, message: "Value "2" must be greater than 2" }

validator({ maxStrict: 3 }).validate(3); // output => { valid: false, message: "Value "3" must be less than 3" }

validator({ min: 1, max: 3 }).validate(4); // output => { valid: false, message: "Value of "4" must be greater than or equal to 1 and less than or equal to 3" }

validator({ minStrict: 1, max: 3 }).validate(1); // output => { valid: false, message: "Value of "1" must be greater than 1 and less than or equal to 3" }

validator({ min: 1, maxStrict: 3 }).validate(3); // output => { valid: false, message: "Value of "3" must be greater than or equal to 1 and less than 3" }

validator({ minStrict: 1, maxStrict: 3 }).validate(3); // output => { valid: false, message: "Value of "3" must be greater than 1 and less than 3" }
```

Example of using a validator with a builder:

```js
// file exampleNumber.js
import { createNumberValidatorFactory, createElementUIRuleBuilderFactory } from 'element-ui-validator';

const ruleBuilder = createElementUIRuleBuilderFactory({
	validators: {
		numberValidator: createNumberValidatorFactory(...),
	},
	messages: {...}
});

const numberRule = ruleBuilder().useValidator("numberValidator", { min: 1, max: 10 }).setRequired(true).getRule();
```

#### NumberValidator Config

| Name          | Description                                                                                                                                    | Type                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| min           | Minimum number. This parameter is responsible for the fact that the value entered must be greater than this.                                   | `number`                 |
| max           | Minimum number. Maximum number. This parameter is responsible for the fact that the entered value should be less than this.                    | `number`                 |
| minStrict     | Minimum strict number. This parameter is responsible for the fact that the value entered must be greater than and not equal to it.             | `number`                 |
| maxStrict     | Maximum strict number. This parameter is responsible for the fact that the value entered must be less than and not equal to it.                | `number`                 |
| allowString   | Allow numbers with string type.                                                                                                                | `boolean`                |
| type          | Type of number. Using this parameter, you can validate values by type of number (integer or floating point).All types are accepted by default. | `'integer'` or `'float'` |
| decimalPlaces | Number of decimal places                                                                                                                       | `number`                 |
| messages      | Object with error messages                                                                                                                     | `object`                 |

#### NumberValidator Error Messages

| Name                      | Description                                                                                                                                    | Type                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------- |
| invalidFormat             | Error message when value is not a number                                                                                                       | `string` or `((value: any) => string)`                           |
| invalidType               | Error message when the value does not match the type ("integer" or "float") that was set in the configuration                                  | `string` or `((type: 'integer'                                   | 'float', value: any) => string)` |
| invalidDecimalPlaces      | Error message when the value is greater than the decimal point than is set in the configuration                                                | `string` or `((decimal: number, value: any) => string)`          |
| invalidMin                | Error message when the value is less than or equal to the "**min**" parameter set in the configuration                                         | `string` or `((min: number, value: any) => string)`              |
| invalidMinStrict          | Error message when value is less than parameter "**invalidMinStrict**" set in configuration                                                    | `string` or `((min: number, value: any) => string)`              |
| invalidMax                | Error message when value is greater than or equal to "**max**" parameter set in configuration                                                  | `string` or `((max: number, value: any) => string)`              |
| invalidMaxStrict          | Error message when value is greater than parameter "**invalidMaxStrict**" set in configuration                                                 | `string` or `((max: number, value: any) => string)`              |
| invalidMinMax             | Error message when value is less than or less than "**min**" or greater than and not equal to the parameter "**max**" set in the configuration | `string` or `((min: number, max: number, value: any) => string)` |
| invalidMinStrictMax       | Error message when value is less than "**minStrict**" or greater than and not equal to the parameter "**max**" set in the configuration        | `string` or `((min: number, max: number, value: any) => string)` |
| invalidMinMaxStrict       | Error message when value is less than or less than "**min**" or more than the parameter "**maxStrict**" set in the configuration               | `string` or `((min: number, max: number, value: any) => string)` |
| invalidMinStrictMaxStrict | Error message when value is less than parameter "**minStrict**" or more than parameter "**maxStrict**" set in configuration                    | `string` or `((min: number, max: number, value: any) => string)` |

### DateValidator

This validator is designed to validate all date values based on the transferred configurations.
_The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages_

#### DateValidator Config

| Name     | Description                                              | Type                     |
| -------- | -------------------------------------------------------- | ------------------------ |
| minDate  | Minimum date. Date must be greater than or equal to this | `Date I string I number` |
| maxDate  | Maximum date. Date must be less than or equal to this    | `Date I string I number` |
| messages | Object with error messages                               | `object`                 |

#### DateValidator Error Messages

| Name           | Description                                                                                                                                                                | Type                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| invalidFormat  | Error message when value is not a date                                                                                                                                     | string`or`((val: any) => string)                           |
| invalidMinDate | Error message when the value must be greater than or equal to the parameter "**minDate**" set in the configuration                                                         | `string` or `((min: Date, val: any) => string)`            |
| invalidMaxDate | Error message when the value must be less than or equal to the parameter "**maxDate**" set in the configuration                                                            | `string` or `((max: Date, val: any) => string)`            |
| invalidRange   | Error message when the value must be greater than or equal to the parameter "**minDate**" or be less than or equal to the parameter "**maxDate**" set in the configuration | `string` or `((min: Date, max: Date, val: any) => string)` |

### BooleanValidator

This validator is designed to validate all boolean values based on the transferred configurations.
_The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages_

#### BooleanValidator Config

| Name        | Description                    | Type      |
| ----------- | ------------------------------ | --------- |
| allowString | Allow Boolean values as string | `boolean` |
| messages    | Object with error messages     | `object`  |

#### BooleanValidator Error Messages

| Name          | Description                               | Type                                 |
| ------------- | ----------------------------------------- | ------------------------------------ |
| invalidFormat | Error message when value is not a boolean | `string` or `((val: any) => string)` |

### RegexpValidator

This validator is designed to validate all type values based on the transferred configurations.
_The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages_
Example of using a validator:

```js
// file stringValidator.js
import { createRegexpValidatorFactory } from 'element-ui-validator';

const defaultErrorMessages = {
	invalidFormat: val => `Value "${val}" is not in the correct format!`,
};

const websiteValidator = createRegexpValidatorFactory({
	messages: defaultErrorMessages,
})({
	regexp:
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
});

websiteValidator.validate('123'); // output => { valid: false, message: "Value "123" is not in the correct format!" }

websiteValidator.validate('https://example.com/'); // output => { valid: true, message: null }
```

#### RegexpValidator Config

| Name     | Description                                    | Type                 |
| -------- | ---------------------------------------------- | -------------------- |
| regexp   | Regular expression by which to check the value | `string` or `RegExp` |
| flags    | Flag to regular expression                     | `string`             |
| messages | Object with error messages                     | `object`             |

#### RegexpValidator Error Messages

| Name          | Description                                                                     | Type                                 |
| ------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| invalidFormat | Error message when value does not match regular expression set in configuration | `string` or `((val: any) => string)` |

### ArrayValidator

This validator is designed to check the elements of the array for the new installed configurations
_The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages_
Example of using a validator:

```js
// file stringValidator.js
import { createArrayValidatorFactory, createNumberValidatorFactory, createStringValidatorFactory } from 'element-ui-validator';

const defaultErrorMessages = {
	invalidFormat:  val  =>  `Value "${val}" is not in the correct format!`,
	invalidMinLength: (min, val) => `Value "${val}" must be greater than or equal to ${min}!`,
	invalidMaxLength: (max, val) => `Value "${val}" must be less than or equal to ${max}!`,
	invalidRange: (min, max, val) => `Value "${val}" must be greater than or equal to ${min} and less than or equal to ${max}!`,
};

const validator = createArrayValidatorFactory({ messages: defaultErrorMessages })

const numberValidator = createNumberValidatorFactory({ ... });
const stringValidator = createStringValidatorFactory({ ... });

validator().validate(0) // output => { valid: false, message: "Value "0" is not in the correct format!" }

validator().validate([]); // output => { valid: true, message: null }

validator({ minLength: 1 }).validate([]) // output => { valid: false, message: "Value '[]' must be greater than or equal to 1!" }

validator({ maxLength: 3 }).validate([1,2,3,4]) // output => { valid: false, message: "Value '[1,2,3,4]' must be less than or equal to 3!" }

validator({ minLength: 1, maxLength: 3 }).validate([1,2,3,4]) // output => { valid: false, message: "Value '[1,2,3,4]' must be greater than or equal to 1 and less than or equal to 3!" }

validator({ itemValidator: numberValidator}).validate([1,2,3,'5']) // output => { valid: false, message: "Value '5' is not in the correct format!" }

validator({ itemValidator: () => numberValidator({ min: 4 })}).validate([10,5,18,2]) // output => { valid: false, message: "Value '2' must be greater than or equal to 4" }

validator({ itemValidator: () => stringValidator()}).validate(['a', 'b', 'c', null]) // output => { valid: false, message: "Value 'null' is not in the correct format!" }
```

#### ArrayValidator Config

| Name          | Description                                              | Type                        |
| ------------- | -------------------------------------------------------- | --------------------------- |
| itemValidator | A validator that will validate each element of the array | `() =>  ElementUIValidator` |
| minLength     | Minimum array length                                     | `number`                    |
| maxLength     | Miximum array length                                     | `number`                    |
| messages      | Object with error messages                               | `object`                    |

#### ArrayValidator Error Messages

| Name             | Description                                                                                                                                                                 | Type                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| invalidFormat    | Error message when value is not an array                                                                                                                                    | `string` or `((val: any) => string)`                           |
| invalidMinLength | Error message when the length of the value (array) is less than or not equal to the set parameter "**minLength**" in the configuration                                      | `string` or `((min: number, val: any) => string)`              |
| invalidMaxLength | Error message when the length of the value (array) is greater than or not equal to the set parameter "**maxLength**" in the configuration                                   | `string` or `((max: number, val: any) => string)`              |
| invalidRange     | Error message when the length of the value (array) is less than or greater than or not equal to the set parameters "**minLength**" and "**maxLength**" in the configuration | `string` or `((min: number, max: number, val: any) => string)` |

### EmailValidator

This validator is designed to check the email for new installed configurations
_The use of this validator is possible using the appropriate class, or using a factory, which in turn makes it possible to send default error messages_

#### EmailValidator Config

| Name              | Description                                                                         | Type       |
| ----------------- | ----------------------------------------------------------------------------------- | ---------- |
| allowedDomainList | Array of domains that are valid for email. Example: ["gmail.com", "example.io"]     | `string[]` |
| blackListDomain   | Array of domains that are not valid for email. Example: ["gmail.com", "example.io"] | `string[]` |
| messages          | Object with error messages                                                          | `object`   |

#### EmailValidator Error Messages

| Name                | Description                                                                                                                                     | Type                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| invalidFormat       | Error message when email is not in the correct format                                                                                           | `string` or `((val: any) => string)`                    |
| notAllowedDomain    | Error message when email does not have a domain from the list of allowed ones set by the "**allowedDomainList**" parameter in the configuration | `string` or `((domains: string[], val: any) => string)` |
| domainFromBlackList | Error message when an email has a domain from the list of invalid ones set by the "**blackListDomain**" parameter in the configuration          | `string` or `((domains: string[], val: any) => string)` |

### Custom

In case you need to use another validator, you can implement it yourself.
All that is needed for this is the "validate" method, which must take an argument whose value must be validated. And returned the object of the validation result. Below is an example of a custom validator:

```js
// myCustomValidator.js
export class MyCustomValidator {
	validate(value) {
		if (value > 5) {
			return {
				valid: true,
				message: null,
			};
		} else {
			return {
				valid: false,
				message: 'Value must be greater than 5',
			};
		}
	}
}
```

```
// validator.js
import { createElementUIRuleBuilderFactory} from 'element-ui-validator';
import { MyCustomValidator } from './myCustomValidator';

const validator = createElementUIRuleBuilderFactory({
	validators: {
		myCustom: () => new MyCustomValidator()
	},
	...
});

const newRule = validator().useValidator("myCustom").setRequired(true).getRule();

```
