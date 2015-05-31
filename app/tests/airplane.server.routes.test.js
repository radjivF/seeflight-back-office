'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Airplane = mongoose.model('Airplane'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, airplane;

/**
 * Airplane routes tests
 */
describe('Airplane CRUD tests', function() {
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

		// Save a user to the test db and create new Airplane
		user.save(function() {
			airplane = {
				name: 'Airplane Name'
			};

			done();
		});
	});

	it('should be able to save Airplane instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airplane
				agent.post('/airplanes')
					.send(airplane)
					.expect(200)
					.end(function(airplaneSaveErr, airplaneSaveRes) {
						// Handle Airplane save error
						if (airplaneSaveErr) done(airplaneSaveErr);

						// Get a list of Airplanes
						agent.get('/airplanes')
							.end(function(airplanesGetErr, airplanesGetRes) {
								// Handle Airplane save error
								if (airplanesGetErr) done(airplanesGetErr);

								// Get Airplanes list
								var airplanes = airplanesGetRes.body;

								// Set assertions
								(airplanes[0].user._id).should.equal(userId);
								(airplanes[0].name).should.match('Airplane Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Airplane instance if not logged in', function(done) {
		agent.post('/airplanes')
			.send(airplane)
			.expect(401)
			.end(function(airplaneSaveErr, airplaneSaveRes) {
				// Call the assertion callback
				done(airplaneSaveErr);
			});
	});

	it('should not be able to save Airplane instance if no name is provided', function(done) {
		// Invalidate name field
		airplane.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airplane
				agent.post('/airplanes')
					.send(airplane)
					.expect(400)
					.end(function(airplaneSaveErr, airplaneSaveRes) {
						// Set message assertion
						(airplaneSaveRes.body.message).should.match('Please fill Airplane name');
						
						// Handle Airplane save error
						done(airplaneSaveErr);
					});
			});
	});

	it('should be able to update Airplane instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airplane
				agent.post('/airplanes')
					.send(airplane)
					.expect(200)
					.end(function(airplaneSaveErr, airplaneSaveRes) {
						// Handle Airplane save error
						if (airplaneSaveErr) done(airplaneSaveErr);

						// Update Airplane name
						airplane.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Airplane
						agent.put('/airplanes/' + airplaneSaveRes.body._id)
							.send(airplane)
							.expect(200)
							.end(function(airplaneUpdateErr, airplaneUpdateRes) {
								// Handle Airplane update error
								if (airplaneUpdateErr) done(airplaneUpdateErr);

								// Set assertions
								(airplaneUpdateRes.body._id).should.equal(airplaneSaveRes.body._id);
								(airplaneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Airplanes if not signed in', function(done) {
		// Create new Airplane model instance
		var airplaneObj = new Airplane(airplane);

		// Save the Airplane
		airplaneObj.save(function() {
			// Request Airplanes
			request(app).get('/airplanes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Airplane if not signed in', function(done) {
		// Create new Airplane model instance
		var airplaneObj = new Airplane(airplane);

		// Save the Airplane
		airplaneObj.save(function() {
			request(app).get('/airplanes/' + airplaneObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', airplane.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Airplane instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airplane
				agent.post('/airplanes')
					.send(airplane)
					.expect(200)
					.end(function(airplaneSaveErr, airplaneSaveRes) {
						// Handle Airplane save error
						if (airplaneSaveErr) done(airplaneSaveErr);

						// Delete existing Airplane
						agent.delete('/airplanes/' + airplaneSaveRes.body._id)
							.send(airplane)
							.expect(200)
							.end(function(airplaneDeleteErr, airplaneDeleteRes) {
								// Handle Airplane error error
								if (airplaneDeleteErr) done(airplaneDeleteErr);

								// Set assertions
								(airplaneDeleteRes.body._id).should.equal(airplaneSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Airplane instance if not signed in', function(done) {
		// Set Airplane user 
		airplane.user = user;

		// Create new Airplane model instance
		var airplaneObj = new Airplane(airplane);

		// Save the Airplane
		airplaneObj.save(function() {
			// Try deleting Airplane
			request(app).delete('/airplanes/' + airplaneObj._id)
			.expect(401)
			.end(function(airplaneDeleteErr, airplaneDeleteRes) {
				// Set message assertion
				(airplaneDeleteRes.body.message).should.match('User is not logged in');

				// Handle Airplane error error
				done(airplaneDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Airplane.remove().exec();
		done();
	});
});