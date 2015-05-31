'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var flies = require('../../app/controllers/flies.server.controller');

	// Flies Routes
	app.route('/flies')
		.get(flies.list)
		.post(users.requiresLogin, flies.create);

	app.route('/flies/:flyId')
		.get(flies.read)
		.put(users.requiresLogin, flies.hasAuthorization, flies.update)
		.delete(users.requiresLogin, flies.hasAuthorization, flies.delete);

	// Finish by binding the Fly middleware
	app.param('flyId', flies.flyByID);
};
