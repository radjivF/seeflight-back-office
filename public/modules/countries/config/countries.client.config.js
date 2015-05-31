'use strict';

// Configuring the Articles module
angular.module('countries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Countries', 'countries', 'dropdown', '/countries(/create)?');
		Menus.addSubMenuItem('topbar', 'countries', 'List Countries', 'countries');
		Menus.addSubMenuItem('topbar', 'countries', 'New Country', 'countries/create');
	}
]);