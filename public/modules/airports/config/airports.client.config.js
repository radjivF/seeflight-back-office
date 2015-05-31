'use strict';

// Configuring the Articles module
angular.module('airports').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Airports', 'airports', 'dropdown', '/airports(/create)?');
		Menus.addSubMenuItem('topbar', 'airports', 'List Airports', 'airports');
		Menus.addSubMenuItem('topbar', 'airports', 'New Airport', 'airports/create');
	}
]);