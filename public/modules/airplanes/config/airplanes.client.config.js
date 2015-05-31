'use strict';

// Configuring the Articles module
angular.module('airplanes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Airplanes', 'airplanes', 'dropdown', '/airplanes(/create)?');
		Menus.addSubMenuItem('topbar', 'airplanes', 'List Airplanes', 'airplanes');
		Menus.addSubMenuItem('topbar', 'airplanes', 'New Airplane', 'airplanes/create');
	}
]);