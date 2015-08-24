'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fly Schema
 */
var FlySchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	airplane:{
		type:{ type: Schema.Types.ObjectId, ref: 'Airplane'}
	},
	startAirport:{
		type:{ type: Schema.Types.ObjectId, ref: 'Airport'},
	},
	startCity:{
		type:{ type: Schema.Types.ObjectId, ref: 'City'}
	},
	arrivalAirport:{
		type:[{ type: Schema.Types.ObjectId, ref: 'Airport'}]
	},
	arrivalCity:{
		type:{ type: Schema.Types.ObjectId, ref: 'City'}
	},
	startDate:{
		type: Date
	},
	arrivalDate:{
		type: Date
	}
});

mongoose.model('Fly', FlySchema);
