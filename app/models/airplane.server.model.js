'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Airplane Schema
 */
var AirplaneSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	company: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Airplane', AirplaneSchema);
