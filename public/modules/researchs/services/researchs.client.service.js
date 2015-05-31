'use strict';

//Researchs service used to communicate Researchs REST endpoints
angular.module('researchs').factory('Researchs', ['$resource',
	function($resource) {
		return $resource('researchs/:researchId', { researchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);