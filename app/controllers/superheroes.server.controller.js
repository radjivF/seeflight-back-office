'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Superhero = mongoose.model('Superhero'),
	_ = require('lodash');

/**
 * Create a Superhero
 */
exports.create = function(req, res) {
	var superhero = new Superhero(req.body);
	superhero.user = req.user;

	superhero.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(superhero);
		}
	});
};

/**
 * Show the current Superhero
 */
exports.read = function(req, res) {
	res.jsonp(req.superhero);
};

/**
 * Update a Superhero
 */
exports.update = function(req, res) {
	var superhero = req.superhero ;

	superhero = _.extend(superhero , req.body);

	superhero.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(superhero);
		}
	});
};

/**
 * Delete an Superhero
 */
exports.delete = function(req, res) {
	var superhero = req.superhero ;

	superhero.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(superhero);
		}
	});
};

/**
 * List of Superheroes
 */
exports.list = function(req, res) { 
	Superhero.find().sort('-created').populate('user', 'displayName').exec(function(err, superheroes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(superheroes);
		}
	});
};

/**
 * Superhero middleware
 */
exports.superheroByID = function(req, res, next, id) { 
	Superhero.findById(id).populate('user', 'displayName').exec(function(err, superhero) {
		if (err) return next(err);
		if (! superhero) return next(new Error('Failed to load Superhero ' + id));
		req.superhero = superhero ;
		next();
	});
};

/**
 * Superhero authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.superhero.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
