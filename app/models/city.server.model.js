'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * City Schema
 */
var CitySchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	country:{
		type:[{ type: Schema.Types.ObjectId, ref: 'Country'}]
	},
	airport:{
		type:[{ type: Schema.Types.ObjectId, ref: 'Airport'}]
	},
});

mongoose.model('City', CitySchema);
