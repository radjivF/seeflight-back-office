'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Airport = mongoose.model('Airport'),
	_ = require('lodash');

/**
 * Create a Airport
 */
exports.create = function(req, res) {
	var airport = new Airport(req.body);
	airport.user = req.user;

	airport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airport);
		}
	});
};

/**
 * Show the current Airport
 */
exports.read = function(req, res) {
	res.jsonp(req.airport);
};

/**
 * Update a Airport
 */
exports.update = function(req, res) {
	var airport = req.airport ;

	airport = _.extend(airport , req.body);

	airport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airport);
		}
	});
};

/**
 * Delete an Airport
 */
exports.delete = function(req, res) {
	var airport = req.airport ;

	airport.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airport);
		}
	});
};

/**
 * List of Airports
 */
exports.list = function(req, res) { 
	Airport.find().sort('-created').populate('user', 'displayName').exec(function(err, airports) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airports);
		}
	});
};

/**
 * Airport middleware
 */
exports.airportByID = function(req, res, next, id) { 
	Airport.findById(id).populate('user', 'displayName').exec(function(err, airport) {
		if (err) return next(err);
		if (! airport) return next(new Error('Failed to load Airport ' + id));
		req.airport = airport ;
		next();
	});
};

/**
 * Airport authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.airport.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
