'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	City = mongoose.model('City'),
	_ = require('lodash');

/**
 * Create a City
 */
exports.create = function(req, res) {
	var city = new City(req.body);
	city.user = req.user;

	city.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(city);
		}
	});
};

/**
 * Show the current City
 */
exports.read = function(req, res) {
	res.jsonp(req.city);
};

/**
 * Update a City
 */
exports.update = function(req, res) {
	var city = req.city ;

	city = _.extend(city , req.body);

	city.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(city);
		}
	});
};

/**
 * Delete an City
 */
exports.delete = function(req, res) {
	var city = req.city ;

	city.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(city);
		}
	});
};

/**
 * List of Cities
 */
exports.list = function(req, res) { 
	City.find().sort('-created').populate('user', 'displayName').exec(function(err, cities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cities);
		}
	});
};

/**
 * City middleware
 */
exports.cityByID = function(req, res, next, id) { 
	City.findById(id).populate('user', 'displayName').exec(function(err, city) {
		if (err) return next(err);
		if (! city) return next(new Error('Failed to load City ' + id));
		req.city = city ;
		next();
	});
};

/**
 * City authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.city.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
