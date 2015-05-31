'use strict';

// Flies controller
angular.module('flies').controller('FliesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Flies',
	function($scope, $stateParams, $location, Authentication, Flies) {
		$scope.authentication = Authentication;

		// Create new Fly
		$scope.create = function() {
			// Create new Fly object
			var fly = new Flies ({
				name: this.name
			});

			// Redirect after save
			fly.$save(function(response) {
				$location.path('flies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fly
		$scope.remove = function(fly) {
			if ( fly ) { 
				fly.$remove();

				for (var i in $scope.flies) {
					if ($scope.flies [i] === fly) {
						$scope.flies.splice(i, 1);
					}
				}
			} else {
				$scope.fly.$remove(function() {
					$location.path('flies');
				});
			}
		};

		// Update existing Fly
		$scope.update = function() {
			var fly = $scope.fly;

			fly.$update(function() {
				$location.path('flies/' + fly._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Flies
		$scope.find = function() {
			$scope.flies = Flies.query();
		};

		// Find existing Fly
		$scope.findOne = function() {
			$scope.fly = Flies.get({ 
				flyId: $stateParams.flyId
			});
		};
	}
]);