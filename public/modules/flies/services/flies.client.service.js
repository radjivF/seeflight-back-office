'use strict';

//Flies service used to communicate Flies REST endpoints
angular.module('flies').factory('Flies', ['$resource',
	function($resource) {
		return $resource('flies/:flyId', { flyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);