'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var countries = require('../../app/controllers/countries.server.controller');

	// Countries Routes
	app.route('/countries')
		.get(countries.list)
		.post(users.requiresLogin, countries.create);

	app.route('/countries/:countryId')
		.get(countries.read)
		.put(users.requiresLogin, countries.hasAuthorization, countries.update)
		.delete(users.requiresLogin, countries.hasAuthorization, countries.delete);

	// Finish by binding the Country middleware
	app.param('countryId', countries.countryByID);
};
