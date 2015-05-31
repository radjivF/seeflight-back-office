'use strict';

// Configuring the Articles module
angular.module('researchs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Researchs', 'researchs', 'dropdown', '/researchs(/create)?');
		Menus.addSubMenuItem('topbar', 'researchs', 'List Researchs', 'researchs');
		Menus.addSubMenuItem('topbar', 'researchs', 'New Research', 'researchs/create');
	}
]);