'use strict';

//Setting up route
angular.module('airplanes').config(['$stateProvider',
	function($stateProvider) {
		// Airplanes state routing
		$stateProvider.
		state('listAirplanes', {
			url: '/airplanes',
			templateUrl: 'modules/airplanes/views/list-airplanes.client.view.html'
		}).
		state('createAirplane', {
			url: '/airplanes/create',
			templateUrl: 'modules/airplanes/views/create-airplane.client.view.html'
		}).
		state('viewAirplane', {
			url: '/airplanes/:airplaneId',
			templateUrl: 'modules/airplanes/views/view-airplane.client.view.html'
		}).
		state('editAirplane', {
			url: '/airplanes/:airplaneId/edit',
			templateUrl: 'modules/airplanes/views/edit-airplane.client.view.html'
		});
	}
]);