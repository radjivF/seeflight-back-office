'use strict';

//Superheroes service used to communicate Superheroes REST endpoints
angular.module('superheroes').factory('Superheroes', ['$resource',
	function($resource) {
		return $resource('superheroes/:superheroId', { superheroId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);