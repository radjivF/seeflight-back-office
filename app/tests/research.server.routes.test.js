'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Research = mongoose.model('Research'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, research;

/**
 * Research routes tests
 */
describe('Research CRUD tests', function() {
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

		// Save a user to the test db and create new Research
		user.save(function() {
			research = {
				name: 'Research Name'
			};

			done();
		});
	});

	it('should be able to save Research instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Research
				agent.post('/researchs')
					.send(research)
					.expect(200)
					.end(function(researchSaveErr, researchSaveRes) {
						// Handle Research save error
						if (researchSaveErr) done(researchSaveErr);

						// Get a list of Researchs
						agent.get('/researchs')
							.end(function(researchsGetErr, researchsGetRes) {
								// Handle Research save error
								if (researchsGetErr) done(researchsGetErr);

								// Get Researchs list
								var researchs = researchsGetRes.body;

								// Set assertions
								(researchs[0].user._id).should.equal(userId);
								(researchs[0].name).should.match('Research Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Research instance if not logged in', function(done) {
		agent.post('/researchs')
			.send(research)
			.expect(401)
			.end(function(researchSaveErr, researchSaveRes) {
				// Call the assertion callback
				done(researchSaveErr);
			});
	});

	it('should not be able to save Research instance if no name is provided', function(done) {
		// Invalidate name field
		research.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Research
				agent.post('/researchs')
					.send(research)
					.expect(400)
					.end(function(researchSaveErr, researchSaveRes) {
						// Set message assertion
						(researchSaveRes.body.message).should.match('Please fill Research name');
						
						// Handle Research save error
						done(researchSaveErr);
					});
			});
	});

	it('should be able to update Research instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Research
				agent.post('/researchs')
					.send(research)
					.expect(200)
					.end(function(researchSaveErr, researchSaveRes) {
						// Handle Research save error
						if (researchSaveErr) done(researchSaveErr);

						// Update Research name
						research.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Research
						agent.put('/researchs/' + researchSaveRes.body._id)
							.send(research)
							.expect(200)
							.end(function(researchUpdateErr, researchUpdateRes) {
								// Handle Research update error
								if (researchUpdateErr) done(researchUpdateErr);

								// Set assertions
								(researchUpdateRes.body._id).should.equal(researchSaveRes.body._id);
								(researchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Researchs if not signed in', function(done) {
		// Create new Research model instance
		var researchObj = new Research(research);

		// Save the Research
		researchObj.save(function() {
			// Request Researchs
			request(app).get('/researchs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Research if not signed in', function(done) {
		// Create new Research model instance
		var researchObj = new Research(research);

		// Save the Research
		researchObj.save(function() {
			request(app).get('/researchs/' + researchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', research.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Research instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Research
				agent.post('/researchs')
					.send(research)
					.expect(200)
					.end(function(researchSaveErr, researchSaveRes) {
						// Handle Research save error
						if (researchSaveErr) done(researchSaveErr);

						// Delete existing Research
						agent.delete('/researchs/' + researchSaveRes.body._id)
							.send(research)
							.expect(200)
							.end(function(researchDeleteErr, researchDeleteRes) {
								// Handle Research error error
								if (researchDeleteErr) done(researchDeleteErr);

								// Set assertions
								(researchDeleteRes.body._id).should.equal(researchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Research instance if not signed in', function(done) {
		// Set Research user 
		research.user = user;

		// Create new Research model instance
		var researchObj = new Research(research);

		// Save the Research
		researchObj.save(function() {
			// Try deleting Research
			request(app).delete('/researchs/' + researchObj._id)
			.expect(401)
			.end(function(researchDeleteErr, researchDeleteRes) {
				// Set message assertion
				(researchDeleteRes.body.message).should.match('User is not logged in');

				// Handle Research error error
				done(researchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Research.remove().exec();
		done();
	});
});