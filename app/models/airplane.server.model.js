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
		required: 'Please fill Airplane name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	company: {
		type: String,
		default: '',
		required: 'Please fill Airplane name',
		trim: true
	}
});

mongoose.model('Airplane', AirplaneSchema);