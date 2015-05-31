'use strict';

// Cities controller
angular.module('cities').controller('CitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cities',
	function($scope, $stateParams, $location, Authentication, Cities) {
		$scope.authentication = Authentication;

		// Create new City
		$scope.create = function() {
			// Create new City object
			var city = new Cities ({
				name: this.name
			});

			// Redirect after save
			city.$save(function(response) {
				$location.path('cities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing City
		$scope.remove = function(city) {
			if ( city ) { 
				city.$remove();

				for (var i in $scope.cities) {
					if ($scope.cities [i] === city) {
						$scope.cities.splice(i, 1);
					}
				}
			} else {
				$scope.city.$remove(function() {
					$location.path('cities');
				});
			}
		};

		// Update existing City
		$scope.update = function() {
			var city = $scope.city;

			city.$update(function() {
				$location.path('cities/' + city._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cities
		$scope.find = function() {
			$scope.cities = Cities.query();
		};

		// Find existing City
		$scope.findOne = function() {
			$scope.city = Cities.get({ 
				cityId: $stateParams.cityId
			});
		};
	}
]);