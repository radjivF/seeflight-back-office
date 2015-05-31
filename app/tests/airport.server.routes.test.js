'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Airport = mongoose.model('Airport'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, airport;

/**
 * Airport routes tests
 */
describe('Airport CRUD tests', function() {
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

		// Save a user to the test db and create new Airport
		user.save(function() {
			airport = {
				name: 'Airport Name'
			};

			done();
		});
	});

	it('should be able to save Airport instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airport
				agent.post('/airports')
					.send(airport)
					.expect(200)
					.end(function(airportSaveErr, airportSaveRes) {
						// Handle Airport save error
						if (airportSaveErr) done(airportSaveErr);

						// Get a list of Airports
						agent.get('/airports')
							.end(function(airportsGetErr, airportsGetRes) {
								// Handle Airport save error
								if (airportsGetErr) done(airportsGetErr);

								// Get Airports list
								var airports = airportsGetRes.body;

								// Set assertions
								(airports[0].user._id).should.equal(userId);
								(airports[0].name).should.match('Airport Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Airport instance if not logged in', function(done) {
		agent.post('/airports')
			.send(airport)
			.expect(401)
			.end(function(airportSaveErr, airportSaveRes) {
				// Call the assertion callback
				done(airportSaveErr);
			});
	});

	it('should not be able to save Airport instance if no name is provided', function(done) {
		// Invalidate name field
		airport.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airport
				agent.post('/airports')
					.send(airport)
					.expect(400)
					.end(function(airportSaveErr, airportSaveRes) {
						// Set message assertion
						(airportSaveRes.body.message).should.match('Please fill Airport name');
						
						// Handle Airport save error
						done(airportSaveErr);
					});
			});
	});

	it('should be able to update Airport instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airport
				agent.post('/airports')
					.send(airport)
					.expect(200)
					.end(function(airportSaveErr, airportSaveRes) {
						// Handle Airport save error
						if (airportSaveErr) done(airportSaveErr);

						// Update Airport name
						airport.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Airport
						agent.put('/airports/' + airportSaveRes.body._id)
							.send(airport)
							.expect(200)
							.end(function(airportUpdateErr, airportUpdateRes) {
								// Handle Airport update error
								if (airportUpdateErr) done(airportUpdateErr);

								// Set assertions
								(airportUpdateRes.body._id).should.equal(airportSaveRes.body._id);
								(airportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Airports if not signed in', function(done) {
		// Create new Airport model instance
		var airportObj = new Airport(airport);

		// Save the Airport
		airportObj.save(function() {
			// Request Airports
			request(app).get('/airports')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Airport if not signed in', function(done) {
		// Create new Airport model instance
		var airportObj = new Airport(airport);

		// Save the Airport
		airportObj.save(function() {
			request(app).get('/airports/' + airportObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', airport.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Airport instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airport
				agent.post('/airports')
					.send(airport)
					.expect(200)
					.end(function(airportSaveErr, airportSaveRes) {
						// Handle Airport save error
						if (airportSaveErr) done(airportSaveErr);

						// Delete existing Airport
						agent.delete('/airports/' + airportSaveRes.body._id)
							.send(airport)
							.expect(200)
							.end(function(airportDeleteErr, airportDeleteRes) {
								// Handle Airport error error
								if (airportDeleteErr) done(airportDeleteErr);

								// Set assertions
								(airportDeleteRes.body._id).should.equal(airportSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Airport instance if not signed in', function(done) {
		// Set Airport user 
		airport.user = user;

		// Create new Airport model instance
		var airportObj = new Airport(airport);

		// Save the Airport
		airportObj.save(function() {
			// Try deleting Airport
			request(app).delete('/airports/' + airportObj._id)
			.expect(401)
			.end(function(airportDeleteErr, airportDeleteRes) {
				// Set message assertion
				(airportDeleteRes.body.message).should.match('User is not logged in');

				// Handle Airport error error
				done(airportDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Airport.remove().exec();
		done();
	});
});