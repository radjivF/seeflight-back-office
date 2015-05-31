'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Airplane = mongoose.model('Airplane'),
	_ = require('lodash');

/**
 * Create a Airplane
 */
exports.create = function(req, res) {
	var airplane = new Airplane(req.body);
	airplane.user = req.user;

	airplane.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airplane);
		}
	});
};

/**
 * Show the current Airplane
 */
exports.read = function(req, res) {
	res.jsonp(req.airplane);
};

/**
 * Update a Airplane
 */
exports.update = function(req, res) {
	var airplane = req.airplane ;

	airplane = _.extend(airplane , req.body);

	airplane.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airplane);
		}
	});
};

/**
 * Delete an Airplane
 */
exports.delete = function(req, res) {
	var airplane = req.airplane ;

	airplane.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airplane);
		}
	});
};

/**
 * List of Airplanes
 */
exports.list = function(req, res) { 
	Airplane.find().sort('-created').populate('user', 'displayName').exec(function(err, airplanes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airplanes);
		}
	});
};

/**
 * Airplane middleware
 */
exports.airplaneByID = function(req, res, next, id) { 
	Airplane.findById(id).populate('user', 'displayName').exec(function(err, airplane) {
		if (err) return next(err);
		if (! airplane) return next(new Error('Failed to load Airplane ' + id));
		req.airplane = airplane ;
		next();
	});
};

/**
 * Airplane authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.airplane.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
