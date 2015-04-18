'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Superhero = mongoose.model('Superhero'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, superhero;

/**
 * Superhero routes tests
 */
describe('Superhero CRUD tests', function() {
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

		// Save a user to the test db and create new Superhero
		user.save(function() {
			superhero = {
				name: 'Superhero Name'
			};

			done();
		});
	});

	it('should be able to save Superhero instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Superhero
				agent.post('/superheroes')
					.send(superhero)
					.expect(200)
					.end(function(superheroSaveErr, superheroSaveRes) {
						// Handle Superhero save error
						if (superheroSaveErr) done(superheroSaveErr);

						// Get a list of Superheroes
						agent.get('/superheroes')
							.end(function(superheroesGetErr, superheroesGetRes) {
								// Handle Superhero save error
								if (superheroesGetErr) done(superheroesGetErr);

								// Get Superheroes list
								var superheroes = superheroesGetRes.body;

								// Set assertions
								(superheroes[0].user._id).should.equal(userId);
								(superheroes[0].name).should.match('Superhero Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Superhero instance if not logged in', function(done) {
		agent.post('/superheroes')
			.send(superhero)
			.expect(401)
			.end(function(superheroSaveErr, superheroSaveRes) {
				// Call the assertion callback
				done(superheroSaveErr);
			});
	});

	it('should not be able to save Superhero instance if no name is provided', function(done) {
		// Invalidate name field
		superhero.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Superhero
				agent.post('/superheroes')
					.send(superhero)
					.expect(400)
					.end(function(superheroSaveErr, superheroSaveRes) {
						// Set message assertion
						(superheroSaveRes.body.message).should.match('Please fill Superhero name');
						
						// Handle Superhero save error
						done(superheroSaveErr);
					});
			});
	});

	it('should be able to update Superhero instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Superhero
				agent.post('/superheroes')
					.send(superhero)
					.expect(200)
					.end(function(superheroSaveErr, superheroSaveRes) {
						// Handle Superhero save error
						if (superheroSaveErr) done(superheroSaveErr);

						// Update Superhero name
						superhero.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Superhero
						agent.put('/superheroes/' + superheroSaveRes.body._id)
							.send(superhero)
							.expect(200)
							.end(function(superheroUpdateErr, superheroUpdateRes) {
								// Handle Superhero update error
								if (superheroUpdateErr) done(superheroUpdateErr);

								// Set assertions
								(superheroUpdateRes.body._id).should.equal(superheroSaveRes.body._id);
								(superheroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Superheroes if not signed in', function(done) {
		// Create new Superhero model instance
		var superheroObj = new Superhero(superhero);

		// Save the Superhero
		superheroObj.save(function() {
			// Request Superheroes
			request(app).get('/superheroes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Superhero if not signed in', function(done) {
		// Create new Superhero model instance
		var superheroObj = new Superhero(superhero);

		// Save the Superhero
		superheroObj.save(function() {
			request(app).get('/superheroes/' + superheroObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', superhero.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Superhero instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Superhero
				agent.post('/superheroes')
					.send(superhero)
					.expect(200)
					.end(function(superheroSaveErr, superheroSaveRes) {
						// Handle Superhero save error
						if (superheroSaveErr) done(superheroSaveErr);

						// Delete existing Superhero
						agent.delete('/superheroes/' + superheroSaveRes.body._id)
							.send(superhero)
							.expect(200)
							.end(function(superheroDeleteErr, superheroDeleteRes) {
								// Handle Superhero error error
								if (superheroDeleteErr) done(superheroDeleteErr);

								// Set assertions
								(superheroDeleteRes.body._id).should.equal(superheroSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Superhero instance if not signed in', function(done) {
		// Set Superhero user 
		superhero.user = user;

		// Create new Superhero model instance
		var superheroObj = new Superhero(superhero);

		// Save the Superhero
		superheroObj.save(function() {
			// Try deleting Superhero
			request(app).delete('/superheroes/' + superheroObj._id)
			.expect(401)
			.end(function(superheroDeleteErr, superheroDeleteRes) {
				// Set message assertion
				(superheroDeleteRes.body.message).should.match('User is not logged in');

				// Handle Superhero error error
				done(superheroDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Superhero.remove().exec();
		done();
	});
});