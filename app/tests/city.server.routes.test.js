'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	City = mongoose.model('City'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, city;

/**
 * City routes tests
 */
describe('City CRUD tests', function() {
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

		// Save a user to the test db and create new City
		user.save(function() {
			city = {
				name: 'City Name'
			};

			done();
		});
	});

	it('should be able to save City instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new City
				agent.post('/cities')
					.send(city)
					.expect(200)
					.end(function(citySaveErr, citySaveRes) {
						// Handle City save error
						if (citySaveErr) done(citySaveErr);

						// Get a list of Cities
						agent.get('/cities')
							.end(function(citiesGetErr, citiesGetRes) {
								// Handle City save error
								if (citiesGetErr) done(citiesGetErr);

								// Get Cities list
								var cities = citiesGetRes.body;

								// Set assertions
								(cities[0].user._id).should.equal(userId);
								(cities[0].name).should.match('City Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save City instance if not logged in', function(done) {
		agent.post('/cities')
			.send(city)
			.expect(401)
			.end(function(citySaveErr, citySaveRes) {
				// Call the assertion callback
				done(citySaveErr);
			});
	});

	it('should not be able to save City instance if no name is provided', function(done) {
		// Invalidate name field
		city.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new City
				agent.post('/cities')
					.send(city)
					.expect(400)
					.end(function(citySaveErr, citySaveRes) {
						// Set message assertion
						(citySaveRes.body.message).should.match('Please fill City name');
						
						// Handle City save error
						done(citySaveErr);
					});
			});
	});

	it('should be able to update City instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new City
				agent.post('/cities')
					.send(city)
					.expect(200)
					.end(function(citySaveErr, citySaveRes) {
						// Handle City save error
						if (citySaveErr) done(citySaveErr);

						// Update City name
						city.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing City
						agent.put('/cities/' + citySaveRes.body._id)
							.send(city)
							.expect(200)
							.end(function(cityUpdateErr, cityUpdateRes) {
								// Handle City update error
								if (cityUpdateErr) done(cityUpdateErr);

								// Set assertions
								(cityUpdateRes.body._id).should.equal(citySaveRes.body._id);
								(cityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cities if not signed in', function(done) {
		// Create new City model instance
		var cityObj = new City(city);

		// Save the City
		cityObj.save(function() {
			// Request Cities
			request(app).get('/cities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single City if not signed in', function(done) {
		// Create new City model instance
		var cityObj = new City(city);

		// Save the City
		cityObj.save(function() {
			request(app).get('/cities/' + cityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', city.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete City instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new City
				agent.post('/cities')
					.send(city)
					.expect(200)
					.end(function(citySaveErr, citySaveRes) {
						// Handle City save error
						if (citySaveErr) done(citySaveErr);

						// Delete existing City
						agent.delete('/cities/' + citySaveRes.body._id)
							.send(city)
							.expect(200)
							.end(function(cityDeleteErr, cityDeleteRes) {
								// Handle City error error
								if (cityDeleteErr) done(cityDeleteErr);

								// Set assertions
								(cityDeleteRes.body._id).should.equal(citySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete City instance if not signed in', function(done) {
		// Set City user 
		city.user = user;

		// Create new City model instance
		var cityObj = new City(city);

		// Save the City
		cityObj.save(function() {
			// Try deleting City
			request(app).delete('/cities/' + cityObj._id)
			.expect(401)
			.end(function(cityDeleteErr, cityDeleteRes) {
				// Set message assertion
				(cityDeleteRes.body.message).should.match('User is not logged in');

				// Handle City error error
				done(cityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		City.remove().exec();
		done();
	});
});