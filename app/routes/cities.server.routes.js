'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cities = require('../../app/controllers/cities.server.controller');

	// Cities Routes
	app.route('/cities')
		.get(cities.list)
		.post(users.requiresLogin, cities.create);

	app.route('/cities/:cityId')
		.get(cities.read)
		.put(users.requiresLogin, cities.hasAuthorization, cities.update)
		.delete(users.requiresLogin, cities.hasAuthorization, cities.delete);

	// Finish by binding the City middleware
	app.param('cityId', cities.cityByID);
};
