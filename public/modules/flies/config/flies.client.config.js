'use strict';

// Configuring the Articles module
angular.module('flies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Flies', 'flies', 'dropdown', '/flies(/create)?');
		Menus.addSubMenuItem('topbar', 'flies', 'List Flies', 'flies');
		Menus.addSubMenuItem('topbar', 'flies', 'New Fly', 'flies/create');
	}
]);