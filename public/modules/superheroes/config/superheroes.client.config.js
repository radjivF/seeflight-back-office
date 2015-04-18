'use strict';

// Configuring the Articles module
angular.module('superheroes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Superheroes', 'superheroes', 'dropdown', '/superheroes(/create)?');
		Menus.addSubMenuItem('topbar', 'superheroes', 'List Superheroes', 'superheroes');
		Menus.addSubMenuItem('topbar', 'superheroes', 'New Superhero', 'superheroes/create');
	}
]);