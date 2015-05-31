'use strict';

//Setting up route
angular.module('researchs').config(['$stateProvider',
	function($stateProvider) {
		// Researchs state routing
		$stateProvider.
		state('listResearchs', {
			url: '/researchs',
			templateUrl: 'modules/researchs/views/list-researchs.client.view.html'
		}).
		state('createResearch', {
			url: '/researchs/create',
			templateUrl: 'modules/researchs/views/create-research.client.view.html'
		}).
		state('viewResearch', {
			url: '/researchs/:researchId',
			templateUrl: 'modules/researchs/views/view-research.client.view.html'
		}).
		state('editResearch', {
			url: '/researchs/:researchId/edit',
			templateUrl: 'modules/researchs/views/edit-research.client.view.html'
		});
	}
]);