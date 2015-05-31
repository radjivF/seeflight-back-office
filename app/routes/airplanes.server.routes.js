'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var airplanes = require('../../app/controllers/airplanes.server.controller');

	// Airplanes Routes
	app.route('/airplanes')
		.get(airplanes.list)
		.post(users.requiresLogin, airplanes.create);

	app.route('/airplanes/:airplaneId')
		.get(airplanes.read)
		.put(users.requiresLogin, airplanes.hasAuthorization, airplanes.update)
		.delete(users.requiresLogin, airplanes.hasAuthorization, airplanes.delete);

	// Finish by binding the Airplane middleware
	app.param('airplaneId', airplanes.airplaneByID);
};
