'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Superhero Schema
 */
var SuperheroSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Superhero name',
		trim: true
	},
	superpower: {
		type: String,
		default:' '
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Superhero', SuperheroSchema);
