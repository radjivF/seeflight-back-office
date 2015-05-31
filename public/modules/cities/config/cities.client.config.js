'use strict';

// Configuring the Articles module
angular.module('cities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cities', 'cities', 'dropdown', '/cities(/create)?');
		Menus.addSubMenuItem('topbar', 'cities', 'List Cities', 'cities');
		Menus.addSubMenuItem('topbar', 'cities', 'New City', 'cities/create');
	}
]);