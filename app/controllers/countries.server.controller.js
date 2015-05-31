'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Country = mongoose.model('Country'),
	_ = require('lodash');

/**
 * Create a Country
 */
exports.create = function(req, res) {
	var country = new Country(req.body);
	country.user = req.user;

	country.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(country);
		}
	});
};

/**
 * Show the current Country
 */
exports.read = function(req, res) {
	res.jsonp(req.country);
};

/**
 * Update a Country
 */
exports.update = function(req, res) {
	var country = req.country ;

	country = _.extend(country , req.body);

	country.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(country);
		}
	});
};

/**
 * Delete an Country
 */
exports.delete = function(req, res) {
	var country = req.country ;

	country.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(country);
		}
	});
};

/**
 * List of Countries
 */
exports.list = function(req, res) { 
	Country.find().sort('-created').populate('user', 'displayName').exec(function(err, countries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(countries);
		}
	});
};

/**
 * Country middleware
 */
exports.countryByID = function(req, res, next, id) { 
	Country.findById(id).populate('user', 'displayName').exec(function(err, country) {
		if (err) return next(err);
		if (! country) return next(new Error('Failed to load Country ' + id));
		req.country = country ;
		next();
	});
};

/**
 * Country authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.country.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
