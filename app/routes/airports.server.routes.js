'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var airports = require('../../app/controllers/airports.server.controller');

	// Airports Routes
	app.route('/airports')
		.get(airports.list)
		.post(users.requiresLogin, airports.create);

	app.route('/airports/:airportId')
		.get(airports.read)
		.put(users.requiresLogin, airports.hasAuthorization, airports.update)
		.delete(users.requiresLogin, airports.hasAuthorization, airports.delete);

	// Finish by binding the Airport middleware
	app.param('airportId', airports.airportByID);
};
