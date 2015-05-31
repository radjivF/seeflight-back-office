'use strict';

//Airplanes service used to communicate Airplanes REST endpoints
angular.module('airplanes').factory('Airplanes', ['$resource',
	function($resource) {
		return $resource('airplanes/:airplaneId', { airplaneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);