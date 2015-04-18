'use strict';

//Setting up route
angular.module('superheroes').config(['$stateProvider',
	function($stateProvider) {
		// Superheroes state routing
		$stateProvider.
		state('listSuperheroes', {
			url: '/superheroes',
			templateUrl: 'modules/superheroes/views/list-superheroes.client.view.html'
		}).
		state('createSuperhero', {
			url: '/superheroes/create',
			templateUrl: 'modules/superheroes/views/create-superhero.client.view.html'
		}).
		state('viewSuperhero', {
			url: '/superheroes/:superheroId',
			templateUrl: 'modules/superheroes/views/view-superhero.client.view.html'
		}).
		state('editSuperhero', {
			url: '/superheroes/:superheroId/edit',
			templateUrl: 'modules/superheroes/views/edit-superhero.client.view.html'
		});
	}
]);