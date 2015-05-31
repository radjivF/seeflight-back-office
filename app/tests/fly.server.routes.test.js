'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fly = mongoose.model('Fly'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fly;

/**
 * Fly routes tests
 */
describe('Fly CRUD tests', function() {
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

		// Save a user to the test db and create new Fly
		user.save(function() {
			fly = {
				name: 'Fly Name'
			};

			done();
		});
	});

	it('should be able to save Fly instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fly
				agent.post('/flies')
					.send(fly)
					.expect(200)
					.end(function(flySaveErr, flySaveRes) {
						// Handle Fly save error
						if (flySaveErr) done(flySaveErr);

						// Get a list of Flies
						agent.get('/flies')
							.end(function(fliesGetErr, fliesGetRes) {
								// Handle Fly save error
								if (fliesGetErr) done(fliesGetErr);

								// Get Flies list
								var flies = fliesGetRes.body;

								// Set assertions
								(flies[0].user._id).should.equal(userId);
								(flies[0].name).should.match('Fly Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fly instance if not logged in', function(done) {
		agent.post('/flies')
			.send(fly)
			.expect(401)
			.end(function(flySaveErr, flySaveRes) {
				// Call the assertion callback
				done(flySaveErr);
			});
	});

	it('should not be able to save Fly instance if no name is provided', function(done) {
		// Invalidate name field
		fly.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fly
				agent.post('/flies')
					.send(fly)
					.expect(400)
					.end(function(flySaveErr, flySaveRes) {
						// Set message assertion
						(flySaveRes.body.message).should.match('Please fill Fly name');
						
						// Handle Fly save error
						done(flySaveErr);
					});
			});
	});

	it('should be able to update Fly instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fly
				agent.post('/flies')
					.send(fly)
					.expect(200)
					.end(function(flySaveErr, flySaveRes) {
						// Handle Fly save error
						if (flySaveErr) done(flySaveErr);

						// Update Fly name
						fly.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Fly
						agent.put('/flies/' + flySaveRes.body._id)
							.send(fly)
							.expect(200)
							.end(function(flyUpdateErr, flyUpdateRes) {
								// Handle Fly update error
								if (flyUpdateErr) done(flyUpdateErr);

								// Set assertions
								(flyUpdateRes.body._id).should.equal(flySaveRes.body._id);
								(flyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Flies if not signed in', function(done) {
		// Create new Fly model instance
		var flyObj = new Fly(fly);

		// Save the Fly
		flyObj.save(function() {
			// Request Flies
			request(app).get('/flies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fly if not signed in', function(done) {
		// Create new Fly model instance
		var flyObj = new Fly(fly);

		// Save the Fly
		flyObj.save(function() {
			request(app).get('/flies/' + flyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', fly.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fly instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fly
				agent.post('/flies')
					.send(fly)
					.expect(200)
					.end(function(flySaveErr, flySaveRes) {
						// Handle Fly save error
						if (flySaveErr) done(flySaveErr);

						// Delete existing Fly
						agent.delete('/flies/' + flySaveRes.body._id)
							.send(fly)
							.expect(200)
							.end(function(flyDeleteErr, flyDeleteRes) {
								// Handle Fly error error
								if (flyDeleteErr) done(flyDeleteErr);

								// Set assertions
								(flyDeleteRes.body._id).should.equal(flySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fly instance if not signed in', function(done) {
		// Set Fly user 
		fly.user = user;

		// Create new Fly model instance
		var flyObj = new Fly(fly);

		// Save the Fly
		flyObj.save(function() {
			// Try deleting Fly
			request(app).delete('/flies/' + flyObj._id)
			.expect(401)
			.end(function(flyDeleteErr, flyDeleteRes) {
				// Set message assertion
				(flyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fly error error
				done(flyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Fly.remove().exec();
		done();
	});
});