var _ = require('lodash');

function notEmpty (value) {
	if (_.isEmpty(value) && !_.isNumber(value) && !_.isBoolean(value)) {
		return 'Required field';
	}
}

module.exports = {
	required: notEmpty
};
