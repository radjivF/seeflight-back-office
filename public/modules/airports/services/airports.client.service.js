'use strict';

//Airports service used to communicate Airports REST endpoints
angular.module('airports').factory('Airports', ['$resource',
	function($resource) {
		return $resource('airports/:airportId', { airportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);