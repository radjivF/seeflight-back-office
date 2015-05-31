'use strict';

//Setting up route
angular.module('airports').config(['$stateProvider',
	function($stateProvider) {
		// Airports state routing
		$stateProvider.
		state('listAirports', {
			url: '/airports',
			templateUrl: 'modules/airports/views/list-airports.client.view.html'
		}).
		state('createAirport', {
			url: '/airports/create',
			templateUrl: 'modules/airports/views/create-airport.client.view.html'
		}).
		state('viewAirport', {
			url: '/airports/:airportId',
			templateUrl: 'modules/airports/views/view-airport.client.view.html'
		}).
		state('editAirport', {
			url: '/airports/:airportId/edit',
			templateUrl: 'modules/airports/views/edit-airport.client.view.html'
		});
	}
]);