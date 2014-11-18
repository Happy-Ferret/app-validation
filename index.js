var Promise = require('bluebird');
var _ = require('lodash');

function buildValidator (objectRules) {
	return function validate (data) {
		var context = this;

		if (!data) {
			throw new Error('Object under validation can\'t be null');
		}

		var promises = _.map(objectRules, function forEachFeild (aliases, field) {
			var value = data[field];

			// Check if value is empty and there is `required` rule on the field
			if (isReallyEmpty(value) && aliases.indexOf('required') === -1) {
				return [];
			}

			var hasError = false;

			// Apply all rules required for the current field
			return aliases.map(function forEachFeildRule (alias) {
				var validator = resolveValidator(alias);

				if (!validator) {
					throw new Error('Can\'t find validator ' + alias);
				}

				var result = !hasError ? validator.call(context, data[field], field, data) : null;

				hasError = hasError || Boolean(result);

				return Promise.resolve(result).then(function (error) {
					if (error) {
						return _.zipObject([field], [error]);
					}
				});
			});
		});

		return Promise.all(_.flatten(promises)).then(function (errors) {
			errors = errors.filter(Boolean);

			if (errors.length) {
				throw { errors: _.assign.apply(undefined, errors) };
			}

			return data;
		});
	}
}

buildValidator.rules = {

};

function isReallyEmpty (value) {
	return _.isNull(value) || _.isUndefined(value) ||
		(_.isArray(value) || _.isString(value)) && _.isEmpty(value);
}

function resolveValidator (alias) {
	return buildValidator.rules[alias];
}

module.exports = buildValidator;
