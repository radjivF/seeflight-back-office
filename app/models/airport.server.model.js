'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Airport Schema
 */
var AirportSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Airport name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	city: {
		type:{ type: Schema.Types.ObjectId, ref: 'City'}
	},
	country: {
		type:{ type: Schema.Types.ObjectId, ref: 'Country'}
	},
	idAirport: {
		type: String,
		required: 'Please fill Airport id'
	}
});

mongoose.model('Airport', AirportSchema);