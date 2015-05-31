'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var researchs = require('../../app/controllers/researchs.server.controller');

	// Researchs Routes
	app.route('/researchs')
		.get(researchs.list)
		.post(users.requiresLogin, researchs.create);

	app.route('/researchs/:researchId')
		.get(researchs.read)
		.put(users.requiresLogin, researchs.hasAuthorization, researchs.update)
		.delete(users.requiresLogin, researchs.hasAuthorization, researchs.delete);

	// Finish by binding the Research middleware
	app.param('researchId', researchs.researchByID);
};
