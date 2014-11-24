## app-validation

Part of app-helpers project.


Promise-based validation engine.

## Installation

```
npm install app-validation
```

## Usage

```javascript
var createValidator = require('app-validation');

// Create user validation function
var validateUser = createValidator({
	email: ['required', 'email', 'only gmail'],
	password: ['required', 'longer than 5'],
	type: ['required', 'available user types']
});

// Sample user object

var user = {
	email: 'user@example.com',
	password: 'test',
	type: 'admin'
};

// Validate user object and return promise
validateUser(user)

	// If validation passes successfully, resolves promise with given data object
	.then(function (user) {

	})

	// If validation fails -> rejection with validation errors object
	.catch(function (errors) {
		// Fits well with app-controller
	});
```

## Define custom rules

Rule is a simple function that takes 3 aprams: `value` to validate,
`field` name of currently validating object property and `context` - whole validating data object.

```javascript
v.extendRules({
	'valid name': function (value, field, context) {
		// ...
	}
});

var validate = v({
	name: ['valid name'],
	level: ['positive number']
});

validate({
	name: 'John',
	level: 10
});

// Will emit 'valid name' rule with params ('John', 'name', { name: 'John', level: 10 })
```

To emit failure rule function must return error message otherwise any falsy value or nothing.

```javascript
var v = require('app-validation');

v.extendRules({
	'only gmail': function (value) {
		if (value.indexOf('@gmail') === -1) {
			return 'Not gmail actually';
		}
	}
});

// Rule could be async
v.extendRules({
	'user exists': function (email) {
		// Assume users.findByEmail returns promise
		return users.findByEmail(email).then(function (user) {
			if (!user) {
				return 'User does not exist';
			}
		});
	}
});
```

## LICENSE
MIT
