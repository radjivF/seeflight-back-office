'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Research Schema
 */
var ResearchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Research name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	startAirport: {
		type: Schema.ObjectId,
		ref: 'Airport'
	},
	arrivalAirport: {
		type: Schema.ObjectId,
		ref: 'Airport'
	}
});

mongoose.model('Research', ResearchSchema);