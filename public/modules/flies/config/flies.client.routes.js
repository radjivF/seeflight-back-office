'use strict';

//Setting up route
angular.module('flies').config(['$stateProvider',
	function($stateProvider) {
		// Flies state routing
		$stateProvider.
		state('listFlies', {
			url: '/flies',
			templateUrl: 'modules/flies/views/list-flies.client.view.html'
		}).
		state('createFly', {
			url: '/flies/create',
			templateUrl: 'modules/flies/views/create-fly.client.view.html'
		}).
		state('viewFly', {
			url: '/flies/:flyId',
			templateUrl: 'modules/flies/views/view-fly.client.view.html'
		}).
		state('editFly', {
			url: '/flies/:flyId/edit',
			templateUrl: 'modules/flies/views/edit-fly.client.view.html'
		});
	}
]);