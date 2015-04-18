'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var superheroes = require('../../app/controllers/superheroes.server.controller');

	// Superheroes Routes
	app.route('/superheroes')
		.get(superheroes.list)
		.post(users.requiresLogin, superheroes.create);

	app.route('/superheroes/:superheroId')
		.get(superheroes.read)
		.put(users.requiresLogin, superheroes.hasAuthorization, superheroes.update)
		.delete(users.requiresLogin, superheroes.hasAuthorization, superheroes.delete);

	// Finish by binding the Superhero middleware
	app.param('superheroId', superheroes.superheroByID);
};
