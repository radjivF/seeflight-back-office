'use strict';

//Setting up route
angular.module('cities').config(['$stateProvider',
	function($stateProvider) {
		// Cities state routing
		$stateProvider.
		state('listCities', {
			url: '/cities',
			templateUrl: 'modules/cities/views/list-cities.client.view.html'
		}).
		state('createCity', {
			url: '/cities/create',
			templateUrl: 'modules/cities/views/create-city.client.view.html'
		}).
		state('viewCity', {
			url: '/cities/:cityId',
			templateUrl: 'modules/cities/views/view-city.client.view.html'
		}).
		state('editCity', {
			url: '/cities/:cityId/edit',
			templateUrl: 'modules/cities/views/edit-city.client.view.html'
		});
	}
]);