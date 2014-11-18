var should = require('should');
var validate = require('./');
var _ = require('lodash');

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

	validate.extendRules({
		'gmail': function (email) {
			if (email.indexOf('@gmail.com') === -1) {
				return 'error-email';
			}
		},

		'password': function (password) {
			if (password.length < 7) {
				return 'error-password';
			}
		}
	});

	var validator = validate({
		email: ['required', 'gmail'],
		password: ['required', 'password']
	});

	it('should fail with multiple rules', function (done) {
		var data = {
			email: 'ema@email.com',
			password: 'lol',
			stuff: 123
		};

		validator(data).catch(function (err) {
			err.errors.email.should.be.equal('error-email');
			err.errors.password.should.be.equal('error-password');
			done();
		});
	});

	it('should fail with multiple rules required ruel', function (done) {
		var data = {
			email: '',
			password: null,
			stuff: 1
		};

		validator(data).catch(function (err) {
			err.errors.email.should.be.equal('Required field');
			err.errors.password.should.be.equal('Required field');
			done();
		});
	});

	it('should pass with multiple rules', function (done) {
		var data = {
			email: 'asdf@gmail.com',
			password: '123456789',
			stuff: 'okok'
		};

		validator(data).then(function (data2) {
			_.isEqual(data, data2).should.be.ok;
			done();
		});
	});
});
