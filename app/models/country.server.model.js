'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Country Schema
 */
var CountrySchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	city:{
		type:[{ type: Schema.Types.ObjectId, ref: 'City'}]
	}
});

mongoose.model('Country', CountrySchema);
