'use strict';

// Airports controller
angular.module('airports').controller('AirportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Airports',
	function($scope, $stateParams, $location, Authentication, Airports) {
		$scope.authentication = Authentication;

		// Create new Airport
		$scope.create = function() {
			// Create new Airport object
			var airport = new Airports ({
				name: this.name
			});

			// Redirect after save
			airport.$save(function(response) {
				$location.path('airports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Airport
		$scope.remove = function(airport) {
			if ( airport ) { 
				airport.$remove();

				for (var i in $scope.airports) {
					if ($scope.airports [i] === airport) {
						$scope.airports.splice(i, 1);
					}
				}
			} else {
				$scope.airport.$remove(function() {
					$location.path('airports');
				});
			}
		};

		// Update existing Airport
		$scope.update = function() {
			var airport = $scope.airport;

			airport.$update(function() {
				$location.path('airports/' + airport._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Airports
		$scope.find = function() {
			$scope.airports = Airports.query();
		};

		// Find existing Airport
		$scope.findOne = function() {
			$scope.airport = Airports.get({ 
				airportId: $stateParams.airportId
			});
		};
	}
]);