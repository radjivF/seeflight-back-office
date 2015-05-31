'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fly = mongoose.model('Fly'),
	_ = require('lodash');

/**
 * Create a Fly
 */
exports.create = function(req, res) {
	var fly = new Fly(req.body);
	fly.user = req.user;

	fly.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fly);
		}
	});
};

/**
 * Show the current Fly
 */
exports.read = function(req, res) {
	res.jsonp(req.fly);
};

/**
 * Update a Fly
 */
exports.update = function(req, res) {
	var fly = req.fly ;

	fly = _.extend(fly , req.body);

	fly.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fly);
		}
	});
};

/**
 * Delete an Fly
 */
exports.delete = function(req, res) {
	var fly = req.fly ;

	fly.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fly);
		}
	});
};

/**
 * List of Flies
 */
exports.list = function(req, res) { 
	Fly.find().sort('-created').populate('user', 'displayName').exec(function(err, flies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(flies);
		}
	});
};

/**
 * Fly middleware
 */
exports.flyByID = function(req, res, next, id) { 
	Fly.findById(id).populate('user', 'displayName').exec(function(err, fly) {
		if (err) return next(err);
		if (! fly) return next(new Error('Failed to load Fly ' + id));
		req.fly = fly ;
		next();
	});
};

/**
 * Fly authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.fly.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
