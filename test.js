var should = require('should');
var validate = require('./');

describe('Validate', function () {

	it('should fail validation on simple required rule', function (done) {
		var validation = validate({
			name: ['required']
		});

		var data = {
			name: null
		};

		validation(data).catch(function(errors) {
			done();
		});
	});

	validate.extendRules({
		name: function (value) {
			if (value === 'haha') {
				return 'error';
			}
		}
	});

	var validation = validate({
		name: ['name']
	});

	it('should fail validation on custom rule', function (done) {
		var data = {
			name: 'haha'
		};

		validation(data).catch(function(err) {
			err.errors.name.should.be.exactly('error');
			done();
		});
	});

	it('should pass validation on custom rule', function (done) {
		var data = {
			name: 'not-haha'
		};

		validation(data).catch(function() {
			done();
		});

		validation(data).then(function (data) {
			data.name.should.be.exactly('not-haha');
			done();
		}).catch(done);
	});
});
