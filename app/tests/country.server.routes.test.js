'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Country = mongoose.model('Country'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, country;

/**
 * Country routes tests
 */
describe('Country CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Country
		user.save(function() {
			country = {
				name: 'Country Name'
			};

			done();
		});
	});

	it('should be able to save Country instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Country
				agent.post('/countries')
					.send(country)
					.expect(200)
					.end(function(countrySaveErr, countrySaveRes) {
						// Handle Country save error
						if (countrySaveErr) done(countrySaveErr);

						// Get a list of Countries
						agent.get('/countries')
							.end(function(countriesGetErr, countriesGetRes) {
								// Handle Country save error
								if (countriesGetErr) done(countriesGetErr);

								// Get Countries list
								var countries = countriesGetRes.body;

								// Set assertions
								(countries[0].user._id).should.equal(userId);
								(countries[0].name).should.match('Country Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Country instance if not logged in', function(done) {
		agent.post('/countries')
			.send(country)
			.expect(401)
			.end(function(countrySaveErr, countrySaveRes) {
				// Call the assertion callback
				done(countrySaveErr);
			});
	});

	it('should not be able to save Country instance if no name is provided', function(done) {
		// Invalidate name field
		country.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Country
				agent.post('/countries')
					.send(country)
					.expect(400)
					.end(function(countrySaveErr, countrySaveRes) {
						// Set message assertion
						(countrySaveRes.body.message).should.match('Please fill Country name');
						
						// Handle Country save error
						done(countrySaveErr);
					});
			});
	});

	it('should be able to update Country instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Country
				agent.post('/countries')
					.send(country)
					.expect(200)
					.end(function(countrySaveErr, countrySaveRes) {
						// Handle Country save error
						if (countrySaveErr) done(countrySaveErr);

						// Update Country name
						country.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Country
						agent.put('/countries/' + countrySaveRes.body._id)
							.send(country)
							.expect(200)
							.end(function(countryUpdateErr, countryUpdateRes) {
								// Handle Country update error
								if (countryUpdateErr) done(countryUpdateErr);

								// Set assertions
								(countryUpdateRes.body._id).should.equal(countrySaveRes.body._id);
								(countryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Countries if not signed in', function(done) {
		// Create new Country model instance
		var countryObj = new Country(country);

		// Save the Country
		countryObj.save(function() {
			// Request Countries
			request(app).get('/countries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Country if not signed in', function(done) {
		// Create new Country model instance
		var countryObj = new Country(country);

		// Save the Country
		countryObj.save(function() {
			request(app).get('/countries/' + countryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', country.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Country instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Country
				agent.post('/countries')
					.send(country)
					.expect(200)
					.end(function(countrySaveErr, countrySaveRes) {
						// Handle Country save error
						if (countrySaveErr) done(countrySaveErr);

						// Delete existing Country
						agent.delete('/countries/' + countrySaveRes.body._id)
							.send(country)
							.expect(200)
							.end(function(countryDeleteErr, countryDeleteRes) {
								// Handle Country error error
								if (countryDeleteErr) done(countryDeleteErr);

								// Set assertions
								(countryDeleteRes.body._id).should.equal(countrySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Country instance if not signed in', function(done) {
		// Set Country user 
		country.user = user;

		// Create new Country model instance
		var countryObj = new Country(country);

		// Save the Country
		countryObj.save(function() {
			// Try deleting Country
			request(app).delete('/countries/' + countryObj._id)
			.expect(401)
			.end(function(countryDeleteErr, countryDeleteRes) {
				// Set message assertion
				(countryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Country error error
				done(countryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Country.remove().exec();
		done();
	});
});